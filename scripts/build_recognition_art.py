"""Prepare versioned private school care award artwork and Noto letterforms. Run from the Glenolia site checkout."""
import argparse
import base64
import gzip
import io
import json
import zlib
import re
from pathlib import Path

import numpy as np
import pypdfium2 as pdfium
from pypdf import PdfReader
from PIL import Image, ImageOps, ImageFont
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

SITE=Path(__file__).resolve().parents[1]
PROJECT=SITE.parents[3]
ART=SITE/'integrations/education-assets/private/recognition/v1'
FONTS=PROJECT/'Brand Guidebook/Official V1 Draft/assets/fonts'
IDENTITY=PROJECT/'Brand Guidebook/Official V1 Draft/identity/A-v1/logos'
IVORY='#F5F1E8';GREEN='#2F4A3C';SAGE='#D9DFD0';COPPER='#B57B5A';INK='#3B332D'
SERIF='NotoSerifDisplay-Regular';SANS='NotoSans-Regular';BOLD='NotoSans-Bold'
for family in [SERIF,SANS,BOLD]:
 pdfmetrics.registerFont(TTFont(family,str(FONTS/(family+'.ttf'))))
PHOTO=Image.open(PROJECT/'The-Glenolia-Two-Worker-Background.png').convert('RGB')
logo=Image.open(IDENTITY/'logo-primary-tagline-color.png')
reverse=Image.open(IDENTITY/'logo-primary-tagline-reversed.png')

class Page:
 def __init__(self,w,h):
  self.w,self.h=w,h
  self.file=io.BytesIO()
  self.c=canvas.Canvas(self.file,pagesize=(w,h),invariant=1,pageCompression=1)
  self.c.setTitle('The Glenolia | Official School Care Partner')
  self.c.setAuthor('The Glenolia')
  self.rect(0,0,w,h,IVORY)
 def rect(self,x,y,w,h,colour):
  self.c.setFillColor(HexColor(colour));self.c.rect(x,self.h-y-h,w,h,fill=1,stroke=0)
 def line(self,x,y,w,colour=COPPER,thickness=1):self.rect(x,y,w,thickness,colour)
 def txt(self,x,y,text,size,font=SANS,colour=GREEN):
  self.c.setFillColor(HexColor(colour));self.c.setFont(font,size);self.c.drawString(x,self.h-y,text)
 def logo(self,x,y,w,light=False):
  im=reverse if light else logo;h=w*im.height/im.width
  self.c.drawImage(ImageReader(im),x,self.h-y-h,w,h,mask='auto')
 def photo(self,x,y,w,h,center=(.5,.5),scale=2.6):
  im=ImageOps.fit(PHOTO,(int(w*scale),int(h*scale)),method=Image.Resampling.LANCZOS,centering=center)
  b=io.BytesIO();im.save(b,'JPEG',quality=92,subsampling=0);b.seek(0)
  self.c.drawImage(ImageReader(b),x,self.h-y-h,w,h)
 def finish(self):
  self.c.showPage();self.c.save();return self.file.getvalue()

def certificate():
 p=Page(841.8898,595.2756)
 p.rect(0,0,10,p.h,GREEN);p.photo(614,0,228,455,(.52,.46),4)
 p.rect(614,455,228,141,GREEN);p.txt(633,490,'THE SCHOOL PLANT PORTAL',9,BOLD,IVORY)
 p.txt(633,522,'Glenorie',25,SERIF,IVORY);p.txt(633,544,'New South Wales, Australia',9,SANS,IVORY)
 p.logo(43,27,153);p.line(48,119,514,SAGE)
 p.txt(48,154,'SCHOOL PLANT PROGRAMME',10,BOLD)
 p.txt(47,208,'Official School',49,SERIF);p.txt(47,263,'Care Partner',49,SERIF)
 p.txt(49,302,'The Glenolia recognises',14,SANS,INK)
 # This form is replaced by a small incremental PDF update at issuance.
 p.c.beginForm('school-care-name',0,0,514,111);p.c.endForm()
 p.c.saveState();p.c.translate(49,p.h-317-111);p.c.doForm('school-care-name');p.c.restoreState()
 p.txt(49,449,'for educational care of this coffee plant. Its farm journal connects',12,SANS,INK)
 p.txt(49,468,'the class with the people who grow and care for it at Glenorie.',12,SANS,INK)
 p.line(49,502,510)
 p.txt(49,524,'The Glenolia',12,BOLD)
 p.txt(49,542,'1435 Old Northern Road, Glenorie, NSW 2157',9.3,SANS,INK)
 p.txt(49,557,'info@theglenolia.com.au   ·   1300 70 11 55   ·   theglenolia.com.au',9.3,SANS,INK)
 p.txt(49,573,'Instagram  @theglenolia',9,SANS,INK)
 return p

def feed():
 p=Page(540,675);p.logo(20,15,140);p.txt(380,51,'GLENORIE, NSW',10,BOLD)
 p.photo(0,88,540,266,(.49,.49));p.rect(22,332,164,21,GREEN);p.txt(31,347,'SCHOOL PLANT PROGRAMME',9,BOLD,IVORY)
 p.txt(25,408,'Meet our class',38,SERIF);p.txt(25,451,'coffee plant.',38,SERIF)
 p.line(27,473,485,SAGE)
 p.txt(27,500,'OFFICIAL SCHOOL CARE PARTNER',10,BOLD)
 p.rect(0,625,540,50,GREEN);p.txt(27,656,'The Glenolia  ·  School Plant Portal',12,SANS,IVORY)
 return p
