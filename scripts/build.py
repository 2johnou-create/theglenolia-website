"""Build the multilingual Glenolia brochure site with Python's standard library."""
from pathlib import Path
from html import escape as e
import json, shutil, os, hashlib
from urllib.parse import quote
import progress_markup as world_markup

ROOT = Path(__file__).resolve().parents[1]
CONTENT = json.loads((ROOT / 'content.json').read_text())
ADDITIONS = json.loads((ROOT / 'content-additions.json').read_text())
for key in CONTENT:
    CONTENT[key].update(ADDITIONS[key])
CONFIG = json.loads((ROOT / 'config.json').read_text())
DIST = ROOT / 'dist'
if DIST.exists():
    shutil.rmtree(DIST)
DIST.mkdir(exist_ok=True)
shutil.copytree(ROOT / 'public', DIST, dirs_exist_ok=True)
ORIGIN = CONFIG['canonicalOrigin'].rstrip('/')
BASE_PATH = os.environ.get('SITE_BASE_PATH', '').rstrip('/')
if BASE_PATH and (not BASE_PATH.startswith('/') or '..' in BASE_PATH):
    raise ValueError('SITE_BASE_PATH must be a safe absolute URL path')
WORLD_REVISION = hashlib.sha256(b''.join(p.read_bytes() for p in sorted((ROOT/'src/progress').glob('*.js'))) + (ROOT/'public/assets/progress/progress.css').read_bytes()).hexdigest()[:12]
ROUTES = {'home':'', 'about':'about/', 'making':'in-the-making/', 'coffee':'coffee-trial/', 'progress':'progress/', 'register':'register/', 'privacy':'privacy/', 'confirmed':'confirmed/', 'admin':'admin/'}

def url(c, page):
    return '/' + c['prefix'] + ROUTES[page]

def image(name, alt='', cls='', eager=False):
    return f'<img src="/assets/images/{name}" alt="{e(alt)}" class="{cls}" width="1000" height="750" loading="{"eager" if eager else "lazy"}" decoding="async">'

def button(href, text, cls='button'):
    return f'<a class="{cls}" href="{href}">{e(text)}<span aria-hidden="true">↗</span></a>'

def label(text): return f'<p class="eyebrow">{e(text)}</p>'

def motion(c, hero=False):
    return f'''<figure class="landscape {'story-landscape' if hero else ''}" data-depth>
    <img class="landscape-poster" src="/assets/images/aerial-1600.webp" srcset="/assets/images/aerial-800.webp 800w, /assets/images/aerial-1600.webp 1600w" sizes="(max-width: 800px) 100vw, 85vw" alt="{e(c['photoAlt'])}" width="1600" height="900" loading="{'eager' if hero else 'lazy'}" {'fetchpriority="high"' if hero else ''}>
    <video class="landscape-video" muted loop playsinline disablepictureinpicture disableremoteplayback preload="none" aria-hidden="true" tabindex="-1" data-background-video data-desktop="/assets/video/aerial-desktop.mp4" data-mobile="/assets/video/aerial-mobile.mp4"></video>
    <div class="landscape-caption">{label(c['location'])}<p>{e(c['heroCaption'])}</p></div>
    <button class="motion-control" data-video-toggle data-pause="{e(c['pause'])}" data-resume="{e(c['resume'])}" hidden>{e(c['pause'])}</button>
    </figure><p class="photo-credit">{e(c['photoCredit'])}</p>'''

def vision(c, full=False, place=False):
    vals=''.join(f'<article><span class="value-index" aria-hidden="true">0{i+1}</span><h3>{e(v["title"])}</h3><p>{e(v["body"])}</p></article>' for i,v in enumerate(c['values']))
    heading=c['storyTitle'] if place else c['visionTitle']
    intro=c['storyIntro'] if place else c['visionIntro']
    return f'''<section class="section vision" id="vision"><div class="vision-intro">{label(c['location'] if place else c['visionLabel'])}<h2>{e(heading)}</h2><p class="lead">{e(intro)}</p>{f'<p class="name-equation">{e(c["storySmall"])}</p>' if place else ''}{'' if full else button(url(c,'about'),c['storyLink'],'text-link')}</div><div class="values">{vals}</div></section>'''

