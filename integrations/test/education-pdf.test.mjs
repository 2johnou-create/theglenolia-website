import test from 'node:test';
import assert from 'node:assert/strict';
import {PDFDocument,PDFName,PDFString,PDFNumber} from 'pdf-lib';
import {zlibSync,strToU8} from 'fflate';
import {validateStaticPDF,StaticPDFError,PDF_LIMITS} from '../education-pdf.mjs';

function manualPDF({catalog='',extra=[],trailer='',rawObjects=null,root=1}={}){
 const objects=rawObjects||[`<< /Type /Catalog /Pages 2 0 R ${catalog} >>`,'<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 200 200] >>',...extra];
 const chunks=[Buffer.from('%PDF-1.7\n%\xE2\xE3\xCF\xD3\n','latin1')],offsets=[0];let length=chunks[0].length;
 for(const [index,object]of objects.entries()){offsets.push(length);const bytes=Buffer.concat([Buffer.from(`${index+1} 0 obj\n`),Buffer.from(object),Buffer.from('\nendobj\n')]);chunks.push(bytes);length+=bytes.length;}
 const xref=length;chunks.push(Buffer.from('xref\n0 '+(objects.length+1)+'\n0000000000 65535 f \n'+offsets.slice(1).map(n=>String(n).padStart(10,'0')+' 00000 n \n').join('')+`trailer\n<< /Size ${objects.length+1} /Root ${root} 0 R ${trailer} >>\nstartxref\n${xref}\n%%EOF\n`));return new Uint8Array(Buffer.concat(chunks));
}
async function imageFixture(){const doc=await PDFDocument.create(),page=doc.addPage([200,200]),pixels=new Uint8Array(64).fill(200);pixels.set(strToU8('/AA /JS /Encrypt /OpenAction'),8);const image=doc.context.stream(pixels,{Type:'XObject',Subtype:'Image',Width:8,Height:8,ColorSpace:'DeviceGray',BitsPerComponent:8});page.node.Resources().set(PDFName.of('XObject'),doc.context.obj({Im0:doc.context.register(image)}));page.node.set(PDFName.of('Contents'),doc.context.register(doc.context.stream('q 100 0 0 100 0 0 cm /Im0 Do Q')));doc.setTitle('A static image and literal /AA text');return doc.save({useObjectStreams:false});}
const rejected=bytes=>assert.rejects(()=>validateStaticPDF(bytes),StaticPDFError);

test('valid static PDFs pass even when opaque image bytes contain reserved-looking names',async()=>{const bytes=await imageFixture();assert.ok(Buffer.from(bytes).includes(Buffer.from('/AA')));assert.equal((await validateStaticPDF(bytes)).pages,1);});
test('ordinary compressed object-stream PDFs are parsed and inspected',async()=>{const doc=await PDFDocument.create();doc.addPage();const bytes=await doc.save({useObjectStreams:true});assert.ok(Buffer.from(bytes).includes(Buffer.from('/ObjStm')));assert.equal((await validateStaticPDF(bytes)).pages,1);});
test('true active dictionary keys and values are rejected, including encoded PDF names',async()=>{
 for(const entry of ['/OpenAction 4 0 R','/AA << /O 4 0 R >>','/Java#53cript 4 0 R','/J#53 4 0 R','/A#41 << /O 4 0 R >>','/Open#41ction 4 0 R','/A << /S /J#61vaScript /Payload (x) >>','/Ope#6eAction 4 0 R','/AcroForm << /Fields [] >>','/XFA (x)','/EmbeddedFiles << >>','/A << /S /Launch /F (x) >>'])await rejected(manualPDF({catalog:entry,extra:['<< /S /GoTo /D [3 0 R /Fit] >>']}));
});
test('active names hidden in compressed object streams are rejected',async()=>{const doc=await PDFDocument.create();doc.addPage();doc.addJavaScript('test','app.alert(1)');const bytes=await doc.save({useObjectStreams:true});assert.ok(Buffer.from(bytes).includes(Buffer.from('/ObjStm')));assert.ok(!Buffer.from(bytes).includes(Buffer.from('/JavaScript')));await rejected(bytes);});
test('indirect and unreferenced action dictionaries cannot evade the static gate',async()=>{await rejected(manualPDF({extra:['<< /AA << /O 5 0 R >> >>','<< /S /JavaScript /JS (x) >>']}));await rejected(manualPDF({catalog:'/Names 4 0 R',extra:['<< /JavaScript 5 0 R >>','<< /Names [(x) 6 0 R] >>','<< /S /JavaScript /JS (x) >>']}));});
test('encrypted, malformed, truncated and unresolved-reference PDFs fail closed',async()=>{
 await rejected(manualPDF({trailer:'/Encrypt 4 0 R',extra:['<< /Filter /Standard /V 1 >>']}));
 await rejected(new TextEncoder().encode('%PDF-1.4\nstatic fabricated fixture\n%%EOF'));
 await rejected(manualPDF().subarray(0,100));
 await rejected(manualPDF({catalog:'/Metadata 999 0 R'}));
 await rejected(manualPDF({rawObjects:['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [2 0 R] /Count 1 >>']}));
 const bad=Buffer.from(manualPDF()).toString('latin1').replace('startxref\n','startxref\n999999');await rejected(new Uint8Array(Buffer.from(bad,'latin1')));
});
test('URI actions permit ordinary source links but reject script-like targets',async()=>{assert.equal((await validateStaticPDF(manualPDF({catalog:'/A << /S /URI /URI (https://curriculum.nsw.edu.au/) >>'}))).pages,1);await rejected(manualPDF({catalog:'/A << /S /URI /URI (javascript:alert(1)) >>'}));});
test('bounded parsing rejects excessive nesting and structural decompression bombs',async()=>{
 await rejected(manualPDF({catalog:'/Something '+ '['.repeat(80)+'0'+']'.repeat(80)}));
 const inflated=strToU8('7 0 << /Safe /Name >>'+' '.repeat(PDF_LIMITS.decodedStream)),compressed=zlibSync(inflated),stream=Buffer.concat([Buffer.from(`<< /Type /ObjStm /N 1 /First 4 /Filter /FlateDecode /Length ${compressed.length} >>\nstream\n`),compressed,Buffer.from('\nendstream')]);await rejected(manualPDF({extra:[stream]}));
 await rejected(new Uint8Array(PDF_LIMITS.bytes+1));
});
test('object-stream count and cross-reference width limits are checked before parser loops',async()=>{
 const bytes=zlibSync(strToU8('7 0 << /Safe /Name >>')),body=Buffer.concat([Buffer.from(`<< /Type /ObjStm /N 999999999 /First 4 /Filter /FlateDecode /Length ${bytes.length} >>\nstream\n`),bytes,Buffer.from('\nendstream')]);await rejected(manualPDF({extra:[body]}));
 await rejected(manualPDF({extra:['<< /Type /XRef /Size 999999999 /W [1 4 2] /Length 7 >>\nstream\n1234567\nendstream']}));
});

