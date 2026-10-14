"""Check factual/accessible 3D content and lazy assets without requiring WebGL.

Run after build.py and build-progress.mjs. A separate --dist lets a copied
base-path build be checked without changing the release or browser-preview dist.
"""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
from datetime import date
import argparse
import copy
import importlib.util
import json
import os
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--dist', type=Path, default=ROOT / 'dist')
parser.add_argument('--base-path', default=os.environ.get('SITE_BASE_PATH', ''))
args = parser.parse_args()
DIST, BASE = args.dist.resolve(), args.base_path.rstrip('/')
DATA = json.loads((ROOT / 'progress-content.json').read_text())
SITE = json.loads((ROOT / 'config.json').read_text())
CONFIG = DATA['config']
LOCALES = {'en': ('en-AU', ''), 'zh': ('zh-Hant', 'zh-hant/'), 'ja': ('ja', 'ja/')}
errors, checks = [], 0


def check(condition, message):
    global checks
    checks += 1
    if not condition:
        errors.append(message)


class Element:
    def __init__(self, tag, attrs=None, parent=None):
        self.tag, self.attrs, self.parent = tag, attrs or {}, parent
        self.children = []

    def text(self):
        return ' '.join(c.text() if isinstance(c, Element) else c for c in self.children)

    def walk(self):
        yield self
        for child in self.children:
            if isinstance(child, Element):
                yield from child.walk()

    def find(self, **attrs):
        return [n for n in self.walk() if all(n.attrs.get(k) == v for k, v in attrs.items())]

    def classes(self, name):
        return [n for n in self.walk() if name in n.attrs.get('class', '').split()]


class Document(HTMLParser):
    VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}

    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.root = Element('document')
        self.stack = [self.root]
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        node = Element(tag, dict(attrs), self.stack[-1])
        self.stack[-1].children.append(node)
        if tag not in self.VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in self.VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1, 0, -1):
            if self.stack[i].tag == tag:
                self.stack = self.stack[:i]
                break

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def norm(value):
    return ' '.join(value.split())


def one(nodes, label):
    check(len(nodes) == 1, label + ': expected one element')
    return nodes[0] if len(nodes) == 1 else Element('missing')


def by_id(root, identifier, label):
    return one(root.find(id=identifier), label + ': #' + identifier)


def local_file(url, label):
    parts = urlsplit(url)
    if parts.scheme or parts.netloc:
        return None
    route = unquote(parts.path)
    if not route:
        return None
    check(route.startswith('/'), label + ': asset/link is not root-relative: ' + url)
    if BASE:
        check(route.startswith(BASE+'/') or route == BASE, label + ': missing deployment base: ' + url)
        if route.startswith(BASE+'/'):
            route = route[len(BASE):]
    target = DIST / route.lstrip('/')
    check('..' not in target.relative_to(DIST).parts, label + ': unsafe relative asset path')
    if target.is_dir():
        target /= 'index.html'
    check(target.is_file(), label + ': missing target: ' + url)
    return target


def payload(root, label, key, expected_config=CONFIG):
    node = one(root.find(id='progress-data'), label + ': authoritative JSON copy')
    check(node.tag == 'script' and node.attrs.get('type') == 'application/json', label + ': payload must be inert JSON')
    try:
        value = json.loads(node.text())
    except (ValueError, TypeError) as error:
        errors.append(label + ': invalid JSON: ' + str(error))
        return {}
    check(set(value) == {'config', 'copy', 'roomCopy', 'coffeeUrl'}, label + ': unexpected/bulk payload fields')
    check(value.get('config') == expected_config, label + ': runtime stage differs from reviewed stage')
    check(value.get('copy') == DATA['copy'][key], label + ': payload locale differs from page locale')
    check(value.get('roomCopy') == DATA['roomCopy'][key], label + ': interior locale differs from page locale')
    return value


