"""
Finds one photo per stay type on Wikimedia Commons and saves it (high resolution) to
frontend/public/media/stays/<slug>.jpg, with attribution data in frontend/src/lib/stay-credits.json.
Only freely licensed images are used (public domain, CC0, CC BY, CC BY-SA). Resumable via <cache.json>.

Usage: python backend/scripts/fetch-stay-images.py <cache.json>
"""
import json, os, re, sys, time, urllib.parse, urllib.request

cache_path = sys.argv[1]
root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
out_dir = os.path.join(root, 'frontend', 'public', 'media', 'stays')
credits_path = os.path.join(root, 'frontend', 'src', 'lib', 'stay-credits.json')
os.makedirs(out_dir, exist_ok=True)

UA = {'User-Agent': 'GalaxyHeritageWorldImageFetcher/1.0 (peltowninfra@gmail.com)'}
API = 'https://commons.wikimedia.org/w/api.php'
MIN_W, MIN_H, WIDTH = 1600, 900, 2400
BAD = re.compile(r'\b(map|maps|logo|flag|plan|diagram|seal|emblem|locator|chart|poster|icon|stamp|banner|screenshot|interior|inside|night|sign|portrait|cropped|protest|rally|exhibition|drawing|painting|illustration|model|toy|lego|floorplan|blueprint|render|rendering|3d|shelling|damaged|ruins|war|group|panorama|spherical|cooking|ski|school|bus|stop|ruin|fire|flood|crash|accident|army|soldier|people|family|wedding|floor|mansions|street|lightship|snake|window|greenhouse|houses|house in|hostel|school|church|bar|lobby|bedroom|room|restaurant|aerial view of the)\b', re.I)
OK_LICENSE = re.compile(r'^(public domain|pd|cc0|cc[- ]by(?!.*nc)(?!.*nd))', re.I)

# slug -> (search queries, words one of which must appear in the file title/description)
STAYS = {
    'villas': (['private pool villa resort Phuket', 'villa Seminyak pool', 'Anantara villa pool', 'Amanpuri villa'], ['villa']),
    'treehouses': (['treehouse hotel', 'Treehotel Sweden', 'tree house resort'], ['treehouse', 'tree house', 'treehotel', 'tree hotel']),
    'domes': (['Elqui Domos', 'dome hotel Iceland', 'glamping dome hotel', 'bubble hotel'], ['dome', 'domo', 'bubble']),
    'igloos': (['glass igloo hotel Finland', 'igloo hotel Kakslauttanen', 'ice hotel igloo'], ['igloo']),
    'cabins': (['log cabin mountain forest', 'wooden cabin lake'], ['cabin']),
    'tenthouses': (['luxury safari tent camp', 'luxury tent resort'], ['tent']),
    'hotels': (['hotel building exterior facade', 'luxury hotel exterior'], ['hotel']),
    'resorts': (['resort swimming pool palm trees', 'tropical resort pool'], ['resort']),
    'apartments': (['serviced apartment', 'apartment building balcony', 'apartments modern'], ['apartment']),
    'vacation-homes': (['holiday cottage garden', 'holiday home Sweden red cottage', 'vacation cottage lake'], ['cottage', 'holiday home', 'vacation']),
    'beach-houses': (['beach houses coast sand', 'houses on the beach sea'], ['beach house', 'beach']),
    'glass-cabins': (['Kakslauttanen glass igloo', 'glass igloo Lapland aurora', 'glass igloo hotel'], ['glass igloo', 'kakslauttanen', 'igloo']),
    'houseboats': (['Kerala houseboat backwaters', 'houseboat Alappuzha'], ['houseboat']),
    'overwater-bungalows': (['Maldives water villas', 'Bora Bora overwater bungalows', 'Maldives resort water bungalows'], ['water villa', 'overwater', 'bungalow', 'maldives']),
    'glamping': (['glamping tent', 'glamping', 'glamping site'], ['glamp']),
    'eco-lodges': (['eco lodge', 'ecolodge rainforest', 'eco-lodge'], ['eco lodge', 'ecolodge', 'eco-lodge', 'lodge']),
    'farm-stays': (['agriturismo Tuscany', 'farmstay accommodation', 'farm stay cottages countryside'], ['agriturismo', 'farmstay', 'farm stay', 'farm']),
    'desert-camps': (['Jaisalmer desert camp Sam sand dunes', 'Thar desert camp tents', 'Merzouga desert camp'], ['camp']),
    'cave-hotels': (['Cappadocia cave hotel terrace', 'Goreme cave hotel', 'cave hotel Guadix'], ['cave hotel', 'cave house', 'cave']),
    'heritage-homes': (['haveli heritage hotel Rajasthan', 'heritage haveli'], ['haveli', 'heritage']),
    'castles': (['castle hotel', 'palace hotel Udaipur'], ['castle', 'palace']),
    'tiny-homes': (['tiny house on wheels', 'tiny house'], ['tiny']),
    'floating-villas': (['floating bungalow Khao Sok', 'floating raft houses Kanchanaburi', 'floating hotel Maldives', 'floating bungalows lake'], ['floating']),
    'wellness-retreats': (['Ayurveda resort Kerala', 'yoga retreat Rishikesh', 'spa resort pool wellness'], ['ayurved', 'yoga', 'spa', 'wellness']),
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


def candidates(query):
    res = call({'action': 'query', 'generator': 'search', 'gsrsearch': f'{query} filetype:bitmap', 'gsrnamespace': 6, 'gsrlimit': 25,
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


cache = json.load(open(cache_path, encoding='utf-8')) if os.path.exists(cache_path) else {}
credits = json.load(open(credits_path, encoding='utf-8')) if os.path.exists(credits_path) else {}

used = {v.get('title') for v in cache.values() if v.get('file')}
for slug, (queries, must) in STAYS.items():
    if cache.get(slug, {}).get('file') and os.path.exists(os.path.join(out_dir, slug + '.jpg')):
        continue
    found = None
    for q in queries:
        for c in candidates(q):
            if any(w in c['title'].lower() for w in must) and c['title'] not in used:
                found = {**c, 'query': q}
                break
        time.sleep(0.4)
        if found:
            break
    if not found:
        cache[slug] = {'file': None}
        print('NONE', slug, flush=True)
        continue
    data = urllib.request.urlopen(urllib.request.Request(found['download'], headers=UA), timeout=90).read()
    with open(os.path.join(out_dir, slug + '.jpg'), 'wb') as fh:
        fh.write(data)
    used.add(found['title'])
    cache[slug] = {'file': f'/media/stays/{slug}.jpg', 'title': found['title'], 'query': found['query'], 'size': found['size']}
    credits[slug] = {'title': found['title'], 'artist': found['artist'], 'license': found['license'],
                     'licenseUrl': found['licenseUrl'], 'source': found['page']}
    print('OK  ', slug, '<-', found['title'], found['size'], f'{len(data) // 1024} KB', flush=True)
    json.dump(cache, open(cache_path, 'w', encoding='utf-8'), indent=1)
    json.dump(credits, open(credits_path, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
    time.sleep(0.4)

json.dump(cache, open(cache_path, 'w', encoding='utf-8'), indent=1)
json.dump(credits, open(credits_path, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print('done:', sum(1 for v in cache.values() if v.get('file')), 'found,', sum(1 for v in cache.values() if not v.get('file')), 'missing', flush=True)