test('forward-indirect structural stream Types cannot hide object-stream actions',async()=>{
 const compressed=zlibSync(strToU8('6 0 << /S /JavaScript /JS (app.alert(1)) >>'));
 const outer=Buffer.concat([Buffer.from(`<< /Type 5 0 R /N 1 /First 4 /Filter /FlateDecode /Length ${compressed.length} >>\nstream\n`),compressed,Buffer.from('\nendstream')]);
 const directForward=manualPDF({extra:[outer,'/ObjStm']});assert.ok(!Buffer.from(directForward).includes(Buffer.from('/JavaScript')));await rejected(directForward);
 await rejected(manualPDF({extra:[outer,'6 0 R','/ObjStm']}));
 await rejected(manualPDF({extra:[outer,'/XRef']}));
});

test('a stream nested inside an object stream is rejected as malformed',async()=>{
 const payload='7 0 << /Type /XObject /Subtype /Image /Width 1 /Height 1 /ColorSpace /DeviceGray /BitsPerComponent 8 /Length 1 >>\nstream\nX\nendstream',compressed=zlibSync(strToU8(payload));
 const outer=Buffer.concat([Buffer.from(`<< /Type /ObjStm /N 1 /First 4 /Filter /FlateDecode /Length ${compressed.length} >>\nstream\n`),compressed,Buffer.from('\nendstream')]);
 await rejected(manualPDF({extra:[outer]}));
});

test('invalid trailer roots are rejected instead of recovered from another scanned Catalog',async()=>{
 await rejected(manualPDF({root:4999}));await rejected(manualPDF({root:2}));
});

test('3D annotation and OnInstantiate script features are outside the static PDF profile',async()=>{
 const doc=await PDFDocument.create(),page=doc.addPage([200,200]),script=doc.context.register(doc.context.stream('app.alert(1)'));
 const model=doc.context.register(doc.context.stream('opaque model fixture',{Type:'3D',Subtype:'U3D',OnInstantiate:script}));
 const annot=doc.context.register(doc.context.obj({Type:'Annot',Subtype:'3D',Rect:[0,0,100,100],'3DD':model}));page.node.set(PDFName.of('Annots'),doc.context.obj([annot]));
 await rejected(await doc.save({useObjectStreams:false}));
 await rejected(manualPDF({catalog:'/SomeName /3DRef'}));await rejected(manualPDF({catalog:'/OnInstantiate 4 0 R',extra:['<< >>']}));
});