def authoritative_markup(root, key, page, label, stage):
    c = DATA['copy'][key]
    if page == 'home':
        section = by_id(root, 'little-world', label)
        status = one(section.classes('home-world-label'), label + ': homepage milestone')
        check(norm(status.text()) == norm(c['currentLabels'][stage]), label + ': homepage status is stale')
        check(norm(c['homeStageBodies'][stage]) in norm(section.text()), label + ': homepage current story is stale')
        caption = by_id(root, 'home-world-caption', label)
        check(norm(caption.text()) == norm(c['illustrative']), label + ': homepage illustrative scope missing')
        canvas = by_id(root, 'home-world-canvas', label)
    else:
        actual = one(root.classes('actual-stage'), label + ': authoritative milestone')
        strong = one([n for n in actual.walk() if n.tag == 'strong'], label + ': authoritative label')
        check(norm(strong.text()) == norm(c['currentLabels'][stage]), label + ': introductory actual milestone is stale')
        check(norm(by_id(root, 'scene-status', label).text()) == norm(c['currentLabels'][stage]), label + ': default scene milestone is stale')
        check(norm(by_id(root, 'stage-body', label).text()) == norm(c['currentText'][stage]), label + ': current chapter story is stale')
        track = by_id(root, 'chapter-track', label)
        items = [n for n in track.children if isinstance(n, Element) and n.tag == 'li']
        check(len(items) == 4, label + ': milestone track must have four chapters')
        for i, item in enumerate(items):
            expected = 'is-confirmed' if i < stage else 'is-current' if i == stage else 'is-future'
            check(expected in item.attrs.get('class', '').split(), label + ': incorrect actual status for chapter ' + str(i))
            heading = one([n for n in item.walk() if n.tag == 'h3'], label + ': chapter heading ' + str(i))
            check(norm(heading.text()) == norm(c['stages'][i]), label + ': chapter translation/order is wrong')
        check(len(track.classes('is-current')) == 1, label + ': multiple or missing current milestones')
        future = by_id(root, 'future-label', label)
        check('hidden' in future.attrs, label + ': default actual scene must not be a future preview')
        selected = [n for n in by_id(root, 'stage-selectors', label).walk() if n.tag == 'button']
        check([n.attrs.get('data-stage') for n in selected] == ['0', '1', '2', '3'], label + ': incomplete future selector')
        check([i for i, n in enumerate(selected) if n.attrs.get('aria-pressed') == 'true'] == [stage], label + ': wrong initial preview selector')
        check(norm(c['reviewLabel']) in norm(root.text()), label + ': future controls lack their illustrative explanation')
        notes = one(root.classes('scene-static-notes'), label + ': model-independent area notes')
        ancestors = []
        ancestor = notes.parent
        while ancestor:
            ancestors.append(ancestor.tag)
            ancestor = ancestor.parent
        check('noscript' not in ancestors and 'hidden' not in notes.attrs, label + ': notes must be available when JavaScript works but WebGL fails')
        for text in c['zoneTitle'] + c['zoneBody'] + DATA['roomCopy'][key]['titles'] + DATA['roomCopy'][key]['bodies']:
            check(norm(text) in norm(notes.text()), label + ': missing fallback area summary')
        caption = by_id(root, 'scene-caption', label)
        check(norm(c['illustrative']) in norm(caption.text()), label + ': illustrative scope missing')
        check(norm(c['target']) in norm(root.text()) and norm(c['targetNote']) in norm(root.text()), label + ': target opening qualification missing')
        canvas = by_id(root, 'world-canvas', label)
    check(canvas.tag == 'canvas' and canvas.attrs.get('tabindex') == '0', label + ': model must be keyboard focusable')
    check(bool(canvas.attrs.get('aria-label')) and bool(canvas.attrs.get('aria-describedby')), label + ': model lacks accessible text/instructions')


def initial_modules(entry, label):
    """Follow only static ESM imports; a world dynamic import must stay deferred."""
    seen, todo = set(), [entry]
    while todo:
        path = todo.pop()
        if path in seen or not path.is_file():
            continue
        seen.add(path)
        script = path.read_text()
        for specifier in re.findall(r'\b(?:import|export)[^;]*?\bfrom\s*[\"\']([^\"\']+)[\"\']', script):
            check(specifier.startswith('./'), label + ': initial module must use a local relative import')
            target = path.parent / specifier
            check(target.is_file(), label + ': missing initial module import: ' + specifier)
            if target.is_file():
                todo.append(target)
    check(sum(p.stat().st_size for p in seen) < 32768, label + ': heavy 3D code is eagerly loaded')
    check(not any(p.name.startswith('world-') for p in seen), label + ': world must be a dynamic import')


