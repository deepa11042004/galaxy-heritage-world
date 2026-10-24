/**
 * Sets the cover photo of the Surajgarh Farms day outing (card on /day-activities and its page header).
 * Usage: npx tsx scripts/one-off/set-surajgarh-image.ts
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const res = await prisma.activity.updateMany({
    where: { title: { startsWith: 'Surajgarh Farms' }, deletedAt: null },
    data: { imageUrl: '/media/surajgarh/entrance-gate.jpg' },
  });
  console.log({ updated: res.count });
}
main().finally(() => prisma.$disconnect());
