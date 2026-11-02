"""English education entry points. Never pass restricted pack text to public pages."""
from html import escape
import re

APP_URL = 'https://glenolia-education.theglenolia.workers.dev'
ORIGIN = 'https://theglenolia.com.au'
STAGES = {'ES1':'Kindergarten', 'S1':'Years 1–2', 'S2':'Years 3–4', 'S3':'Years 5–6', 'S4':'Years 7–8', 'S5':'Years 9–10', 'S6':'Year 11 extension'}
THEMES = [('Observe','Notice a growing place.','observe'),('Investigate','Ask a question. Try a careful method.','measure'),('Connect','Follow the links between land and people.','community'),('Reflect','Share what the evidence can tell us.','reflect')]

def e(value):
    return escape(str(value), quote=True)

def _art(name, alt='', eager=False):
    return f'<img src="/assets/education/{e(name)}.webp" alt="{e(alt)}" width="1200" height="800" decoding="async" loading="{"eager" if eager else "lazy"}" {"fetchpriority=high" if eager else ""}>'

def _link(href, label, secondary=False):
    return f'<a class="edu-button{" edu-button-secondary" if secondary else ""}" href="{e(href)}">{e(label)}<span aria-hidden="true">↗</span></a>'

def landing(resources=None, app_url=APP_URL):
    """Body fragment for the public site's English shell; summaries only."""
    resources = resources or []
    if isinstance(resources, dict):
        resources = resources.get('resources', [])
    samples = [r for r in resources if r.get('availability') == 'public' or r.get('publicSample') is True][:2]
    sample_cards = ''
    for r in samples:
        rid=str(r.get('id',''))
        if not re.fullmatch(r'[A-Za-z0-9_-]{1,100}',rid):
            raise ValueError('Invalid public sample ID')
        stage=r.get('stage','')
        sample_cards += f'<article class="edu-sample-card"><p class="edu-kicker">{e(STAGES.get(stage,stage))} · Free sample</p><h3>{e(r.get("title","Learning sample"))}</h3><p>{e(r.get("summary",r.get("description","")))}</p>{_link(app_url+"/#resource/"+rid,"Explore this sample",True)}</article>'
    if not sample_cards:
        sample_cards=f'<div class="edu-sample-card"><h3>A useful place to begin.</h3><p>Explore the current library, preview a sample and choose the right stage for your class.</p>{_link(app_url+"/#library","Explore the library",True)}</div>'
    themes=''.join(f'<article class="edu-theme-card"><div class="edu-theme-image">{_art(image)}</div><div><p class="edu-kicker">0{i+1} · {title}</p><h3>{body}</h3></div></article>' for i,(title,body,image) in enumerate(THEMES))
    stages=''.join(f'<a href="{e(app_url)}/#library?stage={key}"><strong>{"Early Stage 1" if key=="ES1" else ("Senior extension" if key=="S6" else "Stage "+key[1:])}</strong><span>{e(label)}</span><span aria-hidden="true">↗</span></a>' for key,label in STAGES.items())
    return f'''<div class="edu-public">
<section class="edu-public-hero"><div><p class="edu-kicker">FOR TEACHERS · A PLACE TO GROW AND GATHER</p><h1>Little questions.<br>A growing world.</h1><p class="edu-lead">Bring a growing farm into your classroom. Free, teacher-led activities connect plants, places and people with a year of discovery.</p><div class="edu-actions">{_link(app_url+'/#library','Explore the learning library')}{_link('#teacher-samples','Try a sample',True)}</div><p class="edu-small">Kindergarten to Year 10 + optional Year 11 projects · Print-first learning · No student accounts</p></div><figure class="edu-welcome-art">{_art('welcome','Pip, Milla and Dot welcome curious learners with plants and a field notebook.',True)}<figcaption>Pip, Milla &amp; Dot · A little company for big questions.</figcaption></figure></section>
<section class="edu-promise-strip"><div><strong>Start in the classroom.</strong><p>No visit or purchase is needed to use the learning resources.</p></div><div><strong>Make it your lesson.</strong><p>Choose a stage, adapt the activity and keep judgement with the teacher.</p></div><div><strong>Return as the story grows.</strong><p>Dated farm updates offer questions to revisit, with evidence and limits made clear.</p></div></section>
<section class="edu-public-section"><div class="edu-section-heading"><div><p class="edu-kicker">A YEAR OF CURIOSITY</p><h2>Notice. Try. Connect. Reflect.</h2></div><p>Short sequences build from careful observation to thoughtful explanations. Classroom, school-ground and print alternatives keep the learning practical.</p></div><div class="edu-theme-grid">{themes}</div></section>
<section class="edu-public-section edu-stage-section"><div><p class="edu-kicker">FIND YOUR STARTING POINT</p><h2>Made for different stages.</h2><p>Resources identify their syllabus edition, learning focus and evidence task. Check the fit with your school’s programme before teaching.</p></div><div class="edu-stage-grid">{stages}</div></section>
<section class="edu-public-section" id="teacher-samples"><div class="edu-section-heading"><div><p class="edu-kicker">A SMALL START, ON US</p><h2>Try a learning sample.</h2></div><p>Open a sample first. A free verified adult account adds saved resources, private planning notes and group collections.</p></div><div class="edu-sample-grid">{sample_cards}</div></section>
<section class="edu-public-section edu-teacher-invite"><div><p class="edu-kicker">YOUR TEACHING WORKSPACE</p><h2>Less searching.<br>More useful learning.</h2><p>Keep favourites, prepare a group and assign a particular edition. School learner observations stay off until the school’s processing agreement is approved.</p><div class="edu-actions">{_link(app_url+'/#signin','Create your free teacher account')}{_link(app_url+'/#visit','Discuss a future visit',True)}</div></div><div class="edu-note-panel"><p class="edu-kicker">A FARM IN PREPARATION</p><h3>Come for the question.<br>Follow what happens next.</h3><p>School visits are in preparation. An expression of interest starts a conversation; it is not a booking or an opening-date commitment.</p><p class="edu-small">The Glenolia · Glenorie, NSW<br>Target opening: September 2027</p></div></section>
<p class="edu-public-footnote">Original English teaching resources support selected NSW syllabus contexts. They are not NESA-endorsed courses or a replacement for school assessment. Teachers choose the activities, adjustments and evidence that are right for their learners.</p></div>'''

