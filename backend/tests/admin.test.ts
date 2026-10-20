import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import bcrypt from 'bcryptjs';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import type { Server } from 'http';
import { app } from '../src/app.js';
import { prisma } from '../src/config/database.js';

/**
 * Admin API integration tests. They run against the configured database, so every record they create
 * is prefixed "zz-test" and hard-deleted again in afterAll.
 */
const PREFIX = 'zz-test';
const PASSWORD = 'ZzTest-Passw0rd!';

let server: Server;
let base: string;
const tokens: Record<string, string> = {};
const created = { userIds: [] as string[], mediaFilenames: [] as string[] };

async function makeUser(role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'SALES') {
  const r = await prisma.role.findUniqueOrThrow({ where: { name: role } });
  const user = await prisma.user.create({
    data: {
      email: `${PREFIX}-${role.toLowerCase()}@example.test`,
      name: `ZZ Test ${role}`,
      passwordHash: await bcrypt.hash(PASSWORD, 4),
      userRoles: { create: { roleId: r.id } },
    },
  });
  created.userIds.push(user.id);
  const res = await fetch(`${base}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: user.email, password: PASSWORD }),
  });
  tokens[role] = (await res.json()).token;
  return user;
}

function api(role: keyof typeof tokens | null, method: string, url: string, body?: unknown) {
  return fetch(`${base}/api/v1${url}`, {
    method,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(role ? { Authorization: `Bearer ${tokens[role]}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

beforeAll(async () => {
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      base = `http://127.0.0.1:${(server.address() as any).port}`;
      resolve();
    });
  });
  for (const role of ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'SALES'] as const) await makeUser(role);
}, 60000);

afterAll(async () => {
  await prisma.hotel.deleteMany({ where: { slug: { startsWith: PREFIX } } });
  await prisma.package.deleteMany({ where: { slug: { startsWith: PREFIX } } });
  await prisma.activity.deleteMany({ where: { slug: { startsWith: PREFIX } } });
  await prisma.destination.deleteMany({ where: { slug: { startsWith: PREFIX } } });
  await prisma.auditLog.deleteMany({ where: { userId: { in: created.userIds } } });
  await prisma.user.deleteMany({ where: { id: { in: created.userIds } } });
  await prisma.user.deleteMany({ where: { email: { startsWith: PREFIX } } });
  for (const f of created.mediaFilenames) {
    await prisma.mediaAsset.deleteMany({ where: { filename: f } });
    fs.rmSync(path.resolve(process.cwd(), 'public/media/uploads', f), { force: true });
  }
  await new Promise<void>((resolve) => server.close(() => resolve()));
  await prisma.$disconnect();
});

