"""Audit the programme pages' public SSR baseline and local lazy enhancement.

Run after build.py and build-progress.mjs. --dist and --base-path support an
isolated preview build without modifying the release dist or source documents.
"""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
from xml.etree import ElementTree as ET
from datetime import date
import argparse
import json
import os
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--dist', type=Path, default=ROOT/'dist')
parser.add_argument('--base-path', default=os.environ.get('SITE_BASE_PATH', ''))
args = parser.parse_args()
DIST, BASE = args.dist.resolve(), args.base_path.rstrip('/')
DATA = json.loads((ROOT/'programme-content.json').read_text())
SITE = json.loads((ROOT/'config.json').read_text())
LOCALES = {'en':('en-AU',''), 'zh':('zh-Hant','zh-hant/'), 'ja':('ja','ja/')}
IDS = ['cafe','coffee','workshops','local']
GROWTH = ['seed','germinating','seedling','grafting','growing','flowering','cherries','harvest']
errors, checks = [], 0


def check(condition, message):
    global checks
    checks += 1
    if not condition:
        errors.append(message)


class Node:
    def __init__(self, tag, attrs=None, parent=None):
        self.tag, self.attrs, self.parent, self.children = tag, attrs or {}, parent, []

    def walk(self):
        yield self
        for child in self.children:
            if isinstance(child, Node):
                yield from child.walk()

    def text(self):
        return ' '.join(child.text() if isinstance(child, Node) else child for child in self.children)

    def find(self, **attrs):
        return [node for node in self.walk() if all(node.attrs.get(k) == v for k,v in attrs.items())]

    def classes(self, name):
        return [node for node in self.walk() if name in node.attrs.get('class','').split()]


class Document(HTMLParser):
    VOID = {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}

    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.root = Node('document')
        self.stack = [self.root]
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        node = Node(tag, dict(attrs), self.stack[-1])
        self.stack[-1].children.append(node)
        if tag not in self.VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in self.VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1,0,-1):
            if self.stack[i].tag == tag:
                self.stack = self.stack[:i]
                break

    def handle_data(self, text):
        self.stack[-1].children.append(text)


def norm(text):
    return ' '.join(text.split())


def one(nodes, label):
    check(len(nodes) == 1, label+': expected one element')
    return nodes[0] if len(nodes) == 1 else Node('missing')


def marked(node, attribute, label):
    return one([n for n in node.walk() if attribute in n.attrs], label+': '+attribute)


def local_target(value, page, label):
    parts = urlsplit(value)
    if parts.scheme or parts.netloc or not parts.path:
        return None
    route = unquote(parts.path)
    if route.startswith('/'):
        check(not BASE or route.startswith(BASE+'/'), label+': missing deployment base: '+value)
        if BASE and route.startswith(BASE+'/'):
            route = route[len(BASE):]
        target = DIST/route.lstrip('/')
    else:
        target = page.parent/route
    try:
        target.resolve().relative_to(DIST)
    except ValueError:
        check(False, label+': local reference leaves public dist: '+value)
        return None
    if target.is_dir():
        target /= 'index.html'
    check(target.is_file(), label+': missing reference: '+value)
    return target


def initial_modules(path, label):
    visited, todo = set(), [path]
    while todo:
        current = todo.pop()
        if current in visited or not current.is_file():
            continue
        visited.add(current)
        for specifier in re.findall(r'\b(?:import|export)[^;]*?\bfrom\s*[\"\']([^\"\']+)[\"\']', current.read_text()):
            check(specifier.startswith('./'), label+': runtime dependency is not a local module')
            dependency = current.parent/specifier
            check(dependency.is_file(), label+': missing static import: '+specifier)
            if dependency.is_file():
                todo.append(dependency)
    # Includes the small clock/SunCalc logic, while Three.js remains deferred.
    check(sum(p.stat().st_size for p in visited) < 65536, label+': heavy model code is loaded before the scene approaches')
    check(not any(p.name.startswith('programme-world-') for p in visited), label+': programme world must be dynamically imported')
    return visited


