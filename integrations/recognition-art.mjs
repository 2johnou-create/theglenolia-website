import {makeCertificate} from './recognition-certificate.mjs';
import {indexedPng} from './recognition-png.mjs';

const resolution=72;
const layout={
 'feed.png':{w:1080,h:1350,x:54,top:1023,band:185,width:968,font:62,maxLines:2},
 'story.png':{w:1080,h:1920,x:68,top:1482,band:228,width:940,font:67,maxLines:2},
 'landscape.png':{w:1920,h:1080,x:76,top:690,band:223,width:906,font:68,maxLines:2},
 'certificate.pdf':{w:1542,h:333,x:0,top:0,band:333,width:1542,font:107,maxLines:2}
};
const base='https://recognition.internal/private/recognition/v1/';
const decoder=new TextDecoder();
async function asset(env,path){
 const result=await env.ASSETS.fetch(new Request(base+path));
 if(!result.ok)throw Error('Recognition artwork unavailable');
 return new Uint8Array(await result.arrayBuffer());
}
async function expand(bytes){
 // Some static asset transports return content that has already been decoded.
 if(bytes[0]!==0x1f || bytes[1]!==0x8b)return bytes;
 return new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
}
function encoded(text){return new TextEncoder().encode(text);}
const binary=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function letters(env,text){
 const blocks=JSON.parse(decoder.decode(await asset(env,'glyph-blocks.json')));
 const wanted=new Set(Array.from(text,c=>c.codePointAt(0)>>8));
 const entries=await Promise.all([...wanted].filter(k=>blocks.includes(k)).map(async k=>JSON.parse(decoder.decode(await expand(await asset(env,'glyphs/'+k+'.json.gz'))))));
 const glyphs=new Map(),needed=new Set(Array.from(text,c=>c.codePointAt(0)));
 for(const group of entries)for(const cp of needed){
  const g=group[cp];if(g)glyphs.set(cp,[g[0],g[1],g[2],g[3],g[4],binary(g[5])]);
 }
 const missing=Array.from(text).some(c=>!glyphs.has(c.codePointAt(0)));
 let fallback;
 if(missing){const group=JSON.parse(decoder.decode(await expand(await asset(env,'glyphs/255.json.gz'))));const g=group[65533];if(g)fallback=[...g.slice(0,5),binary(g[5])];}
 return ch=>glyphs.get(ch.codePointAt(0))||fallback;
}
function wrapped(name,get,size,width){
 const charWidth=c=>(get(c)?.[0]||44)*size/resolution;
 const lines=[];let current='',used=0;
 for(const word of name.split(/\s+/u)){
  const ww=Array.from(word).reduce((w,c)=>w+charWidth(c),0);
  if(current && used+charWidth(' ')+ww>width){lines.push(current);current='';used=0;}
  if(current){current+=' ';used+=charWidth(' ');}
  for(const c of word){
   const advance=charWidth(c);
   if(current&&used+advance>width){lines.push(current);current='';used=0;}
   current+=c;used+=advance;
  }
 }
 if(current)lines.push(current);
 return lines;
}
function writeLine(buf,rowWidth,top,x,baseline,fontPx,text,get) {
 const scale=fontPx/resolution;
 for(const ch of text){
  const glyph=get(ch);if(!glyph)continue;
  const [adv,left,dy,w,h,mask]=glyph;
  const px=Math.round(x+left*scale),py=Math.round(baseline+dy*scale)-top;
  for(let y=0;y<Math.round(h*scale);y++){
   const sy=Math.min(h-1,Math.floor(y/scale));
   const destination=(py+y)*(rowWidth+1)+1+px;
   if(py+y<0||destination>=buf.length)continue;
   for(let dx=0;dx<Math.round(w*scale);dx++){
    if(px+dx<0||px+dx>=rowWidth)continue;
    const alpha=mask[sy*w+Math.min(w-1,Math.floor(dx/scale))];
    if(alpha)buf[destination+dx]=224+Math.round(alpha*31/255);
   }
  }
  x+=adv*scale;
 }
}
function renderLines(buf,box,school,detail,get){
 const subSize=box.w===1542?48:30;
 let size=box.font,lines=wrapped(school,get,size,box.width-5);
 while(size>13 && Math.ceil(lines.length*size*1.18+subSize+20)>box.band){
  size--;lines=wrapped(school,get,size,box.width-5);
 }
 let y=box.top+size*.89;
 for(const line of lines){
  writeLine(buf,box.w,box.top,box.x,y,size,line,get);
  y+=size*1.18;
 }
 const subY=Math.min(box.top+box.band-9,y-size*.94+subSize+13);
 writeLine(buf,box.w,box.top,box.x,subY,subSize,detail,get);
}
export async function renderRecognition(env,award,file){
 if(award.edition!==1)throw Error('Unknown certificate edition');
 const date=new Intl.DateTimeFormat('en-AU',{timeZone:'Australia/Sydney',year:'numeric',month:'long',day:'numeric'}).format(new Date(award.acceptedAt));
 const school=award.schoolName.normalize('NFC'),detail=award.plantLabel+'   ·   '+date+(award.sample?'   ·   SAMPLE':'');
 if(file==='captions.txt')return encoded([
  school+' | The Glenolia School Plant Portal'+(award.sample?' | Fictional school example':''),
  '',
  'School announcement','Our class at '+school+' is the official school care partner for coffee plant '+award.plantLabel+' at The Glenolia in Glenorie. We are following the farmer’s observations and learning how a coffee plant grows.',
  '',
  'Story caption','One class. One coffee plant. Follow our learning with '+award.plantLabel+' at @theglenolia.',
  '',
  'Newsletter caption',school+' began its educational care partnership for '+award.plantLabel+' on '+date+'. Our class will observe changes together through The Glenolia’s plant journal.',
  '',
  'Suggested alt text','School care partnership graphic for '+school+' and coffee plant '+award.plantLabel+', with an orchard photograph from The Glenolia.',
  '',
  'theglenolia.com.au/plant-portal/   |   @theglenolia',
  ''
 ].join('\n'));
 const box=layout[file],get=await letters(env,school+' '+detail);
 if(file==='certificate.pdf'){
  const strip=new Uint8Array((box.w+1)*box.band).fill(224);
  for(let y=0;y<box.band;y++)strip[y*(box.w+1)]=0;
  renderLines(strip,box,school,detail,get);
  const [template,meta]=await Promise.all([asset(env,'certificate.pdf'),asset(env,'certificate.json')]);
  return makeCertificate(template,JSON.parse(decoder.decode(meta)),strip,box,school,detail);
 }
 const name=file.split('.')[0];
 const [info,middle,top,bottom]=await Promise.all([asset(env,name+'.json'),asset(env,name+'.mid.gz').then(expand),asset(env,name+'.top'),asset(env,name+'.bottom')]);
 renderLines(middle,box,school,detail,get);
 return indexedPng(box.w,box.h,JSON.parse(decoder.decode(info)),top,middle,bottom);
}
