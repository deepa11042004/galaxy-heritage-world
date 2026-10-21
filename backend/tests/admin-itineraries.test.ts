import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import bcrypt from 'bcryptjs';
import type { Server } from 'http';
import { app } from '../src/app.js';
import { prisma } from '../src/config/database.js';

/** Itinerary admin API tests. Everything created is prefixed "zz-itin" and removed in afterAll. */
const PREFIX = 'zz-itin';
const PASSWORD = 'ZzTest-Passw0rd!';

let server: Server;
let base: string;
const tokens: Record<string, string> = {};
const userIds: string[] = [];

async function makeUser(role: 'ADMIN' | 'EDITOR') {
  const r = await prisma.role.findUniqueOrThrow({ where: { name: role } });
  const user = await prisma.user.create({
    data: {
      email: `${PREFIX}-${role.toLowerCase()}@example.test`,
      name: `ZZ ${role}`,
      passwordHash: await bcrypt.hash(PASSWORD, 4),
      userRoles: { create: { roleId: r.id } },
    },
  });
  userIds.push(user.id);
  const res = await fetch(`${base}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: user.email, password: PASSWORD }),
  });
  tokens[role] = (await res.json()).token;
}

const api = (role: string | null, method: string, url: string, body?: unknown) =>
  fetch(`${base}/api/v1${url}`, {
    method,
    headers: { ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(role ? { Authorization: `Bearer ${tokens[role]}` } : {}) },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

beforeAll(async () => {
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      base = `http://127.0.0.1:${(server.address() as any).port}`;
      resolve();
    });
  });
  await makeUser('ADMIN');
  await makeUser('EDITOR');
}, 60000);

afterAll(async () => {
  await prisma.itinerary.deleteMany({ where: { slug: { startsWith: PREFIX } } }); // days cascade
  await prisma.auditLog.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  await new Promise<void>((resolve) => server.close(() => resolve()));
  await prisma.$disconnect();
});

const day = (n: number) => ({ title: `Day ${n} title`, description: `Description for day number ${n}.` });

describe('itineraries in the admin API', () => {
  let id: string;
  const slug = `${PREFIX}-trip`;

  it('requires authentication and rejects invalid input', async () => {
    expect((await api(null, 'GET', '/admin/itineraries')).status).toBe(401);
    const bad = await api('EDITOR', 'POST', '/admin/itineraries', { title: 'x', heroImageUrl: 'javascript:alert(1)', days: [{ title: '', description: 'x' }] });
    expect(bad.status).toBe(400);
    const paths = (await bad.json()).details.map((d: any) => d.path);
    expect(paths).toEqual(expect.arrayContaining(['title', 'heroImageUrl', 'summary', 'days.0.title']));
  });

  it('creates an itinerary with its days, numbering them in order', async () => {
    const res = await api('EDITOR', 'POST', '/admin/itineraries', {
      slug,
      title: `${PREFIX} Trip`,
      locationLabel: 'Test Land',
      durationDays: 3,
      durationNights: 2,
      heroImageUrl: '/media/test.webp',
      summary: 'A short summary used by the automated tests.',
      overview: 'A longer overview used by the automated tests.',
      highlights: ['One', 'Two'],
      inclusions: ['Breakfast'],
      gallery: ['/media/a.webp'],
      bestTime: '',
      locationType: 'DOMESTIC',
      days: [day(9), day(9), day(9)],
      isPublished: false,
    });
    expect(res.status).toBe(201);
    id = (await res.json()).data.id;

    const detail = await (await api('EDITOR', 'GET', `/admin/itineraries/${id}`)).json();
    expect(detail.data.days.map((d: any) => d.dayNumber)).toEqual([1, 2, 3]);
    expect(detail.data.bestTime).toBeNull();
    expect(detail.data.highlights).toEqual(['One', 'Two']);
  });

  it('stays hidden from the public API until published', async () => {
    expect((await fetch(`${base}/api/v1/itineraries/${slug}`)).status).toBe(404);
    expect((await api('EDITOR', 'PATCH', `/admin/itineraries/${id}/publish`, { isPublished: true })).status).toBe(200);
    const pub = await (await fetch(`${base}/api/v1/itineraries/${slug}`)).json();
    expect(pub.data.days).toHaveLength(3);
    expect(pub.data.highlights).toEqual(['One', 'Two']);
  });

  it('replaces the days on update, and leaves them alone when days are not sent', async () => {
    const reorder = await api('EDITOR', 'PUT', `/admin/itineraries/${id}`, { days: [day(1), day(2)], durationDays: 2, durationNights: 1 });
    expect(reorder.status).toBe(200);
    let detail = await (await api('EDITOR', 'GET', `/admin/itineraries/${id}`)).json();
    expect(detail.data.days).toHaveLength(2);
    expect(detail.data.days[1].title).toBe('Day 2 title');

    const noDays = await api('EDITOR', 'PUT', `/admin/itineraries/${id}`, { badgeText: 'Test badge' });
    expect(noDays.status).toBe(200);
    detail = await (await api('EDITOR', 'GET', `/admin/itineraries/${id}`)).json();
    expect(detail.data.days).toHaveLength(2);
    expect(detail.data.badgeText).toBe('Test badge');

    const cleared = await api('EDITOR', 'PUT', `/admin/itineraries/${id}`, { days: [] });
    expect(cleared.status).toBe(200);
    detail = await (await api('EDITOR', 'GET', `/admin/itineraries/${id}`)).json();
    expect(detail.data.days).toHaveLength(0);
  });

  it('lists with search, filters and a days count', async () => {
    const list = await (await api('EDITOR', 'GET', `/admin/itineraries?search=${PREFIX}&locationType=DOMESTIC`)).json();
    expect(list.total).toBe(1);
    expect(list.data[0]._count.days).toBe(0);
    expect((await (await api('EDITOR', 'GET', `/admin/itineraries?search=${PREFIX}&locationType=INTERNATIONAL`)).json()).total).toBe(0);
  });

  it('counts itineraries on the dashboard', async () => {
    const stats = await (await api('EDITOR', 'GET', '/admin/stats')).json();
    const real = await prisma.itinerary.count({ where: { deletedAt: null } });
    expect(stats.data.itineraries.total).toBe(real);
  });

  it('only ADMIN or above may delete; deleted itineraries disappear everywhere', async () => {
    expect((await api('EDITOR', 'DELETE', `/admin/itineraries/${id}`)).status).toBe(403);
    expect((await api('ADMIN', 'DELETE', `/admin/itineraries/${id}`)).status).toBe(200);
    expect((await api('EDITOR', 'GET', `/admin/itineraries/${id}`)).status).toBe(404);
    expect((await fetch(`${base}/api/v1/itineraries/${slug}`)).status).toBe(404);
  });
});
