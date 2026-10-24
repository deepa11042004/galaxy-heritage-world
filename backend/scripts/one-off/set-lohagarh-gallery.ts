/**
 * Adds a photo gallery to the Lohagarh Farms day outing using full-size photos from the farm's own site
 * (lohagarhfarms.com/gallery). Only the gallery field is changed.
 * Usage: npx tsx scripts/one-off/set-lohagarh-gallery.ts
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const gallery = ['rope-bridge', 'tyre-wall', 'log-swing', 'tyre-climb', 'folk-dance', 'bullock-cart'].map((n) => `/media/lohagarh/${n}.jpg`);

async function main() {
  const res = await prisma.activity.updateMany({ where: { title: { startsWith: 'Lohagarh Farms' }, deletedAt: null }, data: { gallery } });
  console.log({ updated: res.count });
}
main().finally(() => prisma.$disconnect());
