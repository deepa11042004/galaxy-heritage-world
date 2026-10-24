/**
 * Sets the cover photos of the water-park day outings from scripts/_wp_map.json ({ slug: imageUrl }).
 * Usage: npx tsx scripts/one-off/set-water-park-images.ts
 */
import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const map: Record<string, string> = JSON.parse(readFileSync(new URL('./_wp_map.json', import.meta.url), 'utf8'));
  for (const [slug, imageUrl] of Object.entries(map)) {
    const res = await prisma.activity.updateMany({ where: { slug, deletedAt: null }, data: { imageUrl } });
    console.log(slug, res.count);
  }
}
main().finally(() => prisma.$disconnect());
