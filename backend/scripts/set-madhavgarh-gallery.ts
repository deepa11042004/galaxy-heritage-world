/**
 * Replaces the gallery of the Madhavgarh Farms day outing with the sharper photos from the farm's own gallery
 * (madhavgarh.com/gallery, 850px wide; the old ones were 250px thumbnails). Only the gallery field is changed.
 * Usage: npx tsx scripts/set-madhavgarh-gallery.ts
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const gallery = ['zipline', 'folk-dance', 'tractor-trolley', 'camel-cart', 'tyre-tunnel', 'farm-stay-room'].map((n) => `/media/madhavgarh/${n}.jpg`);

async function main() {
  const res = await prisma.activity.updateMany({ where: { slug: 'madhavgarh-farms-rural-experience', deletedAt: null }, data: { gallery } });
  console.log({ updated: res.count, gallery });
}
main().finally(() => prisma.$disconnect());
