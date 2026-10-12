from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json, os, sys
from xml.etree import ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
DIST=ROOT/'dist'
BASE=os.environ.get('SITE_BASE_PATH','').rstrip('/')
config=json.loads((ROOT/'config.json').read_text())
content=json.loads((ROOT/'content.json').read_text())
errors=[]; checked=0
class Page(HTMLParser):
 def __init__(self): super().__init__();self.tags=[];self.links=[];self.ids=[];self.lang=None;self.h1=0
 def handle_starttag(self,tag,attrs):
  d=dict(attrs);self.tags.append((tag,d))
  if tag=='html':self.lang=d.get('lang')
  if tag=='h1':self.h1+=1
  if 'id' in d:self.ids.append(d['id'])
  for field in ['href','src','data-desktop','data-mobile']:
   if d.get(field): self.links.append(d[field])
  if tag=='img' and 'alt' not in d:errors.append('image lacks alt')
for path in DIST.rglob('*.html'):
 p=Page();p.feed(path.read_text());checked+=1;rel=str(path.relative_to(DIST))
 if len(p.ids)!=len(set(p.ids)):errors.append(rel+': duplicate ids')
 if p.h1!=1:errors.append(rel+': h1 count must be one')
 if p.lang not in ['en','en-AU','zh-Hant','ja']:errors.append(rel+': missing language')
 for link in p.links:
  parts=urlsplit(link)
  if parts.scheme or parts.netloc:continue
  route=unquote(parts.path)
  if BASE and route.startswith(BASE+'/'):route=route[len(BASE):]
  target=(DIST/route.lstrip('/') if route.startswith('/') else path.parent/route) if route else path
  if target.is_dir():target=target/'index.html'
  if not target.exists():errors.append(rel+': missing '+link)
  elif parts.fragment and target.suffix=='.html':
   linked=Page();linked.feed(target.read_text())
   if unquote(parts.fragment) not in linked.ids:errors.append(rel+': missing fragment '+link)
 if path.name=='404.html':continue
 metas=[d for t,d in p.tags if t=='meta']
 if any(x in rel.split('/') for x in ['admin','confirmed']) and not any(d.get('name')=='robots' and 'noindex' in d.get('content','') for d in metas):errors.append(rel+': private/confirmation route must be noindex')
 if not any(d.get('name')=='description' and len(d.get('content',''))>(30 if p.lang.startswith('en') else 15) for d in metas):errors.append(rel+': missing description')
 if not any(t=='link' and d.get('rel')=='canonical' for t,d in p.tags):errors.append(rel+': missing canonical')
 alts=[d.get('hreflang') for t,d in p.tags if t=='link' and d.get('rel')=='alternate']
 if set(alts)!={'en-AU','zh-Hant','ja','x-default'}:errors.append(rel+': incomplete language alternatives')
 for t,d in p.tags:
  if t=='video' and ('controls' in d or 'muted' not in d or 'playsinline' not in d):errors.append(rel+': background video configuration')
 if 'register/' in rel:
  if not config['newsletterReady'] and not any(t=='fieldset' and 'disabled' in d for t,d in p.tags):errors.append(rel+': registration must remain disabled before connection')
sitemap=ET.parse(DIST/'sitemap.xml')
for loc in sitemap.findall('.//{*}loc'):
 if any(x in loc.text.split('/') for x in ['admin','confirmed']):errors.append('Admin/confirmation route included in sitemap')
for path in DIST.rglob('*'):
 if path.is_file() and path.suffix in ['.js','.json','.html','.css'] and any(x in path.read_text() for x in ['xkeysib-', 'BREVO_API_KEY', 'client_secret', 'BEGIN PRIVATE KEY']):errors.append(str(path)+': private credential marker')
for lang,c in content.items():
 if set(c)!=set(content['en']):errors.append(lang+': translation keys do not match')
 if len(c['milestones'])!=4 or len(c['directions'])!=4 or len(c['faqs'])!=5:errors.append(lang+': incomplete content')
if config['newsletterReady'] and (not config['newsletterEndpoint'].startswith('https://') or not config['contactEmail']):errors.append('Registration needs a real secure endpoint and verified contact email')
result={'pages':checked,'errors':errors,'newsletterConnected':config['newsletterReady'],'instagramHandle':config['instagramHandle'],'staticBytes':sum(p.stat().st_size for p in DIST.rglob('*') if p.is_file()),'result':'pass' if not errors else 'fail'}
print(json.dumps(result,indent=2));sys.exit(bool(errors))