def directions(c, full=False):
    rows=''.join(f'''<article class="direction {'full' if full else ''}" data-depth><div class="direction-image">{image(d['image'],d['alt'])}</div><div class="direction-copy">{label(f'0{i+1} · '+c['planned'])}<h3>{e(d['title'])}</h3><p>{e(d['body'] if full else d['short'])}</p>{button(url(c,'coffee'),c['coffeeLink'],'text-link') if i==1 else ''}</div></article>''' for i,d in enumerate(c['directions']))
    return f'''<section class="section making"><div class="section-heading"><div>{label(c['makingLabel'])}<h2>{e(c['makingTitle'])}</h2></div><p>{e(c['makingIntro'])}</p></div><div class="directions">{rows}</div><p class="small concept-note">{e(c['conceptNote'])}</p>{f'<p class="small vegetarian-note">{e(c["vegetarianNote"])}</p>' if full else button(url(c,'making'),c['explore'],'text-link')}</section>'''

def partners(c):
    address=CONFIG['partnerEmail']
    href='mailto:'+address+'?subject='+quote(c['partnerSubject'])
    return f'''<section class="section partner-invitation" id="local-partners"><div>{label(c['partnerLabel'])}<h2>{e(c['partnerTitle'])}</h2><p class="lead">{e(c['partnerIntro'])}</p></div><div><p>{e(c['partnerPrompt'])}</p>{button(href,c['partnerAction'])}<a class="partner-email" href="mailto:{address}">{address}</a><p class="small">{e(c['partnerNote'])}</p></div></section>'''

def timeline(c, full=False):
    items=''.join(f'''<li class="milestone"><div class="timeline-date"><span>{e(m['date'])}</span><small>{e(m['state'])}</small></div><div><h3>{e(m['title'])}</h3><p>{e(m['body'])}</p></div></li>''' for m in c['milestones'])
    return f'''<section class="section progress"><div class="section-heading"><div>{label(c['progressLabel'])}<h2>{e(c['progressTitle'])}</h2></div><p>{e(c['progressIntro'])}</p></div><ol class="timeline">{items}</ol><p class="small">{e(c['updated'])}</p>{'' if full else button(url(c,'progress'),c['progressLink'],'text-link')}</section>'''

def journal(c):
    link=button(CONFIG['instagramUrl'],c['ig'],'text-link external') if CONFIG['instagramUrl'] else ''
    return f'''<section class="section journal"><div class="section-heading"><div>{label(c['journalLabel'])}<h2>{e(c['journalTitle'])}</h2></div><p>{e(c['journalText'])}</p></div><div class="instagram-feed" data-instagram-feed data-empty="{e(c['igEmpty'])}" data-unavailable="{e(c['igUnavailable'])}" data-link-label="{e(c['igPost'])}" aria-live="polite"><p class="feed-message">{e(c['igEmpty'] if CONFIG['instagramUrl'] else c['igPending'])}</p></div>{link}</section>'''

def faq(c):
    rows=''.join(f'<details><summary>{e(f["q"])}<span aria-hidden="true">+</span></summary><p>{e(f["a"])}</p></details>' for f in c['faqs'])
    return f'<section class="section faq"><h2>{e(c["faqTitle"])}</h2><div>{rows}</div></section>'

