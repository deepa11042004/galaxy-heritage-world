/**
 * Replaces the galleries of the Rangmanch Farms and Madhavgarh Farms day outings with sharper photos taken from the
 * farms' own galleries (rangmanchfarms.com/gallery, madhavgarh.com/gallery). Only the gallery field is changed.
 * Usage: npx tsx scripts/set-rangmanch-gallery.ts
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const set = (dir: string, names: string[]) => names.map((n) => `/media/${dir}/${n}.jpg`);

async function main() {
  const rang = await prisma.activity.updateMany({
    where: { title: { startsWith: 'Rangmanch Farms' }, deletedAt: null },
    data: { gallery: set('rangmanch', ['rope-course', 'aerial-view', 'cycle-on-rope', 'swimming-pool', 'swing', 'mud-bath', 'guest-room']) },
  });
  const madh = await prisma.activity.updateMany({
    where: { slug: 'madhavgarh-farms-rural-experience', deletedAt: null },
    data: { gallery: set('madhavgarh', ['zipline', 'folk-dance', 'tractor-trolley', 'camel-cart', 'tyre-tunnel', 'farm-stay-room', 'swimming-pool']) },
  });
  console.log({ rangmanch: rang.count, madhavgarh: madh.count });
}
main().finally(() => prisma.$disconnect());
