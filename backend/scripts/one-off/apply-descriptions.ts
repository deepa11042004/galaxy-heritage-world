/**
 * Saves descriptions from a JSON file ([{ id, description }]) to hotels - but ONLY for hotels that still have no real
 * description (empty / the import placeholder / under 60 characters). Existing real text is never overwritten.
 * Usage: npx tsx scripts/one-off/apply-descriptions.ts <descriptions.json> [--dry]
 */
import 'dotenv/config';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const dry = process.argv.includes('--dry');

async function main() {
  const items: { id: string; description: string }[] = JSON.parse(fs.readFileSync(process.argv[2], 'utf-8'));
  let updated = 0, skipped = 0;
  for (const it of items) {
    const h = await prisma.hotel.findUnique({ where: { id: it.id }, select: { name: true, locationName: true, description: true } });
    const missing = h && (h.description.trim() === `${h.name}, ${h.locationName}.` || h.description.trim().length < 60);
    if (!missing || it.description.trim().length < 60) { skipped++; continue; }
    if (!dry) await prisma.hotel.update({ where: { id: it.id }, data: { description: it.description } });
    updated++;
  }
  console.log({ updated, skippedAlreadyHaveText: skipped, dry });
}
main().finally(() => prisma.$disconnect());