check(not BASE or (BASE.startswith('/') and '..' not in BASE), 'Unsafe audit base path')
check(type(CONFIG.get('currentStage')) is int and CONFIG['currentStage'] in range(4), 'Confirmed stage must be an integer from zero to three')
check(CONFIG.get('stages') == ['da-approved', 'construction', 'decoration', 'opening'], 'Unrecognized/ambiguous progress-stage identifiers')
try:
    date.fromisoformat(CONFIG['updated'])
except (KeyError, TypeError, ValueError):
    errors.append('Reviewed update date is invalid')
check(CONFIG.get('openingTarget') == 'September 2027' and SITE.get('openingTarget') == '2027-09', 'Opening target differs between public site and model')
check(set(DATA.get('copy', {})) == set(LOCALES) and set(DATA.get('roomCopy', {})) == set(LOCALES), 'Incomplete progress language editions')
for key, (lang, prefix) in LOCALES.items():
    c = DATA['copy'][key]
    check(set(c) == set(DATA['copy']['en']), key + ': progress translation keys differ')
    check(c.get('lang') == lang, key + ': incorrect locale')
    for field in ['currentLabels', 'currentText', 'currentIntro', 'homeStageBodies', 'stages', 'states', 'stageText']:
        check(isinstance(c.get(field), list) and len(c[field]) == 4 and all(isinstance(v, str) and v.strip() for v in c[field]), key + ': incomplete stage copy: ' + field)
    for field in ['hotspots', 'zoneTitle', 'zoneBody', 'zoneLinks', 'interiorTags']:
        check(isinstance(c.get(field), list) and len(c[field]) == 3 and all(isinstance(v, str) and v.strip() for v in c[field]), key + ': incomplete scene copy: ' + field)
    for field in ['future', 'futureWord', 'past', 'pastWord', 'illustrative', 'posterAlt', 'targetNote']:
        check(bool(c.get(field, '').strip()), key + ': missing factual illustration qualifier: ' + field)
    for field in ['titles', 'bodies']:
        check(len(DATA['roomCopy'][key].get(field, [])) == 3, key + ': incomplete interior summaries: ' + field)

pages = 0
for key, (lang, prefix) in LOCALES.items():
    for page, route in [('home', ''), ('progress', 'progress/')]:
        path = DIST / prefix / route / 'index.html'
        label = str(path.relative_to(DIST))
        check(path.is_file(), label + ': generated page missing')
        if not path.is_file():
            continue
        source = path.read_text()
        root = Document(source).root
        pages += 1
        html = one([n for n in root.walk() if n.tag == 'html'], label + ': document')
        check(html.attrs.get('lang') == lang and html.attrs.get('data-language') == key, label + ': document/payload locale mismatch')
        site_base = one(root.find(name='site-base'), label + ': deployment base')
        check(site_base.attrs.get('content') == BASE, label + ': deployment base mismatch')
        value = payload(root, label, key)
        check(value.get('coffeeUrl') == '/'+prefix+'coffee-trial/', label + ': model detail uses wrong locale route')
        authoritative_markup(root, key, page, label, CONFIG['currentStage'])
        languages = one(root.classes('languages'), label + ': native language navigation')
        links = [n for n in languages.walk() if n.tag == 'a']
        check({n.attrs.get('hreflang'): n.attrs.get('href') for n in links} == {l: BASE+'/'+p+route for l, p in LOCALES.values()}, label + ': native language links do not preserve route/base')
        check(not any(n.tag == 'button' for n in languages.walk()), label + ': prototype language buttons leaked into production')
        canonical = one([n for n in root.walk() if n.tag == 'link' and n.attrs.get('rel') == 'canonical'], label + ': canonical')
        check(canonical.attrs.get('href') == SITE['canonicalOrigin'].rstrip('/')+'/'+prefix+route, label + ': wrong canonical URL')
        check(not root.classes('review-bar') and 'DESIGN PREVIEW · NOT PUBLISHED' not in source, label + ': mockup-only review bar leaked')
        check(not any(n.attrs.get('data-language') and n.tag == 'button' for n in root.walk()), label + ': mockup language controller leaked')
        check(not any(n.tag == 'script' and n.attrs.get('type') == 'importmap' for n in root.walk()), label + ': raw prototype vendor import map leaked')
        check(not any(re.search(r'(?:home(?:-zh|-ja)?\.html|127\.0\.0\.1|localhost)', n.attrs.get('href', '')) for n in root.walk()), label + ': mockup/local links leaked')
        if not BASE:
            check(not any(n.tag == 'meta' and n.attrs.get('name') == 'robots' and 'noindex' in n.attrs.get('content', '') for n in root.walk()), label + ': public progress/home must be indexable')
        modules = [n for n in root.walk() if n.tag == 'script' and n.attrs.get('type') == 'module' and n.attrs.get('src')]
        entry_name = 'home-world' if page == 'home' else 'progress'
        check(len(modules) == 1 and urlsplit(modules[0].attrs.get('src','')).path == BASE+'/assets/progress/'+entry_name+'.js', label + ': wrong/multiple scene entry modules')
        if len(modules) == 1:
            entry = local_file(modules[0].attrs['src'], label)
            if entry and entry.is_file():
                initial_modules(entry, label)
                check(re.search(r'\bimport\s*\([\"\']\./world-[^\"\']+\.js[\"\']\)', entry.read_text()) is not None, label + ': model must be lazy imported')
        check(not any(n.tag == 'link' and n.attrs.get('rel') in ['modulepreload', 'preload'] and '/assets/progress/' in n.attrs.get('href', '') and n.attrs.get('as') != 'image' for n in root.walk()), label + ': heavy scene assets must not be preloaded')
        posters = root.classes('home-world-poster' if page == 'home' else 'world-poster')
        poster = one(posters, label + ': static poster')
        check(poster.tag == 'img' and bool(poster.attrs.get('alt')) and 'hidden' not in poster.attrs, label + ': static model fallback missing')
        local_file(poster.attrs.get('src', ''), label)
        check(poster.attrs.get('width') and poster.attrs.get('height'), label + ': poster needs fixed intrinsic size')
        for n in root.walk():
            for attr in ['href', 'src']:
                if n.attrs.get(attr) and not urlsplit(n.attrs[attr]).scheme:
                    local_file(n.attrs[attr], label)

