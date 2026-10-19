/** Immutable, owner-uploaded status pictures. No filenames, remote URLs or metadata are stored. */
export const IMAGE_MAX_BYTES=307200;
export const IMAGE_MAX_EDGE=1600;
export const IMAGE_ID_PATTERN=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
export const IMAGE_LIMITS=Object.freeze({unpublished:32,total:512,totalBytes:100*1024*1024});
const departments=['cafe','coffee','workshops','local'];
export class ProgrammeMediaError extends Error {constructor(status,code){super(code);this.status=status;this.code=code;}}
const invalid=()=>{throw new ProgrammeMediaError(400,'invalid_image');};
const unavailable=()=>new ProgrammeMediaError(503,'programme_unavailable');
export const validImageId=value=>typeof value==='string'&&IMAGE_ID_PATTERN.test(value);
const tag=(b,o,n)=>String.fromCharCode(...b.subarray(o,o+n));
const u16=(b,o)=>b[o]*256+b[o+1];
const le32=(b,o)=>(b[o]+b[o+1]*256+b[o+2]*65536+b[o+3]*16777216)>>>0;
function dimensions(width,height){if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||width>IMAGE_MAX_EDGE||height>IMAGE_MAX_EDGE||width*height>2560000)invalid();return {width,height};}
function webp(b){
 if(b.length<26||tag(b,0,4)!=='RIFF'||le32(b,4)+8!==b.length||tag(b,8,4)!=='WEBP')invalid();
 const kind=tag(b,12,4),size=le32(b,16),end=20+size;
 // Canvas output is a simple still image: no extended, animated or metadata chunks.
 if(!['VP8 ','VP8L'].includes(kind)||end+(size%2)!==b.length||(size%2&&b[end]!==0))invalid();
 if(kind==='VP8 '){if(size<=10||(b[20]&1)!==0||(b[20]&16)===0||((b[20]>>1)&7)>3||tag(b,23,3)!=='\x9d\x01\x2a'||((b[20]+b[21]*256+b[22]*65536)>>>5)>size-10)invalid();return dimensions((b[26]+b[27]*256)&16383,(b[28]+b[29]*256)&16383);}
 if(size<=5||b[20]!==0x2f)invalid();const bits=le32(b,21);if(bits>>>29)invalid();return dimensions((bits&16383)+1,((bits>>>14)&16383)+1);
}
function jpeg(b){
 if(b.length<4||b[0]!==255||b[1]!==216)invalid();let p=2,shape=null,dqt=false,dht=false,scan=false;const quantisation=new Set(),huffman=new Set();
 while(p<b.length){
  if(b[p++]!==255)invalid();while(b[p]===255)p++;const marker=b[p++];
  if(marker===217){if(!scan||p!==b.length)invalid();return shape;}
  if(scan||![0xe0,0xdb,0xc4,0xc0,0xdd,0xda].includes(marker)||p+2>b.length)invalid();
  const length=u16(b,p),start=p+2,end=p+length;if(length<2||end>b.length)invalid();
  if(marker===0xe0){if(length!==16||tag(b,start,5)!=='JFIF\0'||b[start+12]!==0||b[start+13]!==0)invalid();}
  if(marker===0xdb){if(start===end)invalid();let q=start;while(q<end){const info=b[q++],precision=info>>4;if(precision!==0||(info&15)>3)invalid();quantisation.add(info&15);q+=64;}if(q!==end)invalid();dqt=true;}
  if(marker===0xc4){if(start===end)invalid();let q=start;while(q<end){const info=b[q++];if((info>>4)>1||(info&15)>3||q+16>end)invalid();let count=0,available=1;for(let i=0;i<16;i++){const n=b[q++];count+=n;available=available*2-n;if(available<0)invalid();}if(!count||count>256)invalid();huffman.add(info);q+=count;}if(q!==end)invalid();dht=true;}
  if(marker===0xc0){if(shape||length<11||b[start]!==8)invalid();const components=b[start+5];if(![1,3].includes(components)||length!==8+3*components)invalid();shape=dimensions(u16(b,start+3),u16(b,start+1));const ids=new Set();for(let q=start+6;q<end;q+=3){if(ids.has(b[q])||!(b[q+1]>>4)||!(b[q+1]&15)||(b[q+1]>>4)>4||(b[q+1]&15)>4||b[q+2]>3)invalid();ids.add(b[q]);}shape={...shape,components,ids,quantisation:[]};for(let q=start+6;q<end;q+=3)shape.quantisation.push(b[q+2]);}
  if(marker===0xdd&&length!==4)invalid();
  if(marker===0xda){if(!shape||!dqt||!dht||shape.quantisation.some(id=>!quantisation.has(id)))invalid();const count=b[start];if(count!==shape.components||length!==6+2*count||b[end-3]!==0||b[end-2]!==63||b[end-1]!==0)invalid();const ids=new Set();for(let q=start+1;q<end-3;q+=2){if(!shape.ids.has(b[q])||ids.has(b[q])||(b[q+1]>>4)>3||(b[q+1]&15)>3||!huffman.has(b[q+1]>>4)||!huffman.has(0x10+(b[q+1]&15)))invalid();ids.add(b[q]);}scan=true;p=end;let entropy=0;while(p<b.length){if(b[p++]!==255){entropy++;continue;}if(p>=b.length)invalid();const code=b[p++];if(code===0){entropy++;continue;}if(code>=0xd0&&code<=0xd7)continue;if(code===217&&entropy&&p===b.length)return dimensions(shape.width,shape.height);invalid();}invalid();}
  p=end;
 }
 invalid();
}
/** Structural validation only; clients decode and canvas-reencode before upload. */
export function validateProgrammeImage(input,mime){
 const b=input instanceof Uint8Array?input:input instanceof ArrayBuffer?new Uint8Array(input):null;
 if(!b||!b.length||b.length>IMAGE_MAX_BYTES||!['image/webp','image/jpeg'].includes(mime))invalid();
 const shape=mime==='image/webp'?webp(b):jpeg(b);return {mime,...dimensions(shape.width,shape.height),byteLength:b.length};
}
function rgbProfile(bytes){
 // Browser canvas may add an sRGB ICC profile. It is checked, then discarded;
 // neither ICC text tags nor any other source metadata reach stored bytes.
 if(bytes.length<132||bytes.length>65536||u16(bytes,0)*65536+u16(bytes,2)!==bytes.length||tag(bytes,36,4)!=='acsp'||tag(bytes,12,4)!=='mntr'||tag(bytes,16,4)!=='RGB '||tag(bytes,20,4)!=='XYZ ')invalid();
 const count=u16(bytes,128)*65536+u16(bytes,130),tableEnd=132+count*12;
 if(count<1||count>64||tableEnd>bytes.length)invalid();
 for(let i=0;i<count;i++){
  const at=132+i*12,offset=u16(bytes,at+4)*65536+u16(bytes,at+6),size=u16(bytes,at+8)*65536+u16(bytes,at+10);
  if(size<8||offset<tableEnd||offset>bytes.length||size>bytes.length-offset)invalid();
 }
}
function jpegWithoutProfile(raw){
 if(raw.length<4||raw[0]!==255||raw[1]!==216)invalid();let at=2,removed=false;const parts=[raw.subarray(0,2)];
 while(at<raw.length){
  const start=at;if(raw[at++]!==255)invalid();while(raw[at]===255)at++;const marker=raw[at++];
  if(marker===0xda||marker===0xd9){parts.push(raw.subarray(start));at=raw.length;break;}
  if(at+2>raw.length)invalid();const length=u16(raw,at),end=at+length;if(length<2||end>raw.length)invalid();
  if(marker===0xe2){
   const payload=raw.subarray(at+2,end);
   // Canvas emits a single sRGB profile; reject opaque APP2 and split profiles.
   if(removed||payload.length<14||tag(payload,0,12)!=='ICC_PROFILE\0'||payload[12]!==1||payload[13]!==1)invalid();
   rgbProfile(payload.subarray(14));removed=true;
  }else parts.push(raw.subarray(start,end));
  at=end;
 }
 if(!removed)return raw;const bytes=new Uint8Array(parts.reduce((n,p)=>n+p.length,0));let offset=0;for(const part of parts){bytes.set(part,offset);offset+=part.length;}return bytes;
}
/** Browser encoders can wrap an opaque still image in VP8X+ICCP. Remove that
 * colour-profile wrapper (or a JPEG ICC APP2 segment) before strict validation. EXIF,
 * XMP, animation, alpha wrappers and unknown chunks are never accepted. The
 * client canvas uses its default sRGB colour space before this normalization.
 */
