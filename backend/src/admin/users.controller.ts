import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../config/database.js';
import { AppError } from '../middlewares/error.js';
import { audit, intParam } from './helpers.js';

/** Roles that can be granted from the panel. SALES / SUPPORT users have no panel access. */
export const PANEL_ROLES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] as const;
const RoleSchema = z.enum(PANEL_ROLES);

export const PasswordSchema = z
  .string()
  .min(10, 'Password must be at least 10 characters')
  .max(128)
  .regex(/[a-z]/, 'Password needs a lowercase letter')
  .regex(/[A-Z]/, 'Password needs an uppercase letter')
  .regex(/[0-9]/, 'Password needs a number');

const BCRYPT_COST = 12;

const userSelect = {
  id: true,
  email: true,
  name: true,
  phone: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  userRoles: { select: { role: { select: { name: true } } } },
} as const;

type UserRow = {
  id: string; email: string; name: string; phone: string | null; isActive: boolean;
  createdAt: Date; updatedAt: Date; userRoles: { role: { name: string } }[];
};

const present = (u: UserRow) => ({
  id: u.id,
  email: u.email,
  name: u.name,
  phone: u.phone,
  isActive: u.isActive,
  createdAt: u.createdAt,
  updatedAt: u.updatedAt,
  roles: u.userRoles.map((r) => r.role.name),
});

async function roleId(name: string): Promise<string> {
  const role = await prisma.role.findUnique({ where: { name } });
  if (!role) throw new AppError(`Role ${name} is not configured`, 500);
  return role.id;
}

/** At least one active SUPER_ADMIN must always remain. */
async function assertAnotherSuperAdmin(excludeUserId: string): Promise<void> {
  const others = await prisma.user.count({
    where: { id: { not: excludeUserId }, isActive: true, userRoles: { some: { role: { name: 'SUPER_ADMIN' } } } },
  });
  if (others === 0) throw new AppError('At least one active Super Admin must remain', 409);
}

async function isSuperAdmin(userId: string): Promise<boolean> {
  return (await prisma.userRole.count({ where: { userId, role: { name: 'SUPER_ADMIN' } } })) > 0;
}

export async function listUsers(req: Request, res: Response): Promise<void> {
  const page = intParam(req.query.page, 1, 1, 10000);
  const limit = intParam(req.query.limit, 20, 1, 100);
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
  const where: Record<string, any> = {};
  if (search) where.OR = [{ name: { contains: search } }, { email: { contains: search } }];
  if (req.query.status === 'active') where.isActive = true;
  if (req.query.status === 'inactive') where.isActive = false;
  if (typeof req.query.role === 'string' && req.query.role) where.userRoles = { some: { role: { name: req.query.role } } };

  const [total, rows] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit, select: userSelect }),
  ]);
  res.json({ success: true, data: rows.map(present), total, page, limit, pages: Math.max(Math.ceil(total / limit), 1) });
}

const CreateUserSchema = z.object({
  name: z.string().trim().min(2).max(191),
  email: z.string().trim().toLowerCase().email().max(191),
  phone: z.string().trim().max(30).optional().nullable(),
  password: PasswordSchema,
  role: RoleSchema,
});

export async function createUser(req: Request, res: Response): Promise<void> {
  const data = CreateUserSchema.parse(req.body);
  const passwordHash = await bcrypt.hash(data.password, BCRYPT_COST);
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      passwordHash,
      userRoles: { create: { roleId: await roleId(data.role) } },
    },
    select: userSelect,
  });
  await audit(req, 'CREATE_USER', 'User', user.id, { email: user.email, role: data.role });
  res.status(201).json({ success: true, data: present(user) });
}

const UpdateUserSchema = z.object({
  name: z.string().trim().min(2).max(191).optional(),
  phone: z.string().trim().max(30).optional().nullable(),
  isActive: z.boolean().optional(),
  role: RoleSchema.optional(),
});

