/**
 * Adds the cottages / boathouses / camp-nights stay types to hotels whose name matches. Only ever ADDS a type
 * (existing types and admin edits stay untouched) and is safe to re-run.
 * Usage: npx tsx scripts/one-off/add-new-stay-types.ts [--dry]
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const dry = process.argv.includes('--dry');

const RULES: [string, RegExp][] = [
  ['cottages', /\bcottages?\b/i],
  ['boathouses', /\bboat ?houses?\b|\bhouse ?boats?\b/i],
  ['camp-nights', /\bcamps?\b|\bcamping\b|\btent(s|ed)?\b/i],
];

async function main() {
  const hotels = await prisma.hotel.findMany({ where: { deletedAt: null }, select: { id: true, name: true, stayTypes: true } });
  const counts: Record<string, string[]> = {};
  let changed = 0;
  for (const h of hotels) {
    const have: string[] = Array.isArray(h.stayTypes) ? (h.stayTypes as string[]) : [];
    const add = RULES.filter(([slug, re]) => re.test(h.name) && !have.includes(slug)).map(([slug]) => slug);
    if (!add.length) continue;
    for (const a of add) (counts[a] ??= []).push(h.name);
    if (!dry) await prisma.hotel.update({ where: { id: h.id }, data: { stayTypes: [...have, ...add] } });
    changed++;
  }
  console.log({ hotels: hotels.length, changed, dry });
  for (const [k, v] of Object.entries(counts)) console.log(k, v.length, v.slice(0, 5));
}

(async () => {
  for (let i = 0; i < 6; i++) {
    try { await main(); return; } catch (e: any) { console.log('retry', e.message.split('\n').pop()); await new Promise((r) => setTimeout(r, 3000)); }
  }
})().finally(() => prisma.$disconnect());
