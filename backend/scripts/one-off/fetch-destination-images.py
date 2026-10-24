"""
Finds a landmark photo for every destination on Wikimedia Commons and saves it (high resolution) to
frontend/public/media/destinations/<slug>.jpg, plus attribution data to frontend/src/lib/destination-credits.json.

Only freely licensed images are used (public domain, CC0, CC BY, CC BY-SA); attribution is recorded and shown on the site.
Landmarks come from the CSV's famous_sightseens column.  Resumable: results are cached in <cache>.

Usage: python backend/scripts/one-off/fetch-destination-images.py <hotels_export.csv> <cache.json>
"""
import csv, json, os, re, sys, time, unicodedata, urllib.parse, urllib.request

csv_path, cache_path = sys.argv[1:3]
root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
out_dir = os.path.join(root, 'frontend', 'public', 'media', 'destinations')
credits_path = os.path.join(root, 'frontend', 'src', 'lib', 'destination-credits.json')
os.makedirs(out_dir, exist_ok=True)

UA = {'User-Agent': 'GalaxyHeritageWorldImageFetcher/1.0 (peltowninfra@gmail.com)'}
API = 'https://commons.wikimedia.org/w/api.php'
MIN_W, MIN_H, WIDTH = 1600, 900, 2400
BAD = re.compile(r'\b(map|maps|logo|flag|plan|diagram|seal|emblem|locator|coat of arms|chart|poster|icon|stamp|banner|screenshot|interior|inside|night|sign|statue of|menu|portrait|cropped|protest|auto show|mural|stall|pooja|puja|butterfly|papilio|empty|poster|rally|exhibition|bus stop|busstop)\b', re.I)
OK_LICENSE = re.compile(r'^(public domain|pd|cc0|cc[- ]by(?!.*nc)(?!.*nd))', re.I)


def slugify(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]+', '-', s.lower().replace('&', ' and ')).strip('-')[:150]


def call(params):
    url = API + '?' + urllib.parse.urlencode({**params, 'format': 'json'})
    for attempt in range(4):
        try:
            return json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40))
        except Exception:
            time.sleep(2 * (attempt + 1))
    return {}


def strip_html(s):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', s or '')).strip()


def candidates(query):
    res = call({'action': 'query', 'generator': 'search', 'gsrsearch': f'{query} filetype:bitmap', 'gsrnamespace': 6, 'gsrlimit': 20,
                'prop': 'imageinfo', 'iiprop': 'url|size|mime|extmetadata', 'iiurlwidth': WIDTH})
    pages = sorted((res.get('query', {}).get('pages', {})).values(), key=lambda p: p.get('index', 0))
    for p in pages:
        info = (p.get('imageinfo') or [None])[0]
        if not info or info.get('mime') != 'image/jpeg':
            continue
        w, h = info['width'], info['height']
        title = p['title'][5:]
        md = info.get('extmetadata', {})
        lic = (md.get('LicenseShortName', {}).get('value') or '').strip()
        if w < MIN_W or h < MIN_H or not (1.25 <= w / h <= 2.2) or BAD.search(title) or not OK_LICENSE.match(lic):
            continue
        yield {
            'title': title,
            'text': (title + ' ' + strip_html(md.get('ImageDescription', {}).get('value'))).lower(),
            'download': info.get('thumburl') or info['url'],
            'page': info['descriptionurl'],
            'artist': strip_html(md.get('Artist', {}).get('value'))[:120] or 'Unknown author',
            'license': lic,
            'licenseUrl': md.get('LicenseUrl', {}).get('value', ''),
            'size': f'{w}x{h}',
        }


