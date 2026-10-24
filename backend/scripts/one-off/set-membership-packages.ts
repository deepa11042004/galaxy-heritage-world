/**
 * Replaces the Vacation Packages content with the three membership packages shown on the website
 * (Blue / White / Red). Existing packages are SOFT-deleted (deleted_at set, unpublished), never removed,
 * so they can be restored from the database or from backend/backups.
 * Usage: npx tsx scripts/one-off/set-membership-packages.ts [--dry]
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const dry = process.argv.includes('--dry');

const IMAGE = '/media/galaxy-heritage-world/homepage/images/gettyimages-149353949_high-scaled.jpg';
const BASE = ['Access to 4500+ properties worldwide', '6 nights, 7 days accommodation per year', 'Dedicated Travel Desk'];
const OVERVIEW =
  'One of three levels of World of Galaxy Heritage Suites and Retreat packages. Enjoy great rewards with amazing experiences with your family throughout your package period.';

const tiers = [
  { slug: 'blue-off-season', title: 'BLUE - OFF SEASON', price: 675000, featured: false, inclusions: [...BASE, 'EMI options available'] },
  { slug: 'white-mid-season', title: 'WHITE - MID SEASON', price: 711000, featured: true, inclusions: [...BASE, 'EMI options available'] },
  {
    slug: 'red-peak-season',
    title: 'RED - PEAK SEASON',
    price: 1002000,
    featured: false,
    inclusions: [...BASE, 'Zero-interest EMI options* Available', 'Exclusive experiences included'],
  },
];

async function main() {
  const keep = tiers.map((t) => t.slug);
  const toRemove = await prisma.package.findMany({
    where: { deletedAt: null, slug: { notIn: keep } },
    select: { id: true, title: true },
  });
  console.log(dry ? 'DRY' : 'Soft-deleting', toRemove.map((p) => p.title));

  if (!dry) {
    await prisma.package.updateMany({
      where: { id: { in: toRemove.map((p) => p.id) } },
      data: { deletedAt: new Date(), isPublished: false },
    });
  }

  for (const t of tiers) {
    const data = {
      title: t.title,
      subtitle: 'Rs. 20,000', // shown as "Variable Charges" on the website
      locationLabel: 'Worldwide',
      durationDays: 7,
      durationNights: 6,
      priceStarting: t.price,
      priceLabel: null,
      category: 'Membership Package',
      heroImageUrl: IMAGE,
      overview: OVERVIEW,
      inclusions: t.inclusions,
      exclusions: [],
      highlights: [],
      featured: t.featured, // featured = "Popular" ribbon
      isPublished: true,
      deletedAt: null,
    };
    console.log(dry ? 'DRY upsert' : 'upsert', t.slug);
    if (!dry) await prisma.package.upsert({ where: { slug: t.slug }, update: data, create: { slug: t.slug, ...data } });
  }
}

main().finally(() => prisma.$disconnect());
