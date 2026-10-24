"""
Second pass of fetch-stay-images.py: picks photos from curated Wikimedia Commons CATEGORIES (much more precise than
keyword search). For each stay it tries its categories in order and, among the freely licensed landscape photos
found, keeps the sharpest one (largest). Overwrites the stay's entry in the cache / credits / image folder.

Usage: python backend/scripts/one-off/fetch-stay-images-by-category.py <cache.json> <slug> [<slug> ...]
"""
import json, os, re, sys, time, urllib.parse, urllib.request

cache_path, slugs = sys.argv[1], sys.argv[2:]
root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
out_dir = os.path.join(root, 'frontend', 'public', 'media', 'stays')
credits_path = os.path.join(root, 'frontend', 'src', 'lib', 'stay-credits.json')

UA = {'User-Agent': 'GalaxyHeritageWorldImageFetcher/1.0 (peltowninfra@gmail.com)'}
API = 'https://commons.wikimedia.org/w/api.php'
MIN_W, MIN_H, WIDTH = 1600, 900, 2400
BAD = re.compile(r'\b(map|maps|logo|flag|plan|diagram|seal|emblem|chart|poster|icon|stamp|banner|screenshot|interior|inside|night|sign|portrait|cropped|protest|exhibition|drawing|painting|illustration|model|toy|lego|render|rendering|3d|damaged|ruins|war|group|panorama|spherical|ski|school|bus|fire|flood|crash|people|family|wedding|menu|bar|lobby|room)\b', re.I)
OK_LICENSE = re.compile(r'^(public domain|pd|cc0|cc[- ]by(?!.*nc)(?!.*nd))', re.I)

CATEGORIES = {
    'villas': ['Villa resorts', 'Hotel villas', 'Resorts in Bali', 'Resorts in Phuket', 'Luxury hotels'],
    'treehouses': ['Treehouse hotels', 'Treehouses', 'Tree houses'],
    'domes': ['Glamping', 'Bubble tents', 'Dome tents', 'Geodesic dome hotels'],
    'igloos': ['Igloo hotels', 'Glass igloos', 'Ice Hotel (Jukkasjärvi)', 'Igloos'],
    'apartments': ['Aparthotels', 'Serviced apartments', 'Modern apartment buildings'],
    'vacation-homes': ['Vacation rentals', 'Holiday homes', 'Holiday cottages', 'Vacation homes'],
    'glass-cabins': ['Glass igloos', 'Kakslauttanen Arctic Resort', 'Aurora Village', 'Glass buildings'],
    'overwater-bungalows': ['Overwater bungalows', 'Water villas', 'Overwater villas'],
    'floating-villas': ['Floating bungalows', 'Houseboats', 'Water villas', 'Floating hotels'],
    'wellness-retreats': ['Spa resorts', 'Health resorts', 'Wellness hotels', 'Spa hotels'],
    'tiny-homes': ['Tiny houses', 'Tiny house movement'],
    'desert-camps': ['Desert camps', 'Tourist camps in India', 'Tented camps', 'Luxury tents in Rajasthan'],
    'cabins': ['Log cabins', 'Cabins (buildings)'],
    'farm-stays': ['Agriturismi', 'Farm tourism', 'Farmstays', 'Agritourism'],
    'cave-hotels': ['Cave hotels', 'Cave hotels in Cappadocia'],
    'eco-lodges': ['Ecolodges', 'Eco lodges'],
}


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


def from_category(cat):
    res = call({'action': 'query', 'generator': 'categorymembers', 'gcmtitle': f'Category:{cat}', 'gcmtype': 'file', 'gcmlimit': 60,
                'prop': 'imageinfo', 'iiprop': 'url|size|mime|extmetadata', 'iiurlwidth': WIDTH})
    for p in (res.get('query', {}).get('pages', {})).values():
        info = (p.get('imageinfo') or [None])[0]
        if not info or info.get('mime') != 'image/jpeg':
            continue
        w, h = info['width'], info['height']
        title = p['title'][5:]
        md = info.get('extmetadata', {})
        lic = (md.get('LicenseShortName', {}).get('value') or '').strip()
        if w < MIN_W or h < MIN_H or not (1.25 <= w / h <= 2.2) or BAD.search(title) or not OK_LICENSE.match(lic):
            continue
        yield {'title': title, 'pixels': w * h, 'download': info.get('thumburl') or info['url'], 'page': info['descriptionurl'],
               'artist': strip_html(md.get('Artist', {}).get('value'))[:120] or 'Unknown author', 'license': lic,
               'licenseUrl': md.get('LicenseUrl', {}).get('value', ''), 'size': f'{w}x{h}', 'cat': cat}


cache = json.load(open(cache_path, encoding='utf-8'))
credits = json.load(open(credits_path, encoding='utf-8'))
used = {v.get('title') for k, v in cache.items() if v.get('file') and k not in slugs}

for slug in slugs:
    best = None
    for cat in CATEGORIES.get(slug, []):
        pool = [c for c in from_category(cat) if c['title'] not in used]
        time.sleep(0.4)
        if pool:
            best = max(pool, key=lambda c: c['pixels'])
            break
    if not best:
        print('NONE (kept previous)', slug, flush=True)
        continue
    data = urllib.request.urlopen(urllib.request.Request(best['download'], headers=UA), timeout=90).read()
    with open(os.path.join(out_dir, slug + '.jpg'), 'wb') as fh:
        fh.write(data)
    used.add(best['title'])
    cache[slug] = {'file': f'/media/stays/{slug}.jpg', 'title': best['title'], 'query': 'Category:' + best['cat'], 'size': best['size']}
    credits[slug] = {k: best[k] for k in ('title', 'artist', 'license', 'licenseUrl')} | {'source': best['page']}
    print('OK  ', slug, '<-', best['title'], best['size'], '[' + best['cat'] + ']', flush=True)
    json.dump(cache, open(cache_path, 'w', encoding='utf-8'), indent=1)
    json.dump(credits, open(credits_path, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    time.sleep(0.4)
