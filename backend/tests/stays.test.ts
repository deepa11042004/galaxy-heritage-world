import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import bcrypt from 'bcryptjs';
import type { Server } from 'http';
import { app } from '../src/app.js';
import { prisma } from '../src/config/database.js';

/** Stay-type tagging and filtering. Everything created is prefixed "zz-stay" and removed in afterAll. */
const PREFIX = 'zz-stay';
const PASSWORD = 'ZzTest-Passw0rd!';

let server: Server;
let base: string;
let token = '';
let userId = '';

const api = (method: string, url: string, body?: unknown, auth = true) =>
  fetch(`${base}/api/v1${url}`, {
    method,
    headers: { ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(auth ? { Authorization: `Bearer ${token}` } : {}) },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

beforeAll(async () => {
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      base = `http://127.0.0.1:${(server.address() as any).port}`;
      resolve();
    });
  });
  const role = await prisma.role.findUniqueOrThrow({ where: { name: 'EDITOR' } });
  const user = await prisma.user.create({
    data: { email: `${PREFIX}-editor@example.test`, name: 'ZZ Stay Editor', passwordHash: await bcrypt.hash(PASSWORD, 4), userRoles: { create: { roleId: role.id } } },
  });
  userId = user.id;
  const res = await fetch(`${base}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: user.email, password: PASSWORD }),
  });
  token = (await res.json()).token;
}, 60000);

afterAll(async () => {
  await prisma.hotel.deleteMany({ where: { slug: { startsWith: PREFIX } } });
  await prisma.auditLog.deleteMany({ where: { userId } });
  await prisma.user.deleteMany({ where: { id: userId } });
  await new Promise<void>((resolve) => server.close(() => resolve()));
  await prisma.$disconnect();
});

describe('stay types on hotels', () => {
  let id: string;
  const slug = `${PREFIX}-treehouse`;
  const hotel = {
    slug,
    name: `${PREFIX} Canopy Treehouse`,
    locationName: 'Testville',
    description: 'A fictional treehouse used by the automated tests.',
    imageUrl: '',
    isPublished: true,
  };

  it('rejects unknown stay types', async () => {
    const res = await api('POST', '/admin/hotels', { ...hotel, stayTypes: ['spaceship'] });
    expect(res.status).toBe(400);
    expect((await res.json()).details.map((d: any) => d.path)).toContain('stayTypes.0');
  });

  it('stores stay types and returns them to the public API filter', async () => {
    const res = await api('POST', '/admin/hotels', { ...hotel, stayTypes: ['treehouses', 'eco-lodges'] });
    expect(res.status).toBe(201);
    id = (await res.json()).data.id;

    const list = await (await fetch(`${base}/api/v1/hotels?stayType=treehouses&search=${PREFIX}`)).json();
    expect(list.data.map((h: any) => h.id)).toContain(id);

    const other = await (await fetch(`${base}/api/v1/hotels?stayType=igloos&search=${PREFIX}`)).json();
    expect(other.data).toHaveLength(0);
  });

  it('counts properties per stay type', async () => {
    const counts = (await (await fetch(`${base}/api/v1/hotels/stay-types`)).json()).data;
    const real = await prisma.hotel.count({ where: { isPublished: true, deletedAt: null, stayTypes: { array_contains: 'treehouses' } } });
    expect(counts.treehouses).toBe(real);
    expect(counts.treehouses).toBeGreaterThanOrEqual(1);
  });

  it('can be re-tagged in the admin, and the admin list can filter by stay type', async () => {
    expect((await api('PUT', `/admin/hotels/${id}`, { stayTypes: ['cabins'] })).status).toBe(200);
    const treehouses = await (await fetch(`${base}/api/v1/hotels?stayType=treehouses&search=${PREFIX}`)).json();
    expect(treehouses.data).toHaveLength(0);
    const adminList = await (await api('GET', `/admin/hotels?stayType=cabins&search=${PREFIX}`)).json();
    expect(adminList.total).toBe(1);
  });

  it('drops an unpublished property from the public category', async () => {
    expect((await api('PATCH', `/admin/hotels/${id}/publish`, { isPublished: false })).status).toBe(200);
    const list = await (await fetch(`${base}/api/v1/hotels?stayType=cabins&search=${PREFIX}`)).json();
    expect(list.data).toHaveLength(0);
  });

  it('ignores malformed stayType filters instead of erroring', async () => {
    const res = await fetch(`${base}/api/v1/hotels?stayType=${encodeURIComponent("x'; DROP TABLE hotels;--")}&limit=1`);
    expect(res.status).toBe(200);
  });
});
