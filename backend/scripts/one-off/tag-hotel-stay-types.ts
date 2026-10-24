/**
 * Gives every hotel that has no stay types yet a starting set, based on its hotel type and name.
 * Never touches hotels that already have stay types (so admin edits are safe) and is safe to re-run.
 * Usage: npx tsx scripts/one-off/tag-hotel-stay-types.ts [--dry]
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const dry = process.argv.includes('--dry');

// Whole-word patterns on the property name (so "Lemon Tree" is not a treehouse and "Fortune" is not a fort).
const NAME_RULES: [string, RegExp][] = [
  ['villas', /\bvillas?\b/i],
  ['treehouses', /\btree ?house\b|(?<!lemon )\btree hotel\b/i], // not the "Lemon Tree" hotel chain
  ['domes', /\bdomes?\b/i],
  ['igloos', /\biglo+s?\b/i],
  ['cabins', /\bcabins?\b|\bcottages?\b/i],
  ['tenthouses', /\btents?\b/i],
  ['apartments', /\bapartments?\b|\bserviced residences?\b/i],
  ['vacation-homes', /\bhomestay\b|\bhomes?\b|\bguest ?house\b|\bbungalows?\b/i],
  ['beach-houses', /\bbeach (house|villa|cottage|hut)s?\b|\bbeachfront\b|\bbeach resort\b/i],
  ['glass-cabins', /\bglass (cabin|house|igloo)s?\b/i],
  ['houseboats', /\bhouse ?boats?\b/i],
  ['overwater-bungalows', /\bover ?water\b|\bwater (villa|bungalow)s?\b/i],
  ['glamping', /\bglamp/i],
  ['eco-lodges', /\beco\b|\becolodge\b|\blodge\b/i],
  ['farm-stays', /\bfarm(stay|house| stay)?s?\b/i],
  ['desert-camps', /\bdesert\b.*\bcamp\b|\bcamp\b.*\bdesert\b|\bdunes?\b.*\bcamp\b/i],
  ['cave-hotels', /\bcave\b/i],
  ['heritage-homes', /\bhaveli\b|\bheritage\b|\bkothi\b|\bmahal\b|\bpalace\b/i],
  ['castles', /\bcastle\b|\bfort\b|\bpalace\b/i],
  ['tiny-homes', /\btiny\b/i],
  ['floating-villas', /\bfloating\b/i],
  ['wellness-retreats', /\bspa\b|\bwellness\b|\bayurved\w*\b|\bretreat\b|\byoga\b/i],
];

function typesFor(h: { name: string; hotelType: string | null }): string[] {
  const out = new Set<string>();
  if (h.hotelType === 'HOTEL') out.add('hotels');
  if (h.hotelType === 'RESORT') out.add('resorts');
  if (h.hotelType === 'VILLA') out.add('villas');
  if (h.hotelType === 'APARTMENT') out.add('apartments');
  for (const [slug, re] of NAME_RULES) if (re.test(h.name)) out.add(slug);
  // a property with an explicit "Resort" in its name is a resort even if catalogued as a hotel
  if (/\bresorts?\b/i.test(h.name)) out.add('resorts');
  return [...out];
}

async function main() {
  const hotels = await prisma.hotel.findMany({ where: { deletedAt: null }, select: { id: true, name: true, hotelType: true, stayTypes: true } });
  const todo = hotels.filter((h) => !Array.isArray(h.stayTypes) || h.stayTypes.length === 0);
  const counts: Record<string, number> = {};
  const samples: Record<string, string[]> = {};
  let tagged = 0;

  for (const h of todo) {
    const types = typesFor(h);
    if (!types.length) continue;
    for (const t of types) {
      counts[t] = (counts[t] ?? 0) + 1;
      (samples[t] ??= []).length < 3 && samples[t].push(h.name);
    }
    if (!dry) await prisma.hotel.update({ where: { id: h.id }, data: { stayTypes: types } });
    tagged++;
  }

  console.log({ hotels: hotels.length, alreadyTagged: hotels.length - todo.length, tagged, dry });
  console.table(Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([type, n]) => ({ type, n, examples: samples[type].join(' | ') })));
}

main().finally(() => prisma.$disconnect());
