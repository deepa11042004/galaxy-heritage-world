/**
 * Idempotent hotel importer. Usage: tsx prisma/import-hotels.ts <hotels.json> [--dry]
 * Input is produced from the hotel CSV exports; images are re-encoded to WebP
 * under apps/web/public/media/hotels/<slug>/. Upserts by hotelCode; never deletes.
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { prisma } from '../src/config/database';

interface Row {
  code: string; name: string; ptype: string; htype: string | null; loc: string;
  country: string | null; ltype: string | null; address: string; map: string; desc: string;
  files?: string[];
}

const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 150);

async function main() {
  const [file, flag] = process.argv.slice(2);
  const dry = flag === '--dry';
  const rows: Row[] = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const outRoot = path.resolve(__dirname, '../../web/public/media/hotels');

  const existing = await prisma.hotel.findMany({ select: { slug: true, hotelCode: true, name: true } });
  console.log('existing hotels:', existing.map((h) => `${h.slug}(${h.hotelCode ?? '-'})`).join(', '));
  const taken = new Set(existing.filter((h) => !h.hotelCode).map((h) => h.slug));
  const byCode = new Map(existing.filter((h) => h.hotelCode).map((h) => [h.hotelCode!, h.slug]));

  let created = 0, updated = 0, imgs = 0, noDesc = 0;
  for (const r of rows) {
    let slug = byCode.get(r.code) ?? slugify(r.name);
    // an existing un-coded hotel with the same slug is the same property: adopt it
    const adopt = !byCode.has(r.code) && existing.some((h) => !h.hotelCode && h.slug === slug);
    if (!byCode.has(r.code) && !adopt && taken.has(slug)) slug = `${slug}-${r.code.toLowerCase()}`;
    taken.add(slug);

    const gallery: string[] = [];
    if (!dry && r.files?.length) {
      const dir = path.join(outRoot, slug);
      fs.mkdirSync(dir, { recursive: true });
      for (let i = 0; i < r.files.length; i++) {
        const dest = path.join(dir, `${i + 1}.webp`);
        try {
          if (!fs.existsSync(dest)) {
            await sharp(r.files[i]).rotate().resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 72 }).toFile(dest);
          }
          gallery.push(`/media/hotels/${slug}/${i + 1}.webp`);
          imgs++;
        } catch (e) {
          console.warn('skip image', r.code, r.files[i], (e as Error).message);
        }
      }
    } else if (r.files) {
      imgs += r.files.length;
    }
    if (!r.desc) noDesc++;

    const data = {
      name: r.name,
      locationName: r.loc,
      country: r.country || 'India',
      category: r.ptype === 'INTERNAL_PROPERTY' ? ('INTERNAL' as const) : ('ASSOCIATED' as const),
      hotelType: r.htype,
      locationType: r.ltype || ((r.country || 'India') === 'India' ? 'DOMESTIC' : 'INTERNATIONAL'),
      address: r.address || null,
      mapLink: r.map || null,
      description: r.desc,
      imageUrl: gallery[0] ?? '',
      gallery,
    };
    if (dry) { console.log('DRY', r.code, slug, data.category, data.locationType, gallery.length || r.files?.length || 0); continue; }
    const had = byCode.has(r.code) || adopt;
    await prisma.hotel.upsert({
      where: adopt ? { slug } : { hotelCode: r.code },
      create: { slug, hotelCode: r.code, ...data },
      update: adopt ? { hotelCode: r.code, ...data } : data,
    });
    had ? updated++ : created++;
  }
  console.log({ rows: rows.length, created, updated, images: imgs, emptyDescriptions: noDesc });
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