check(not BASE or (BASE.startswith('/') and '..' not in BASE), 'Invalid audit base path')
check(set(DATA) == {'copy','initial'}, 'Source has unexpected private/draft fields')
check(set(DATA['copy']) == set(LOCALES), 'Programme copy must have three languages')
initial = DATA['initial']
check(set(initial) == {'version','updatedAt','departments','coffee'}, 'Initial programme has unexpected fields')
check(initial['version'] == 1 and re.fullmatch(r'\d{4}-\d{2}-\d{2}',initial['updatedAt']) is not None, 'Invalid initial version/date')
check(list(initial['departments']) == IDS, 'Wrong/missing public department IDs/order')
try:
    check(date.fromisoformat(initial['updatedAt']).isoformat()==initial['updatedAt'],'Initial programme date is not a real date')
except (TypeError,ValueError):
    check(False,'Initial programme date is not a real date')
coffee = initial['coffee']
try:
    check(date.fromisoformat(coffee['observedOn']).isoformat()==coffee['observedOn'],'Initial plant-report date is not a real date')
except (TypeError,ValueError):
    check(False,'Initial plant-report date is not a real date')
check(set(coffee) == {'seedVarieties','seedStage','trialName','trialStage','heightCm','observedOn'}, 'Coffee baseline has unsupported/private fields')
check(coffee['seedVarieties'] == ['IPR107','NR25','Marsellesa'], 'Confirmed seed names are wrong')
check(coffee['seedStage'] == 'seed' and coffee['trialName'] == 'Paraíso' and coffee['trialStage'] == 'seedling' and coffee['heightCm'] == 20, 'Initial seed and separate Paraíso report differ from the reviewed launch facts')
for key,(lang,prefix) in LOCALES.items():
    c = DATA['copy'][key]
    check(set(c) == set(DATA['copy']['en']) and c['lang'] == lang, key+': incomplete or wrong localized copy')
    check(set(c['clock']) == {'label','place'} and all(c['clock'].values()), key+': analogue clock labels missing')
    check(isinstance(c['lightingThoughts'],list) and len(c['lightingThoughts'])>=2 and all(isinstance(s,str) and s.strip() for s in c['lightingThoughts']), key+': localized light-switching thoughts missing')
    check(list(c['departments']) == IDS, key+': department names missing')
    check(list(c['growth']['stages']) == GROWTH, key+': optional growth stages missing/order changed')
    check(set(c['statusLabels']) == {'planning','developing','trialling','ready'}, key+': status labels incomplete')
    for id in IDS:
        department = initial['departments'][id]
        check(set(department) == {'status','translations'} and set(department['translations']) == set(LOCALES), key+'/'+id+': initial record has private/missing fields')
        translation = department['translations'][key]
        check(set(translation) == {'now','next','done'} and all(isinstance(translation[f],str) and translation[f].strip() for f in ['now','next']) and isinstance(translation['done'],list), key+'/'+id+': incomplete public status copy')

