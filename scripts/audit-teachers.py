"""Audit English teacher introductions and the static/private publishing boundary.

Run after build.py. The education Worker serves full packs and authorised PDFs;
GitHub Pages receives only public summaries, illustrations and interface assets.
"""
from pathlib import Path
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlsplit
from xml.etree import ElementTree as ET
import argparse
import json
import os
import re
import sys

ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--dist',type=Path,default=ROOT/'dist')
parser.add_argument('--base-path',default=os.environ.get('SITE_BASE_PATH',''))
args=parser.parse_args()
DIST=args.dist.resolve();BASE=args.base_path.rstrip('/')
ORIGIN=json.loads((ROOT/'config.json').read_text())['canonicalOrigin'].rstrip('/')
PORTAL='https://glenolia-education.theglenolia.workers.dev'
catalogue=json.loads((ROOT/'education-catalogue.json').read_text())
samples=[r for r in catalogue['resources'] if r.get('availability')=='public']
errors=[];checks=0


def check(ok,message):
    global checks
    checks+=1
    if not ok:errors.append(message)


class Document(HTMLParser):
    def __init__(self,html):
        super().__init__(convert_charrefs=True)
        self.tags=[];self.text=[]
        self.feed(html)
    def handle_starttag(self,tag,attrs):self.tags.append((tag,dict(attrs)))
    def handle_data(self,text):self.text.append(text)


def read(path,label):
    check(path.is_file(),label+': missing HTML')
    html=path.read_text() if path.is_file() else ''
    return html,Document(html)


allowed={'id','title','stage','years','term','question','summary','image','availability','kind','version','publicSample'}
check(catalogue.get('language')=='en','Catalogue must be English')
check(len(samples)==2,'Exactly two public learning samples are expected')
check(len({r.get('id') for r in catalogue['resources']})==len(catalogue['resources']),'Catalogue IDs must be unique')
for r in catalogue['resources']:
    check(set(r)<=allowed,r.get('id','?')+': restricted catalogue fields')
    check(bool(re.fullmatch(r'[a-z0-9-]{1,100}',str(r.get('id','')))),r.get('id','?')+': unsafe resource ID')

routes=['/teachers/']+['/teachers/samples/'+r['id']+'/' for r in samples]
expected_files={route.lstrip('/')+'index.html' for route in routes}
actual_files={str(p.relative_to(DIST)) for p in (DIST/'teachers').rglob('*.html')}
check(actual_files==expected_files,'Static education HTML must contain only the introduction and two sample summaries')
for prefix in ['zh-hant','ja']:
    check(not (DIST/prefix/'teachers').exists(),'English education must not invent '+prefix+' translations')

pages={}
for route in routes:
    label=route;html,doc=read(DIST/route.lstrip('/')/'index.html',label);pages[route]=(html,doc)
    tags=doc.tags
    check([a.get('lang') for t,a in tags if t=='html']==['en-AU'],label+': wrong language')
    check(sum(t=='h1' for t,_ in tags)==1,label+': expected one h1')
    canonical=[a.get('href') for t,a in tags if t=='link' and a.get('rel')=='canonical']
    check(canonical==[ORIGIN+route],label+': wrong canonical')
    alternatives={a.get('hreflang'):a.get('href') for t,a in tags if t=='link' and a.get('rel')=='alternate'}
    check(alternatives=={'en-AU':ORIGIN+route,'x-default':ORIGIN+route},label+': English-only alternatives must be self-references')
    check(any(t=='link' and a.get('href')==BASE+'/teachers/teacher-ui.css' for t,a in tags),label+': missing shared teacher styles')
    check(not any(t=='script' and ('teacher-ui.js' in a.get('src','') or a.get('type')=='module') for t,a in tags),label+': public introduction must not boot the authenticated portal')
    check(not any(t in ['canvas','iframe','video','form'] for t,_ in tags),label+': public learning introduction must remain lightweight')
    check(not any(t=='a' and urlsplit(a.get('href','')).path.lower().endswith('.pdf') for t,a in tags),label+': complete sample downloads belong in the education service')
    check(any(t=='a' and a.get('href','').startswith(PORTAL+'/#') for t,a in tags),label+': missing education-service entry')
    for r in catalogue['resources']:
        if r.get('availability')!='public':
            check(escape(r['summary'],quote=True) not in html,label+': restricted summary unexpectedly rendered as a public sample: '+r['id'])