export function normaliseProgrammeImage(input,mime){
 const raw=input instanceof Uint8Array?input:input instanceof ArrayBuffer?new Uint8Array(input):null;
 if(!raw||!raw.length||raw.length>IMAGE_MAX_BYTES)invalid();let bytes=raw;
 if(mime==='image/webp'&&tag(raw,12,4)==='VP8X'){
  if(raw.length<30||tag(raw,0,4)!=='RIFF'||le32(raw,4)+8!==raw.length||tag(raw,8,4)!=='WEBP'||le32(raw,16)!==10)invalid();
  const flags=raw[20];if(![0,0x20].includes(flags)||raw[21]||raw[22]||raw[23])invalid();
  const width=1+raw[24]+raw[25]*256+raw[26]*65536,height=1+raw[27]+raw[28]*256+raw[29]*65536;dimensions(width,height);
  let at=30,profile=false,imageChunk=null;
  while(at<raw.length){
   if(at+8>raw.length)invalid();const kind=tag(raw,at,4),size=le32(raw,at+4),end=at+8+size,padded=end+size%2;
   if(end>raw.length||padded>raw.length||(size%2&&raw[end]!==0))invalid();
   if(kind==='ICCP'){
    if(profile||imageChunk||flags!==0x20)invalid();rgbProfile(raw.subarray(at+8,end));profile=true;
   }else if(['VP8 ','VP8L'].includes(kind)){
    if(imageChunk||(flags===0x20&&!profile))invalid();imageChunk=raw.subarray(at,padded);
   }else invalid();
   at=padded;
  }
  if(!imageChunk||Boolean(flags&0x20)!==profile)invalid();
  bytes=new Uint8Array(12+imageChunk.length);bytes.set([82,73,70,70],0);new DataView(bytes.buffer).setUint32(4,bytes.length-8,true);bytes.set([87,69,66,80],8);bytes.set(imageChunk,12);
  const metadata=validateProgrammeImage(bytes,mime);if(metadata.width!==width||metadata.height!==height)invalid();
 }else if(mime==='image/jpeg')bytes=jpegWithoutProfile(raw);
 return {bytes,...validateProgrammeImage(bytes,mime)};
}
export async function readImageBody(request){
 const mime=request.headers.get('Content-Type')?.trim().toLowerCase();if(!['image/jpeg','image/webp'].includes(mime))invalid();
 const declared=request.headers.get('Content-Length');if(declared!==null&&(!/^\d+$/.test(declared)||Number(declared)>IMAGE_MAX_BYTES))throw new ProgrammeMediaError(413,'image_too_large');
 const reader=request.body?.getReader();if(!reader)invalid();let size=0;const parts=[];
 try{for(;;){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>IMAGE_MAX_BYTES){await reader.cancel();throw new ProgrammeMediaError(413,'image_too_large');}parts.push(value);}}catch(error){if(error instanceof ProgrammeMediaError)throw error;invalid();}
 const bytes=new Uint8Array(size);let at=0;for(const part of parts){bytes.set(part,at);at+=part.length;}return normaliseProgrammeImage(bytes,mime);
}
export async function uploadProgrammeImage(db,request,{department,actor,now=Date.now()}={}){
 if(!departments.includes(department))throw new ProgrammeMediaError(400,'invalid_department');
 if(typeof actor!=='string'||!actor.trim()||actor.length>254)throw new ProgrammeMediaError(400,'invalid_actor');
 const time=new Date(now);if(!Number.isFinite(time.getTime()))invalid();
 const image=await readImageBody(request),imageId=crypto.randomUUID(),at=time.toISOString();
 const sha256=[...new Uint8Array(await crypto.subtle.digest('SHA-256',image.bytes))].map(v=>v.toString(16).padStart(2,'0')).join('');
 if(!db?.batch||!db?.prepare)throw unavailable();let results;
 try{
  results=await db.batch([
   db.prepare("DELETE FROM programme_media WHERE first_published_at IS NULL AND created_at<? AND image_id NOT IN (SELECT j.value FROM programme_state s,json_tree(s.draft_json,'$.departments') j WHERE j.key='imageId')").bind(new Date(time.getTime()-7*86400000).toISOString()),
   db.prepare('INSERT INTO programme_media (image_id,department,mime,width,height,byte_length,sha256,bytes,created_at,created_by) SELECT ?,?,?,?,?,?,?,?,?,? WHERE (SELECT COUNT(*) FROM programme_media WHERE first_published_at IS NULL)<? AND (SELECT COUNT(*) FROM programme_media)<? AND (SELECT COALESCE(SUM(byte_length),0) FROM programme_media)+?<=?').bind(imageId,department,image.mime,image.width,image.height,image.byteLength,sha256,image.bytes,at,actor.trim(),IMAGE_LIMITS.unpublished,IMAGE_LIMITS.total,image.byteLength,IMAGE_LIMITS.totalBytes)
  ]);
 }catch{throw unavailable();}
 if(Number(results?.[1]?.meta?.changes)!==1)throw new ProgrammeMediaError(409,'image_storage_limit');
 return {imageId,department,mime:image.mime,width:image.width,height:image.height,byteLength:image.byteLength,previewUrl:'/api/programme/images/'+imageId};
}
export async function fetchProgrammeImage(db,imageId,{publicOnly=false}={}){
 if(!validImageId(imageId))return null;if(!db?.prepare)throw unavailable();
 let row;try{row=await db.prepare('SELECT mime,width,height,byte_length,sha256,bytes FROM programme_media WHERE image_id=?'+(publicOnly?' AND first_published_at IS NOT NULL':'')).bind(imageId).first();}catch{throw unavailable();}
 return row||null;
}
export function programmeImageResponse(image,{publicOnly=false}={}){
 const bytes=Array.isArray(image.bytes)?Uint8Array.from(image.bytes):image.bytes;
 if(!(bytes instanceof Uint8Array)&&!(bytes instanceof ArrayBuffer))throw unavailable();
 return new Response(bytes,{headers:{'Content-Type':image.mime,'Content-Length':String(image.byte_length),'X-Content-Type-Options':'nosniff','Cache-Control':publicOnly?'public, max-age=31536000, immutable':'no-store','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'none'; sandbox",...(publicOnly?{'Access-Control-Allow-Origin':'*',ETag:'"'+image.sha256+'"'}:{'X-Frame-Options':'DENY'})}});
}
