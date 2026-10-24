/**
 * Step 2 of the hotel catalogue import (step 1: scripts/prepare-hotel-import.py).
 * REPLACES all hotels and destinations with the records in catalogue.json, inside ONE transaction:
 * if anything fails, the database is left exactly as it was.
 * Packages / itineraries that pointed at a deleted destination keep existing (destination_id becomes NULL).
 *
 * Usage: npx tsx scripts/one-off/import-hotel-catalogue.ts <catalogue.json> [--confirm]
 * Without --confirm it only prints what it would do.
 */
import 'dotenv/config';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

interface Loc { name: string; country: string; type: 'DOMESTIC' | 'INTERNATIONAL'; description: string; highlights: string[]; published: boolean }
interface Hotel {
  code: string; slug: string; name: string; category: 'ASSOCIATED' | 'INTERNAL'; hotelType: string | null; location: string;
  address: string | null; mapLink: string | null; description: string; published: boolean; images: string[];
}

const prisma = new PrismaClient();
const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 150);
const FALLBACK_IMAGE = '/media/galaxy-heritage-world/destinations/images/1-1.png';

async function main() {
  const [file] = process.argv.slice(2);
  const confirm = process.argv.includes('--confirm');
  const { locations, hotels }: { locations: Loc[]; hotels: Hotel[] } = JSON.parse(fs.readFileSync(file, 'utf-8'));

  const [oldHotels, oldDestinations] = await Promise.all([prisma.hotel.count(), prisma.destination.count()]);
  console.log({ deleting: { hotels: oldHotels, destinations: oldDestinations }, inserting: { hotels: hotels.length, destinations: locations.length } });
  if (!confirm) return console.log('Dry run. Re-run with --confirm to apply.');

  const cover = new Map<string, string>();
  for (const h of hotels) if (h.images[0] && !cover.has(h.location)) cover.set(h.location, h.images[0]);

  const slugs = new Set<string>();
  const destData = locations.map((l) => {
    let slug = slugify(l.name) || 'destination';
    if (slugs.has(slug)) slug = `${slug}-${l.type.toLowerCase()}`;
    slugs.add(slug);
    return {
      slug,
      name: l.name,
      region: l.country, // the export has no state/region; the country is the closest real value
      country: l.country,
      type: l.type,
      description: l.description || `Explore handpicked partner properties in ${l.name}.`,
      heroImageUrl: cover.get(l.name) ?? FALLBACK_IMAGE,
      highlights: l.highlights,
      gallery: [] as string[],
      isPublished: l.published,
    };
  });

  await prisma.$transaction(
    async (tx) => {
      await tx.hotel.deleteMany({});
      await tx.destination.deleteMany({});
      await tx.destination.createMany({ data: destData });

      const dests = await tx.destination.findMany({ select: { id: true, name: true } });
      const idByName = new Map(dests.map((d) => [d.name, d.id]));
      const type = new Map(locations.map((l) => [l.name, l]));

      const rows = hotels.map((h) => ({
        slug: h.slug,
        hotelCode: h.code,
        name: h.name,
        destinationId: idByName.get(h.location) ?? null,
        locationName: h.location,
        country: type.get(h.location)!.country,
        locationType: type.get(h.location)!.type,
        category: h.category,
        hotelType: h.hotelType,
        address: h.address,
        mapLink: h.mapLink,
        description: h.description || `${h.name}, ${h.location}.`,
        imageUrl: h.images[0] ?? '',
        gallery: h.images,
        amenities: [] as string[],
        isPublished: h.published,
      }));
      for (let i = 0; i < rows.length; i += 100) await tx.hotel.createMany({ data: rows.slice(i, i + 100) });
    },
    { timeout: 600_000, maxWait: 60_000 }
  );

  const [h, d, withImg] = await Promise.all([
    prisma.hotel.count(),
    prisma.destination.count(),
    prisma.hotel.count({ where: { imageUrl: { not: '' } } }),
  ]);
  console.log({ hotels: h, destinations: d, hotelsWithImages: withImg });
}

main().finally(() => prisma.$disconnect());