def public_resource_page(resource, app_url=APP_URL):
    """Public sample overview; complete teaching text stays in the portal gateway."""
    if not (resource.get('availability') == 'public' or resource.get('publicSample') is True):
        raise ValueError('Restricted teaching resources cannot be rendered into public pages')
    rid=str(resource.get('id',''))
    if not re.fullmatch(r'[a-z0-9][a-z0-9-]{1,79}',rid):
        raise ValueError('Invalid public sample ID')
    return f'<div class="edu-public"><section class="edu-public-section"><p class="edu-kicker">FREE TEACHING SAMPLE</p><h1>{e(resource.get("title","Learning sample"))}</h1><p class="edu-lead">{e(resource.get("summary",resource.get("description","")))}</p><p>{e(STAGES.get(resource.get("stage"),resource.get("stage","")))} · English · Teacher-led learning</p><div class="edu-actions">{_link(app_url+"/#resource/"+rid,"Open the complete sample")}{_link(app_url+"/#library","Browse the library",True)}</div><p class="edu-small">Read the teacher guidance and check the syllabus edition before using this resource. School visits are in preparation; no visit is required for the classroom activity.</p></section></div>'

def portal_html(mode='teacher', api_base='/api', asset_base='/teachers', illustration_base=ORIGIN+'/assets/education'):
    """Portable shell for the education Worker and protected owner-admin proxy."""
    if mode not in ('teacher','staff') or not api_base.startswith('/') or '..' in api_base:
        raise ValueError('Invalid education application configuration')
    asset_base=asset_base.rstrip('/')
    teacher_nav=[('library','Library'),('groups','My groups'),('reports','Reports'),('visit','Plan a visit')]
    staff_nav=[('staff-schools','Schools'),('staff-teachers','Teachers'),('staff-resources','Content'),('staff-enquiries','Visit enquiries')]
    nav=''.join(f'<a href="#{key}" data-edu-route="{key}">{label}</a>' for key,label in (staff_nav if mode=='staff' else teacher_nav))
    title='Education staff workspace' if mode=='staff' else 'Learning with The Glenolia'
    return f'''<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="color-scheme" content="light"><title>{title} | The Glenolia</title><link rel="stylesheet" href="{e(asset_base)}/teacher-ui.css"><script type="module" src="{e(asset_base)}/teacher-ui.js"></script></head><body class="edu-body"><div class="edu-app" data-education-app data-mode="{mode}" data-api-base="{e(api_base)}" data-illustration-base="{e(illustration_base.rstrip('/'))}"><a class="edu-skip" href="#edu-main">Skip to learning workspace</a><header class="edu-app-header"><a class="edu-brand" href="{ORIGIN}/teachers/" aria-label="The Glenolia — For Teachers"><img src="{ORIGIN}/assets/logos/logo-compact-web.svg" alt="THE GLENOLIA" width="660" height="335"></a><div class="edu-brand-label">{'EDUCATION STAFF' if mode=='staff' else 'LEARNING TOGETHER'}</div><nav class="edu-app-nav" aria-label="{'Staff tools' if mode=='staff' else 'Teacher workspace'}">{nav}</nav><div class="edu-account-tools"><button class="edu-guide-toggle" type="button" data-guide-toggle aria-pressed="true">Hide character prompts</button><a class="edu-account-link" href="#profile" data-account-link>{'Checking access…' if mode=='staff' else 'Teacher sign in'}</a></div></header><div class="edu-context-bar" data-workspace-context hidden></div><div class="edu-live-status" data-global-status role="status" aria-live="polite"></div><main class="edu-app-main" id="edu-main" tabindex="-1"><div class="edu-loading" role="status"><span class="edu-loading-leaf" aria-hidden="true"></span><p>Opening your learning library…</p></div><noscript><p>This workspace needs JavaScript for sign-in and private planning. <a href="{ORIGIN}/teachers/">Return to For Teachers</a> or email <a href="mailto:info@theglenolia.com.au">info@theglenolia.com.au</a>.</p></noscript></main><footer class="edu-app-footer"><p>THE GLENOLIA · A place to grow and gather.</p><nav aria-label="Help and privacy"><a href="mailto:info@theglenolia.com.au">Get in touch</a><a href="{ORIGIN}/privacy/">Privacy</a><a href="{ORIGIN}/teachers/">For Teachers</a></nav><p class="edu-small">Teacher-managed learning. No student accounts. School visits are in preparation.</p></footer><dialog class="edu-dialog" data-edu-dialog aria-labelledby="edu-dialog-title"><button type="button" class="edu-dialog-close" data-dialog-close aria-label="Close dialog"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button><div data-dialog-body></div></dialog></div></body></html>'''
