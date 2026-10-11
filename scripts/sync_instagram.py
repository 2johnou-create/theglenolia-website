"""Cache the owner's authorised Instagram media; never expose an access token."""
from pathlib import Path
from urllib.request import Request, urlopen, build_opener, HTTPRedirectHandler
from urllib.parse import urlencode, urlsplit
from datetime import datetime, timezone
from io import BytesIO
import json, os, re, sys
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
CONFIG = json.loads((ROOT/'config.json').read_text())
Image.MAX_IMAGE_PIXELS = 36_000_000

def safe_cdn(url):
    p = urlsplit(url)
    return p.scheme=='https' and p.port in (None,443) and not p.username and not p.password and any((p.hostname or '').endswith('.'+d) for d in ['cdninstagram.com','fbcdn.net'])

class CDNRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if not safe_cdn(newurl): raise ValueError('Unexpected media host')
        return super().redirect_request(req, fp, code, msg, headers, newurl)

class NoAPIRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise ValueError('API redirect refused to protect authorisation')

def read(url, token=None):
    if token:
        if urlsplit(url).hostname!='graph.instagram.com': raise ValueError('Unexpected API host')
        response=build_opener(NoAPIRedirect()).open(Request(url,headers={'Authorization':'Bearer '+token}),timeout=20)
        maximum=1_000_000
    else:
        if not safe_cdn(url): raise ValueError('Unexpected media host')
        response=build_opener(CDNRedirect()).open(Request(url,headers={'User-Agent':'The-Glenolia-media-cache'}),timeout=20)
        maximum=12_000_000
    with response:
        data=response.read(maximum+1)
        if len(data)>maximum: raise ValueError('Response exceeds asset limit')
        return data

def sync():
    token=os.environ.get('INSTAGRAM_ACCESS_TOKEN','')
    user=os.environ.get('INSTAGRAM_USER_ID','')
    version=os.environ.get('INSTAGRAM_API_VERSION','')
    if not token or not re.fullmatch(r'\d+',user) or not re.fullmatch(r'v\d+\.\d+',version):
        raise ValueError('Set the authorised account ID, access token and supported API version')
    base=f'https://graph.instagram.com/{version}/{user}'
    owner=json.loads(read(base+'?fields=id,username',token))
    if owner.get('username','').lower()!=CONFIG['instagramHandle'].lower():
        raise ValueError('The authorised account does not match the official handle')
    fields='id,caption,media_type,media_url,thumbnail_url,permalink,timestamp'
    media=json.loads(read(base+'/media?'+urlencode({'fields':fields,'limit':6}),token))
    if not isinstance(media.get('data'),list): raise ValueError('Invalid media response')
    cache=PUBLIC/'assets/instagram';cache.mkdir(parents=True,exist_ok=True)
    existing=json.loads((PUBLIC/'instagram.json').read_text())
    old={p['id']:p for p in existing.get('posts',[]) if 'id' in p}
    posts=[]
    for item in media['data'][:6]:
        ident=str(item.get('id',''));link=urlsplit(item.get('permalink',''))
        if not re.fullmatch(r'\d+',ident) or link.scheme!='https' or link.hostname not in ['www.instagram.com','instagram.com']: continue
        stamp=item.get('timestamp','');datetime.fromisoformat(stamp.replace('Z','+00:00'))
        source=item.get('thumbnail_url') if item.get('media_type')=='VIDEO' else item.get('media_url')
        if not source or not safe_cdn(source): continue
        # Resize real post images rather than loading Instagram scripts on every visit.
        im=Image.open(BytesIO(read(source))).convert('RGB');im=ImageOps.exif_transpose(im);im.thumbnail((1000,1000))
        target=cache/(ident+'.webp');buffer=BytesIO();im.save(buffer,format='WEBP',quality=82,method=6)
        target.write_bytes(buffer.getvalue())
        post={'id':ident,'permalink':item['permalink'],'timestamp':stamp,'image':'/assets/instagram/'+target.name,'caption':str(item.get('caption',''))[:2200],'alt':''}
        # Preserve human-reviewed alt text and caption translations when a source caption is unchanged.
        previous=old.get(ident,{})
        if previous.get('caption')==post['caption']:
            for key in ['alt','captions']:
                if key in previous: post[key]=previous[key]
        posts.append(post)
    if posts!=existing.get('posts',[]):
        document={'updated':datetime.now(timezone.utc).isoformat(),'posts':posts}
        temporary=PUBLIC/'instagram.json.tmp';temporary.write_text(json.dumps(document,ensure_ascii=False,indent=2)+'\n');temporary.replace(PUBLIC/'instagram.json')
    keep={Path(p['image']).name for p in posts}
    for file in cache.glob('*.webp'):
        if file.name not in keep: file.unlink()
    print(f'Cached {len(posts)} authorised posts from @{CONFIG["instagramHandle"]}')

if __name__=='__main__':
    try: sync()
    except Exception:
        # No exception body: provider errors may contain token-bearing URLs.
        print('Instagram import failed. Existing feed retained; check account authorisation and API version.',file=sys.stderr)
        sys.exit(1)
