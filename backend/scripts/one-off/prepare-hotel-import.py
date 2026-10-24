"""
Step 1 of the hotel catalogue import (step 2: `npx tsx scripts/one-off/import-hotel-catalogue.ts`).

Reads hotels_export.csv + all_hotels_images.zip and writes
  - <out>/catalogue.json                  cleaned hotel + location records (HTML entities decoded, slugs assigned)
  - frontend/public/media/hotels/<slug>/N.<ext>   the images, copied from the zip BYTE-FOR-BYTE
    (no resizing or re-encoding, so the original quality is preserved)

Usage: python backend/scripts/one-off/prepare-hotel-import.py <hotels_export.csv> <all_hotels_images.zip> <out_dir> [--keep-old-images]
By default the old frontend/public/media/hotels folders are removed first (they belong to the hotels being replaced;
they remain recoverable from git history).
"""
import csv, html, json, os, re, shutil, sys, unicodedata, zipfile

csv_path, zip_path, out_dir = sys.argv[1:4]
keep_old = '--keep-old-images' in sys.argv
root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
media = os.path.join(root, 'frontend', 'public', 'media', 'hotels')
os.makedirs(out_dir, exist_ok=True)

clean = lambda s: html.unescape((s or '').strip()).replace('\r\n', '\n')

def slugify(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]+', '-', s.lower().replace('&', ' and ')).strip('-')[:150]

rows = list(csv.DictReader(open(csv_path, encoding='utf-8-sig', newline='')))
zf = zipfile.ZipFile(zip_path)
by_folder = {}
for info in zf.infolist():
    if info.is_dir() or info.filename.lower().endswith('.txt'):
        continue
    folder, _, name = info.filename.partition('/')
    by_folder.setdefault(folder, {})[name] = info

if not keep_old and os.path.isdir(media):
    shutil.rmtree(media)
os.makedirs(media, exist_ok=True)

taken, hotels, locations, n_images, bytes_written = set(), [], {}, 0, 0
for r in rows:
    name = clean(r['hotel_name'])
    slug = slugify(name) or r['hotel_code'].lower()
    if slug in taken:
        slug = f"{slug}-{r['hotel_code'].lower()}"
    taken.add(slug)

    files = [f.strip() for f in r['zip_image_filenames'].split(' ; ') if f.strip()]
    images = []
    for i, f in enumerate(files, 1):
        info = by_folder.get(r['zip_folder_name'], {}).get(f)
        if not info:
            print('MISSING image', r['hotel_code'], f)
            continue
        ext = os.path.splitext(f)[1].lower().replace('.jpeg', '.jpg')
        dest_dir = os.path.join(media, slug)
        os.makedirs(dest_dir, exist_ok=True)
        data = zf.read(info)  # path is built from our own slug, never from the zip entry name
        with open(os.path.join(dest_dir, f'{i}{ext}'), 'wb') as fh:
            fh.write(data)
        images.append(f'/media/hotels/{slug}/{i}{ext}')
        n_images += 1
        bytes_written += len(data)

    loc = clean(r['location_name'])
    if loc not in locations:
        try:
            sights = json.loads(r['famous_sightseens'] or '[]')
        except ValueError:
            sights = []
        locations[loc] = {
            'name': loc,
            'country': clean(r['location_country']) or 'India',
            'type': r['location_type'] if r['location_type'] in ('DOMESTIC', 'INTERNATIONAL') else 'DOMESTIC',
            'description': clean(r['location_description']),
            'highlights': [clean(s) for s in sights if isinstance(s, str)],
            'published': r['location_status'] == 'ACTIVE',
        }
    hotels.append({
        'code': r['hotel_code'].strip(),
        'slug': slug,
        'name': name,
        'category': 'INTERNAL' if r['property_type'] == 'INTERNAL_PROPERTY' else 'ASSOCIATED',
        'hotelType': r['hotel_type'] or None,
        'location': loc,
        'address': clean(r['hotel_address']) or None,
        'mapLink': r['hotel_map_link'].strip() or None,
        'description': clean(r['hotel_description']),
        'published': r['hotel_status'] == 'ACTIVE',
        'images': images,
    })

json.dump({'locations': list(locations.values()), 'hotels': hotels}, open(os.path.join(out_dir, 'catalogue.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f'hotels={len(hotels)} locations={len(locations)} images={n_images} ({bytes_written / 1e6:.0f} MB)')
