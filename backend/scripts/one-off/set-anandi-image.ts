/**
 * Sets the cover photo of Anandi Water Park, Lucknow (card on /day-activities and its page header).
 * Photo: Prabhat1729 on Wikimedia Commons, CC BY-SA 4.0.
 * Usage: npx tsx scripts/one-off/set-anandi-image.ts
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const res = await prisma.activity.updateMany({
    where: { slug: 'anandi-water-park-lucknow', deletedAt: null },
    data: { imageUrl: '/media/water-parks/anandi-2.jpg' },
  });
  console.log({ updated: res.count });
}
main().finally(() => prisma.$disconnect());
