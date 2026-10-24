"""
Step 1 of the itinerary import (step 2: `npx tsx scripts/one-off/import-itineraries.ts <catalogue.json>`).

Reads itineraries_export.csv + itinerary_images.zip and writes
  - <out>/itineraries.json                     cleaned itinerary records with day-by-day schedules
  - frontend/public/media/itineraries/<slug>/N.jpg   the photos, copied from the zip BYTE-FOR-BYTE (original quality)

Usage: python backend/scripts/one-off/prepare-itinerary-import.py <itineraries_export.csv> <itinerary_images.zip> <out_dir>
"""
import csv, html, json, os, re, shutil, sys, zipfile

csv.field_size_limit(10 ** 9)
csv_path, zip_path, out_dir = sys.argv[1:4]
root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
media = os.path.join(root, 'frontend', 'public', 'media', 'itineraries')
os.makedirs(out_dir, exist_ok=True)
clean = lambda s: html.unescape((s or '').strip()).replace('\r\n', '\n')

rows = list(csv.DictReader(open(csv_path, encoding='utf-8-sig', newline='')))
zf = zipfile.ZipFile(zip_path)
by_folder = {}
for info in zf.infolist():
    if info.is_dir() or info.filename.lower().endswith('.txt'):
        continue
    folder, _, name = info.filename.partition('/')
    by_folder.setdefault(folder, {})[name] = info


def bullets(s):
    return [re.sub(r'^[•\-\*]\s*', '', l).strip() for l in s.split('\n') if l.strip()]


def schedule(full):
    # "[Day 1 - Title]\nDescription..." blocks
    days = []
    for m in re.finditer(r'\[Day\s+(\d+)\s*-\s*(.*?)\]\s*\n(.*?)(?=\n\s*\n\[Day\s+\d+|\Z)', full, re.S):
        days.append({'dayNumber': int(m.group(1)), 'title': m.group(2).strip(), 'description': m.group(3).strip()})
    return days


if os.path.isdir(media):
    shutil.rmtree(media)
os.makedirs(media)

out, n_img, n_bytes = [], 0, 0
for r in rows:
    if r['status'] != 'ACTIVE' or r['deleted_at']:
        continue
    slug = r['slug'].strip()
    files = [r['zip_cover_image_file']] + [f.strip() for f in r['zip_gallery_image_files'].split(' ; ') if f.strip()]
    images = []
    for i, f in enumerate(files, 1):
        info = by_folder.get(r['zip_folder_name'], {}).get(f)
        if not info:
            print('MISSING image', slug, f)
            continue
        ext = os.path.splitext(f)[1].lower().replace('.jpeg', '.jpg')
        os.makedirs(os.path.join(media, slug), exist_ok=True)
        data = zf.read(info)  # destination path is built from our own slug, never from the zip entry name
        with open(os.path.join(media, slug, f'{i}{ext}'), 'wb') as fh:
            fh.write(data)
        images.append(f'/media/itineraries/{slug}/{i}{ext}')
        n_img += 1
        n_bytes += len(data)

    days = schedule(clean(r['schedule_full_details']))
    if len(days) != int(r['days']):
        print('WARN day count', slug, len(days), 'vs', r['days'])
    out.append({
        'slug': slug,
        'title': clean(r['name']),
        'badge': re.sub(r'^[^\w]+', '', clean(r['badge'])).strip() or None,  # drop the leading flag emoji
        'destination': clean(r['destination']),
        'type': r['type'] if r['type'] in ('DOMESTIC', 'INTERNATIONAL') else None,
        'category': clean(r['category']) or None,
        'durationDays': int(r['days']),
        'durationNights': int(r['nights']),
        'bestTime': clean(r['best_time']) or None,
        'summary': clean(r['short_desc']),
        'highlights': bullets(clean(r['highlights_formatted'])),
        'inclusions': bullets(clean(r['inclusions_formatted'])),
        'days': days,
        'images': images,
    })

json.dump(out, open(os.path.join(out_dir, 'itineraries.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f'itineraries={len(out)} images={n_img} ({n_bytes / 1e6:.0f} MB)')
