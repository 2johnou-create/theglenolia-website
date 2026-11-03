import {PDFParser,PDFObjectStreamParser,PDFXRefStreamParser,PDFDict,PDFArray,PDFName,PDFRef,PDFNumber,PDFRawStream,PDFStream,PDFInvalidObject,PDFNull,PDFString,PDFHexString} from 'pdf-lib';
import {Unzlib} from 'fflate/browser';

// A narrow static resource-PDF gate, not a malware/accessibility certification.
// Raw image/font/content bytes are deliberately opaque: a JPEG can legitimately
// contain '/AA'. Only parsed dictionaries and PDFName objects carry PDF syntax.
// pdf-lib is pinned because the instance-local parser hooks below guard its
// parser before it can inflate an object or cross-reference stream.
export const PDF_LIMITS=Object.freeze({bytes:2097152,objects:5000,tokens:60000,nodes:60000,depth:64,pages:500,decodedStream:2097152,decodedTotal:4194304,milliseconds:2000});
const forbidden=new Set(['JavaScript','JS','OpenAction','AA','Launch','EmbeddedFiles','EmbeddedFile','FileAttachment','EF','RichMedia','RichMediaContent','RichMediaSettings','SubmitForm','XFA','Encrypt','AcroForm','Movie','Sound','Rendition','GoToR','GoToE','ImportData','3D','3DRef','OnInstantiate']);
const name=n=>n instanceof PDFName?n.decodeText().replace(/#([0-9a-f]{2})/gi,(_,h)=>String.fromCharCode(parseInt(h,16))):null;
const keyword=s=>Uint8Array.from(s,c=>c.charCodeAt(0));
const ENDOBJ=keyword('endobj');
export class StaticPDFError extends Error{constructor(reason){super('The PDF requires a safe static copy.');this.name='StaticPDFError';this.reason=reason;}}
const reject=reason=>{throw new StaticPDFError(reason);};
const integer=(v,max=PDF_LIMITS.objects)=>{const n=v instanceof PDFNumber?v.asNumber():NaN;if(!Number.isSafeInteger(n)||n<0||n>max)reject('invalid_structure_number');return n;};
function tick(state){if(Date.now()-state.started>PDF_LIMITS.milliseconds)reject('parse_budget');}

function boundedDecode(stream,state){
 const dict=stream.dict,filter=dict.lookup(PDFName.of('Filter'));
 let filters=filter instanceof PDFArray?filter.asArray():filter&&filter!==PDFNull?[filter]:[];
 if(filters.length>1||filters.some(f=>!['FlateDecode','Fl'].includes(name(f))))reject('unsupported_structural_stream_filter');
 const params=dict.lookup(PDFName.of('DecodeParms'));
 if(params&&params!==PDFNull)reject('unsupported_structural_decode_parameters');
 const source=stream.getContents();let result;
 if(!filters.length)result=source;
 else{
  const chunks=[];let size=0,ended=false;
  const unzip=new Unzlib((chunk,final)=>{size+=chunk.length;if(size>PDF_LIMITS.decodedStream||state.decoded+size>PDF_LIMITS.decodedTotal)reject('structural_stream_too_large');chunks.push(chunk);ended=final;});
  // Small compressed input slices bound each decoder allocation as well as the
  // accumulated output; the callback throws before another slice is accepted.
  for(let at=0;at<source.length;at+=128){tick(state);unzip.push(source.subarray(at,at+128),at+128>=source.length);}
  if(!ended)reject('invalid_structural_stream');result=new Uint8Array(size);let at=0;for(const chunk of chunks){result.set(chunk,at);at+=chunk.length;}
 }
 if(result.length>PDF_LIMITS.decodedStream||(state.decoded+=result.length)>PDF_LIMITS.decodedTotal)reject('structural_stream_too_large');
 const raw=PDFRawStream.of(dict.clone(dict.context),result);raw.dict.delete(PDFName.of('Filter'));raw.dict.delete(PDFName.of('DecodeParms'));raw.dict.set(PDFName.of('Length'),PDFNumber.of(result.length));return raw;
}

function inspectNames(object,seen=new WeakSet(),depth=0){
 if(!object||typeof object!=='object'||seen.has(object))return;if(depth>PDF_LIMITS.depth)reject('structure_depth');seen.add(object);
 if(object instanceof PDFName){if(object.sizeInBytes()>1024)reject('name_too_long');if(forbidden.has(name(object)))reject('active_pdf_name');return;}
 if(object instanceof PDFStream){inspectNames(object.dict,seen,depth+1);return;}
 if(object instanceof PDFDict){for(const [key,value]of object.entries()){inspectNames(key,seen,depth+1);inspectNames(value,seen,depth+1);}}
 else if(object instanceof PDFArray)for(const item of object.asArray())inspectNames(item,seen,depth+1);
}

function guardObjectParser(parser,state,allowStreams=true){
 const parse=parser.parseObject.bind(parser);let depth=0;
 parser.parseObject=function(){tick(state);if(++state.tokens>PDF_LIMITS.tokens||++depth>PDF_LIMITS.depth)reject('parser_complexity');try{const value=parse();if(!allowStreams&&value instanceof PDFStream)reject('nested_object_stream');if(value instanceof PDFName){if(value.sizeInBytes()>1024)reject('name_too_long');if(forbidden.has(name(value)))reject('active_pdf_name');}return value;}finally{depth--;}};
}

function objectStream(stream,state){
 const decoded=boundedDecode(stream,state),dict=decoded.dict,count=integer(dict.lookup(PDFName.of('N'))),first=integer(dict.lookup(PDFName.of('First')),decoded.getContents().length);
 if(!count||state.objects+count>PDF_LIMITS.objects)reject('object_limit');
 const parser=PDFObjectStreamParser.forStream(decoded);guardObjectParser(parser,state,false);
 const parseOffsets=parser.parseOffsetsAndObjectNumbers.bind(parser);
 parser.parseOffsetsAndObjectNumbers=function(){const rows=parseOffsets();if(this.bytes.offset()>first)reject('invalid_object_stream_offsets');let previous=-1;for(const row of rows){if(!Number.isSafeInteger(row.objectNumber)||row.objectNumber<1||row.objectNumber>PDF_LIMITS.objects||!Number.isSafeInteger(row.offset)||row.offset<0||row.offset<=previous||first+row.offset>=decoded.getContents().length)reject('invalid_object_stream_offsets');previous=row.offset;const key=row.objectNumber+' 0 R';if(state.refs.has(key))reject('duplicate_indirect_object');state.refs.add(key);state.objects++;}return rows;};
 return parser.parseIntoContext();
}

function crossRefStream(stream,state){
 const decoded=boundedDecode(stream,state),dict=decoded.dict,size=integer(dict.lookup(PDFName.of('Size'))),widths=dict.lookup(PDFName.of('W'));
 if(!(widths instanceof PDFArray)||widths.size()!==3)reject('invalid_xref_stream');const width=widths.asArray().map(x=>integer(x,8)).reduce((a,b)=>a+b,0);if(!width||!size)reject('invalid_xref_stream');
 const index=dict.lookup(PDFName.of('Index'));let entries=size;
 if(index){if(!(index instanceof PDFArray)||index.size()%2||index.size()>PDF_LIMITS.objects*2)reject('invalid_xref_stream');entries=0;for(let i=0;i<index.size();i+=2){integer(index.lookup(i));entries+=integer(index.lookup(i+1));}}
 if(entries>PDF_LIMITS.objects||entries*width!==decoded.getContents().length)reject('invalid_xref_stream');PDFXRefStreamParser.forStream(decoded).parseIntoContext();
}

async function preflight(bytes,startxref){
 const state={started:Date.now(),objects:0,tokens:0,decoded:0,refs:new Set(),xrefOffsets:new Set()},parser=PDFParser.forBytesWithOptions(bytes,100,true,true);guardObjectParser(parser,state);
 // Static uploads must have their genuine trailer root. Do not repair a
 // malformed root by silently choosing another scanned Catalog dictionary.
 parser.maybeRecoverRoot=()=>{};
 const parseXref=parser.maybeParseCrossRefSection.bind(parser);parser.maybeParseCrossRefSection=function(){this.skipWhitespaceAndComments();const at=this.bytes.offset(),section=parseXref();if(section)state.xrefOffsets.add(at);return section;};
 // Use the upstream object's parser, with a strict endobj and pre-inflation
 // guards. This is per instance; no prototypes/global parser state are changed.
 parser.parseIndirectObject=async function(){
  tick(state);if(++state.objects>PDF_LIMITS.objects)reject('object_limit');const at=this.bytes.offset(),ref=this.parseIndirectObjectHeader(),key=String(ref);if(state.refs.has(key))reject('duplicate_indirect_object');state.refs.add(key);this.skipWhitespaceAndComments();const object=this.parseObject();this.skipWhitespaceAndComments();if(!this.matchKeyword(ENDOBJ))reject('missing_endobj');inspectNames(object);
  if(object instanceof PDFStream&&object.dict.get(PDFName.of('Type')) instanceof PDFRef)reject('indirect_stream_type');
  if(object instanceof PDFRawStream&&name(object.dict.lookup(PDFName.of('Type')))==='ObjStm')await objectStream(object,state);
  else if(object instanceof PDFRawStream&&name(object.dict.lookup(PDFName.of('Type')))==='XRef'){state.xrefOffsets.add(at);crossRefStream(object,state);}
  else this.context.assign(ref,object);return ref;
 };
 const context=await parser.parseDocument();tick(state);if(!state.xrefOffsets.has(startxref))reject('invalid_startxref');if(context.trailerInfo.Encrypt)reject('encrypted_pdf');if(!context.trailerInfo.Root)reject('missing_catalog');return {context,state};
}

function inspectContext(context,state){
 const seen=new WeakSet();let nodes=0;
 function visit(object,depth=0){tick(state);if(++nodes>PDF_LIMITS.nodes||depth>PDF_LIMITS.depth)reject('structure_complexity');
  if(object instanceof PDFRef){if(object.objectNumber>PDF_LIMITS.objects||object.generationNumber>65535)reject('invalid_reference');const value=context.lookup(object);if(!value)reject('unresolved_reference');visit(value,depth+1);return;}
  if(!object||typeof object!=='object'||seen.has(object))return;seen.add(object);
  if(object instanceof PDFInvalidObject)reject('invalid_pdf_object');
  if(object instanceof PDFName){if(object.sizeInBytes()>1024||forbidden.has(name(object)))reject('active_pdf_name');return;}
  if(object instanceof PDFStream){const type=object.dict.get(PDFName.of('Type'));if(type instanceof PDFRef)reject('indirect_stream_type');if(['ObjStm','XRef'].includes(name(object.dict.lookup(PDFName.of('Type')))))reject('unexpanded_structural_stream');if(object.dict.has(PDFName.of('F')))reject('external_stream');const length=object.dict.lookup(PDFName.of('Length'));if(!(length instanceof PDFNumber)||length.asNumber()!==object.getContents().length)reject('stream_length_mismatch');visit(object.dict,depth+1);return;}
  if(object instanceof PDFDict){for(const [key,value]of object.entries()){visit(key,depth+1);visit(value,depth+1);if(name(key)==='URI'){const target=context.lookup(value);if(!(target instanceof PDFString||target instanceof PDFHexString)||!/^https?:\/\/|^mailto:/i.test(target.decodeText()))reject('unsafe_uri_action');}}}
  else if(object instanceof PDFArray)for(const item of object.asArray())visit(item,depth+1);
 }
 for(const [,object]of context.enumerateIndirectObjects())visit(object);for(const value of Object.values(context.trailerInfo))if(value)visit(value);
 const catalog=context.lookup(context.trailerInfo.Root);if(!(catalog instanceof PDFDict)||name(catalog.lookup(PDFName.of('Type')))!=='Catalog')reject('missing_catalog');
 const pageNodes=new Set();let pages=0;
 function pageTree(object,depth=0){const node=context.lookup(object);if(!(node instanceof PDFDict)||pageNodes.has(node)||depth>32)reject('invalid_page_tree');pageNodes.add(node);const type=name(node.lookup(PDFName.of('Type')));if(type==='Page'){if(++pages>PDF_LIMITS.pages)reject('page_limit');return 1;}if(type!=='Pages')reject('invalid_page_tree');const kids=node.lookup(PDFName.of('Kids'));if(!(kids instanceof PDFArray)||kids.size()>PDF_LIMITS.pages)reject('invalid_page_tree');let count=0;for(const child of kids.asArray())count+=pageTree(child,depth+1);if(integer(node.lookup(PDFName.of('Count')),PDF_LIMITS.pages)!==count)reject('invalid_page_count');return count;}
 pageTree(catalog.get(PDFName.of('Pages')));if(!pages)reject('empty_pdf');return {pages,objects:context.enumerateIndirectObjects().length,nodes};
}

export async function validateStaticPDF(bytes){
 if(!(bytes instanceof Uint8Array)||bytes.length<32)reject('invalid_pdf');if(bytes.length>PDF_LIMITS.bytes)reject('pdf_too_large');
 const header=new TextDecoder('latin1').decode(bytes.subarray(0,12)),tail=new TextDecoder('latin1').decode(bytes.subarray(Math.max(0,bytes.length-256)));
 if(!/^%PDF-\d\.\d(?:\s|$)/.test(header))reject('missing_pdf_header');const end=tail.match(/startxref\s+(\d+)\s+%%EOF\s*$/);if(!end||Number(end[1])>=bytes.length)reject('missing_pdf_trailer');
 const xrefAt=Number(end[1]),xrefHeader=new TextDecoder('latin1').decode(bytes.subarray(xrefAt,xrefAt+80));if(!/^(?:xref\s|\d+\s+\d+\s+obj\b)/.test(xrefHeader))reject('invalid_startxref');
 try{
  // The guarded parser already produced the complete object context. Validate
  // it once, including its genuine root, references and strict page tree.
  // Re-running the same upstream parser adds CPU without an independent check.
  const {context,state}=await preflight(bytes,xrefAt),result=inspectContext(context,state);tick(state);return {...result,decodedStructuralBytes:state.decoded,bytes:bytes.length};
 }catch(error){if(error instanceof StaticPDFError)throw error;reject('malformed_pdf');}
}
