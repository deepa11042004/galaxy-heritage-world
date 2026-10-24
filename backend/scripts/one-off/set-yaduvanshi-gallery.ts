/**
 * Replaces the Yaduvanshi Farms day-outing gallery with the full-size originals from galaxyheritageworld.com
 * (1200px; the copies imported earlier were 250px thumbnails). Only the gallery field is changed.
 * Usage: npx tsx scripts/one-off/set-yaduvanshi-gallery.ts
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const gallery = ['camel-ride', 'inflatable-slide', 'bull-ride', 'cricket', 'water-roller', 'tractor-ride', 'farm-at-night'].map((n) => `/media/yaduvanshi/${n}.jpg`);

async function main() {
  const res = await prisma.activity.updateMany({ where: { title: { startsWith: 'Yaduvanshi Farms' }, deletedAt: null }, data: { gallery } });
  console.log({ updated: res.count });
}
main().finally(() => prisma.$disconnect());
