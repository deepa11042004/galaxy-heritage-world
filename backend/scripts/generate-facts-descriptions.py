"""
Writes short, factual Property Overview text for hotels that have none, using ONLY data we hold for the hotel:
name, city, state/country, hotel type, address and the landmarks listed for its city. No amenities, ratings, prices or
other claims are invented. Three sentence layouts are rotated (stably, by slug) so the pages don't all read the same.

Usage: python backend/scripts/generate-facts-descriptions.py <missing.json> <out.json>
"""
import hashlib, json, re, sys

src, out = sys.argv[1:3]
hotels = json.load(open(src, encoding='utf-8'))


def display_name(n):
    n = n.split('|')[-1].strip()                 # "Udaan Hotels | Woodberry Hotel & Spa - Gangtok"
    n = re.split(r'\s[-–]\s', n)[0].strip()       # drop a trailing " - City"
    return re.sub(r'\s+', ' ', n)


def listing(items):
    items = [i for i in items if i][:3]
    if len(items) <= 1:
        return ''.join(items)
    return ', '.join(items[:-1]) + ' and ' + items[-1]


def place(h):
    parts = [h['city']]
    if h.get('state'):
        parts.append(h['state'])
    if (h.get('country') or 'India') != 'India' or not h.get('state'):
        parts.append(h.get('country') or 'India')
    return ', '.join(dict.fromkeys(parts))


def address_sentence(h, lead):
    a = (h.get('address') or '').strip().rstrip('.')
    # skip empty, over-long or junk addresses (e.g. a stray symbol): need real words and at least 12 characters
    if len(a) < 12 or len(a) > 170 or len(re.findall(r'[A-Za-z]{3,}', a)) < 2:
        return ''
    return f'{lead} {a}.'


results = []
for h in hotels:
    name = display_name(h['name'])
    kind = 'resort' if h.get('type') == 'RESORT' else 'hotel'
    where = place(h)
    sights = listing(h.get('sights') or [])
    sight_sentence = f"Popular places to visit in {h['city']} include {sights}." if sights else ''
    contact = 'For availability and booking, contact our travel desk on 1800-843-6114.'
    variant = int(hashlib.md5(h['slug'].encode()).hexdigest(), 16) % 3
    already = kind in name.lower() or 'resort' in name.lower() or 'hotel' in name.lower()
    if variant == 0:
        parts = [(f'{name} is located in {where}.' if already else f'{name} is a {kind} in {where}.'), address_sentence(h, 'Its address is'), sight_sentence, contact]
    elif variant == 1:
        parts = [f'Located in {where}, {name} is part of the Galaxy Heritage World network of hotels and resorts.', address_sentence(h, 'Find it at'), sight_sentence, contact]
    else:
        parts = [(f'Stay at {name} in {where}.' if already else f'Stay at {name}, a {kind} in {where}.'), address_sentence(h, 'The address is'), sight_sentence, contact]
    results.append({'id': h['id'], 'name': h['name'], 'description': ' '.join(p for p in parts if p)})

json.dump(results, open(out, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print(len(results), 'descriptions; length min/avg/max:', min(len(r['description']) for r in results),
      sum(len(r['description']) for r in results) // len(results), max(len(r['description']) for r in results))
