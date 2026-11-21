// Incremental PDF updates keep the native print artwork, fonts, logo and photo byte-for-byte.
// The original PDF already places a named form. Fill that form with the dated school inscription.
const encode=value=>new TextEncoder().encode(value);
const hex=n=>n.toString(16).padStart(2,'0');
function utf16(text){
 let out='FEFF';for(let i=0;i<text.length;i++)out+=text.charCodeAt(i).toString(16).padStart(4,'0');return '<'+out+'>';
}
const colours=Array.from({length:32},(_,n)=>[[245,47],[241,74],[232,60]].map(([a,b])=>hex(Math.round(a+(b-a)*n/31))).join('')).join('');
export async function makeCertificate(template,meta,strip,box,school,detail){
 const pixels=new Uint8Array(box.w*box.band);
 for(let y=0;y<box.band;y++)for(let x=0;x<box.w;x++)pixels[y*box.w+x]=strip[y*(box.w+1)+1+x]-224;
 const compressed=new Uint8Array(await new Response(new Blob([pixels]).stream().pipeThrough(new CompressionStream('deflate'))).arrayBuffer());
 const parts=[template],entries=[];let offset=template.length;
 function append(value){const bytes=typeof value==='string'?encode(value):value;parts.push(bytes);offset+=bytes.length;}
 function object(id,writer){entries.push([id,offset]);append(id+' 0 obj\n');writer();append('\nendobj\n');}
 append('\n');
 const marked=utf16(school+' · '+detail);
 const drawing='/Span << /ActualText '+marked+' >> BDC\nq 514 0 0 111 0 0 cm /SchoolName Do Q\nEMC';
 object(meta.form,()=>append('<< /Type /XObject /Subtype /Form /BBox [0 0 514 111] /Resources << /XObject << /SchoolName '+meta.size+' 0 R >> >> /Length '+encode(drawing).length+' >>\nstream\n'+drawing+'\nendstream'));
 object(meta.size,()=>{
  append('<< /Type /XObject /Subtype /Image /Width '+box.w+' /Height '+box.band+' /ColorSpace [/Indexed /DeviceRGB 31 <'+colours+'>] /BitsPerComponent 8 /Filter /FlateDecode /Length '+compressed.length+' >>\nstream\n');
  append(compressed);append('\nendstream');
 });
 object(meta.info,()=>append('<< /Title '+utf16('Official School Care Partner | '+school+' | '+detail)+' /Author (The Glenolia) /Subject '+marked+' >>'));
 const xref=offset;append('xref\n');
 for(const [id,start] of entries.sort((a,b)=>a[0]-b[0]))append(id+' 1\n'+String(start).padStart(10,'0')+' 00000 n \n');
 append('trailer\n<< /Size '+(meta.size+1)+' /Root '+meta.root+' 0 R /Info '+meta.info+' 0 R /Prev '+meta.xref+' /ID [<'+meta.documentId+'><'+meta.documentId+'>] >>\nstartxref\n'+xref+'\n%%EOF\n');
 const bytes=new Uint8Array(offset);let pos=0;for(const part of parts){bytes.set(part,pos);pos+=part.length;}return bytes;
}
