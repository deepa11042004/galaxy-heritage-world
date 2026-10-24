/**
 * Sets each destination's cover image (hero_image_url) and source_url to the landmark photo fetched by
 * scripts/fetch-destination-images.py. Only touches destinations that have a fetched image.
 * Usage: npx tsx scripts/one-off/apply-destination-images.ts <cache.json> <destination-credits.json>
 */
import 'dotenv/config';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const [cachePath, creditsPath] = process.argv.slice(2);
  const cache: Record<string, { file: string | null }> = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
  const credits: Record<string, { name: string; source: string }> = JSON.parse(fs.readFileSync(creditsPath, 'utf-8'));
  const slugOf = new Map(Object.entries(credits).map(([slug, c]) => [c.name, { slug, source: c.source }]));

  let updated = 0;
  const missing: string[] = [];
  for (const [name, entry] of Object.entries(cache)) {
    if (!entry.file) { missing.push(name); continue; }
    const res = await prisma.destination.updateMany({
      where: { name, deletedAt: null },
      data: { heroImageUrl: entry.file, sourceUrl: slugOf.get(name)?.source ?? null },
    });
    updated += res.count;
  }
  console.log({ updated, withoutImage: missing });
}

main().finally(() => prisma.$disconnect());
