"""Public school invitation and planting-row explorer. Personal journals stay on the education service."""
from hashlib import sha256
from html import escape
import json
from pathlib import Path

ASSETS = Path(__file__).resolve().parents[1] / 'public' / 'assets' / 'plant-portal'


def render(origin, base_path='', teacher_origin='https://glenolia-education.theglenolia.workers.dev'):
    base = escape(base_path.rstrip('/'), quote=True)
    assets = base + '/assets/plant-portal'
    canonical = origin.rstrip('/') + '/plant-portal/'
    teacher_origin = teacher_origin.rstrip('/')
    teacher = escape(teacher_origin + '/#plant', quote=True)
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
<meta property="og:image" content="{origin.rstrip('/')}/assets/plant-portal/orchard-share.jpg"><meta property="og:image:alt" content="Illustrated view of two people working between magnolia rows"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{base}/assets/logos/leaf.svg" type="image/svg+xml"><link rel="stylesheet" href="{assets}/portal.css?v={revision}">
<script type="application/ld+json">{json.dumps(schema, ensure_ascii=False)}</script><script type="module" src="{assets}/portal.js?v={revision}"></script></head>
<body><a class="skip" href="#main">Skip to content</a>
<header class="mast"><a class="identity" href="{base}/" aria-label="The Glenolia home"><img src="{base}/assets/logos/logo-compact.svg" width="250" height="70" alt="The Glenolia"></a><span class="mast-title">School Plant Portal</span>
<nav aria-label="Plant portal"><a class="resources" href="{base}/teachers/">Teacher resources</a><a class="return-link" href="{teacher}">Teacher sign in <span aria-hidden="true">↗</span></a></nav></header>
<main id="main" data-teacher="{teacher}" data-map-url="{escape(teacher_origin, quote=True)}/api/plants/map" data-atlas-assets="{assets}">
<section class="welcome" aria-labelledby="invite-heading">
<div class="welcome-scene"><picture><source media="(max-width: 760px)" srcset="{assets}/approved-row-mobile.webp"><img src="{assets}/approved-row.webp" width="934" height="736" fetchpriority="high" alt="Illustration of two workers tending young coffee plants in a sunny magnolia aisle."></picture>
<small class="scene-credit">Illustrated farm view</small>
<a class="hero-marker marker-1" href="#rows" data-preview="1" aria-label="Explore the estate atlas"><span class="sr">Plant 1</span></a>
<a class="hero-marker marker-2" href="#rows" data-preview="2" aria-label="Explore the estate atlas"><span class="sr">Plant 2</span></a>
<a class="hero-marker marker-3" href="#rows" data-preview="3" aria-label="Explore the estate atlas"><span class="sr">Plant 3</span></a>
</div>
<div class="invite-frame"><div class="invite"><div class="invite-heading"><p class="eyebrow">Free school programme</p><h1 id="invite-heading">A coffee plant <br>for your class.</h1></div>
<div class="invite-portrait"><img src="{assets}/approved-young-plant.webp" alt="Illustrated young coffee plant" width="287" height="226"></div>
<div class="invite-actions"><p>Follow one plant in Glenorie through the farmer’s photos and field notes.</p>
<a class="cta" href="#rows">Explore the rows <span aria-hidden="true">↓</span></a>
<a class="sub-link" href="{teacher}">Register your school <span aria-hidden="true">↗</span></a></div></div></div></section>
<section class="explore shell" id="rows" aria-labelledby="rows-heading" tabindex="-1">
<div class="section-head"><div><p class="eyebrow">The estate atlas</p><h2 id="rows-heading">Choose a class plant.</h2></div>
<p>Explore the coffee plants among the established magnolias. Select a plant to take your preference into your school application.</p></div>
<div id="row-app" hidden>
<details class="growth-guide" id="stage-guide"><summary>See the 10 coffee growth stages</summary><p>The farmer sets each plant’s stage. The tiny seedling is drawn at about 10 cm.</p>
<label for="stage-set">Illustration set</label> <select id="stage-set" aria-controls="stage-plates"><option value="1">A</option><option value="2">B</option><option value="3">C</option><option value="4">D</option><option value="5">E</option></select>
<ol id="stage-plates"></ol></details>
<div class="atlas-tools"><label for="row-jump"><span class="wide-label">Jump to </span>row</label><select id="row-jump" aria-label="Jump to row"></select>
<span class="atlas-hint">Scroll inside the map ↓</span><button type="button" id="return-selected" hidden></button><button type="button" id="plant-list" disabled>Plant list</button></div>
<div class="map-notice" id="map-notice" role="status"><span id="map-message">Loading the farmer’s planting map…</span><button type="button" id="retry-map" hidden>Try again</button></div>
<figure class="atlas-sheet"><div id="art-notice" class="map-notice" role="status"><span id="art-message">Loading the orchard illustration…</span><button type="button" id="retry-art" hidden>Retry illustration</button></div>
<div id="atlas-viewport" role="region" aria-label="Scrollable orchard map" aria-describedby="atlas-scroll-tip" tabindex="0"><div id="atlas-frame" data-art-state="loading"><picture><source id="mobile-art" media="(max-width:620px)" srcset="{assets}/estate-atlas-mobile.webp"><img id="estate-art" src="{assets}/estate-atlas.webp" width="1400" height="3332" alt="" loading="eager" decoding="async"></picture>
<svg id="estate-map" viewBox="0 0 1000 2380" role="group" aria-labelledby="atlas-title atlas-desc">
<title id="atlas-title">The Glenolia estate atlas</title><desc id="atlas-desc">A continuous illustrated orchard map. Explore individual planting positions in the plant list or use the arrow keys between them.</desc>
<g id="atlas-row-labels" aria-hidden="true"></g><g id="atlas-plants" role="group" aria-label="Coffee planting positions"></g></svg></div></div>
<figcaption><span id="atlas-scroll-tip">Scroll the map to explore all 12 rows.</span><span>Rows 3–12 are in the autumn 2027 planting plan. The farm updates each row as work progresses.</span></figcaption></figure>
<a class="sub-link plain-apply" id="no-preference" href="{teacher}">Apply without a preference ↗</a>
<p id="selection-live" class="sr" role="status"></p>
<dialog id="plant-dialog" aria-labelledby="list-title"><header><h3 id="list-title">Plant list</h3><button type="button" id="close-list">Close</button></header>
<div class="list-body"><label for="list-row">Planting row</label><select id="list-row"></select><div id="list-options" role="group" aria-label="Choose a position to inspect"></div></div></dialog>
<section id="plant-card" hidden aria-label="Plant details">
<button type="button" id="close-card" aria-label="Close plant details">×</button><div class="card-head"><span class="card-art"><img id="card-image" alt="" width="63" height="71"></span><div><p class="eyebrow" id="card-kind">Coffee plant</p><h3 id="plant-title"></h3></div></div>
<p class="stage-line"><strong id="stage-title"></strong><span id="stage-number"></span></p>
<p class="height">Individual height <strong>No reading published</strong></p><p class="cohort">Pilot average <strong>17 cm</strong> · <time datetime="2026-11-01">1 Nov 2026</time></p>
<p id="plant-status"></p><button type="button" class="cta" id="select-plant"></button><a class="cta" id="request" hidden href="{teacher}">Apply for your class ↗</a></section>
</div>
<noscript><p>The interactive map uses JavaScript. You can register your school directly and the farmer can help match your class to a plant.</p><a class="cta" href="{teacher}">Register your school ↗</a></noscript>
</section>
<section class="school shell" id="schools" aria-labelledby="schools-heading"><div><p class="eyebrow">For primary and high schools</p><h2 id="schools-heading">A growing classroom.</h2></div>
<div><ol><li><strong>Register your school.</strong> An authorised teacher applies with their work email. Nearby schools receive priority.</li>
<li><strong>Meet your plant.</strong> The farm team reviews your application and offers a verified plant when one is available.</li>
<li><strong>Follow it together.</strong> Open the journal with your students to compare the farmer’s dated photos and notes.</li></ol>
<p class="terms">School adoption is free. The plant stays in the care of the farm. Students participate through their teacher.</p>
<a class="cta" href="{teacher}">Register your school <span aria-hidden="true">↗</span></a></div></section>
</main><footer><a href="{base}/">The Glenolia</a><nav aria-label="More from The Glenolia"><a href="{base}/coffee-trial/">Coffee trial</a><a href="{base}/teachers/">For teachers</a><a href="{base}/privacy/">Privacy</a></nav></footer></body></html>'''
