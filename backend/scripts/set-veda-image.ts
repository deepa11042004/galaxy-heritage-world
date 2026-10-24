/**
 * Sets the cover photo of the Veda day outing (card on /day-activities and its page header).
 * Usage: npx tsx scripts/set-veda-image.ts
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const res = await prisma.activity.updateMany({
    where: { title: { startsWith: 'Veda' }, deletedAt: null },
    data: { imageUrl: '/media/veda/cover.jpg' },
  });
  console.log({ updated: res.count });
}
main().finally(() => prisma.$disconnect());