def signup(c, form=False):
    if not form:
        return f'''<section class="signup-band"><div>{label(c['signupLabel'])}<h2>{e(c['signupTitle'])}</h2><p>{e(c['signupIntro'])}</p></div><div>{button(url(c,'register'),c['register'],'button button-light')}<p class="small">{e(c['signupNote'])}</p></div><img class="band-leaf" src="/assets/logos/leaf-reversed.svg" width="100" height="240" alt="" loading="lazy"></section>'''
    checks=''.join(f'<label class="choice"><input type="checkbox" name="interests" value="{v}"><span>{e(c["interestNames"][i])}</span></label>' for i,v in enumerate(['opening','coffee','workshops','local']))
    disabled='' if CONFIG['newsletterReady'] else ' disabled'
    return f'''<section class="register-layout section"><div>{label(c['signupLabel'])}<h1>{e(c['signupTitle'])}</h1><p class="lead">{e(c['signupIntro'])}</p><p>{e(c['signupNote'])}</p><div class="register-art">{image('shoot.webp',c['directions'][1]['alt'])}</div><p class="small">{e(c['conceptNote'])}</p></div><div class="form-panel"><form id="newsletter-form" data-endpoint="{e(CONFIG['newsletterEndpoint'])}" data-success="{e(c['success'])}" data-error="{e(c['error'])}" data-sending="{e(c['sending'])}" data-email-error="{e(c['emailError'])}" data-consent-error="{e(c['consentError'])}" data-unconnected="{e(c['unconnected'])}" novalidate><fieldset{disabled}><legend class="sr-only">{e(c['register'])}</legend><div class="field"><label for="email">{e(c['email'])}</label><input id="email" name="email" type="email" autocomplete="email" placeholder="{e(c['emailPlaceholder'])}" required maxlength="254"></div><div class="field"><label for="first-name">{e(c['firstName'])}</label><input id="first-name" name="firstName" autocomplete="given-name" maxlength="80"></div><fieldset class="interests"><legend>{e(c['interests'])}</legend>{checks}</fieldset><div class="honeypot" aria-hidden="true"><label for="website">Website</label><input id="website" name="website" tabindex="-1" autocomplete="off"></div><label class="consent"><input type="checkbox" id="consent" name="consent" required><span>{e(c['consent'])}</span></label><a class="privacy-link" href="{url(c,'privacy')}">{e(c['privacyLink'])}</a><button type="submit" class="button">{e(c['submit'])}<span aria-hidden="true">↗</span></button></fieldset><p class="form-status" role="status" tabindex="-1">{'' if CONFIG['newsletterReady'] else e(c['unconnected'])}</p><input type="hidden" name="language" value="{c['lang']}"></form></div></section>'''

def footer(c):
    contact=f'<a href="mailto:{e(CONFIG["contactEmail"])}">{e(CONFIG["contactEmail"])}</a>' if CONFIG['contactEmail'] else f'<span>{e(c["contactPending"])}</span>'
    return f'''<footer class="footer"><div class="footer-brand"><a href="{url(c,'home')}"><img class="footer-logo-full" src="/assets/logos/logo-{'zh' if c['lang']=='zh-Hant' else 'en'}-web.svg" alt="THE GLENOLIA — {e(c['tagline'] if c['lang']=='zh-Hant' else 'A place to grow and gather.')}" width="660" height="390" loading="lazy"><img class="footer-logo-compact" src="/assets/logos/logo-compact-web.svg" alt="THE GLENOLIA" width="660" height="335" loading="lazy"></a><p>{e(c['footerLine'])}</p></div><div class="footer-info"><p>{e(c['location'])}</p><p>{e(c['footerStatus'])}</p><p>{e(c['target'])}</p>{contact}<nav aria-label="{e(c['privacy'])}"><a href="{url(c,'privacy')}">{e(c['privacy'])}</a><button data-motion-toggle data-off="{e(c['motionOff'])}" data-on="{e(c['motionOn'])}" type="button">{e(c['motionOff'])}</button><a href="#top">{e(c['top'])} ↑</a><a href="{url(c,'admin')}">{e(c['adminLabel'])}</a></nav><p class="small">© 2026 THE GLENOLIA</p></div></footer>'''