describe('authentication & authorization', () => {
  it('rejects unauthenticated requests', async () => {
    for (const url of ['/admin/stats', '/admin/hotels', '/admin/users', '/admin/account']) {
      expect((await api(null, 'GET', url)).status).toBe(401);
    }
  });

  it('rejects wrong credentials without revealing which part is wrong', async () => {
    const res = await fetch(`${base}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: `${PREFIX}-editor@example.test`, password: 'definitely-wrong' }),
    });
    expect(res.status).toBe(401);
    expect((await res.json()).error).toBe('Invalid email or password');
  });

  it('denies users without a panel role (SALES)', async () => {
    expect((await api('SALES', 'GET', '/admin/stats')).status).toBe(403);
  });

  it('lets an EDITOR read stats but not manage users', async () => {
    expect((await api('EDITOR', 'GET', '/admin/stats')).status).toBe(200);
    expect((await api('EDITOR', 'GET', '/admin/users')).status).toBe(403);
    expect((await api('ADMIN', 'GET', '/admin/users')).status).toBe(403);
    expect((await api('SUPER_ADMIN', 'GET', '/admin/users')).status).toBe(200);
  });

  it('dashboard returns real database counts', async () => {
    const body = await (await api('EDITOR', 'GET', '/admin/stats')).json();
    const [hotels, activities] = await Promise.all([
      prisma.hotel.count({ where: { deletedAt: null } }),
      prisma.activity.count({ where: { deletedAt: null } }),
    ]);
    expect(body.data.hotels.total).toBe(hotels);
    expect(body.data.activities.total).toBe(activities);
    expect(body.data.hotels.published + body.data.hotels.draft).toBe(hotels);
  });
});

describe('destinations, hotels, packages: CRUD, relations and publishing', () => {
  let destId: string;
  let hotelId: string;
  let packageId: string;

  it('validates input', async () => {
    const res = await api('EDITOR', 'POST', '/admin/destinations', { name: 'x', heroImageUrl: 'javascript:alert(1)' });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.details.map((d: any) => d.path)).toEqual(expect.arrayContaining(['name', 'region', 'description', 'heroImageUrl']));
  });

  it('creates a destination and generates the slug from the name', async () => {
    const res = await api('EDITOR', 'POST', '/admin/destinations', {
      name: `${PREFIX} Atlantis`,
      region: 'Test Region',
      description: 'A fictional destination used by automated tests.',
      heroImageUrl: '/media/test.webp',
      isPublished: false,
    });
    expect(res.status).toBe(201);
    const { data } = await res.json();
    expect(data.slug).toBe(`${PREFIX}-atlantis`);
    destId = data.id;
  });

  it('refuses a duplicate explicit slug with 409', async () => {
    const res = await api('EDITOR', 'POST', '/admin/destinations', {
      slug: `${PREFIX}-atlantis`,
      name: 'Another',
      region: 'Region',
      description: 'Duplicate slug attempt for the test.',
      heroImageUrl: '/media/test.webp',
    });
    expect(res.status).toBe(409);
  });

  it('keeps drafts out of the public API and shows them once published', async () => {
    const slug = `${PREFIX}-atlantis`;
    expect((await fetch(`${base}/api/v1/destinations/${slug}`)).status).toBe(404);

    expect((await api('EDITOR', 'PATCH', `/admin/destinations/${destId}/publish`, { isPublished: true })).status).toBe(200);
    const pub = await fetch(`${base}/api/v1/destinations/${slug}`);
    expect(pub.status).toBe(200);
    expect((await pub.json()).data.name).toBe(`${PREFIX} Atlantis`);

    await api('EDITOR', 'PATCH', `/admin/destinations/${destId}/publish`, { isPublished: false });
    expect((await fetch(`${base}/api/v1/destinations/${slug}`)).status).toBe(404);
  });

  it('creates a hotel linked to the destination and rejects an unknown destination', async () => {
    const bad = await api('EDITOR', 'POST', '/admin/hotels', {
      name: `${PREFIX} Hotel Bad`,
      locationName: 'Nowhere',
      description: 'Hotel with a bogus destination id.',
      imageUrl: '',
      destinationId: '00000000-0000-0000-0000-000000000000',
    });
    expect(bad.status).toBe(400);

    const res = await api('EDITOR', 'POST', '/admin/hotels', {
      name: `${PREFIX} Hotel`,
      locationName: 'Atlantis',
      description: 'A fictional hotel used by automated tests.',
      imageUrl: '',
      hotelCode: '',
      destinationId: destId,
      amenities: ['Pool', 'Wi-Fi'],
      isPublished: true,
    });
    expect(res.status).toBe(201);
    const { data } = await res.json();
    expect(data.hotelCode).toBeNull(); // '' normalised to NULL so the unique index is not tripped
    expect(data.destination?.id ?? data.destinationId).toBe(destId);
    hotelId = data.id;

    const pub = await fetch(`${base}/api/v1/hotels?search=${PREFIX}`);
    expect((await pub.json()).data.map((h: any) => h.id)).toContain(hotelId);
  });

  it('creates a package, updates it, and filters the admin list', async () => {
    const res = await api('EDITOR', 'POST', '/admin/packages', {
      title: `${PREFIX} Package`,
      locationLabel: 'Atlantis',
      durationDays: 4,
      durationNights: 3,
      priceStarting: 12999,
      heroImageUrl: '/media/test.webp',
      overview: 'A fictional package used by automated tests.',
      inclusions: ['Breakfast'],
      destinationId: destId,
    });
    expect(res.status).toBe(201);
    packageId = (await res.json()).data.id;

    const upd = await api('EDITOR', 'PUT', `/admin/packages/${packageId}`, { subtitle: 'Updated subtitle', priceStarting: 15000 });
    expect(upd.status).toBe(200);
    expect((await upd.json()).data.subtitle).toBe('Updated subtitle');

    const list = await (await api('EDITOR', 'GET', `/admin/packages?search=${PREFIX}&destinationId=${destId}`)).json();
    expect(list.total).toBe(1);
    expect(list.pages).toBe(1);
  });

  it('paginates and ignores unknown sort fields', async () => {
    const res = await api('EDITOR', 'GET', '/admin/hotels?limit=5&page=2&sort=passwordHash');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.length).toBeLessThanOrEqual(5);
    expect(body.page).toBe(2);
    expect(body.total).toBeGreaterThan(5);
  });

  it('only ADMIN or above may delete; a destination in use cannot be deleted', async () => {
    expect((await api('EDITOR', 'DELETE', `/admin/hotels/${hotelId}`)).status).toBe(403);
    expect((await api('ADMIN', 'DELETE', `/admin/destinations/${destId}`)).status).toBe(409);

    expect((await api('ADMIN', 'DELETE', `/admin/hotels/${hotelId}`)).status).toBe(200);
    expect((await api('ADMIN', 'DELETE', `/admin/packages/${packageId}`)).status).toBe(200);
    expect((await api('ADMIN', 'DELETE', `/admin/destinations/${destId}`)).status).toBe(200);

    expect((await api('EDITOR', 'GET', `/admin/hotels/${hotelId}`)).status).toBe(404);
    const pub = await fetch(`${base}/api/v1/hotels?search=${PREFIX}`);
    expect((await pub.json()).data).toHaveLength(0);
  });
});

describe('day outings (activities)', () => {
  it('stores a gallery and video id and validates the video id', async () => {
    const bad = await api('EDITOR', 'POST', '/admin/activities', {
      title: `${PREFIX} Outing`, locationLabel: 'Delhi', imageUrl: '/media/x.webp',
      description: 'A fictional outing used by tests.', videoId: 'not valid!',
    });
    expect(bad.status).toBe(400);

    const res = await api('EDITOR', 'POST', '/admin/activities', {
      title: `${PREFIX} Outing`, locationLabel: 'Delhi', imageUrl: '/media/x.webp',
      description: 'A fictional outing used by tests.', gallery: ['/media/a.webp', '/media/b.webp'], videoId: 'xsTXYcZQmmk',
    });
    expect(res.status).toBe(201);
    const { data } = await res.json();
    expect(data.gallery).toHaveLength(2);
    expect(data.videoId).toBe('xsTXYcZQmmk');

    const pub = await (await fetch(`${base}/api/v1/activities/${data.slug}`)).json();
    expect(pub.data.title).toBe(`${PREFIX} Outing`);
  });
});

describe('image uploads', () => {
  const form = async (name: string, bytes: Buffer, type: string) => {
    const fd = new FormData();
    fd.append('folder', 'activities');
    fd.append('files', new Blob([new Uint8Array(bytes)], { type }), name);
    return fetch(`${base}/api/v1/admin/uploads`, { method: 'POST', headers: { Authorization: `Bearer ${tokens.EDITOR}` }, body: fd });
  };

  it('accepts a real image and re-encodes it to WebP', async () => {
    const png = await sharp({ create: { width: 64, height: 48, channels: 3, background: '#f5b700' } }).png().toBuffer();
    const res = await form('Cover Photo.png', png, 'image/png');
    expect(res.status).toBe(201);
    const { data } = await res.json();
    expect(data[0].url).toMatch(/^\/media\/uploads\/[0-9a-f-]{36}\.webp$/);
    created.mediaFilenames.push(path.basename(data[0].url));
    expect(fs.existsSync(path.resolve(process.cwd(), 'public', data[0].url.slice(1)))).toBe(true);

    const served = await fetch(`${base}${data[0].url}`);
    expect(served.status).toBe(200);
    expect(served.headers.get('content-type')).toContain('image/webp');
  });

  it('rejects non-images and disguised files', async () => {
    expect((await form('evil.png', Buffer.from('<?php echo 1; ?>'), 'image/png')).status).toBe(400);
    expect((await form('vector.svg', Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>'), 'image/svg+xml')).status).toBe(400);
  });

  it('requires authentication', async () => {
    const fd = new FormData();
    fd.append('files', new Blob([new Uint8Array([1, 2, 3])]), 'a.png');
    expect((await fetch(`${base}/api/v1/admin/uploads`, { method: 'POST', body: fd })).status).toBe(401);
  });
});

describe('users & account', () => {
  let newUserId: string;

  it('SUPER_ADMIN creates a user with a strong password; weak passwords are rejected', async () => {
    const weak = await api('SUPER_ADMIN', 'POST', '/admin/users', {
      name: 'Weak', email: `${PREFIX}-weak@example.test`, password: 'short', role: 'EDITOR',
    });
    expect(weak.status).toBe(400);

    const res = await api('SUPER_ADMIN', 'POST', '/admin/users', {
      name: 'ZZ New Editor', email: `${PREFIX}-new@example.test`, password: PASSWORD, role: 'EDITOR',
    });
    expect(res.status).toBe(201);
    const { data } = await res.json();
    expect(data.roles).toEqual(['EDITOR']);
    expect(data).not.toHaveProperty('passwordHash');
    newUserId = data.id;
    created.userIds.push(newUserId);

    const row = await prisma.user.findUniqueOrThrow({ where: { id: newUserId } });
    expect(row.passwordHash).toMatch(/^\$2[aby]\$/); // bcrypt hash, never plaintext
  });

  it('refuses a duplicate email', async () => {
    const res = await api('SUPER_ADMIN', 'POST', '/admin/users', {
      name: 'Dup', email: `${PREFIX}-new@example.test`, password: PASSWORD, role: 'EDITOR',
    });
    expect(res.status).toBe(409);
  });

  it('deactivating a user blocks their existing token immediately', async () => {
    const login = await fetch(`${base}/api/v1/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: `${PREFIX}-new@example.test`, password: PASSWORD }),
    });
    tokens.NEW = (await login.json()).token;
    expect((await api('NEW', 'GET', '/admin/stats')).status).toBe(200);

    expect((await api('SUPER_ADMIN', 'PUT', `/admin/users/${newUserId}`, { isActive: false })).status).toBe(200);
    expect((await api('NEW', 'GET', '/admin/stats')).status).toBe(401);
  });

  it('a Super Admin cannot demote or deactivate themselves', async () => {
    const me = await prisma.user.findUniqueOrThrow({ where: { email: `${PREFIX}-super_admin@example.test` } });
    expect((await api('SUPER_ADMIN', 'PUT', `/admin/users/${me.id}`, { isActive: false })).status).toBe(400);
    expect((await api('SUPER_ADMIN', 'PUT', `/admin/users/${me.id}`, { role: 'EDITOR' })).status).toBe(400);
  });

  it('changing own password requires the current password and enforces the policy', async () => {
    expect((await api('EDITOR', 'POST', '/admin/account/password', { currentPassword: 'wrong', newPassword: 'NewPassw0rd!x' })).status).toBe(400);
    expect((await api('EDITOR', 'POST', '/admin/account/password', { currentPassword: PASSWORD, newPassword: 'weak' })).status).toBe(400);

    const ok = await api('EDITOR', 'POST', '/admin/account/password', { currentPassword: PASSWORD, newPassword: 'NewPassw0rd!x' });
    expect(ok.status).toBe(200);
    const relogin = await fetch(`${base}/api/v1/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: `${PREFIX}-editor@example.test`, password: 'NewPassw0rd!x' }),
    });
    expect(relogin.status).toBe(200);
  });
});
