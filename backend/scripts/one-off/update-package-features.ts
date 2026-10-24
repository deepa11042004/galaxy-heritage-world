/**
 * Updates ONLY the feature list (inclusions) of the three membership packages. Prices, images and everything
 * else (which may have been edited in the admin) are left untouched.
 * Usage: npx tsx scripts/one-off/update-package-features.ts
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const features: Record<string, string[]> = {
  'blue-off-season': [
    'Access to 4500+ properties worldwide',
    'Off-season booking privileges',
    'Club & Gymnasium access',
    '6 nights, 7 days accommodation per year',
    'Dedicated Travel Desk',
    'EMI options available',
  ],
  'white-mid-season': [
    'Access to 4500+ properties worldwide',
    'Mid-season & Off-season booking',
    'Premium Club & Gymnasium access',
    '6 nights, 7 days accommodation per year',
    'Dedicated Travel Desk',
    'EMI options available',
    'Complimentary airport transfers',
  ],
  'red-peak-season': [
    'Access to 4500+ properties worldwide',
    'All-season booking (Peak, Mid, Off)',
    'VIP Club & Gymnasium access',
    '6 nights, 7 days accommodation per year',
    'Dedicated Travel Desk',
    'Zero-interest EMI options* Available',
    'Complimentary airport transfers',
    'Exclusive experiences included',
  ],
};

async function main() {
  for (const [slug, inclusions] of Object.entries(features)) {
    const res = await prisma.package.updateMany({ where: { slug, deletedAt: null }, data: { inclusions } });
    console.log(slug, res.count ? 'updated' : 'NOT FOUND');
  }
}

main().finally(() => prisma.$disconnect());
