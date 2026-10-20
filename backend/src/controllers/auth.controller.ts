import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { prisma } from '../config/database.js';
import { config } from '../config/env.js';
import { AppError } from '../middlewares/error.js';
import { LoginSchema } from '../shared/index.js';

function generateTokens(user: { id: string; email: string }) {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    config.jwt.accessSecret,
    { expiresIn: '1h' }
  );

  const refreshToken = jwt.sign(
    { userId: user.id, email: user.email, jti: randomUUID() },
    config.jwt.refreshSecret,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = LoginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: { role: true },
        },
      },
    });

    if (!user || !user.isActive) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Record session
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || null,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Set HTTP-only cookies
    res.cookie('ghw_access_token', accessToken, {
      httpOnly: true,
      secure: config.cookie.secure,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    });

    res.cookie('ghw_refresh_token', refreshToken, {
      httpOnly: true,
      secure: config.cookie.secure,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Log admin audit
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_LOGIN',
        entityType: 'User',
        entityId: user.id,
        ipAddress: req.ip,
      },
    });

    res.json({
      success: true,
      token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.userRoles.map((ur) => ur.role.name),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const refreshToken = req.cookies?.ghw_refresh_token;
    if (refreshToken) {
      await prisma.session.deleteMany({ where: { refreshToken } }).catch(() => {});
    }

    res.clearCookie('ghw_access_token');
    res.clearCookie('ghw_refresh_token');

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const refreshToken = req.cookies?.ghw_refresh_token || req.body?.refreshToken;
    if (!refreshToken) {
      throw new AppError('Refresh token required', 401);
    }

    const session = await prisma.session.findUnique({
      where: { refreshToken },
      include: {
        user: {
          include: { userRoles: { include: { role: true } } },
        },
      },
    });

    if (!session || session.expiresAt < new Date() || !session.user.isActive) {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(session.user);

    await prisma.session.update({
      where: { id: session.id },
      data: {
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie('ghw_access_token', accessToken, {
      httpOnly: true,
      secure: config.cookie.secure,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    });

    res.cookie('ghw_refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: config.cookie.secure,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      token: accessToken,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        roles: session.user.userRoles.map((ur) => ur.role.name),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: Request, res: Response): Promise<void> {
  res.json({
    success: true,
    user: req.user,
  });
}
