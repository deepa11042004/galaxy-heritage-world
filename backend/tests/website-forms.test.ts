import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import bcrypt from 'bcryptjs';
import type { Server } from 'node:http';
import { app } from '../src/app.js';
import { prisma } from '../src/config/database.js';

const TAG = 'zz-forms-test';
const PASSWORD = 'ZzTest-Passw0rd!';

let server: Server;
let base: string;
let adminToken = '';
let userId = '';

const post = (path: string, body: unknown) =>
  fetch(`${base}/api/v1${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const adminGet = (path: string) => fetch(`${base}/api/v1${path}`, { headers: { Authorization: `Bearer ${adminToken}` } });

const lead = (sourcePage: string, name: string) => ({
  name,
  email: `${TAG}@example.test`,
  phone: '+91 98765 43210',
  city: 'Testville',
  message: 'Automated test',
  sourcePage,
  consent: true,
});

beforeAll(async () => {
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      base = `http://127.0.0.1:${(server.address() as any).port}`;
      resolve();
    });
  });
  const role = await prisma.role.findUniqueOrThrow({ where: { name: 'ADMIN' } });
  const user = await prisma.user.create({
    data: { email: `${TAG}-admin@example.test`, name: 'ZZ Forms Admin', passwordHash: await bcrypt.hash(PASSWORD, 4), userRoles: { create: { roleId: role.id } } },
  });
  userId = user.id;
  const res = await post('/auth/login', { email: user.email, password: PASSWORD });
  adminToken = (await res.json()).token;
});

afterAll(async () => {
  await prisma.enquiry.deleteMany({ where: { email: `${TAG}@example.test` } });
  await prisma.voucherRedemption.deleteMany({ where: { email: `${TAG}@example.test` } });
  await prisma.newsletterSubscription.deleteMany({ where: { email: `${TAG}@example.test` } });
  await prisma.auditLog.deleteMany({ where: { userId } });
  await prisma.session.deleteMany({ where: { userId } });
  await prisma.userRole.deleteMany({ where: { userId } });
  await prisma.user.deleteMany({ where: { id: userId } });
  await new Promise((r) => server.close(r));
  await prisma.$disconnect();
});

describe('website forms reach the admin panel', () => {
  it('stores each enquiry form and lets admins filter by the form it came from', async () => {
    for (const [page, name] of [['/', 'Home'], ['/contact', 'Contact'], ['/travel-desk', 'Desk'], ['/reviews-and-complaints', 'Complaint']] as const) {
      expect((await post('/enquiries', lead(page, `${TAG} ${name}`))).status).toBe(201);
    }
    const all = await (await adminGet(`/enquiries?search=${TAG}&limit=50`)).json();
    expect(all.total).toBe(4);

    const contact = await (await adminGet(`/enquiries?search=${TAG}&source=${encodeURIComponent('/contact')}`)).json();
    expect(contact.data.map((e: any) => e.sourcePage)).toEqual(['/contact']);

    const home = await (await adminGet(`/enquiries?search=${TAG}&source=${encodeURIComponent('/')}`)).json();
    expect(home.data.map((e: any) => e.sourcePage)).toEqual(['/']);
  });

  it('lists voucher redemptions and newsletter sign-ups', async () => {
    const v = await post('/enquiries/voucher', {
      voucherCode: 'ZZ-TEST-0001',
      name: `${TAG} Voucher`,
      email: `${TAG}@example.test`,
      phone: '+91 98765 43210',
      city: 'Testville',
      preferredDestination: 'Goa',
    });
    expect(v.status).toBe(201);
    const vouchers = await (await adminGet(`/enquiries/vouchers/list?search=${TAG}`)).json();
    expect(vouchers.data.length).toBeGreaterThanOrEqual(1);

    expect((await post('/enquiries/newsletter', { email: `${TAG}@example.test` })).status).toBe(201);
    const subs = await (await adminGet(`/enquiries/newsletter/list?search=${TAG}`)).json();
    expect(subs.data.map((s: any) => s.email)).toContain(`${TAG}@example.test`);
  });

  it('keeps the lists private', async () => {
    expect((await fetch(`${base}/api/v1/enquiries`)).status).toBe(401);
    expect((await fetch(`${base}/api/v1/enquiries/newsletter/list`)).status).toBe(401);
  });
});