def build_page(key, page):
    c=CONTENT[key]
    titles={'home':c['siteTitle'],'about':c['nav'][0], 'making':c['nav'][1], 'coffee':c['coffeeTitle'], 'progress':c['nav'][2], 'register':c['register'],'privacy':c['privacy'],'confirmed':c['confirmTitle'],'admin':c['adminLabel']}
    page_title=titles[page] if page=='home' else titles[page]+' | The Glenolia'
    descriptions={'home':c['description'],'about':c['visionIntro'],'making':c['makingIntro'],'coffee':c['coffeeIntro'],'progress':world_markup.DATA['copy'][key]['currentText'][world_markup.CONFIG['currentStage']],'register':c['signupIntro'] if CONFIG['newsletterReady'] else c['unconnected']+' '+c['signupIntro'],'privacy':c['privacyIntro'],'confirmed':c['confirmText'],'admin':c['adminIntro']}
    description=descriptions[page]
    canon=ORIGIN+url(c,page)
    alternates=''.join(f'<link rel="alternate" hreflang="{v["lang"]}" href="{ORIGIN+url(v,page)}">' for v in CONTENT.values())+f'<link rel="alternate" hreflang="x-default" href="{ORIGIN+url(CONTENT["en"],page)}">'
    languages=''.join(f'<a href="{url(v,page)}" lang="{v["lang"]}" hreflang="{v["lang"]}" {"aria-current=\"true\"" if v==c else ""}>{v["name"]}</a>' for v in CONTENT.values())
    nav=''.join(f'<a href="{url(c,p)}" {"aria-current=\"page\"" if page==p else ""}>{e(c["nav"][i])}</a>' for i,p in enumerate(['about','making','progress']))
    header=f'''<a class="skip-link" href="#main">{e(c['skip'])}</a><header class="site-header" id="top"><a class="brand" href="{url(c,'home')}" aria-label="THE GLENOLIA · {e(c['home'])}"><img src="/assets/logos/logo-compact-web.svg" width="660" height="335" alt="THE GLENOLIA"></a><div class="header-tools"><nav class="languages" aria-label="Language / 語言 / 言語">{languages}</nav><button class="menu-toggle" aria-expanded="false" aria-controls="main-nav" data-close="{e(c['close'])}" data-open="{e(c['menu'])}">{e(c['menu'])}<span aria-hidden="true">☰</span></button></div><nav class="main-nav" id="main-nav" aria-label="{e(c['menu'])}">{nav}{button(url(c,'register'),c['register'],'button button-small')}</nav></header>'''
    if page=='home':
        h=''.join(f'<span>{e(x)}</span>' for x in c['hero'])
        body=f'''<section class="home-hero section"><div class="hero-copy">{label(c['location'])}<h1>{h}</h1><p class="lead">{e(c['heroText'])}</p><div class="hero-actions">{button(url(c,'register'),c['register'])}{button(url(c,'about'),c['storyLink'],'text-link')}</div><p class="opening-note"><span class="dot" aria-hidden="true"></span>{e(c['target'])}</p></div><div class="hero-art" data-depth><div class="hero-art-field"></div>{image('magnolia.webp','', 'magnolia',True)}<div class="hero-art-caption">{label('01 · '+c['status'])}<p>{e(c['tagline'])}</p></div><img class="hero-leaf" src="/assets/logos/leaf.svg" alt="" width="90" height="215" loading="eager"></div></section>'''+vision(c)+f'<section class="landscape-section">{motion(c)}</section>'+directions(c)+world_markup.home(key,url(c,'progress'),url(c,'coffee'))+journal(c)+faq(c)+signup(c)
    elif page=='about':
        body=f'''<section class="page-intro section">{label(c['nav'][0])}<h1>{e(c['visionTitle'])}</h1><p class="lead">{e(c['visionIntro'])}</p></section><section class="landscape-section">{motion(c,True)}</section>'''+vision(c,True,True)+f'''<section class="section foundation"><div>{label(c['status'])}<h2>{e(c['foundationTitle'])}</h2><p class="lead">{e(c['foundationIntro'])}</p><div class="foundation-items">{''.join('<article><h3>'+e(x['title'])+'</h3><p>'+e(x['body'])+'</p></article>' for x in c['foundation'])}</div></div><div class="foundation-art" data-depth>{image('magnolia.webp','')}{image('shoot.webp','')}</div></section>'''+signup(c)
    elif page=='making':
        body=f'<section class="page-intro section">{label(c["status"])}<h1>{e(c["nav"][1])}</h1><p class="lead">{e(c["dateNote"])}</p></section>'+directions(c,True)+partners(c)+faq(c)+signup(c)
    elif page=='coffee':
        body=f'<section class="page-intro section coffee-intro">{label(c["coffeeLabel"])}<h1>{e(c["coffeeTitle"])}</h1><p class="lead">{e(c["coffeeIntro"])}</p></section><section class="section coffee-details"><div class="coffee-art">'+image('shoot.webp',c['directions'][1]['alt'])+f'<p class="small">{e(c["conceptNote"])}</p></div><div>'+''.join(f'<article><h2>{e(x["title"])}</h2><p>{e(x["body"])}</p></article>' for x in c['coffeeSections'])+'</div></section>'+signup(c)
    elif page=='progress':
        body=world_markup.page(key,url(c,'register'),url(c,'coffee'))
    elif page=='register': body=signup(c,True)+faq(c)
    elif page=='privacy':
        body=f'<section class="page-intro section prose">{label(c["privacyDate"])}<h1>{e(c["privacyTitle"])}</h1><p class="lead">{e(c["privacyIntro"])}</p>'+''.join(f'<section><h2>{e(x["title"])}</h2><p>{e(x["body"])}</p></section>' for x in c['privacySections'])+'</section>'
    elif page=='admin':
        admin=CONFIG.get('adminUrl','')
        action=button(e(admin),c['adminAction']) if admin else f'<p class="admin-pending" role="status">{e(c["adminPending"])}</p>'
        body=f'<section class="page-intro section prose">{label(c["adminLabel"])}<h1>{e(c["adminTitle"])}</h1><p class="lead">{e(c["adminIntro"])}</p>{action}<p class="small admin-privacy">{e(c["adminPrivacy"])}</p></section>'
    else: body=f'<section class="page-intro section prose"><h1>{e(c["confirmTitle"])}</h1><p class="lead">{e(c["confirmText"])}</p>{button(url(c,"home"),c["home"])}</section>'
    schema={'@context':'https://schema.org','@graph':[{'@type':'Organization','@id':ORIGIN+'/#organization','name':'THE GLENOLIA','url':ORIGIN,'logo':ORIGIN+'/assets/logos/logo-en-tagline.svg'}, {'@type':'WebSite','@id':ORIGIN+'/#website','name':'THE GLENOLIA','url':ORIGIN,'inLanguage':['en-AU','zh-Hant','ja']},{'@type':'WebPage','@id':canon,'url':canon,'name':page_title,'description':c['description'],'inLanguage':c['lang'],'isPartOf':{'@id':ORIGIN+'/#website'}}]}
    result=f'''<!doctype html><html lang="{c['lang']}" data-language="{key}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{e(page_title)}</title><meta name="description" content="{e(c['description'])}"><meta name="theme-color" content="#F5F1E8"><meta name="color-scheme" content="light"><link rel="canonical" href="{canon}">{alternates}<meta property="og:type" content="website"><meta property="og:title" content="{e(page_title)}"><meta property="og:description" content="{e(c['description'])}"><meta property="og:url" content="{canon}"><meta property="og:image" content="{ORIGIN}/assets/images/social.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:locale" content="{c['lang'].replace('-', '_')}"><meta name="twitter:card" content="summary_large_image"><link rel="icon" type="image/svg+xml" href="/assets/logos/leaf.svg"><link rel="stylesheet" href="/style.css"><link rel="preload" href="/assets/fonts/{'en' if key=='en' else key}-sans.woff2" as="font" type="font/woff2" crossorigin><script src="/app.js" defer></script><script type="application/ld+json">{json.dumps(schema,ensure_ascii=False)}</script>{'<meta name="robots" content="noindex,follow">' if page in ['confirmed','admin'] else ''}</head><body>{header}<main id="main">{body}</main>{footer(c)}</body></html>'''
    if page in ['home','progress']:
        script='home-world' if page=='home' else 'progress'
        result=result.replace('</head>',f'<link rel="stylesheet" href="/assets/progress/progress.css?v={WORLD_REVISION}"><script type="module" src="/assets/progress/{script}.js?v={WORLD_REVISION}"></script></head>')
    if BASE_PATH:
        result=result.replace('href="/', f'href="{BASE_PATH}/').replace('src="/', f'src="{BASE_PATH}/').replace('data-desktop="/',f'data-desktop="{BASE_PATH}/').replace('data-mobile="/',f'data-mobile="{BASE_PATH}/').replace('srcset="/',f'srcset="{BASE_PATH}/').replace(', /assets/', f', {BASE_PATH}/assets/')
    result=result.replace('content="'+c['lang'].replace('-', '_')+'"', 'content="'+{'en':'en_AU','zh':'zh_TW','ja':'ja_JP'}[key]+'"')
    result=result.replace('content="'+e(c['description'])+'"','content="'+e(description)+'"').replace('"description": '+json.dumps(c['description'],ensure_ascii=False),'"description": '+json.dumps(description,ensure_ascii=False))
    if BASE_PATH and page!='confirmed':
        result=result.replace('</head>','<meta name="robots" content="noindex,follow"></head>')
    result=result.replace('</head>',f'<meta name="site-base" content="{BASE_PATH}"></head>')
    path=DIST/c['prefix']/ROUTES[page]/'index.html';path.parent.mkdir(parents=True,exist_ok=True);path.write_text(result)
    return canon

