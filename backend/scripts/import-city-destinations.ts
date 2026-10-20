/**
 * Creates a `destinations` record for every city shown on the website's Destinations page
 * (cities are grouped from published hotels). Idempotent and additive:
 * - cities that already have a destination (same name, case-insensitive) are left untouched;
 * - hotels without a destination get linked to their city's destination (destination_id was NULL);
 * - nothing is deleted or overwritten.
 * Usage: npx tsx scripts/import-city-destinations.ts [--dry]
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const dry = process.argv.includes('--dry');

const slugify = (s: string) => s.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 150);
const FALLBACK_IMAGE = '/media/galaxy-heritage-world/destinations/images/1-1.png';

async function main() {
  const hotels = await prisma.hotel.findMany({
    where: { isPublished: true, deletedAt: null },
    select: { id: true, locationName: true, locationType: true, country: true, state: true, imageUrl: true, destinationId: true, featured: true, ratingStars: true, name: true },
    orderBy: [{ featured: 'desc' }, { ratingStars: 'desc' }, { name: 'asc' }],
  });

  const existing = await prisma.destination.findMany({ select: { id: true, name: true, slug: true } });
  const byName = new Map(existing.map((d) => [d.name.toLowerCase(), d]));
  const slugs = new Set(existing.map((d) => d.slug));

  const cities = new Map<string, typeof hotels>();
  for (const h of hotels) {
    const list = cities.get(h.locationName) ?? [];
    list.push(h);
    cities.set(h.locationName, list);
  }

  let created = 0, linked = 0;
  for (const [name, list] of cities) {
    let dest = byName.get(name.toLowerCase());

    if (!dest) {
      const first = list[0];
      const country = first.country || 'India';
      const type = first.locationType === 'INTERNATIONAL' || first.locationType === 'DOMESTIC'
        ? first.locationType
        : country === 'India' ? 'DOMESTIC' : 'INTERNATIONAL';
      const states = list.map((h) => h.state).filter(Boolean) as string[];
      const region = states.sort((a, b) => states.filter((s) => s === b).length - states.filter((s) => s === a).length)[0] ?? country;
      const cover = list.find((h) => h.imageUrl)?.imageUrl || FALLBACK_IMAGE;

      let slug = slugify(name) || 'destination';
      if (slugs.has(slug)) slug = `${slug}-${type.toLowerCase()}`;
      for (let i = 2; slugs.has(slug); i++) slug = `${slugify(name)}-${i}`;
      slugs.add(slug);

      console.log(dry ? 'DRY create' : 'create', slug, `(${list.length} hotels)`);
      if (!dry) {
        dest = await prisma.destination.create({
          data: {
            slug,
            name,
            region,
            country,
            type,
            description: `Explore ${list.length} handpicked partner ${list.length === 1 ? 'property' : 'properties'} in ${name}.`,
            heroImageUrl: cover,
            isPublished: true,
          },
          select: { id: true, name: true, slug: true },
        });
        created++;
      } else created++;
    }

    const unlinked = list.filter((h) => !h.destinationId).map((h) => h.id);
    if (dest && unlinked.length) {
      if (!dry) await prisma.hotel.updateMany({ where: { id: { in: unlinked }, destinationId: null }, data: { destinationId: dest.id } });
      linked += unlinked.length;
    }
  }
  console.log({ cities: cities.size, created, hotelsLinked: linked, dry });
}

main().finally(() => prisma.$disconnect());