def story():
 p=Page(540,960);p.photo(0,0,540,473,(.47,.50));p.rect(22,97,151,65,IVORY);p.logo(34,106,126)
 p.rect(0,460,540,9,COPPER);p.txt(33,511,'A CLASSROOM AT GLENORIE',12,BOLD)
 p.txt(32,567,'A season of',48,SERIF);p.txt(32,621,'noticing.',48,SERIF)
 p.txt(34,655,'Our class follows one coffee plant as it grows.',16,SANS,INK)
 p.line(34,681,470,SAGE);p.txt(34,716,'OFFICIAL SCHOOL CARE PARTNER',12,BOLD)
 p.rect(0,885,540,75,GREEN);p.txt(34,913,'The Glenolia  ·  theglenolia.com.au',13,SANS,IVORY)
 return p
def landscape():
 p=Page(960,540);p.photo(548,0,412,540,(.43,.48));p.rect(539,0,9,540,COPPER);p.logo(31,22,156)
 p.txt(37,145,'FROM THE SCHOOL PLANT PORTAL',12,BOLD)
 p.txt(35,204,'Learning in',52,SERIF);p.txt(35,260,'the orchard.',52,SERIF)
 p.line(38,295,450,SAGE);p.txt(38,327,'OFFICIAL SCHOOL CARE PARTNER',11,BOLD)
 p.rect(0,472,539,68,GREEN);p.txt(38,514,'The Glenolia  ·  Glenorie, New South Wales',15,SANS,IVORY)
 return p

def build_templates():
 ART.mkdir(parents=True,exist_ok=True)
 cert=certificate().finish();(ART/'certificate.pdf').write_bytes(cert)
 reader=PdfReader(io.BytesIO(cert));page=reader.pages[0]
 form=page['/Resources']['/XObject'].raw_get('/FormXob.school-care-name').idnum
 trailer=reader.trailer
 info={'form':form,'size':int(trailer['/Size']),'info':trailer.raw_get('/Info').idnum,'root':trailer.raw_get('/Root').idnum,
       'xref':int(re.search(rb'startxref\s+(\d+)\s+%%EOF\s*$',cert).group(1)),
       'documentId':trailer['/ID'][0].original_bytes.hex()}
 (ART/'certificate.json').write_text(json.dumps(info))
 for k,f in [('feed',feed),('story',story),('landscape',landscape)]:
  pdf=pdfium.PdfDocument(f().finish())
  im=pdf[0].render(scale=2).to_pil().convert('RGB')
  # 224 photographic shades plus a reserved 32-step antialias ramp for personalised ink.
  pal=im.quantize(colors=224,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.FLOYDSTEINBERG)
  base=list(pal.getpalette()[:224*3]);base.extend([0]*(224*3-len(base)))
  ivory=[245,241,232];green=[47,74,60]
  for n in range(32):base.extend(round(ivory[i]+(green[i]-ivory[i])*n/31) for i in range(3))
  # Protect the exact paper colour from photographic colour quantisation.
  idx=np.asarray(pal).copy();idx[np.all(np.asarray(im)==ivory,axis=2)]=224
  top,band={'feed':(1023,185),'story':(1482,228),'landscape':(690,223)}[k]
  rows=np.zeros((idx.shape[0],idx.shape[1]+1),dtype=np.uint8);rows[:,1:]=idx
  pre,mid,end=rows[:top].tobytes(),rows[top:top+band].tobytes(),rows[top+band:].tobytes()
  def packed(data,final):
   c=zlib.compressobj(8,zlib.DEFLATED,-15)
   return c.compress(data)+c.flush(zlib.Z_FINISH if final else zlib.Z_SYNC_FLUSH)
  def adler(data):
   a=zlib.adler32(data);return [a&65535,a>>16]
  (ART/(k+'.json')).write_text(json.dumps({'top':adler(pre),'bottom':adler(end),'bottomLength':len(end),'palette':base},separators=(',',':')))
  (ART/(k+'.top')).write_bytes(packed(pre,False));(ART/(k+'.bottom')).write_bytes(packed(end,True))
  (ART/(k+'.mid.gz')).write_bytes(gzip.compress(mid,compresslevel=6,mtime=0))
  pdf.close()

def build_glyphs():
 # Mask contours are prepared from the project's licensed Noto masters, once per edition.
 # Each request reads only the Unicode blocks needed for the issued school name.
 (ART/'glyphs').mkdir(exist_ok=True)
 paths=[FONTS/(SERIF+'.ttf'), FONTS/'NotoSansTC-Regular.ttf']
 faces=[ImageFont.truetype(str(f),72) for f in paths]
 maps=[TTFont('care-face-'+str(i),str(f)).face.charToGlyph for i,f in enumerate(paths)]
 entries={}
 for cp in sorted(set(maps[0])|set(maps[1])):
  if cp<32 or 0xd800<=cp<=0xdfff:continue
  char=chr(cp);face=faces[0] if cp in maps[0] else faces[1]
  mask,offset=face.getmask2(char,mode='L',anchor='ls');w,h=mask.size
  g=[round(face.getlength(char),2),offset[0],offset[1],w,h,base64.b64encode(bytes(mask)).decode('ascii')]
  entries.setdefault(cp>>8,{})[str(cp)]=g
 for block,data in entries.items():
  (ART/'glyphs'/(str(block)+'.json.gz')).write_bytes(gzip.compress(json.dumps(data,separators=(',',':')).encode(),compresslevel=6,mtime=0))
 (ART/'glyph-blocks.json').write_text(json.dumps(sorted(entries)))
 (ART/'OFL.txt').write_bytes((FONTS/'Noto-SIL-Open-Font-License.txt').read_bytes())
 (ART/'OFL-TC.txt').write_bytes((FONTS/'NotoSansTC-OFL.txt').read_bytes())

if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--templates-only',action='store_true');args=parser.parse_args()
 build_templates()
 if not args.templates_only:build_glyphs()
 print(ART)
