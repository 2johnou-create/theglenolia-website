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
                   'Glenorie, NSW. Explore the planting rows and bring farmer photos and notes into class.')
    schema = {
        '@context': 'https://schema.org', '@type': 'WebPage', 'url': canonical,
        'name': 'School Plant Portal at The Glenolia', 'description': description, 'inLanguage': 'en-AU',
        'audience': {'@type': 'EducationalAudience', 'educationalRole': 'teacher'},
        'isPartOf': {'@type': 'WebSite', 'name': 'The Glenolia', 'url': origin.rstrip('/') + '/'},
        'about': {'@type': 'Thing', 'name': 'School coffee plant adoption in Glenorie, New South Wales'},
    }
    revision = sha256((ASSETS/'portal.css').read_bytes() + (ASSETS/'portal.js').read_bytes()).hexdigest()[:12]
    preview_meta = '<meta name="robots" content="noindex,follow">' if base else ''
    positions = ''.join(f'<option value="{n}">Plant {n:02d}</option>' for n in range(1, 20))
    return f'''<!doctype html>
<html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{escape(title)}</title><meta name="description" content="{escape(description)}"><meta name="theme-color" content="#F5F1E8">
<link rel="canonical" href="{canonical}"><link rel="alternate" hreflang="en-AU" href="{canonical}"><link rel="alternate" hreflang="x-default" href="{canonical}">{preview_meta}
<meta property="og:type" content="website"><meta property="og:locale" content="en_AU"><meta property="og:site_name" content="The Glenolia">
<meta property="og:title" content="A coffee plant for your classroom | The Glenolia"><meta property="og:description" content="{escape(description)}"><meta property="og:url" content="{canonical}">
<meta property="og:image" content="{origin.rstrip('/')}/assets/plant-portal/orchard-share.jpg"><meta property="og:image:alt" content="Illustrated view of two people working between magnolia rows"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{base}/assets/logos/leaf.svg" type="image/svg+xml"><link rel="stylesheet" href="{assets}/portal.css?v={revision}">
<script type="application/ld+json">{json.dumps(schema, ensure_ascii=False)}</script><script defer src="{assets}/portal.js?v={revision}"></script></head>
<body><a class="skip" href="#main">Skip to content</a>
<header class="mast"><a class="identity" href="{base}/" aria-label="The Glenolia home"><img src="{base}/assets/logos/logo-compact.svg" width="250" height="70" alt="The Glenolia"></a><span class="mast-title">School Plant Portal</span>
<nav aria-label="Plant portal"><a class="resources" href="{base}/teachers/">Teacher resources</a><a class="return-link" href="{teacher}">Teacher sign in <span aria-hidden="true">↗</span></a></nav></header>
<main id="main" data-teacher="{teacher}" data-map-url="{escape(teacher_origin, quote=True)}/api/plants/map">
<section class="welcome" aria-labelledby="invite-heading">
<div class="welcome-scene"><picture><source media="(max-width: 760px)" srcset="{assets}/approved-row-mobile.webp"><img src="{assets}/approved-row.webp" width="934" height="736" fetchpriority="high" alt="Illustration of two workers tending young coffee plants in a sunny magnolia aisle."></picture>
<small class="scene-credit">Illustrated farm view</small>
<a class="hero-marker marker-1" href="#rows" data-preview="1" aria-label="Explore row 1, plant 1"><span class="sr">Plant 1</span></a>
<a class="hero-marker marker-2" href="#rows" data-preview="2" aria-label="Explore row 1, plant 2"><span class="sr">Plant 2</span></a>
<a class="hero-marker marker-3" href="#rows" data-preview="3" aria-label="Explore row 1, plant 3"><span class="sr">Plant 3</span></a>
</div>
<div class="invite-frame"><div class="invite"><div class="invite-heading"><p class="eyebrow">Free school programme</p><h1 id="invite-heading">A coffee plant <br>for your class.</h1></div>
<div class="invite-portrait"><img src="{assets}/approved-young-plant.webp" alt="Illustrated young coffee plant" width="287" height="226"></div>
<div class="invite-actions"><p>Follow one plant in Glenorie through the farmer’s photos and field notes.</p>
<a class="cta" href="#rows">Explore the rows <span aria-hidden="true">↓</span></a>
<a class="sub-link" href="{teacher}">Register your school <span aria-hidden="true">↗</span></a></div></div></div></section>
<section class="explore shell" id="rows" aria-labelledby="rows-heading" tabindex="-1">
<div class="section-head"><div><p class="eyebrow">Inside the plantation</p><h2 id="rows-heading">Choose a class plant.</h2></div>
<p>Explore two coffee rows between the magnolias. Your preference goes with your school application.</p></div>
<div id="row-app" hidden>
<div class="map-top"><div class="row-switch" role="group" aria-label="Plantation row"><button type="button" data-row="1" aria-pressed="true">Row 1</button><button type="button" data-row="2" aria-pressed="false">Row 2</button></div>
<label class="list-field" for="position-list">Plant list <select id="position-list">{positions}</select></label></div>
<div class="map-layout"><div class="plot" id="plot" aria-label="Illustrated plantation map">
<div class="world" aria-hidden="true"><img class="grove-art" src="{assets}/grove.webp" srcset="{assets}/grove-870.webp 870w, {assets}/grove.webp 1774w" sizes="(max-width: 760px) max(650px, 200vw), (max-width: 1500px) max(910px, 145vw), 2070px" width="1774" height="887" alt="" decoding="async"></div><div class="plot-label"><span>Row <b id="scene-row">1</b> of 2</span><small>Illustrated planting layout</small></div>
<div class="scene-arrows" role="group" aria-label="Move between rows"><button data-move="-1" aria-label="Previous row" type="button" aria-disabled="true">←</button><button data-move="1" aria-label="Next row" type="button" aria-disabled="false">→</button></div></div>
<div class="selection"><div><p class="eyebrow" id="pick-row">Row 1</p><h3 id="pick-title">Plant 01</h3><p id="availability">The farmer confirms each plant before allocation.</p></div>
<div><a class="cta" id="request" href="{teacher}?prefer=r1-p1">Request this position <span aria-hidden="true">↗</span></a><a class="sub-link" id="no-preference" href="{teacher}">Apply without a preference</a></div></div></div>
<div class="rail-wrap"><p id="rail-label">Positions in row 1</p><div class="rail" aria-labelledby="rail-label" role="group"></div></div>
<p id="selection-live" class="sr" role="status"></p></div>
<noscript><p>The interactive map uses JavaScript. You can register your school directly and the farmer can help match your class to a plant.</p><a class="cta" href="{teacher}">Register your school ↗</a></noscript>
</section>
<section class="school shell" id="schools" aria-labelledby="schools-heading"><div><p class="eyebrow">For primary and high schools</p><h2 id="schools-heading">A growing classroom.</h2></div>
<div><ol><li><strong>Register your school.</strong> An authorised teacher applies with their work email. Nearby schools receive priority.</li>
<li><strong>Meet your plant.</strong> The farm team reviews your application and offers a verified plant when one is available.</li>
<li><strong>Follow it together.</strong> Open the journal with your students to compare the farmer’s dated photos and notes.</li></ol>
<p class="terms">School adoption is free. The plant stays in the care of the farm. Students participate through their teacher.</p>
<a class="cta" href="{teacher}">Register your school <span aria-hidden="true">↗</span></a></div></section>
</main><footer><a href="{base}/">The Glenolia</a><nav aria-label="More from The Glenolia"><a href="{base}/coffee-trial/">Coffee trial</a><a href="{base}/teachers/">For teachers</a><a href="{base}/privacy/">Privacy</a></nav></footer></body></html>'''