# Hand-picked searches where the generic landmark lookup gave a poor match: name -> (queries, words one of which must appear)
OVERRIDES = {
    'Bangalore': (['Vidhana Soudha Bangalore', 'Bangalore Palace'], ['vidhana', 'palace']),
    'Kochi': (['Chinese fishing nets Kochi', 'Fort Kochi Chinese fishing nets'], ['fishing net']),
    'Manesar': (['Sultanpur National Park Haryana', 'Aravalli Haryana'], ['sultanpur', 'aravalli']),
    'Ludhiana': (['Punjab Agricultural University Ludhiana', 'Lodhi Fort Ludhiana', 'Ludhiana Railway Station', 'Ludhiana city skyline'], ['agricultural university', 'lodhi fort', 'railway station', 'skyline']),
    'Panchgani': (['Table Land Panchgani plateau', 'Panchgani Maharashtra hill station'], ['table land', 'panchgani']),
    'Thekkady': (['Periyar Lake Thekkady boat', 'Periyar Tiger Reserve lake'], ['periyar']),
    'Shirdi': (['Shirdi Sai Baba temple Maharashtra', 'Shirdi'], ['shirdi']),
    'Dharamshala': (['Dhauladhar Dharamshala', 'Dharamshala Himalayas', 'Tsuglagkhang Complex'], ['dhauladhar', 'tsuglagkhang', 'dalai lama']),
    'London': (['Tower Bridge London', 'Big Ben London'], ['tower bridge', 'big ben']),
    'Bhopal': (['Upper Lake Bhopal', 'Taj-ul-Masajid Bhopal'], ['upper lake', 'taj-ul']),
}

rows = list(csv.DictReader(open(csv_path, encoding='utf-8-sig', newline='')))
locs = {}
for r in rows:
    try:
        sights = json.loads(r['famous_sightseens'] or '[]')
    except ValueError:
        sights = []
    locs.setdefault(r['location_name'].strip(), {'country': r['location_country'], 'sights': sights})

cache = json.load(open(cache_path, encoding='utf-8')) if os.path.exists(cache_path) else {}
credits = json.load(open(credits_path, encoding='utf-8')) if os.path.exists(credits_path) else {}

for name, meta in locs.items():
    slug = slugify(name)
    if cache.get(name, {}).get('file') and os.path.exists(os.path.join(out_dir, slug + '.jpg')):
        continue
    place = name.split(',')[0].strip().lower()
    queries = [f'{s} {name}' for s in meta['sights'][:3]] + [name, f"{name} {meta['country']}"]
    must = None
    if name in OVERRIDES:
        queries, must = OVERRIDES[name]
    found = None
    for q in queries:
        sight = q.lower()
        for c in candidates(q):
            # must really be about this place: the location name, or the full landmark name, appears in title/description
            landmark = next((s.lower() for s in meta['sights'] if s.lower() in c['text']), None)
            if (must and any(w in c['text'] for w in must)) or (not must and (place in c['text'] or landmark)):
                found = {**c, 'query': q}
                break
        time.sleep(0.4)
        if found:
            break
    if not found:
        cache[name] = {'file': None}
        print('NONE', name)
        continue
    data = urllib.request.urlopen(urllib.request.Request(found['download'], headers=UA), timeout=90).read()
    with open(os.path.join(out_dir, slug + '.jpg'), 'wb') as fh:
        fh.write(data)
    cache[name] = {'file': f'/media/destinations/{slug}.jpg', 'title': found['title'], 'query': found['query'], 'size': found['size']}
    credits[slug] = {'name': name, 'title': found['title'], 'artist': found['artist'], 'license': found['license'],
                     'licenseUrl': found['licenseUrl'], 'source': found['page']}
    print('OK  ', name, '<-', found['title'], found['size'], f'{len(data) // 1024} KB')
    json.dump(cache, open(cache_path, 'w', encoding='utf-8'), indent=1)
    json.dump(credits, open(credits_path, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    time.sleep(0.4)

json.dump(cache, open(cache_path, 'w', encoding='utf-8'), indent=1)
json.dump(credits, open(credits_path, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print('done:', sum(1 for v in cache.values() if v.get('file')), 'found,', sum(1 for v in cache.values() if not v.get('file')), 'missing')
