"""
Downloads several CANDIDATE photos per Membership "Handpicked Privileges" card from Wikimedia Commons (freely licensed
only: public domain, CC0, CC BY, CC BY-SA) into <cand_dir>/<slot>/<n>.jpg and writes <cand_dir>/candidates.json with the
attribution data, so the best one per card can be chosen by eye.

Usage: python backend/scripts/fetch-membership-images.py <cand_dir>
"""
import json, os, re, sys, time, urllib.parse, urllib.request

cand_dir = sys.argv[1]
UA = {'User-Agent': 'GalaxyHeritageWorldImageFetcher/1.0 (peltowninfra@gmail.com)'}
API = 'https://commons.wikimedia.org/w/api.php'
MIN_W, MIN_H, WIDTH = 1600, 900, 1800
BAD = re.compile(r'\b(map|logo|flag|diagram|poster|icon|stamp|banner|screenshot|drawing|painting|illustration|model|toy|render|rendering|3d|damaged|ruins|war|protest|fire|flood|crash|menu|vector|sketch|cartoon|advert|advertisement|collage|montage)\b', re.I)
OK_LICENSE = re.compile(r'^(public domain|pd|cc0|cc[- ]by(?!.*nc)(?!.*nd))', re.I)

SLOTS = {
    'holiday-your-way': ['family beach holiday sunset', 'tropical beach resort sunrise', 'couple walking on beach holiday'],
    'future-pricing': ['happy family parents children laughing', 'family playing together on bed', 'smiling family with kids at home'],
    'spacious-suites': ['heritage hotel suite four poster bed India', 'palace hotel bedroom Rajasthan', 'haveli hotel room'],
    'family-experiences': ['family walking tea plantation', 'father carrying child on shoulders walking', 'family hiking in countryside children'],
    'premium-resorts': ['water villas lagoon resort', 'overwater villas Maldives', 'floating villas lake resort'],
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
    res = call({'action': 'query', 'generator': 'search', 'gsrsearch': f'{query} filetype:bitmap', 'gsrnamespace': 6, 'gsrlimit': 30,
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
        if w < MIN_W or h < MIN_H or not (1.1 <= w / h <= 2.0) or BAD.search(title) or not OK_LICENSE.match(lic):
            continue
        yield {'title': title, 'download': info.get('thumburl') or info['url'], 'page': info['descriptionurl'],
               'artist': strip_html(md.get('Artist', {}).get('value'))[:120] or 'Unknown author', 'license': lic,
               'licenseUrl': md.get('LicenseUrl', {}).get('value', ''), 'size': f'{w}x{h}'}


out = {}
for slot, queries in SLOTS.items():
    os.makedirs(os.path.join(cand_dir, slot), exist_ok=True)
    seen, picked = set(), []
    for q in queries:
        for c in candidates(q):
            if c['title'] in seen:
                continue
            seen.add(c['title'])
            picked.append(c)
            if len(picked) >= 8:
                break
        time.sleep(0.4)
        if len(picked) >= 8:
            break
    for i, c in enumerate(picked, 1):
        try:
            data = urllib.request.urlopen(urllib.request.Request(c['download'], headers=UA), timeout=90).read()
            with open(os.path.join(cand_dir, slot, f'{i}.jpg'), 'wb') as fh:
                fh.write(data)
            c['file'] = f'{slot}/{i}.jpg'
        except Exception as e:
            c['file'] = None
        time.sleep(0.3)
    out[slot] = [c for c in picked if c.get('file')]
    print(slot, len(out[slot]), 'candidates', flush=True)

json.dump(out, open(os.path.join(cand_dir, 'candidates.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
