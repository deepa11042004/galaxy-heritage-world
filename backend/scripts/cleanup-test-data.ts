/**
 * Removes records left behind by the automated tests (slug / email / image name starting with "zz-").
 * Usage: npx tsx scripts/cleanup-test-data.ts
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const startsWith = { startsWith: 'zz-' };

async function main() {
  const counts = {
    hotels: (await prisma.hotel.deleteMany({ where: { slug: startsWith } })).count,
    packages: (await prisma.package.deleteMany({ where: { slug: startsWith } })).count,
    activities: (await prisma.activity.deleteMany({ where: { slug: startsWith } })).count,
    itineraries: (await prisma.itinerary.deleteMany({ where: { slug: startsWith } })).count, // days cascade
    destinations: (await prisma.destination.deleteMany({ where: { slug: startsWith } })).count,
    users: 0,
    images: 0,
  };

  const users = await prisma.user.findMany({ where: { email: startsWith }, select: { id: true } });
  if (users.length) {
    await prisma.auditLog.deleteMany({ where: { userId: { in: users.map((u) => u.id) } } });
    counts.users = (await prisma.user.deleteMany({ where: { id: { in: users.map((u) => u.id) } } })).count;
  }

  const assets = await prisma.mediaAsset.findMany({ where: { altText: startsWith } });
  for (const a of assets) {
    fs.rmSync(path.resolve(process.cwd(), 'public', a.storagePath.replace(/^\//, '')), { force: true });
  }
  counts.images = (await prisma.mediaAsset.deleteMany({ where: { altText: startsWith } })).count;

  console.log('Removed:', counts);
}

main().finally(() => prisma.$disconnect());