urls=[]
for key in CONTENT:
    for page in ROUTES:
        canon=build_page(key,page)
        if page not in ['confirmed','admin']: urls.append(canon)
(DIST/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>'+u+'</loc><lastmod>'+CONFIG['updated']+'</lastmod></url>' for u in urls)+'</urlset>')
(DIST/'robots.txt').write_text('User-agent: *\nAllow: /\n'+('' if BASE_PATH else 'Sitemap: '+ORIGIN+'/sitemap.xml\n'))
(DIST/'CNAME').write_text('theglenolia.com.au\n')
(DIST/'.nojekyll').write_text('')
# The 404 page identifies the current language from the requested path.
(DIST/'404.html').write_text('<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page not found | The Glenolia</title><link rel="stylesheet" href="/style.css"></head><body><main class="section prose"><img src="/assets/logos/logo-compact.svg" width="300" height="80" alt="THE GLENOLIA"><h1 id="message">'+e(CONTENT['en']['notFoundTitle'])+'</h1><p id="explanation">'+e(CONTENT['en']['notFoundText'])+'</p><a class="button" id="return" href="/">Home ↗</a></main><script src="/not-found.js" defer></script></body></html>')
(DIST/'not-found.js').write_text('const base='+json.dumps(BASE_PATH)+';const c='+json.dumps({k:{x:v[x] for x in ['lang','prefix','notFoundTitle','notFoundText','home']} for k,v in CONTENT.items()},ensure_ascii=False)+';const path=base&&location.pathname.startsWith(base+"/")?location.pathname.slice(base.length):location.pathname;const l=path.startsWith("/zh-hant/")?c.zh:path.startsWith("/ja/")?c.ja:c.en;document.documentElement.lang=l.lang;document.title=l.notFoundTitle+" | The Glenolia";document.getElementById("message").textContent=l.notFoundTitle;document.getElementById("explanation").textContent=l.notFoundText;document.getElementById("return").textContent=l.home+" ↗";document.getElementById("return").href=base+"/"+l.prefix;')
if BASE_PATH:
    error_page=(DIST/'404.html').read_text().replace('href="/',f'href="{BASE_PATH}/').replace('src="/',f'src="{BASE_PATH}/')
    (DIST/'404.html').write_text(error_page)
error_page=(DIST/'404.html').read_text().replace('logo-compact.svg" width="300" height="80"','logo-compact-web.svg" width="285" height="145"')
(DIST/'404.html').write_text(error_page)
print(f'Built {len(CONTENT)*len(ROUTES)} localized pages in {DIST}')
if BASE_PATH:
    css=(DIST/'style.css').read_text().replace("url('/",f"url('{BASE_PATH}/")
    (DIST/'style.css').write_text(css)
