/**
 * Writes the hotels that have no real description (empty / placeholder / just "-") to a JSON file, together with the
 * facts we can trust about them. Read-only.
 * Usage: npx tsx scripts/one-off/export-hotels-missing-description.ts <out.json>
 */
import 'dotenv/config';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const hotels = await prisma.hotel.findMany({
    where: { deletedAt: null },
    select: { id: true, slug: true, name: true, locationName: true, state: true, country: true, hotelType: true, address: true, description: true, destination: { select: { highlights: true } } },
  });
  const missing = hotels
    .filter((h) => h.description.trim() === `${h.name}, ${h.locationName}.` || h.description.trim().length < 60)
    .map((h) => ({
      id: h.id, slug: h.slug, name: h.name, city: h.locationName, state: h.state, country: h.country, type: h.hotelType,
      address: h.address, sights: Array.isArray(h.destination?.highlights) ? h.destination!.highlights : [],
      current: h.description,
    }));
  fs.writeFileSync(process.argv[2], JSON.stringify(missing, null, 1));
  console.log('exported', missing.length);
}
main().finally(() => prisma.$disconnect());