pages, programmes = 0, 0
for key,(lang,prefix) in LOCALES.items():
    c = DATA['copy'][key]
    for page,route in [('home',''),('programmes','progress/programmes/')]:
        file = DIST/prefix/route/'index.html'
        label = str(file.relative_to(DIST))
        check(file.is_file(), label+': generated page is missing')
        if not file.is_file():
            continue
        pages += 1
        text = file.read_text()
        root = Document(text).root
        html = one([n for n in root.walk() if n.tag=='html'], label+': html')
        check(html.attrs.get('lang') == lang and html.attrs.get('data-language') == key, label+': locale mismatch')
        check(len([n for n in root.walk() if n.tag=='h1']) == 1, label+': must have one H1')
        ids = [n.attrs['id'] for n in root.walk() if 'id' in n.attrs]
        check(len(ids) == len(set(ids)), label+': duplicate IDs')
        canonical = one([n for n in root.walk() if n.tag=='link' and n.attrs.get('rel')=='canonical'], label+': canonical')
        check(canonical.attrs.get('href') == SITE['canonicalOrigin'].rstrip('/')+'/'+prefix+route, label+': canonical route differs')
        alternatives = {n.attrs.get('hreflang'):n.attrs.get('href') for n in root.walk() if n.tag=='link' and n.attrs.get('rel')=='alternate'}
        expected = {l:SITE['canonicalOrigin'].rstrip('/')+'/'+p+route for l,p in LOCALES.values()}
        expected['x-default'] = SITE['canonicalOrigin'].rstrip('/')+'/'+route
        check(alternatives == expected, label+': hreflang route mismatch')
        if not BASE:
            check(not any(n.tag=='meta' and n.attrs.get('name')=='robots' and 'noindex' in n.attrs.get('content','') for n in root.walk()), label+': live programme/home must be indexable')
        languages = one(root.classes('languages'), label+': common language nav')
        check({n.attrs.get('hreflang'):n.attrs.get('href') for n in languages.walk() if n.tag=='a'} == {l:BASE+'/'+p+route for l,p in LOCALES.values()}, label+': common locale links do not retain base/route')
        logo = one(root.classes('brand'), label+': native brand link')
        check(any(n.tag=='img' and n.attrs.get('src')==BASE+'/assets/logos/logo-compact-web.svg' for n in logo.walk()), label+': original native logo missing')
        base = one(root.find(name='site-base'), label+': base metadata')
        check(base.attrs.get('content') == BASE, label+': wrong runtime deployment base')
        for node in root.walk():
            for field in ['href','src']:
                if node.attrs.get(field):
                    local_target(node.attrs[field],file,label)
        check(not any('127.0.0.1' in n.attrs.get('href','') or 'localhost' in n.attrs.get('href','') for n in root.walk()), label+': local design-review link leaked')
        if page=='home':
            hero = one(root.classes('home-hero'), label+': homepage hero')
            magnolia = one(hero.classes('magnolia'), label+': original magnolia hero image')
            check(magnolia.tag=='img' and magnolia.attrs.get('src')==BASE+'/assets/images/magnolia.webp', label+': original magnolia hero must remain')
            check(not any(n.tag=='canvas' for n in root.walk()), label+': homepage must not contain a live 3D canvas')
            check(not root.classes('programme-world-root') and not root.find(id='programme-world-canvas'), label+': programme world must stay on its detail page')
            check(not root.find(id='programme-data') and not root.find(id='progress-data'), label+': homepage must not carry live-model data')
            check(not any(n.tag=='script' and '/assets/progress/' in n.attrs.get('src','') for n in root.walk()), label+': homepage must not load a live-model script')
            check(not any(n.tag=='link' and n.attrs.get('rel')=='stylesheet' and 'programme' in urlsplit(n.attrs.get('href','')).path for n in root.walk()), label+': homepage must not load programme styles')
            check(not any(attribute.startswith(('data-programme','data-weather')) for n in root.walk() for attribute in n.attrs), label+': live programme/weather controls leaked onto homepage')
            check(not root.classes('programme-weather') and not root.classes('programme-clock'), label+': homepage must not display live programme weather or clock')
            check(any(n.tag=='a' and n.attrs.get('href')==BASE+'/'+prefix+'progress/' for n in root.walk()), label+': homepage has no route to physical progress')
            continue
        programmes += 1
        world = marked(root,'data-programme-world',label)
        check('programme-world-root' in world.attrs.get('class','').split(), label+': expected one programme world root')
        payload = one(root.find(id='programme-data'), label+': one programme JSON payload')
        check(payload.tag=='script' and payload.attrs.get('type')=='application/json', label+': content payload must be inert JSON')
        try:
            value = json.loads(payload.text())
        except ValueError:
            check(False, label+': invalid programme JSON')
            value = {}
        check(set(value) == {'copy','initial','language','apiOrigin','programmeUrl'}, label+': unexpected/public-private payload fields')
        check(value.get('copy') == c and value.get('language') == key, label+': payload locale differs')
        check(value.get('initial') == initial, label+': payload must match the reviewed public baseline')
        check(value.get('programmeUrl') == '/'+prefix+'progress/programmes/', label+': wrong locale programme route in payload')
        check(value.get('apiOrigin') == 'https://glenolia-newsletter.theglenolia.workers.dev', label+': unreviewed public API origin')
        check(not root.find(id='progress-data'), label+': obsolete homepage progress controller/copy conflicts with programme')
        canvas = one(root.find(id='programme-world-canvas'), label+': programme canvas')
        check(canvas.tag=='canvas' and canvas.attrs.get('tabindex')=='0' and bool(canvas.attrs.get('aria-label')) and canvas.attrs.get('aria-describedby')=='programme-world-caption', label+': canvas keyboard/text equivalent missing')
        check(len([n for n in root.walk() if n.tag=='canvas'])==1, label+': more than one animated model on the same page')
        poster = one(root.classes('programme-poster'), label+': static programme poster')
        check(poster.tag=='img' and poster.attrs.get('src')==BASE+'/assets/progress/programme-poster.webp' and bool(poster.attrs.get('alt')) and 'hidden' not in poster.attrs, label+': model fallback is missing')
        caption = one(root.find(id='programme-world-caption'), label+': scope caption')
        check(norm(c['worldCaption']) in norm(caption.text()) and norm(c['staffCaption']) in norm(caption.text()), label+': scene/staff illustrative scope missing')
        tabs = one(root.classes('programme-department-tabs'), label+': department selectors')
        buttons = [n for n in tabs.walk() if n.tag=='button']
        check([n.attrs.get('data-programme-department') for n in buttons] == ['all']+IDS, label+': department controls are incomplete')
        check([n.attrs.get('data-programme-department') for n in buttons if n.attrs.get('aria-pressed')=='true'] == ['all'], label+': initial model must show overview, not imply a completed department')
        clock = marked(root,'data-programme-time',label)
        check(clock.tag=='time' and norm(c['weather']['time']) in norm(clock.text()), label+': date needs an honest Sydney-local placeholder')
        wrap = one(root.classes('programme-canvas-wrap'), label+': world canvas wrapper')
        dial = marked(wrap,'data-programme-clock',label)
        check(dial.tag=='time' and dial.attrs.get('role')=='img' and bool(dial.attrs.get('aria-label')) and dial.attrs.get('aria-live','off')=='off', label+': live analogue clock needs a readable, non-announcing time equivalent')
        for hand in ['hour','minute','second']:
            check(marked(dial,'data-clock-'+hand,label).tag=='g', label+': analogue clock hand missing: '+hand)
        check(not any(n.tag=='canvas' for n in dial.walk()), label+': clock must work without a second WebGL context')
        sky = marked(wrap,'data-programme-sky',label)
        for body in ['sun','moon']:
            check('hidden' in marked(sky,'data-sky-'+body,label).attrs, label+': static sky indicator must not invent current day/night')
        check(marked(sky,'data-sky-moon-lit',label).tag=='path',label+': current moon phase graphic missing')
        marked(root,'data-programme-day',label)
        check(norm(marked(root,'data-weather-status',label).text())==norm(c['weather']['unavailable']),label+': static weather must honestly report unavailable until data loads')
        for field in ['data-weather-status','data-weather-temperature','data-weather-wind','data-weather-rain','data-weather-asof']:
            marked(root,field,label)
        check(any(n.tag=='a' and n.attrs.get('href')=='https://api.met.no/' for n in root.walk()) and any(n.tag=='a' and n.attrs.get('href')=='https://creativecommons.org/licenses/by/4.0/' for n in root.walk()), label+': displayed weather needs attribution and licence link')
        check(norm(c['weather']['estimated']) in norm(root.text()), label+': nearby estimated weather qualification missing')
        # A disabled script or failed request must not invent measured conditions.
        for field in ['data-weather-temperature','data-weather-wind','data-weather-rain']:
            check(norm(marked(root,field,label).text()) == '—', label+': weather value must not be fabricated in static HTML')
        check(norm(one([n for n in root.walk() if n.tag=='h1'],label+': H1').text())==norm(c['title']), label+': wrong programme title')
        cards = root.classes('programme-card')
        check([n.attrs.get('data-department-card') for n in cards]==IDS, label+': expected exactly the four real department cards')
        for id,card in zip(IDS,cards):
            d=initial['departments'][id];t=d['translations'][key]
            check(norm(marked(card,'data-status',label).text())==norm(c['statusLabels'][d['status']]), label+'/'+id+': actual status differs')
            check(norm(marked(card,'data-now',label).text())==norm(t['now']), label+'/'+id+': now copy differs from published initial')
            check(norm(marked(card,'data-next',label).text())==norm(t['next']), label+'/'+id+': next copy differs from published initial')
            done=marked(card,'data-done',label)
            check([norm(n.text()) for n in done.children if isinstance(n,Node) and n.tag=='li']==[norm(v) for v in t['done']], label+'/'+id+': completed list differs')
        check(all(name in root.text() for name in ['IPR107','NR25','Marsellesa','Paraíso']), label+': accepted seed direction and separate trial name missing')
        check(norm(marked(root,'data-seed-actual',label).text())==norm(c['growth']['seedActual']) and norm(marked(root,'data-trial-actual',label).text())==norm(c['growth']['trialActual']), label+': current seed/seedling facts missing')
        check('20' in marked(root,'data-plant-height',label).text(), label+': approximate reported 20 cm seedling height missing')
        observed=marked(root,'data-plant-observed',label)
        check(observed.tag=='time' and observed.attrs.get('datetime')==coffee['observedOn'], label+': report date missing/wrong')
        updated=marked(root,'data-programme-updated',label)
        check(updated.tag=='time' and updated.attrs.get('datetime')==initial['updatedAt'], label+': programme date missing/wrong')
        explorer=one(root.classes('growth-explorer'),label+': growth explorer')
        check(explorer.tag=='details' and 'open' not in explorer.attrs, label+': future growth must be an optional explorer')
        growth=[n for n in explorer.walk() if n.tag=='button' and 'data-growth-stage' in n.attrs]
        check([n.attrs['data-growth-stage'] for n in growth]==['actual']+GROWTH, label+': growth controls lack reported stage or eight exploratory stages')
        check([n.attrs['data-growth-stage'] for n in growth if n.attrs.get('aria-pressed')=='true']==['actual'], label+': future growth must not be presented as actual by default')
        for field in ['futureNote','graftNote','varietyNote']:
            check(norm(c['growth'][field]) in norm(root.text()), label+': missing optional/future/identity qualifier: '+field)
        modules=[n for n in root.walk() if n.tag=='script' and n.attrs.get('type')=='module' and n.attrs.get('src')]
        check(len(modules)==1 and 'programme' in modules[0].attrs.get('src',''), label+': expected one programme enhancement entry')
        if len(modules)==1:
            entry=local_target(modules[0].attrs['src'],file,label)
            if entry and entry.is_file():
                initial_modules(entry,label)
                check(re.search(r'\bimport\s*\([\"\']\./programme-world-[^\"\']+\.js[\"\']\)',entry.read_text()) is not None, label+': world is not lazy imported')
        check(not any(n.tag=='link' and n.attrs.get('rel') in ['preload','modulepreload'] and n.attrs.get('as')!='image' and '/assets/progress/' in n.attrs.get('href','') for n in root.walk()), label+': heavy programme module is preloaded')

