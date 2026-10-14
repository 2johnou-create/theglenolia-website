"""Accessible public content for the approved miniature, independent of WebGL."""
from pathlib import Path
from html import escape as e
import json

DATA = json.loads((Path(__file__).resolve().parents[1] / 'progress-content.json').read_text())
CONFIG = DATA['config']
if type(CONFIG['currentStage']) is not int or CONFIG['currentStage'] not in range(4):
    raise ValueError('The confirmed progress stage must be between 0 and 3')

def payload(key, coffee_url):
    value = {'config': CONFIG, 'copy': DATA['copy'][key], 'roomCopy': DATA['roomCopy'][key], 'coffeeUrl': coffee_url}
    return '<script type="application/json" id="progress-data">'+json.dumps(value, ensure_ascii=False).replace('<', '\\u003c')+'</script>'

def home(key, progress_url, coffee_url):
    c, stage = DATA['copy'][key], CONFIG['currentStage']
    return f'''<section class="little-world-home" id="little-world"><div><p class="eyebrow">{e(c['homeKicker'])}</p><h2>{e(c['homeTitle'])}</h2><p>{e(c['homeStageBodies'][stage])}</p><a class="button" href="{progress_url}">{e(c['homeButton'])}<span aria-hidden="true">↗</span></a></div><div class="home-world-image"><canvas id="home-world-canvas" tabindex="0" aria-label="{e(c['farm'])}" aria-describedby="home-world-caption"></canvas><img class="home-world-poster" src="/assets/progress/farm-poster.webp" alt="{e(c['posterAlt'])}" width="1200" height="660" loading="lazy" decoding="async"><button id="home-pause" class="home-world-pause" type="button" aria-pressed="true">{e(c['play'])}</button><div class="home-world-label"><span class="home-motion-dot" aria-hidden="true"></span>{e(c['currentLabels'][stage])}</div></div><p class="small home-world-caption" id="home-world-caption">{e(c['illustrative'])}</p></section>'''+payload(key, coffee_url)

def page(key, register_url, coffee_url):
    c, stage = DATA['copy'][key], CONFIG['currentStage']
    heading = '<br>'.join(e(x) for x in c['title'].split('<br>'))
    chapters = ''.join(f'''<li class="{'is-confirmed' if i<stage else 'is-current' if i==stage else 'is-future'}"><h3>{e(name)}</h3><span>{e(c['complete'] if i<stage else c['states'][0] if i==stage else c['states'][i])}</span></li>''' for i,name in enumerate(c['stages']))
    selectors = ''.join(f'<button type="button" data-stage="{i}" aria-pressed="{str(i==stage).lower()}">{e(name)}</button>' for i,name in enumerate(c['stages']))
    spots = ''.join(f'<button type="button" data-zone="{i}" class="hotspot" aria-pressed="{str(i==0).lower()}" aria-label="{e(name+", "+c["open"])}"><span>0{i+1}</span><b>{e(name)}</b><i aria-hidden="true">+</i></button>' for i,name in enumerate(c['hotspots']))
    notes = ''.join(f'<article><h3>{e(title)}</h3><p>{e(text)}</p></article>' for title,text in zip(c['zoneTitle']+DATA['roomCopy'][key]['titles'], c['zoneBody']+DATA['roomCopy'][key]['bodies']))
    return f'''<section class="world-intro"><div><p class="eyebrow">{e(c['kicker'])}</p><h1>{heading}</h1></div><div class="intro-aside"><p class="lead">{e(c['intro'])}</p><div class="actual-stage"><span class="live-dot" aria-hidden="true"></span><div><span class="eyebrow">{e(c['current'])}</span><strong>{e(c['currentLabels'][stage])}</strong></div></div></div></section>
<section class="world-section" id="scenes" aria-label="{e(c['view'])}">
<div class="world-toolbar"><div class="scene-toggle" role="group" aria-label="{e(c['view'])}"><button type="button" data-view="farm" aria-pressed="true"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 19h18M6 19V9l6-5 6 5v10M10 19v-6h4v6M3 10l9-7 9 7"/></svg><span>{e(c['farm'])}</span></button><button type="button" data-view="cafe" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h12v8a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V7zm12 1h2a3 3 0 0 1 0 6h-2M4 22h14M8 2v2m4-2v2"/></svg><span>{e(c['cafe'])}</span></button></div><p class="mini-update">{e(c['update'])}</p></div>
<div id="world-stage" class="world-stage" data-view="farm"><div class="scene-top"><div class="scene-stage"><span class="live-dot" aria-hidden="true"></span><span id="scene-status">{e(c['currentLabels'][stage])}</span></div><span id="future-label" class="future-label" hidden></span></div>
<div id="canvas-wrap" class="canvas-wrap"><canvas id="world-canvas" tabindex="0" aria-label="{e(c['farm'])}" aria-describedby="scene-caption"></canvas><img class="world-poster" src="/assets/progress/farm-poster.webp" alt="{e(c['posterAlt'])}" width="1200" height="660" decoding="async"><p id="loading" hidden>{e(c['loading'])}</p><p id="fallback" hidden>{e(c['fallback'])}</p></div>
<div class="hotspot-layer" id="hotspots">{spots}</div><div class="scene-bottom"><span class="drag-hint"><span>{e(c['drag'])}</span></span><div><button type="button" id="reset" class="icon-button" aria-label="{e(c['reset'])}" title="{e(c['reset'])}">↺</button><button type="button" id="pause" class="pause-button" aria-pressed="true"><span id="pause-icon" aria-hidden="true">▷</span><span id="pause-label">{e(c['play'])}</span></button></div></div></div>
<div class="scene-caption" id="scene-caption"><span>{e(c['illustrative'])}</span><span>{e(c['sound'])}</span></div><div class="scene-details" id="scene-details" aria-live="polite"><div class="detail-number" id="detail-number">01</div><div><p class="eyebrow" id="detail-label">{e(c['hotspots'][0])}</p><h2 id="detail-title">{e(c['zoneTitle'][0])}</h2></div><div><p id="detail-body">{e(c['zoneBody'][0])}</p><a class="text-link" id="detail-link" href="{coffee_url}">{e(c['zoneLinks'][0])} ↗</a></div></div><details class="scene-static-notes"><summary>{e(c['sceneNotes'])}</summary>{notes}</details></section>
<section class="chapter-section"><div class="chapter-heading"><div><p class="eyebrow">{e(c['stageKicker'])}</p><h2>{e(c['stageTitle'])}</h2></div><p>{e(c['currentIntro'][stage])}</p></div><ol class="chapter-track" id="chapter-track">{chapters}</ol><div class="chapter-story"><span class="chapter-symbol" id="chapter-symbol">0{stage+1}</span><p id="stage-body">{e(c['currentText'][stage])}</p></div><div class="review-stage-controls"><p>{e(c['reviewLabel'])}</p><div class="stage-selectors" id="stage-selectors">{selectors}</div><p class="stage-preview-note" id="stage-preview-note">{e(c['now'])}</p></div></section>
<section class="opening-strip"><img src="/assets/logos/leaf-reversed.svg" alt="" width="64" height="153" loading="lazy"><div><h2>{e(c['target'])}</h2><p>{e(c['targetNote'])}</p></div><a class="button button-light" href="{register_url}">{e(c['register'])}<span aria-hidden="true">↗</span></a></section>'''+payload(key, coffee_url)