# Pages that cannot display the miniature should incur no scene-specific payload.
for path in DIST.rglob('*.html'):
    if path in [DIST/p/r/'index.html' for _, p in LOCALES.values() for r in ['', 'progress/']]:
        continue
    source = path.read_text()
    root = Document(source).root
    label = str(path.relative_to(DIST))
    check(not root.find(id='progress-data'), label + ': unused progress copy loaded')
    check(not any(n.tag == 'script' and '/assets/progress/' in n.attrs.get('src', '') for n in root.walk()), label + ': unused 3D entry loaded')

# Check every emitted split-module reference, including deferred world imports.
for path in (DIST/'assets/progress').glob('*.js'):
    script = path.read_text()
    for specifier in set(re.findall(r'[\"\'](\./[^\"\']+\.js)[\"\']', script)):
        check((path.parent/specifier).is_file(), path.name + ': missing generated module: ' + specifier)
    check(not re.search(r'https?://(?:cdn\.|unpkg\.|esm\.)', script), path.name + ': runtime 3D dependency must be locally served')

# Verify future updates via pure rendering helpers; never rewrite source or dist.
spec = importlib.util.spec_from_file_location('progress_markup_audit', ROOT/'scripts/progress_markup.py')
markup = importlib.util.module_from_spec(spec)
spec.loader.exec_module(markup)
saved_config = markup.CONFIG
try:
    for stage in [1, 2, 3]:
        advanced = copy.deepcopy(CONFIG)
        advanced['currentStage'] = stage
        markup.CONFIG = advanced
        for key, (_, prefix) in LOCALES.items():
            for page in ['home', 'progress']:
                source = markup.home(key, '/'+prefix+'progress/', '/'+prefix+'coffee-trial/') if page == 'home' else markup.page(key, '/'+prefix+'register/', '/'+prefix+'coffee-trial/')
                root = Document(source).root
                label = key + '/' + page + ': simulated reviewed stage ' + str(stage)
                payload(root, label, key, advanced)
                authoritative_markup(root, key, page, label, stage)
finally:
    markup.CONFIG = saved_config

print(json.dumps({'result': 'pass' if not errors else 'fail', 'pages': pages, 'checks': checks, 'currentStage': CONFIG['currentStage'], 'basePath': BASE, 'simulatedCurrentStages': [1, 2, 3], 'errors': errors}, ensure_ascii=False, indent=2))
sys.exit(bool(errors))
