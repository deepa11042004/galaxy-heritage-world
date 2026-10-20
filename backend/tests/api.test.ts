import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { app } from '../src/app.js';
import { prisma } from '../src/config/database.js';
import type { Server } from 'http';

let server: Server;
let baseUrl: string;

beforeAll(async () => {
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const addr = server.address();
      if (typeof addr === 'object' && addr !== null) {
        baseUrl = `http://127.0.0.1:${addr.port}`;
      }
      resolve();
    });
  });
});

afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
  await prisma.$disconnect();
});

describe('Galaxy Heritage World API Integration Tests', () => {
  it('GET / - returns API status UP and documentation link', async () => {
    const res = await fetch(`${baseUrl}/`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('UP');
    expect(body.name).toBe('Galaxy Heritage World API');
    expect(body.documentation).toBe('/api/v1/docs');
  });

  it('GET /api/v1/health - returns database connection status UP', async () => {
    const res = await fetch(`${baseUrl}/api/v1/health`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('UP');
    expect(body.database).toBe('Connected');
  });

  it('GET /api/v1/destinations - returns seeded destinations list', async () => {
    const res = await fetch(`${baseUrl}/api/v1/destinations`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0]).toHaveProperty('slug');
  });

  it('GET /api/v1/packages - returns seeded vacation packages', async () => {
    const res = await fetch(`${baseUrl}/api/v1/packages`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/v1/hotels - returns seeded hotels and resorts', async () => {
    const res = await fetch(`${baseUrl}/api/v1/hotels`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  it('POST /api/v1/enquiries - validates and logs lead with reference number', async () => {
    const payload = {
      name: 'Rohan Sharma',
      email: 'rohan.test@example.com',
      phone: '+91 98765 43210',
      city: 'Delhi',
      destinationInterest: 'Goa',
      consent: true,
    };

    const res = await fetch(`${baseUrl}/api/v1/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.referenceNumber).toMatch(/^GHW-ENQ-/);
    expect(body.data.name).toBe('Rohan Sharma');
  });

  it('POST /api/v1/enquiries/voucher - validates and logs voucher redemption', async () => {
    const payload = {
      voucherCode: 'GHW-VIP-2026',
      name: 'Priya Mehra',
      email: 'priya.test@example.com',
      phone: '+91 98111 22334',
      city: 'Noida',
      preferredDestination: 'Jaipur',
    };

    const res = await fetch(`${baseUrl}/api/v1/enquiries/voucher`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.referenceNumber).toMatch(/^GHW-VOUCH-/);
  });

  it('POST /api/v1/auth/login - authenticates admin user and returns token', async () => {
    const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@galaxyheritageworld.com',
        password: 'Admin@Galaxy2026!',
      }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.token).toBeDefined();
    expect(body.user.email).toBe('admin@galaxyheritageworld.com');
  });

  it('GET /api/v1/search - searches across multiple content categories', async () => {
    const res = await fetch(`${baseUrl}/api/v1/search?q=Goa`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.total).toBeGreaterThan(0);
  });
});
