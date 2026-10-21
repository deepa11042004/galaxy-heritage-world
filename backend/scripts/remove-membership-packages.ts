/**
 * Hides the old Blue / White / Red membership packages (soft delete: deleted_at is set and they are unpublished,
 * so they disappear from the website and admin lists but stay in the database and in backend/backups).
 * To restore one, clear deleted_at and set is_published = 1 on its row.
 * Usage: npx tsx scripts/remove-membership-packages.ts
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SLUGS = ['blue-off-season', 'white-mid-season', 'red-peak-season'];

async function main() {
  const res = await prisma.package.updateMany({
    where: { slug: { in: SLUGS }, deletedAt: null },
    data: { deletedAt: new Date(), isPublished: false },
  });
  const left = await prisma.package.count({ where: { deletedAt: null } });
  console.log({ hidden: res.count, packagesStillLive: left });
}

main().finally(() => prisma.$disconnect());
