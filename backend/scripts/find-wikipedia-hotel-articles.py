"""
Looks for an English Wikipedia article about each hotel in <missing.json> and writes the candidates (with the article's
introduction) to <out.json> for REVIEW. Nothing is written to the database here.

A candidate is accepted only if the article title closely matches the hotel's name AND the introduction says the article is
about a hotel / resort / palace-hotel (so "Radisson" the company or a place with the same name is never picked).
Wikipedia text is CC BY-SA 4.0: the credit is stored with the description.

Usage: python backend/scripts/find-wikipedia-hotel-articles.py <missing.json> <out.json>
"""
import json, re, sys, time, urllib.parse, urllib.request

src, out = sys.argv[1:3]
UA = {'User-Agent': 'GalaxyHeritageWorldDescriptions/1.0 (peltowninfra@gmail.com)'}
API = 'https://en.wikipedia.org/w/api.php'


def call(params):
    url = API + '?' + urllib.parse.urlencode({**params, 'format': 'json'})
    for attempt in range(4):
        try:
            return json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30))
        except Exception:
            time.sleep(2 * (attempt + 1))
    return {}


STOP = {'hotel', 'hotels', 'resort', 'resorts', 'the', 'by', 'and', 'spa', 'inn', 'suites', 'suite', 'a', 'an', 'of', 'at', 'in', 'palace'}


def tokens(s):
    return [t for t in re.findall(r"[a-z0-9]+", s.lower()) if t not in STOP]


def clean_name(n):
    n = n.split('|')[-1]  # "Udaan Hotels | Woodberry Hotel & Spa - Gangtok"
    return re.sub(r'\s+', ' ', n).strip()


hotels = json.load(open(src, encoding='utf-8'))
results = []
for h in hotels:
    name = clean_name(h['name'])
    # the name without a trailing " - City" / ", City"
    base = re.split(r'\s[-–,]\s', name)[0].strip()
    found = None
    for query in dict.fromkeys([name, base, f"{base} {h['city']}"]):
        res = call({'action': 'query', 'list': 'search', 'srsearch': query, 'srlimit': 5, 'srnamespace': 0})
        for hit in res.get('query', {}).get('search', []):
            title = hit['title']
            tt, bt = set(tokens(title)), tokens(base)
            if not bt or not (set(bt) <= tt | set(tokens(h['city']))):
                continue
            # tokens of the hotel's own name must all appear in the title
            if not set(bt) <= tt:
                continue
            ex = call({'action': 'query', 'prop': 'extracts|info', 'inprop': 'url', 'exintro': 1, 'explaintext': 1, 'exsentences': 4, 'titles': title, 'redirects': 1})
            page = next(iter(ex.get('query', {}).get('pages', {}).values()), {})
            text = (page.get('extract') or '').strip()
            if not text or 'may refer to' in text[:200]:
                continue
            first = text[:300].lower()
            if not re.search(r'\b(hotel|resort|palace|lodge|inn|heritage)\b', first):
                continue
            found = {'title': page['title'], 'url': page.get('fullurl'), 'extract': text, 'query': query}
            break
        time.sleep(0.3)
        if found:
            break
    results.append({'id': h['id'], 'name': h['name'], 'city': h['city'], 'wikipedia': found})
    print(('WIKI ' if found else 'none ') + h['name'][:50].ljust(50), '->', found['title'] if found else '', flush=True)

json.dump(results, open(out, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print('matches:', sum(1 for r in results if r['wikipedia']), 'of', len(results))
