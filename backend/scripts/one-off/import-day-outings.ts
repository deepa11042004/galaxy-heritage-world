/**
 * One-off, idempotent import of the static day-outings content into `activities`.
 * - Creates rows that do not exist (matched by slug or by case-insensitive title prefix).
 * - For rows that already exist, only fills gallery / video_id when they are still NULL.
 * - Never overwrites or deletes existing data.
 * Usage: npx tsx scripts/one-off/import-day-outings.ts [--dry]
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { DAY_OUTINGS as D } from '../../../frontend/src/lib/day-outings.js';

const prisma = new PrismaClient();
const dry = process.argv.includes('--dry');

const CITIES = ['Indore', 'Bhopal', 'Lucknow'];
const locationFor = (name: string) => CITIES.find((c) => name.endsWith(c)) ?? 'Delhi NCR';

// Public media is served from frontend/public (and backend/public); warn on dangling image paths.
const mediaExists = (url: string) =>
  [`../frontend/public${url}`, `public${url}`].some((p) => fs.existsSync(path.resolve(process.cwd(), p)));

const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

type Item = {
  name: string;
  desc: string;
  image: string;
  category: string;
  gallery?: string[];
  videoId?: string;
};

const items: Item[] = [
  ...D.farms.map((f) => ({
    name: f.name,
    desc: f.desc,
    image: f.images[0],
    gallery: f.images,
    videoId: f.video,
    category: 'Farm Day Outing',
  })),
  ...D.outing.map((o) => ({ name: o.name, desc: o.desc, image: o.image, category: 'Day Outing & Picnic' })),
  ...D.water.map((w) => ({ name: w.name, desc: w.desc, image: w.image, category: 'Water Park & Amusement' })),
];

async function main() {
  const existing = await prisma.activity.findMany();
  const seen = new Set<string>();
  let created = 0, filled = 0, skipped = 0;

  for (const it of items) {
    const slug = slugify(it.name);
    const key = it.name.toLowerCase();
    if (seen.has(key)) { skipped++; continue; }
    seen.add(key);

    const match = existing.find((e) => e.slug === slug || e.title.toLowerCase().startsWith(key));
    if (match) {
      const patch: Record<string, unknown> = {};
      if (!match.gallery && it.gallery) patch.gallery = it.gallery;
      if (!match.videoId && it.videoId) patch.videoId = it.videoId;
      if (Object.keys(patch).length) {
        console.log(dry ? 'DRY fill' : 'fill', match.slug, Object.keys(patch));
        if (!dry) await prisma.activity.update({ where: { id: match.id }, data: patch });
        filled++;
      } else skipped++;
      continue;
    }

    for (const u of [it.image, ...(it.gallery ?? [])]) if (!mediaExists(u)) console.warn('  missing image file:', u);
    console.log(dry ? 'DRY create' : 'create', slug);
    if (!dry) {
      await prisma.activity.create({
        data: {
          slug,
          title: it.name,
          category: it.category,
          locationLabel: locationFor(it.name),
          imageUrl: it.image,
          description: it.desc,
          gallery: it.gallery,
          videoId: it.videoId,
          isPublished: true,
        },
      });
    }
    created++;
  }
  console.log({ created, filled, skipped });
}

main().finally(() => prisma.$disconnect());
