"""Public school invitation and planting-row explorer. Personal journals stay on the education service."""
from hashlib import sha256
from html import escape
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'public' / 'assets' / 'plant-portal'


def render(origin, base_path='', teacher_origin='https://glenolia-education.theglenolia.workers.dev'):
    base = escape(base_path.rstrip('/'), quote=True)
    assets = base + '/assets/plant-portal'
    canonical = origin.rstrip('/') + '/plant-portal/'
    teacher_origin = teacher_origin.rstrip('/')
    teacher = escape(teacher_origin + '/#plant', quote=True)
    admin_origin = json.loads((ROOT / 'config.json').read_text())['adminUrl']
    farmer = escape(admin_origin.rstrip('/') + '/plants', quote=True)
    title = 'School Plant Portal | Adopt a coffee plant in Glenorie | The Glenolia'
    description = ('Register your primary or high school to follow a coffee plant at The Glenolia in '
                   'Glenorie, NSW. Explore the estate atlas and follow illustrated coffee growth stages and farmer field notes.')
    schema = {
        '@context': 'https://schema.org', '@type': 'WebPage', 'url': canonical,
        'name': 'School Plant Portal at The Glenolia', 'description': description, 'inLanguage': 'en-AU',
        'audience': {'@type': 'EducationalAudience', 'educationalRole': 'teacher'},
        'isPartOf': {'@type': 'WebSite', 'name': 'The Glenolia', 'url': origin.rstrip('/') + '/'},
        'about': {'@type': 'Thing', 'name': 'School coffee plant adoption in Glenorie, New South Wales'},
    }
    revision = sha256((ASSETS/'portal.css').read_bytes() + (ASSETS/'portal.js').read_bytes()).hexdigest()[:12]
    preview_meta = '<meta name="robots" content="noindex,follow">' if base else ''
    return f'''<!doctype html>
<html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{escape(title)}</title><meta name="description" content="{escape(description)}"><meta name="theme-color" content="#F5F1E8">
<link rel="canonical" href="{canonical}"><link rel="alternate" hreflang="en-AU" href="{canonical}"><link rel="alternate" hreflang="x-default" href="{canonical}">{preview_meta}
<meta property="og:type" content="website"><meta property="og:locale" content="en_AU"><meta property="og:site_name" content="The Glenolia">
<meta property="og:title" content="A coffee plant for your classroom | The Glenolia"><meta property="og:description" content="{escape(description)}"><meta property="og:url" content="{canonical}">
<meta property="og:image" content="{origin.rstrip('/')}/assets/plant-portal/two-worker-orchard.webp"><meta property="og:image:alt" content="Two workers tending a row of young coffee plants between magnolias"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{base}/assets/logos/leaf.svg" type="image/svg+xml"><link rel="stylesheet" href="{assets}/portal.css?v={revision}">
<script type="application/ld+json">{json.dumps(schema, ensure_ascii=False)}</script><script type="module" src="{assets}/portal.js?v={revision}"></script></head>
<body><a class="skip" href="#main">Skip to content</a>
<header class="mast"><a class="identity" href="{base}/" aria-label="The Glenolia home"><img src="{base}/assets/logos/logo-compact.svg" width="250" height="70" alt="The Glenolia"></a><span class="mast-title">School Plant Portal</span>
<nav aria-label="Plant portal"><a class="resources" href="{base}/teachers/">Teacher resources</a><a class="return-link" href="{teacher}">Teacher sign in <span aria-hidden="true">↗</span></a><a class="farm-login" id="farmer-login" href="{farmer}" rel="nofollow">Farmer login</a></nav></header>
<main id="main" data-teacher="{teacher}" data-map-url="{escape(teacher_origin, quote=True)}/api/plants/map" data-weather-url="{escape(teacher_origin, quote=True)}/api/plants/weather" data-atlas-assets="{assets}">
<section class="welcome" aria-labelledby="invite-heading">
<div class="welcome-scene"><picture><source media="(max-width: 760px)" srcset="{assets}/two-worker-orchard-small.webp"><img src="{assets}/two-worker-orchard.webp" width="1672" height="941" fetchpriority="high" alt="Two workers tending young coffee plants between magnolia trees in Glenorie."></picture>
<a class="hero-marker marker-1" href="#rows" data-preview="1" hidden>P1</a>
<a class="hero-marker marker-2" href="#rows" data-preview="2" hidden>P2</a>
<a class="hero-marker marker-3" href="#rows" data-preview="3" hidden>P3</a></div>
<div class="invite"><p class="eyebrow">Free school programme · Glenorie, NSW</p><h1 id="invite-heading">A coffee plant<br> for your class.</h1>
<p class="hero-intro">Watch it grow with the farmer’s photos, field notes and classroom activities.</p>
<div class="invite-actions"><a class="cta" href="#rows">Explore the rows <span aria-hidden="true">↓</span></a>
<a class="sub-link" href="{teacher}">Register your school <span aria-hidden="true">↗</span></a><a class="sub-link" href="#meet-farmer">Meet the Farmer <span aria-hidden="true">↓</span></a></div></div></section>
<section class="explore shell" id="rows" aria-labelledby="rows-heading" tabindex="-1">
<div class="section-head"><div><p class="eyebrow">The estate atlas</p><h2 id="rows-heading">Choose a class plant.</h2></div>
<p>Choose a tree in the school pilot, or explore the magnolia lanes planned for autumn 2027.</p></div>
<div id="row-app" hidden>

<div class="atlas-tools"><label for="row-jump"><span class="wide-label">Jump to </span>row</label><select id="row-jump" aria-label="Jump to row"></select>
<span class="atlas-hint">Scroll inside the map ↓</span><button type="button" id="return-selected" hidden></button><button type="button" id="plant-list" disabled>Plant list</button>
<div class="farm-clock" aria-label="Glenorie local time"><span class="clock-face" aria-hidden="true"><i id="clock-hour"></i><i id="clock-minute"></i></span><div><span class="clock-place">Glenorie farm time</span><time id="farm-time">Sydney time</time></div></div></div>
<section class="weather-strip" aria-label="Glenorie weather">
<dl class="weather-readings"><div><dt>Air temperature</dt><dd id="wx-temp">—</dd></div><div><dt>Humidity</dt><dd id="wx-humidity">—</dd></div><div><dt>Wind</dt><dd id="wx-wind">—</dd></div><div><dt>Rain, next hour</dt><dd id="wx-rain">—</dd></div><div class="mean-reading"><dt>14-day avg. temp</dt><dd id="wx-mean-temp">—</dd></div><div><dt>14-day avg. rain</dt><dd id="wx-mean-rain">—</dd></div></dl>
<details class="weather-notes"><summary>Weather details</summary><div><p id="wx-current-note">Loading the Glenorie area forecast…</p><p id="wx-history-note">Checking the last 14 complete local days…</p><p id="wx-source"></p></div></details></section>
<div class="map-notice" id="map-notice" role="status"><span id="map-message">Loading the farmer’s planting map…</span><button type="button" id="retry-map" hidden>Try again</button></div>
<figure class="atlas-sheet"><div id="estate-workspace"><div class="estate-map-column">
<div id="world-scroll" role="region" tabindex="0" aria-label="3D estate map, scroll between rows" hidden>
<div id="world-surface"><canvas id="world-canvas" aria-hidden="true"></canvas><div id="world-pins" aria-label="Plants on the map"></div>
<div class="world-caption"><small id="world-area"></small><strong id="world-row"></strong></div>
<button type="button" class="world-pause" id="world-pause" aria-label="Pause farm animation">Ⅱ</button>
<div class="world-nav"><button type="button" id="world-back" hidden>← Back to rows</button><div id="world-pan" hidden><button type="button" id="world-prev" aria-label="Previous positions">←</button><span id="world-range"></span><button type="button" id="world-next" aria-label="Next positions">→</button></div></div></div><div class="world-distance" aria-hidden="true"></div></div><div id="art-notice" class="map-notice" role="status"><span id="art-message">Loading the orchard illustration…</span><button type="button" id="retry-art" hidden>Retry illustration</button></div>
<div id="atlas-viewport" role="region" aria-label="Scrollable orchard map" aria-describedby="atlas-scroll-tip" tabindex="0"><div id="atlas-frame" data-art-state="loading"><picture><source id="mobile-art" media="(max-width:620px)" srcset="{assets}/estate-atlas-mobile.webp"><img id="estate-art" src="{assets}/estate-atlas.webp" width="1400" height="3332" alt="" loading="eager" decoding="async"></picture>
<svg id="estate-map" viewBox="0 0 1000 2380" role="group" aria-labelledby="atlas-title atlas-desc">
<title id="atlas-title">The Glenolia estate atlas</title><desc id="atlas-desc">A continuous illustrated orchard map. Explore individual planting positions in the plant list or use the arrow keys between them.</desc>
<g id="atlas-row-labels" aria-hidden="true"></g><g id="atlas-plants" role="group" aria-label="Coffee planting positions"></g></svg></div></div>
</div><aside id="estate-directory" aria-label="Field directory">
<p class="eyebrow">Field directory</p><h3>Explore the rows</h3>
<div class="estate-areas" role="group" aria-label="Planting area"><button id="pilot-area" type="button" aria-pressed="true">Pilot rows</button><button id="planned-area" type="button" aria-pressed="false">Autumn 2027</button></div>
<div id="directory-rows" role="group" aria-label="Rows in this area"></div>
<p id="directory-summary" role="status">Loading the planting register…</p>
<div id="world-card-slot"></div><button class="future-invite" id="future-invite" type="button"><img src="{assets}/world/atlas-cover.webp" alt="" width="300" height="110" loading="lazy"><span>Explore the 2027 planting plan →</span></button><button id="view-toggle" type="button" hidden>Use illustrated map</button><small id="world-fallback" hidden>Illustrated map view</small></aside></div>
<figcaption><span id="atlas-scroll-tip">Scroll the map to explore all 12 rows.</span><span>Rows 3–12 are in the autumn 2027 planting plan. The farm updates each row as work progresses.</span></figcaption></figure>
<details class="growth-guide" id="stage-guide"><summary>See the 10 coffee growth stages</summary>
<p>Choose a stage to explore what happens as a coffee plant grows.</p>
<ol id="stage-plates" aria-label="Coffee growth stages"></ol>
<div class="stage-detail" id="stage-detail" aria-live="polite"></div>
<p class="stage-guide-note">Timing is a general guide and varies with variety, weather and growing conditions. The farmer records each plant’s actual stage and observations.</p>
<p class="stage-sources">Learn more from <a href="https://agrifutures.com.au/product/australian-coffee-growers-manual/" target="_blank" rel="noopener noreferrer">the Australian Coffee Growers’ Manual</a>, <a href="https://varieties.worldcoffeeresearch.org/varieties/paraiso" target="_blank" rel="noopener noreferrer">World Coffee Research</a> and <a href="https://apps.cals.arizona.edu/arboretum/taxon.aspx?id=972" target="_blank" rel="noopener noreferrer">University of Arizona</a> and <a href="https://ucanr.edu/sites/default/files/2020-07/329593.pdf" target="_blank" rel="noopener noreferrer">University of California Agriculture and Natural Resources</a>.</p>
</details>
<p class="map-key" id="map-adoption-key" hidden><span><i class="school-colour" aria-hidden="true">✓</i> Adopted</span><span><i class="cooling-colour" aria-hidden="true">◷</i> Release pending</span></p>
<details class="school-register" id="school-register" hidden><summary id="school-register-title">School adoptions</summary><ul id="school-register-list"></ul></details>
<a class="sub-link plain-apply" id="no-preference" href="{teacher}">Apply without a preference ↗</a>
<p id="selection-live" class="sr" role="status"></p>
<dialog id="plant-dialog" aria-labelledby="list-title"><header><h3 id="list-title">Plant list</h3><button type="button" id="close-list">Close</button></header>
<div class="list-body"><label for="list-row">Planting row</label><select id="list-row"></select><div id="list-options" role="group" aria-label="Choose a position to inspect"></div></div></dialog>
<section id="plant-card" hidden aria-label="Plant details">
<button type="button" id="close-card" aria-label="Close plant details">×</button><div class="card-head"><span class="card-art"><img id="card-image" alt="" width="63" height="71"><button type="button" id="card-photo-toggle" aria-label="Show real plant photograph" aria-pressed="false" hidden><img id="card-photo" alt="Real photograph of this plant"></button></span><div><p class="eyebrow" id="card-kind">Coffee plant</p><h3 id="plant-title"></h3><p id="plant-variety" class="plant-variety"></p></div></div>
<p class="stage-line"><strong id="stage-title"></strong><span id="stage-number"></span></p>
<p class="height">Individual height <strong>No reading published</strong></p><p class="cohort">Pilot average <strong>17 cm</strong> · <time datetime="2026-11-01">1 Nov 2026</time></p>
<p id="plant-status"></p><button type="button" class="cta" id="select-plant"></button><a class="cta" id="request" hidden href="{teacher}">Apply for your class ↗</a>
</section>
</div>
<noscript><p>The interactive map uses JavaScript. You can register your school directly and the farmer can help match your class to a plant.</p><a class="cta" href="{teacher}">Register your school ↗</a></noscript>
</section>
<section class="school shell" id="schools" aria-labelledby="schools-heading"><div><p class="eyebrow">For primary and high schools</p><h2 id="schools-heading">A growing classroom.</h2></div>
<div><ol><li><strong>Register your school.</strong> An authorised teacher applies with a work email. Nearby primary and high schools receive priority.</li>
<li><strong>Meet your plant.</strong> The farm team reviews your application and offers a verified plant when one is available.</li>
<li><strong>Follow it together.</strong> Invite other teachers to the same journal. Compare the farmer’s dated photos with your class.</li></ol>
<p class="terms">Your school can apply for up to three plants. Each extra plant needs an educational reason and approval. The farm cares for the plants. Students take part through a teacher.</p>
<a class="cta" href="{teacher}">Register your school <span aria-hidden="true">↗</span></a></div></section>
<section class="meet-farmer shell" id="meet-farmer" aria-labelledby="farmer-heading">
<div class="farmer-intro"><p class="eyebrow">The people behind the plants</p><h2 id="farmer-heading">Meet the Farmer</h2><p>Growing coffee is a journey of observation, care and shared knowledge.</p></div>
<div class="farmer-layout">
<figure class="farmer-photo"><img src="{assets}/meet-the-farmer.webp" width="1440" height="1080" loading="lazy" alt="Three people standing together among the magnolia rows at The Glenolia."><figcaption>At the farm in Glenorie</figcaption></figure>

<div class="farmer-people">
<article><p class="farmer-role">Program Director · Head of Coffee</p><h3>John Ou</h3><p>John leads the coffee-growing program and the school plant initiative at The Glenolia. He works with the farm team and plantation consultants to share the journey of growing coffee with students and the community.</p></article>
<article><p class="farmer-role">Coffee plantation consultants</p><h3>David Peasley &amp; Jos Webber</h3><p>David and Jos advise The Glenolia on its coffee plantation planning and growing program. Both are co-authors of the <a href="https://agrifutures.com.au/product/australian-coffee-growers-manual/" target="_blank" rel="noopener noreferrer">Australian Coffee Growers’ Manual</a>, a resource for growers across Australia.</p></article>
</div></div>
<div class="farmer-membership"><p>The Glenolia is a proud member of the <strong>Australian Grown Coffee Association</strong>.</p><a href="https://www.agca.au/" target="_blank" rel="noopener noreferrer">Discover the association <span aria-hidden="true">↗</span></a></div>
</section>
</main><footer><a href="{base}/">The Glenolia</a><nav aria-label="More from The Glenolia"><a href="#meet-farmer">Meet the Farmer</a><a href="{base}/coffee-trial/">Coffee trial</a><a href="{base}/teachers/">For teachers</a><a href="{base}/privacy/">Privacy</a><a href="{farmer}" rel="nofollow">Farmer login</a></nav></footer></body></html>'''
