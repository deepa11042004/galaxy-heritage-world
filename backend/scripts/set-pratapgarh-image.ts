/**
 * Sets the cover photo of the Pratapgarh Farms day outing (card on /day-activities and its page header).
 * Usage: npx tsx scripts/set-pratapgarh-image.ts
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const res = await prisma.activity.updateMany({
    where: { title: { startsWith: 'Pratapgarh Farms' }, deletedAt: null },
    data: { imageUrl: '/media/pratapgarh/camel-cart.jpg' },
  });
  console.log({ updated: res.count });
}
main().finally(() => prisma.$disconnect());