for key,(_,prefix) in LOCALES.items():
    progress=DIST/prefix/'progress/index.html'
    check(progress.is_file(), prefix+'progress/: missing parent page')
    if progress.is_file():
        root=Document(progress.read_text()).root
        check(any(n.tag=='a' and n.attrs.get('href')==BASE+'/'+prefix+'progress/programmes/' for n in root.walk()), prefix+'progress/: missing programme entry')

for file in (DIST/'assets/progress').glob('*.js'):
    source=file.read_text()
    for reference in set(re.findall(r'[\"\'](\./[^\"\']+\.js)[\"\']',source)):
        check((file.parent/reference).is_file(), file.name+': missing split module '+reference)
    check(not re.search(r'https?://(?:cdn\.|unpkg\.|esm\.)',source), file.name+': external 3D CDN request')
    check(not any(marker in source for marker in ['BREVO_API_KEY','xkeysib-','BEGIN PRIVATE KEY','client_secret']), file.name+': private credential material in public script')

try:
    sitemap=ET.parse(DIST/'sitemap.xml')
    routes={node.text for node in sitemap.findall('.//{*}loc')}
    for _,prefix in LOCALES.values():
        check(SITE['canonicalOrigin'].rstrip('/')+'/'+prefix+'progress/programmes/' in routes, prefix+': public programme is absent from sitemap')
except (OSError,ET.ParseError):
    check(False,'Missing or invalid sitemap')

print(json.dumps({'result':'pass' if not errors else 'fail','checks':checks,'pages':pages,'programmePages':programmes,'basePath':BASE,'errors':errors},ensure_ascii=False,indent=2))
sys.exit(bool(errors))
