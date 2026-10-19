// Published media is addressed by an immutable ID, never by a caller's URL.
export const programmeMediaOrigin='https://glenolia-newsletter.theglenolia.workers.dev';
const imageId=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const keys=(value,expected)=>value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).length===expected.length&&expected.every(key=>Object.hasOwn(value,key));
const plain=(value,limit,required=false)=>typeof value==='string'&&(!required||Boolean(value.trim()))&&[...value].length<=limit&&!/[<>\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(value);
const date=value=>value===''||typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value+'T00:00:00Z'))&&new Date(value+'T00:00:00Z').toISOString().slice(0,10)===value;

export function validSnapshots(value){
 if(value===undefined)return true; // Existing version-one publications.
 return Array.isArray(value)&&value.length<=4&&new Set(value.map(item=>item?.imageId)).size===value.length&&value.every(item=>
  keys(item,['imageId','kind','capturedOn','translations'])&&typeof item.imageId==='string'&&imageId.test(item.imageId)&&['photo','concept'].includes(item.kind)&&date(item.capturedOn)&&keys(item.translations,['en','zh','ja'])&&['en','zh','ja'].every(language=>{
   const entry=item.translations[language];return keys(entry,['caption','alt'])&&plain(entry.caption,120)&&plain(entry.alt,160,true);
  }));
}

export function snapshotImageURL(id){
 if(typeof id!=='string'||!imageId.test(id))throw Error('Invalid published image ID');
 return programmeMediaOrigin+'/public/programme/images/'+id;
}

export function snapshotItems(value,language){
 if(!['en','zh','ja'].includes(language)||!validSnapshots(value))return [];
 return (value||[]).map(item=>({imageId:item.imageId,kind:item.kind,capturedOn:item.capturedOn,url:snapshotImageURL(item.imageId),caption:item.translations[language].caption,alt:item.translations[language].alt}));
}