landing,landing_doc=pages['/teachers/']
check('No student accounts' in landing,'Introduction must explain no student accounts')
check('September 2027' in landing and 'Target opening' in landing,'Opening date must stay a target')
for r in samples:
    route='/teachers/samples/'+r['id']+'/'
    check(any(t=='a' and a.get('href')==BASE+route for t,a in landing_doc.tags),'Introduction must link the public sample summary: '+r['id'])
    html,doc=pages[route]
    check(escape(r['summary'],quote=True) in html,route+': summary differs from catalogue')
    check(any(t=='a' and a.get('href')==PORTAL+'/#resource/'+r['id'] for t,a in doc.tags),route+': complete sample must open the education-service resource')

home,home_doc=read(DIST/'index.html','English home')
check('teacher-callout-title' in home and 'Explore learning with The Glenolia' in home,'English home needs a compact learning callout')
check('/assets/images/magnolia.webp' in home,'Existing magnolia hero must remain')
check('home-world-canvas' not in home,'Do not add the programme 3D world to the landing page')
check(any(t=='a' and a.get('href')==BASE+'/teachers/' for t,a in home_doc.tags),'English navigation must link For teachers')
for route in ['zh-hant/','ja/']:
    html,_=read(DIST/route/'index.html',route+'home')
    check('teacher-callout-title' not in html,route+': English-only learning callout must not pretend to be translated')

privacy,privacy_doc=read(DIST/'privacy/index.html','English privacy')
privacy_text=' '.join(privacy_doc.text)
for phrase in ['Teacher accounts and learning records','Cloudflare Workers','Cloudflare D1','Brevo','eight hours','30 minutes','90 days','processing agreement','pseudonyms, not anonymous','no student accounts or student file uploads','one year']:
    check(phrase.lower() in privacy_text.lower(),'Education privacy detail missing: '+phrase)
check('does not subscribe' in privacy_text,'Teacher account must not imply marketing enrolment')

sitemap=ET.parse(DIST/'sitemap.xml')
locations=[node.text for node in sitemap.findall('.//{*}loc')]
for route in routes:check(locations.count(ORIGIN+route)==1,'English education canonical missing/duplicated in sitemap: '+route)
check(not any('/zh-hant/teachers/' in u or '/ja/teachers/' in u for u in locations),'Sitemap must not invent translated education routes')

# Full teaching content is provisioned directly to the education service. These
# structured keys are never needed by the brochure/mobile editorial JSON APIs.
private_keys={'lessons','studentSheets','seniorOutlines','teacherMisconceptions','answerGuidance','learnerId','learner_id','sessionHash','school_id','email_hash'}
def inspect_json(value,path):
    if isinstance(value,dict):
        for key,item in value.items():
            check(key not in private_keys,str(path.relative_to(DIST))+': restricted structured field '+key)
            inspect_json(item,path)
    elif isinstance(value,list):
        for item in value:inspect_json(item,path)
for path in DIST.rglob('*.json'):
    try:inspect_json(json.loads(path.read_text()),path)
    except (UnicodeDecodeError,json.JSONDecodeError):check(False,str(path)+': invalid public JSON')
for path in DIST.rglob('*'):
    if path.is_file():
        check(path.name not in ['primary.json','secondary.json','education-seed.sql','education-content.sql'],'Private education source entered public dist: '+str(path.relative_to(DIST)))
        if 'teachers' in path.relative_to(DIST).parts:
            check(path.suffix.lower()!='.pdf','Education PDFs must be served through resource permissions')

print(json.dumps({'result':'pass' if not errors else 'fail','checks':checks,'educationPages':len(routes),'errors':errors},indent=2))
sys.exit(bool(errors))