export async function updateUser(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id);
  const data = UpdateUserSchema.parse(req.body);
  const target = await prisma.user.findUnique({ where: { id }, select: { id: true } });
  if (!target) throw new AppError('User not found', 404);

  const isSelf = id === req.user!.id;
  if (isSelf && (data.isActive === false || data.role)) {
    throw new AppError('You cannot change your own role or deactivate your own account', 400);
  }
  if ((data.isActive === false || (data.role && data.role !== 'SUPER_ADMIN')) && (await isSuperAdmin(id))) {
    await assertAnotherSuperAdmin(id);
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id },
      data: { name: data.name, phone: data.phone === undefined ? undefined : data.phone || null, isActive: data.isActive },
    });
    if (data.role) {
      await tx.userRole.deleteMany({ where: { userId: id } });
      await tx.userRole.create({ data: { userId: id, roleId: await roleId(data.role) } });
    }
    if (data.isActive === false) await tx.session.deleteMany({ where: { userId: id } });
  });

  const user = await prisma.user.findUniqueOrThrow({ where: { id }, select: userSelect });
  await audit(req, 'UPDATE_USER', 'User', id, { fields: Object.keys(data) });
  res.json({ success: true, data: present(user) });
}

export async function resetUserPassword(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id);
  const { password } = z.object({ password: PasswordSchema }).parse(req.body);
  const target = await prisma.user.findUnique({ where: { id }, select: { id: true } });
  if (!target) throw new AppError('User not found', 404);

  await prisma.user.update({ where: { id }, data: { passwordHash: await bcrypt.hash(password, BCRYPT_COST), resetToken: null, resetExpires: null } });
  await prisma.session.deleteMany({ where: { userId: id } });
  await audit(req, 'RESET_USER_PASSWORD', 'User', id);
  res.json({ success: true, message: 'Password updated. The user has been signed out everywhere.' });
}

// ----------------------------------------------------------------------------
// Own account
// ----------------------------------------------------------------------------
export async function getAccount(req: Request, res: Response): Promise<void> {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: req.user!.id }, select: userSelect });
  res.json({ success: true, data: present(user) });
}

export async function updateAccount(req: Request, res: Response): Promise<void> {
  const data = z
    .object({ name: z.string().trim().min(2).max(191), phone: z.string().trim().max(30).optional().nullable() })
    .parse(req.body);
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: { name: data.name, phone: data.phone || null },
    select: userSelect,
  });
  await audit(req, 'UPDATE_ACCOUNT', 'User', user.id);
  res.json({ success: true, data: present(user) });
}

export async function changePassword(req: Request, res: Response): Promise<void> {
  const { currentPassword, newPassword } = z
    .object({ currentPassword: z.string().min(1), newPassword: PasswordSchema })
    .parse(req.body);
  const user = await prisma.user.findUniqueOrThrow({ where: { id: req.user!.id } });

  if (!(await bcrypt.compare(currentPassword, user.passwordHash))) {
    throw new AppError('Current password is incorrect', 400);
  }
  if (currentPassword === newPassword) throw new AppError('New password must be different', 400);

  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(newPassword, BCRYPT_COST) } });
  // Keep this device signed in; end every other session.
  const keep = req.cookies?.ghw_refresh_token as string | undefined;
  await prisma.session.deleteMany({ where: { userId: user.id, ...(keep ? { NOT: { refreshToken: keep } } : {}) } });
  await audit(req, 'CHANGE_PASSWORD', 'User', user.id);
  res.json({ success: true, message: 'Password changed. Other devices have been signed out.' });
}

export async function listSessions(req: Request, res: Response): Promise<void> {
  const current = req.cookies?.ghw_refresh_token as string | undefined;
  const sessions = await prisma.session.findMany({
    where: { userId: req.user!.id, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' },
  });
  res.json({
    success: true,
    data: sessions.map((s) => ({
      id: s.id,
      ipAddress: s.ipAddress,
      userAgent: s.userAgent,
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
      current: s.refreshToken === current,
    })),
  });
}

export async function revokeOtherSessions(req: Request, res: Response): Promise<void> {
  const keep = req.cookies?.ghw_refresh_token as string | undefined;
  const { count } = await prisma.session.deleteMany({
    where: { userId: req.user!.id, ...(keep ? { NOT: { refreshToken: keep } } : {}) },
  });
  await audit(req, 'REVOKE_SESSIONS', 'User', req.user!.id, { count });
  res.json({ success: true, message: `Signed out of ${count} other session(s)` });
}
