import {fieldHero,fieldFacts,farmWeather,workshopShelf,schoolAward,companionPrompt} from './plant-field-home.js';
import {plantThreadsPanel} from './plant-threads-ui.js';
/* Teacher-managed education. Private content is requested only from authorised APIs. */
const STAGES={ES1:'Early Stage 1 · Kindergarten',S1:'Stage 1 · Years 1–2',S2:'Stage 2 · Years 3–4',S3:'Stage 3 · Years 5–6',S4:'Stage 4 · Years 7–8',S5:'Stage 5 · Years 9–10',S6:'Senior extension · Year 11'};
const MODES={classroom:'Classroom',school_grounds:'School grounds',field:'Farm fieldwork',indoor:'Indoor workshop',home:'Optional home activity'};
const LEVELS={not_observed:'Not yet observed',starting:'Starting',developing:'Developing',secure:'Secure',extending:'Extending'};
const THEMES={u1:'observe',u2:'measure',u3:'soil',u4:'weather',u5:'living',u6:'community',u7:'design',u8:'reflect'};
const ERRORS={try_later:'Please wait a little before requesting another link.',daily_sign_in_allowance:'Sign-in emails have reached today’s allowance. Please try again later or contact info@theglenolia.com.au.',sign_in_temporarily_unavailable:'Sign-in email is temporarily unavailable. Please try again shortly.',expired_or_different_browser:'This link has expired or was opened in a different browser. Request a new sign-in link in this browser.',link_already_used:'This link was already used. Request a new link if you need to sign in again.',invalid_link:'This link cannot be used. Request a fresh sign-in link.',educator_confirmation_required:'Confirm that you are an adult educator before continuing.',teacher_must_sign_in_first:'The school coordinator must verify their work email once before the school can be created.',agreement_required:'An approved school processing-agreement reference is needed before learner observations can be enabled.',learner_code_required:'Use a short school-chosen code with letters, numbers or hyphens, without names or official identifiers.',assignment_has_evidence:'This assignment is linked to learning observations. Keep it with the record, or review those observations before removing it.',group_closed:'This group is closed. Review its settings before adding new learning records.',invalid_field:'Check the entered details and any required fields. Your edits remain in the form.',invalid_fields:'Check the form details before trying again. Your edits remain here.',resource_not_found:'This resource is no longer available. Return to the library for the current edition.',revision_conflict:'This record changed in another session. Copy any edits before reloading the latest record.',auth_required:'Please sign in to continue. Your edits remain in this tab.',access_required:'This resource or school workspace is not available to your account.',forbidden:'You do not have access to this action.',school_approval_required:'Learner observations are not enabled for this school. You can continue planning without learner records.',evidence_disabled:'Your school must approve the processing agreement before learner observations can be recorded.',changed_elsewhere:'This record changed in another session. Your edits are still here. Copy them before reloading the latest record.',conflict:'This record changed in another session. Copy your edits, then reload before saving again.',rate_limit:'Please wait a little before trying again.',invalid:'Check the entered details and try again. Your edits remain in the form.',invalid_input:'Check the entered details and try again. Your edits remain in the form.',not_found:'This item is no longer available. Return to the library for the current edition.',resource_unavailable:'This resource is not available to your account. Ask your school coordinator about access.',csrf:'Your session needs refreshing. Copy any unsaved edits, then reload and sign in again.',mail_unavailable:'A sign-in email could not be prepared just now. Please try again shortly.',token_invalid:'This sign-in link is no longer usable. Request a new link in this browser.',invalid_token:'This sign-in link is no longer usable. Request a new link in this browser.'};
export function durationLabel(value){return typeof value==='number'||typeof value==='string'&&/^\d+(?:\.\d+)?$/.test(value.trim())?String(value)+' minutes':String(value||'Teacher-selected duration');}
export function stageLabel(stage){return STAGES[stage]||String(stage||'Teacher resource');}
export function resourceSummary(value){if(!value||typeof value!=='object'||typeof value.id!=='string')return null;return {...value,id:value.id,title:String(value.title||'Learning resource'),stage:String(value.stage||''),summary:String(value.summary||value.description||''),term:Number(value.term)||null,version:Number(value.version||value.publishedVersion||value.published_version)||1,availability:value.availability||'teacher'};}
export function filterResources(resources,filters={}){const q=String(filters.search||'').trim().toLowerCase();return resources.filter(r=>(!filters.stage||filters.stage==='all'||r.stage===filters.stage)&&(!filters.term||filters.term==='all'||r.term===Number(filters.term))&&(!filters.mode||filters.mode==='all'||[...(Array.isArray(r.modes)?r.modes:[]),r.mode||'',r.classroomAlternative?'classroom':'',r.fieldAlternative?'field':''].some(m=>String(m).toLowerCase().replaceAll(' ','_')===filters.mode))&&(!q||[r.title,r.summary,stageLabel(r.stage),r.question||''].join(' ').toLowerCase().includes(q)));}
export function safeLink(value,base='https://theglenolia.com.au/'){if(typeof value!=='string'||!(/^(?:https?:\/\/|\/(?!\/))/.test(value)))return null;try{const url=new URL(value,base);return ['https:','http:'].includes(url.protocol)&&!url.username&&!url.password?url.href:null;}catch{return null;}}
export function plantPosition(key){
 const match=/^r([1-9]|1[0-2])-p([1-9]|1[0-9])$/.exec(typeof key==='string'?key:'');
 if(!match)return null;
 const row=Number(match[1]),position=Number(match[2]);
 return 'P'+((row-1)*19+position)+' · Row '+row;
}
export function eligiblePlantPreferences(map){
 if(!Array.isArray(map?.rows)||!Array.isArray(map.plants))return [];
 const counts=new Map(map.rows.filter(r=>Number.isInteger(r?.enabledCount)&&r.enabledCount>=0&&r.enabledCount<=19)
  .map(r=>[r.row,r.enabledCount]));
 return map.plants.filter(p=>Number.isInteger(p?.row)&&Number.isInteger(p.position)&&p.key==='r'+p.row+'-p'+p.position&&plantPosition(p.key)
  &&p.position<=counts.get(p.row)&&Number.isInteger(p.stage)&&p.stage>=2&&p.stage<=10
  &&(p.status==='unverified'||p.status==='available'));
}
export function plantPhotoPath(path){
 return typeof path==='string'&&/^\/api\/plants\/photos\/[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(path)?path:null;
}
Object.assign(ERRORS,{
 try_later:'Please wait a moment before requesting another code.',
 invalid_or_expired_code:'The code could not be verified. Check the six digits in your latest email or request a new code.',
 required_consents:'Read and confirm the privacy and educational use terms to continue.',
 teacher_consent_required:'Confirm the terms in your teaching account to continue.',

 school_application_exists:'Your registration is already on file. Refresh to see its status.',
 plant_school_limit:'Your school already holds or has requested three plants.',
 additional_reason_required:'Tell the farm how your school will use this plant (at least 10 characters).',
 school_already_registered:'This school is registered. Ask its primary teacher to invite your email.',
 master_required:'Only this school’s primary teacher can make that change.',
 organisation_changed:'Another teacher changed the school profile. Copy your edits, refresh and try again.',
 invalid_transfer:'Select a different teacher who has accepted access to this school.',
 invitation_unavailable:'This invitation has expired or has already been used. Ask the primary teacher to send another.',
 member_exists:'This email already has access to the school.',
 withdrawal_unavailable:'The withdrawal status has changed. Refresh your school settings to review the current status.',
 plant_unavailable:'That plant is unavailable. Choose another preference or select “Any plant”.',
 application_unavailable:'This registration is no longer available to this account.',
 offer_unavailable:'This offer has changed. Refresh to see the latest status.',
 plant_access_required:'Use the educator account that registered this school to open its journal.',
 question_limit:'Please wait before sending another question.',
 consent_required:'Confirm the educator statement before continuing.',
 invalid_email:'Enter a complete school email address.'
});
const STORY_ID=/^sl(?:0[1-9]|[12][0-9]|3[0-9]|40)$/;
const STORY_PLACEMENTS=new Set(['opening','lesson-1','lesson-2','lesson-3','lesson-4','reflection']);
export function storyImageId(value){const id=String(value||'').replace(/^stories\//,'');return STORY_ID.test(id)?id:null;}
export function classroomToolPath(file){return typeof file==='string'&&/^[A-Za-z0-9][A-Za-z0-9_-]{0,120}\.pdf$/.test(file)?'/assets/education/classroom/'+file:null;}
export function normaliseStoryLibrary(value){
 const clean=(v,max=1000)=>typeof v==='string'?v.trim().slice(0,max):'';
 const seen=new Set(),scenes=[];
 for(const row of Array.isArray(value?.scenes)?value.scenes:[]){const id=storyImageId(row?.id);if(!id||seen.has(id)||!clean(row.title,180))continue;seen.add(id);scenes.push({id,image:id,title:clean(row.title,180),theme:clean(row.theme,100),unit:/^u[1-8]$/.test(row.unit)?row.unit:null,cast:(Array.isArray(row.cast)?row.cast:[]).filter(x=>['Pip','Milla','Dot'].includes(x)),alt:clean(row.alt,800),question:clean(row.question,600),stages:(Array.isArray(row.stages)?row.stages:[]).filter(x=>Object.hasOwn(STAGES,x))});}
 const toolIds=new Set(),classroomTools=[];
 for(const row of Array.isArray(value?.classroomTools)?value.classroomTools:[]){if(!row||typeof row.id!=='string'||!/^[a-z0-9][a-z0-9-]{0,79}$/.test(row.id)||toolIds.has(row.id)||!classroomToolPath(row.file)||!clean(row.title,180))continue;toolIds.add(row.id);classroomTools.push({id:row.id,title:clean(row.title,180),description:clean(row.description,1500),file:row.file,pages:Number.isInteger(row.pages)&&row.pages>0&&row.pages<=1000?row.pages:null,paper:clean(row.paper,200),printNote:clean(row.printNote,800),category:clean(row.category,100)||'Classroom tools'});}
 return {scenes,classroomTools};
}
export function filterStoryScenes(scenes,{search='',theme='all',stage='all'}={}){const q=String(search).trim().toLowerCase();return scenes.filter(s=>(theme==='all'||s.theme===theme)&&(stage==='all'||!s.stages.length||s.stages.includes(stage))&&(!q||[s.title,s.theme,s.question,...s.cast].join(' ').toLowerCase().includes(q)));}
export function resourceStoryMoments(resource,scenes,placement){if(!STORY_PLACEMENTS.has(placement))return [];const byId=new Map(scenes.map(s=>[s.id,s]));return (Array.isArray(resource?.storyScenes)?resource.storyScenes:[]).filter(m=>m&&m.placement===placement&&STORY_ID.test(m.sceneId)&&byId.has(m.sceneId)).map(m=>({...byId.get(m.sceneId),question:typeof m.question==='string'?m.question.slice(0,500):byId.get(m.sceneId).question,character:['Pip','Milla','Dot','Together'].includes(m.character)?m.character:byId.get(m.sceneId).cast.join(', ')}));}
export function storyEditorRows(value){const existing=new Map((Array.isArray(value)?value:[]).filter(m=>m&&STORY_PLACEMENTS.has(m.placement)).map(m=>[m.placement,m]));return [...STORY_PLACEMENTS].map(placement=>{const current=existing.get(placement);return {placement,sceneId:storyImageId(current?.sceneId)||'',character:['Pip','Milla','Dot','Together'].includes(current?.character)?current.character:'Together',question:typeof current?.question==='string'?current.question:''};});}
export function storyScenesFromEditor(rows){if(!Array.isArray(rows)||rows.length>6)throw Error('Use at most six story moments.');const seen=new Set(),moments=[];for(const row of rows){if(!row||!STORY_PLACEMENTS.has(row.placement)||seen.has(row.placement))throw Error('Use each story placement once.');seen.add(row.placement);if(!row.sceneId)continue;const sceneId=storyImageId(row.sceneId);if(!sceneId||sceneId!==row.sceneId)throw Error('Choose one of the forty story scenes.');if(!['Pip','Milla','Dot','Together'].includes(row.character))throw Error('Choose Pip, Milla, Dot or Together for this story moment.');const question=String(row.question||'').trim();if(question.length>500)throw Error('Keep each story question to 500 characters or fewer.');moments.push({sceneId,placement:row.placement,character:row.character,...(question?{question}:{})});}return moments;}
// Presentation owns only its temporary animations. Requests and teacher edits stay independent.
function createEducationMotion(root,dialog){
 const query=window.matchMedia('(prefers-reduced-motion: reduce)'),animations=new Set(),byElement=new WeakMap(),resultTimers=new Map();
 const nav=root.querySelector('.edu-app-nav'),marker=nav?document.createElement('span'):null;
 let reduced=false,navFrame=0;
 function cancel(animation){if(!animation)return;animations.delete(animation);animation.cancel();}
 function cancelTarget(element){cancel(byElement.get(element));}
 function cancelWithin(element){for(const animation of [...animations])if(element===animation.effect?.target||element.contains(animation.effect?.target))cancel(animation);}
 function stop(preserveMarker=false){if(navFrame){cancelAnimationFrame(navFrame);navFrame=0;}for(const timer of resultTimers.values())clearTimeout(timer);resultTimers.clear();for(const animation of [...animations])if(!preserveMarker||animation.effect?.target!==marker)cancel(animation);}
 function allowed(){return !reduced&&!document.hidden;}
 function play(element,keyframes,{duration=300,delay=0,easing='cubic-bezier(.2,.75,.25,1)'}={}){
  if(!allowed()||!element?.isConnected||typeof element.animate!=='function')return;
  cancelTarget(element);
  const animation=element.animate(keyframes,{duration,delay,easing,fill:'backwards'});
  animations.add(animation);byElement.set(element,animation);
  const release=()=>{animations.delete(animation);if(byElement.get(element)===animation)byElement.delete(element);};
  animation.finished.then(release,release);
 }
 function selection(animate=true){
  if(!nav||!marker)return;
  const selected=nav.querySelector('a[aria-current="page"]'),host=nav.getBoundingClientRect(),target=selected?.getBoundingClientRect();
  if(!target?.width||!target.height){cancelTarget(marker);marker.hidden=true;return;}
  const before=marker.hidden?null:marker.getBoundingClientRect();
  cancelTarget(marker);
  const x=target.left-host.left-nav.clientLeft+nav.scrollLeft,y=target.top-host.top-nav.clientTop+nav.scrollTop;
  marker.hidden=false;marker.style.width=target.width+'px';marker.style.height=target.height+'px';marker.style.transform='translate('+x+'px,'+y+'px)';
  if(animate&&before&&allowed()){
   const fromX=before.left-host.left-nav.clientLeft+nav.scrollLeft,fromY=before.top-host.top-nav.clientTop+nav.scrollTop;
   if(Math.abs(fromX-x)+Math.abs(fromY-y)+Math.abs(before.width-target.width)>1)play(marker,[{transform:'translate('+fromX+'px,'+fromY+'px) scale('+before.width/target.width+','+before.height/target.height+')'},{transform:'translate('+x+'px,'+y+'px) scale(1,1)'}],{duration:320});
  }
 }
 function resize(){if(navFrame)return;navFrame=requestAnimationFrame(()=>{navFrame=0;selection(false);});}
 function preference(){
  let saved=false;try{saved=localStorage.getItem('glenolia-motion')==='reduce';}catch{}
  reduced=query.matches||saved||document.documentElement.dataset.reduceMotion==='true';
  root.dataset.eduMotion=reduced?'reduce':'allow';
  if(reduced)stop();selection(false);
 }
 if(marker){marker.className='edu-nav-indicator';marker.setAttribute('aria-hidden','true');marker.hidden=true;nav.dataset.motionNav='';nav.prepend(marker);new ResizeObserver(resize).observe(nav);document.fonts?.ready.then(resize);}
 query.addEventListener?.('change',preference);
 window.addEventListener('storage',event=>{if(event.key==='glenolia-motion'||event.key===null)preference();});
 new MutationObserver(preference).observe(document.documentElement,{attributes:true,attributeFilter:['data-reduce-motion']});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else selection(false);});
 window.addEventListener('resize',resize,{passive:true});
 window.addEventListener('pagehide',()=>stop());
 window.addEventListener('pageshow',preference);
 dialog.addEventListener('close',()=>cancelWithin(dialog));
 preference();
 return {
  cancel:()=>stop(true),
  selection,
  enter(page){
   if(!allowed())return;
   const pieces=[...page.children].filter(n=>!n.matches('.edu-guidance,.edu-resource-grid,.edu-story-grid,.edu-tool-grid')).slice(0,5);
   pieces.forEach((node,index)=>play(node,[{opacity:.5,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:300,delay:Math.min(index,3)*28}));
   const grid=page.querySelector('.edu-resource-grid,.edu-story-grid,.edu-tool-grid');
   if(grid)[...grid.children].slice(0,6).forEach((node,index)=>play(node,[{opacity:.5,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:300,delay:70+index*25}));
  },
  results(grid){
   clearTimeout(resultTimers.get(grid));resultTimers.delete(grid);cancelWithin(grid);
   if(!allowed()||!grid.isConnected)return;
   // Filtering remains synchronous. Only the decorative entrance waits for a typing pause.
   resultTimers.set(grid,setTimeout(()=>{
    resultTimers.delete(grid);if(!allowed()||!grid.isConnected)return;
    [...grid.children].slice(0,6).forEach((node,index)=>play(node,[{opacity:.65,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:240,delay:index*22}));
   },110));
  },
  dialog(){play(dialog,[{opacity:.65,transform:'translateY(9px) scale(.99)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:240});}
 };
}
// Canvas strips original metadata. Keep the lossless WebP pixel chunk so transparent
// school artwork can use the same strict single-image normaliser as farm photographs.
function losslessLogo(data){
 if(!data.startsWith('data:image/webp;base64,'))return null;
 const riff=atob(data.split(',')[1]);
 if(riff.slice(0,4)!=='RIFF'||riff.slice(8,12)!=='WEBP')return null;
 let offset=12;
 while(offset+8<=riff.length){
  const length=riff.charCodeAt(offset+4)+256*riff.charCodeAt(offset+5)+65536*riff.charCodeAt(offset+6)+16777216*riff.charCodeAt(offset+7);
  const end=offset+8+length+length%2;
  if(end>riff.length)return null;
  if(riff.slice(offset,offset+4)==='VP8L'){
   const chunk=riff.slice(offset,end),size=4+chunk.length;
   return {mime:'image/webp',base64:btoa('RIFF'+String.fromCharCode(size&255,(size>>>8)&255,(size>>>16)&255,(size>>>24)&255)+'WEBP'+chunk)};
  }
  offset=end;
 }
 return null;
}
export async function prepareSchoolLogo(file){
 if(!file?.size||!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('Choose a PNG, JPEG or WebP logo.');
 let bitmap;
 try{bitmap=await createImageBitmap(file);}catch{throw Error('That image could not be opened. Choose another logo.');}
 try{
  const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');
  for(const edge of [512,384,256]){
   const scale=Math.min(1,edge/Math.max(bitmap.width,bitmap.height));
   canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
   ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
   const lossless=losslessLogo(canvas.toDataURL('image/webp',1));
   if(lossless){if(lossless.base64.length<=409600)return lossless;continue;}
   ctx.globalCompositeOperation='destination-over';ctx.fillStyle='white';ctx.fillRect(0,0,canvas.width,canvas.height);
   const encoded=canvas.toDataURL('image/jpeg',.9);
   if(encoded.startsWith('data:image/jpeg;base64,')&&encoded.split(',')[1].length<=409600)return {mime:'image/jpeg',base64:encoded.split(',')[1]};
  }
  throw Error('This logo could not be resized. Try another PNG or JPEG.');
 }finally{bitmap.close();}
}

const app=typeof document!=='undefined'?document.querySelector('[data-education-app]'):null;
if(app)start(app);
function start(root){
 const $=(selector,scope=root)=>scope.querySelector(selector),main=$('#edu-main'),dialog=$('[data-edu-dialog]');
 const apiBase=(root.dataset.apiBase||'/api').replace(/\/$/,'');
 const staffMode=root.dataset.mode==='staff',artBase=root.dataset.illustrationBase||'https://theglenolia.com.au/assets/education';
 const state={session:{user:null},resources:[],workspace:null,resourceCache:new Map(),staffDashboard:null,staffAuthenticated:false,render:0,filters:{search:'',stage:'all',term:'all',mode:'all',saved:false},guides:true,storyLibrary:null};
 let lastDialogFocus=null,resourcesLoaded=false,identityLoaded=false;
 const motion=createEducationMotion(root,dialog);
 function el(tag,text,cls){const n=document.createElement(tag);if(text!==undefined&&text!==null)n.textContent=String(text);if(cls)n.className=cls;return n;}
 function append(target,...nodes){for(const n of nodes.flat())if(n)target.append(typeof n==='string'?document.createTextNode(n):n);return target;}
 function button(label,callback,secondary=false){const b=el('button',label,'edu-button'+(secondary?' edu-button-secondary':''));b.type='button';b.addEventListener('click',callback);return b;}
 function link(label,href,secondary=false){const a=el('a',label,'edu-button'+(secondary?' edu-button-secondary':''));a.href=href;return a;}
 function small(text){return el('p',text,'edu-small');}
 function actions(...nodes){return append(el('div',null,'edu-actions'),nodes);}
 function notice(title,text){const n=el('div',null,'edu-notice');if(title)n.append(el('strong',title));if(text)n.append(el('p',text));return n;}
 function empty(title,text,action){const n=el('div',null,'edu-empty');n.append(el('h2',title),el('p',text));if(action)n.append(action);return n;}
 function tell(text){$('[data-global-status]').textContent=text;}
 function heading(title,description,kicker='LEARNING WITH THE GLENOLIA',right){const h=el('div',null,'edu-page-heading'),left=el('div');left.append(el('p',kicker,'edu-kicker'),el('h1',title));if(description)left.append(el('p',description));h.append(left);if(right)h.append(right);return h;}
 function art(name,description=''){const image=el('img');image.src=artBase+'/'+name+'.webp';image.alt=description;image.loading='lazy';image.decoding='async';image.addEventListener('error',()=>{image.hidden=true;},{once:true});return image;}
 function guide(name,text,character='Pip'){const g=el('aside',null,'edu-guidance'),p=el('p');p.append(el('strong',character+(character==='Pip, Milla & Dot'?' have a thought…':' has a thought…')),document.createTextNode(text));g.append(art(name),p);return g;}
 async function storyLibrary(timeout=15000){if(state.storyLibrary)return state.storyLibrary;const response=await fetch('/teachers/story-library.json',{credentials:'same-origin',cache:'no-cache',signal:AbortSignal.timeout(timeout)});if(!response.ok||!response.headers.get('Content-Type')?.includes('json'))throw Error('The classroom collection could not be opened just now. Please try again shortly.');state.storyLibrary=normaliseStoryLibrary(await response.json());return state.storyLibrary;}
 function storyArt(scene){const image=art('stories/'+scene.id,scene.alt||scene.title);image.width=1200;image.height=800;return image;}
 function storyMoment(scene){const figure=el('figure',null,'edu-guidance edu-story-moment'),caption=el('figcaption');caption.append(el('p',scene.character==='Together'?'A thought to share':scene.character||scene.cast.join(', ')||'A learning moment','edu-kicker'),el('p',scene.title,'edu-story-title'));if(scene.question)caption.append(el('p',scene.question));figure.append(storyArt(scene),caption);return figure;}
 function chapterMoments(resource,scenes,placement,target){for(const scene of resourceStoryMoments(resource,scenes,placement))target.append(storyMoment(scene));}
 function classroomCollectionLinks(){return actions(link('Story scenes','#stories',true),link('Classroom printables','#classroom',true));}
 async function storiesPage(query){const collection=await storyLibrary(),box=el('div');box.append(heading('Small stories. Growing questions.','Pip, Milla and Dot notice, try, pause and learn together. Choose a scene for a chapter opening, a discussion or a little classroom inspiration.','THE CHARACTER STORY LIBRARY',classroomCollectionLinks()));const filters=el('form',null,'edu-filters edu-story-filters'),search=input('storySearch',{type:'search',maxLength:120}),themes=[...new Set(collection.scenes.map(s=>s.theme).filter(Boolean))],theme=select('storyTheme',[['all','All learning themes'],...themes.map(t=>[t,t])],themes.includes(query.get('theme'))?query.get('theme'):'all'),stage=select('storyStage',[['all','All stages'],...Object.entries(STAGES)],Object.hasOwn(STAGES,query.get('stage'))?query.get('stage'):'all');search.placeholder='Teamwork, soil, Pip…';filters.append(field('Find a story moment',search),field('Learning theme',theme),field('Learning stage',stage));filters.addEventListener('submit',event=>event.preventDefault());const status=small(''),grid=el('div',null,'edu-story-grid');status.setAttribute('role','status');status.setAttribute('aria-live','polite');function paint(){motion.results(grid);const matches=filterStoryScenes(collection.scenes,{search:search.value,theme:theme.value,stage:stage.value});status.textContent=matches.length+' '+(matches.length===1?'story moment':'story moments')+' to explore';grid.replaceChildren();if(!matches.length){grid.append(empty('Another question to try.','Choose another theme or clear the search to see more scenes.'));return;}for(const scene of matches){const card=el('article',null,'edu-story-card'),body=el('div');card.append(storyArt(scene));body.append(el('p',scene.theme,'edu-kicker'),el('h2',scene.title));if(scene.question)body.append(el('p',scene.question));body.append(small(scene.cast.join(', ')),actions(button('Explore this moment',()=>{const content=el('div',null,'edu-story-dialog');content.append(storyArt(scene));if(scene.question)content.append(el('p',scene.question,'edu-detail-intro'));content.append(small('Invite learners to notice the action, explain what they think and connect it with their own evidence. This is an illustration, not a record of a real farm event.'));const imageLink=link('Open the reusable image',artBase+'/stories/'+scene.id+'.webp',true);imageLink.target='_blank';imageLink.rel='noopener';const jpgLink=link('Download classroom JPG',artBase+'/stories/'+scene.id+'.jpg',true);jpgLink.setAttribute('download',scene.id+'-'+scene.title.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.jpg');content.append(actions(jpgLink,imageLink,link('Browse learning packs','#library',true)));openDialog(scene.title,content);},true)));card.append(body);grid.append(card);}}for(const control of [search,theme,stage])control.addEventListener(control===search?'input':'change',paint);paint();box.append(filters,status,grid,small('Free for teacher-led classroom use with The Glenolia credit. Keep the characters recognisable; illustrations are learning companions rather than scientific diagrams, actual farm photographs or evidence of completed facilities.'));return box;}
 async function classroomPage(){const collection=await storyLibrary(),box=el('div');box.append(heading('A little more life in the classroom.','Useful printables for noticing, planning, measuring and working together. Choose the right paper size, check the print instructions and make each tool your own.','THE CLASSROOM TOOLKIT',classroomCollectionLinks()));box.append(guide('classroom','A good tool leaves room for your class’s own ideas.','Milla'));const categories=[...new Set(collection.classroomTools.map(t=>t.category))],filter=select('toolCategory',[['all','All classroom tools'],...categories.map(t=>[t,labelKey(t)])],'all'),filters=el('div',null,'edu-tool-filters'),count=small(''),grid=el('div',null,'edu-tool-grid');filters.append(field('Choose a useful tool',filter));count.setAttribute('role','status');count.setAttribute('aria-live','polite');function paint(){motion.results(grid);const matches=collection.classroomTools.filter(t=>filter.value==='all'||t.category===filter.value);count.textContent=matches.length+' '+(matches.length===1?'classroom tool':'classroom tools');grid.replaceChildren();if(!matches.length){grid.append(empty('The collection is taking a little pause.','Please try another category or return a little later.'));return;}for(const tool of matches){const card=el('article',null,'edu-tool-card'),format=el('div',null,'edu-tool-format');format.append(el('span','PDF'),small([tool.paper,tool.pages?tool.pages+' '+(tool.pages===1?'page':'pages'):null].filter(Boolean).join(' · ')));const preview=el('img',null,'edu-tool-preview');preview.src=classroomToolPath(tool.file).replace(/\.pdf$/,'.webp');preview.alt=tool.title+' — first-page preview';preview.loading='lazy';preview.width=600;preview.height=400;preview.addEventListener('error',()=>preview.remove());card.append(preview);card.append(format,el('p',labelKey(tool.category),'edu-kicker'),el('h2',tool.title),el('p',tool.description));if(tool.printNote)card.append(notice('Before you print',tool.printNote));const download=link('Download classroom PDF',classroomToolPath(tool.file),true);download.setAttribute('download',tool.file);card.append(actions(download));grid.append(card);}}filter.addEventListener('change',paint);paint();box.append(filters,count,grid,notice('A place for participation, not public ranking.','Use group names or classroom-created labels. Keep learner identities, private assessment results and health records in your school’s approved systems.'),small('Free for teacher-led educational use with The Glenolia credit. Calendars are planning tools; add your school’s own dates. Classroom materials do not establish official curriculum completion or grades.'));return box;}
 function errorPanel(error,retry){const n=empty('A little pause.',error.message||'We could not load this information just now.',actions(button('Try again',retry,true),link('Return to the library','#library',true),!state.session.user&&!staffMode?link('Teacher sign in','#signin'):null));n.classList.add('edu-error');return n;}
 function loading(){const n=el('div',null,'edu-loading');n.setAttribute('role','status');n.append(el('span',null,'edu-loading-leaf'),el('p','Gathering the latest information…'));return n;}
 async function api(path,body,options={}){const method=options.method||((body!==undefined)?'POST':'GET'),headers={Accept:'application/json'};if(body!==undefined)headers['Content-Type']='application/json';if(method!=='GET'&&!path.startsWith('/auth/'))headers['X-CSRF']=state.session.csrf||'';const response=await fetch(apiBase+path,{method,credentials:'same-origin',cache:'no-store',headers,body:body!==undefined?JSON.stringify(body):undefined,signal:AbortSignal.timeout(45000)});if(!response.headers.get('Content-Type')?.includes('application/json'))throw Error('Please refresh this page and sign in again. Your unsaved edits remain in this tab.');const data=await response.json();if(!response.ok){if(response.status===401)resetIdentity();const error=Error(ERRORS[data.error]||'This could not be completed just now. Your edits remain in this tab. Please try again.');error.status=response.status;error.code=data.error;throw error;}return data;}
 function gateway(path){return apiBase+path;}
 function input(name,{type='text',value='',maxLength,required=false,min,max,rows}={}){const n=el(type==='textarea'?'textarea':'input');if(type!=='textarea')n.type=type;n.name=name;n.value=value??'';if(maxLength)n.maxLength=maxLength;if(required)n.required=true;if(min!==undefined)n.min=min;if(max!==undefined)n.max=max;if(rows)n.rows=rows;return n;}
 function select(name,options,value){const n=el('select');n.name=name;for(const [v,t]of options){const o=el('option',t);o.value=v;n.append(o);}if(value!==undefined)n.value=value;return n;}
 function field(label,control,hint){const f=el('label',null,'edu-field');f.append(document.createTextNode(label),control);if(hint)f.append(el('small',hint));return f;}
 function form(onSave){const f=el('form'),err=el('p',null,'edu-form-error');err.setAttribute('role','alert');err.tabIndex=-1;f.addEventListener('input',()=>{f.dataset.dirty='true';});f.addEventListener('submit',async event=>{event.preventDefault();if(f.dataset.busy==='true'||!f.reportValidity())return;f.dataset.busy='true';err.textContent='';const controls=[...f.querySelectorAll('button[type=submit]')];controls.forEach(b=>b.disabled=true);try{await onSave(new FormData(f),f);f.dataset.dirty='false';}catch(error){err.textContent=error.message;err.focus();}finally{delete f.dataset.busy;controls.forEach(b=>b.disabled=false);}});f.append(err);return f;}
 function submit(label){const b=el('button',label,'edu-button');b.type='submit';return b;}
 function addForm(f,...nodes){const err=f.querySelector('.edu-form-error');for(const n of nodes.flat())if(n)f.insertBefore(n,err);return f;}
 function check(label,name,checked=false){const box=input(name,{type:'checkbox'});box.checked=checked;box.value='yes';const l=el('label',null,'edu-check');l.append(box,el('span',label));return l;}
 function section(title,...nodes){const s=el('section',null,'edu-section');s.append(el('h2',title));append(s,nodes);return s;}
 function list(values,ordered=false){const l=el(ordered?'ol':'ul');for(const v of values||[])l.append(el('li',v));return l;}
 function labelKey(value){return String(value).replace(/([a-z])([A-Z])/g,'$1 $2').replaceAll('_',' ').replace(/^./,x=>x.toUpperCase());}
 function rich(value,depth=0){const out=el('div');if(depth>7||value===null||value===undefined)return out;if(typeof value==='string'||typeof value==='number'){out.append(el('p',value));return out;}if(Array.isArray(value)){for(const entry of value){if(typeof entry==='string')out.append(el('p',entry));else out.append(rich(entry,depth+1));}return out;}if(typeof value==='object'){for(const [key,v]of Object.entries(value)){if(['id','image','imageURL','pdfKey','pdfBlob'].includes(key)||v===null||v===undefined)continue;out.append(el('h3',labelKey(key)),rich(v,depth+1));}}return out;}
 function openDialog(title,content){lastDialogFocus=document.activeElement;const h=el('h2',title);h.id='edu-dialog-title';$('[data-dialog-body]').replaceChildren(h,content);dialog.showModal();motion.dialog();}
 function closeDialog(){dialog.close();if(lastDialogFocus?.isConnected)lastDialogFocus.focus();}
 $('[data-dialog-close]').addEventListener('click',closeDialog);dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeDialog();}});
 $('[data-guide-toggle]').addEventListener('click',()=>{state.guides=!state.guides;root.classList.toggle('hide-guides',!state.guides);$('[data-guide-toggle]').setAttribute('aria-pressed',String(state.guides));$('[data-guide-toggle]').textContent=state.guides?'Hide character prompts':'Show character prompts';});
 const plantLanding='https://theglenolia.com.au/plant-portal/';
 const isPlantRoute=route=>['plant','plant-classroom','plant-settings','plant-preferences'].includes(route);
 function requiredCheck(label,name){
  const control=check(label,name);
  control.querySelector('input').required=true;
  return control;
 }
 function plantShell(route){
  if(staffMode)return;
  const mode=route==='plant-classroom'?'classroom':isPlantRoute(route)?'teacher':'';
  root.dataset.plantView=mode;
  const label=$('.edu-brand-label');
  label.textContent=mode?'PLANT PORTAL':'LEARNING TOGETHER';
  if(mode==='classroom'){
   $('[data-workspace-context]').replaceChildren();
   $('[data-account-link]').textContent='';
   tell('');
  }
 }
 // Preserve only recognised plant destinations across a same-browser email link.
 function cleanPlantReturn(value){
  const [route,raw='']=String(value).split('?');
  if(!['plant','plant-settings','plant-preferences'].includes(route))return null;
  const params=new URLSearchParams(raw),allowed=new URLSearchParams();
  for(const key of ['orgId','applicationId','thread'])if(/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(params.get(key)||''))allowed.set(key,params.get(key));
  if(plantPosition(params.get('prefer')))allowed.set('prefer',params.get('prefer'));
  return route+(allowed.size?'?'+allowed:'');
 }
 function rememberPlantReturn(){
  const destination=cleanPlantReturn(location.hash.slice(1))||'plant';
  document.cookie='__Host-glenolia-plant-return='+encodeURIComponent(destination)+'; Max-Age=900; Path=/; Secure; SameSite=Lax';
 }
 function takePlantReturn(){
  const entry=document.cookie.split('; ').find(item=>item.startsWith('__Host-glenolia-plant-return='));
  if(!entry)return null;
  document.cookie='__Host-glenolia-plant-return=; Max-Age=0; Path=/; Secure; SameSite=Lax';
  try{const value=decodeURIComponent(entry.split('=').slice(1).join('='));return plantPosition(value)?'plant?prefer='+value:cleanPlantReturn(value);}catch{return null;}
 }
 function plantIntro(){
  const a=el('a','← Explore the farm rows','edu-back');
  a.href=plantLanding;
  return a;
 }
 function plantForm(formEl){
  formEl.className='edu-form-panel plant-form';
  return formEl;
 }
 const privacyPage='https://theglenolia.com.au/privacy/#education-privacy';
 const educationalUse='https://theglenolia.com.au/privacy/#educational-use';
 const otpKey='glenolia.educator.pending-code';
 let teacherPrefs=null, learningContent=null;
 function pendingCode(value){
  try {
   if(value===null){sessionStorage.removeItem(otpKey);return null;}
   if(value){sessionStorage.setItem(otpKey,JSON.stringify(value));return value;}
   const saved=JSON.parse(sessionStorage.getItem(otpKey)||'null');
   return saved?.until>Date.now() && typeof saved.email==='string'?saved:null;
  } catch {return null;}
 }
 function plainLink(label,href){const a=el('a',label);a.href=href;return a;}
 function teacherCodeEntry(preference,plant){
  const box=el('div',null,'plant-panel'),slot=el('div');
  if(plant)box.append(plantIntro());
  box.append(heading(plant?'Your school’s coffee plant':'Teacher sign in','Use your school email to receive a six-digit login code.',plant?'SCHOOL PLANT PORTAL':'TEACHER WORKSPACE'));
  if(plantPosition(preference))box.append(small('Your preference: '+plantPosition(preference)));
  function emailForm(value=''){
   const email=input('email',{type:'email',required:true,maxLength:254,value});email.autocomplete='email';
   const f=plantForm(form(async values=>{
    const address=String(values.get('email')).trim();
    await api('/auth/request',{email:address,role:'teacher',intent:'signin',consent:true});
    const challenge={email:address,until:Date.now()+900000};
    pendingCode(challenge);
    if(plant)rememberPlantReturn();
    showCode(challenge,true);
   }));
   addForm(f,field('School email',email),small('By requesting a code you confirm you are an adult educator.'),actions(submit('Email my code')));
   slot.replaceChildren(f);
  }
  function showCode(challenge,focus){
   const code=input('code',{required:true,maxLength:6});code.autocomplete='one-time-code';code.inputMode='numeric';code.pattern='[0-9]{6}';code.placeholder='000000';code.classList.add('plant-code');
   const f=plantForm(form(async values=>{
    state.session=await api('/auth/verify',{email:challenge.email,code:String(values.get('code')).trim()});
    identityLoaded=true;teacherPrefs=null;pendingCode(null);takePlantReturn();
    if(!plant && currentRoute().route==='signin')routeTo('library');else await render();
   }));
   const resend=button('Send a new code',async()=>{
    resend.disabled=true;
    try{await api('/auth/request',{email:challenge.email,role:'teacher',intent:'signin',consent:true});challenge.until=Date.now()+900000;pendingCode(challenge);code.value='';tell('Check your inbox and use the latest code. Allow 90 seconds between requests.');code.focus();}
    catch(error){tell(error.message);}finally{resend.disabled=false;}
   },true);
   addForm(f,el('h2','Check your inbox'),el('p','Enter the code sent to '+challenge.email+'. It is valid for 15 minutes in this browser.'),field('Six-digit code',code),actions(submit('Sign in'),resend),actions(button('Use another email',()=>{pendingCode(null);emailForm(challenge.email);slot.querySelector('input')?.focus();},true)));
   slot.replaceChildren(f);if(focus)code.focus();
  }
  const challenge=pendingCode();
  if(challenge)showCode(challenge,false);else emailForm();
  box.append(slot);return box;
 }
 function plantSignIn(preference){return teacherCodeEntry(preference,true);}
 function preferencesPage(settings,setup){
  const box=el('div',null,'plant-panel');
  box.append(heading(setup?'Set up your teaching account':'Email preferences',state.session.user.email,'TEACHER ACCOUNT'));
  const f=plantForm(form(async (v,current)=>{
   teacherPrefs=await api('/teacher/preferences',{privacy:setup?v.get('privacy')==='yes':true,education:setup?v.get('education')==='yes':true,immediate:v.get('immediate')==='yes',monthly:v.get('monthly')==='yes'});
   current.dataset.dirty='false';tell(setup?'Your teaching account is ready.':'Email preferences saved.');await render();
  }));
  if(setup){
   addForm(f,requiredCheck('I have read the teacher privacy notice.','privacy'),plainLink('Read the teacher privacy notice',privacyPage),
    requiredCheck('I agree to use the portal for teacher-managed education.','education'),plainLink('Read the educational use terms',educationalUse));
  }
  addForm(f,el('h2','Emails from the farm'),small('Choose either, both or neither. You can change these choices any time.'),
   check('Email me when the farmer posts an update for a plant my school follows.','immediate',Boolean(settings.immediate)),
   check('Send me a monthly summary of my school’s plants.','monthly',Boolean(settings.monthly)),
   actions(submit(setup?'Save and continue':'Save email preferences')));
  box.append(f);
  if(!setup)box.append(actions(link('Back to my school',plantRoute('plant',currentRoute().query.get('orgId')),true),plainLink('Teacher privacy notice',privacyPage)));
  return box;
 }
 function schoolApplication(map,preference,previous,{organisation,additional}){
  const box=el('div',null,'plant-panel');
  box.append(plantIntro(),heading(additional?'Apply for another plant':organisation?'Apply for a plant':'Register your school',additional?'Tell the farm how another plant supports your classes. A school can hold up to three places.':'Follow a coffee plant with your class for free. Nearby schools have first priority.','SCHOOL PLANT PORTAL'));
  const requestId=crypto.randomUUID();
  function plantChoices(inventory,wanted){
   const eligible=eligiblePlantPreferences(inventory);
   const options=[['any','Any plant the farm can offer'],...eligible.map(p=>[
    p.key,plantPosition(p.key)+(p.status==='unverified'?' · awaiting field check':'')
   ])];
   const stale=Boolean(plantPosition(wanted))&&!eligible.some(p=>p.key===wanted);
   if(stale)options.unshift(['','Choose a new preference']);
   const control=select('preferredKey',options,stale?'':plantPosition(wanted)?wanted:'any');
   if(stale){control.required=true;control.options[0].disabled=true;}
   return control;
  }
  let choices=plantChoices(map,preference);
  const f=plantForm(form(async (values,current)=>{
   const selected=values.get('preferredKey');
   const core={preferredKey:selected==='any'?null:selected,consent:values.get('consent')==='yes',requestId};
   const body=organisation?{...core,orgId:organisation.id,reason:String(values.get('reason')||'').trim()}:
    {...core,schoolName:String(values.get('schoolName')).trim(),suburb:String(values.get('suburb')).trim(),schoolType:String(values.get('schoolType')),address:String(values.get('address')).trim(),publicName:values.get('publicName')==='yes'};
   try{const response=await api('/plants/apply',body);
    current.dataset.dirty='false';if(current.isConnected){await refreshAfterMutate('Plant application received.',plantRoute('plant',response.orgId||organisation?.id,response.applicationId||response.id||requestId));}return;
   }catch(error){
    if(error.code==='plant_unavailable'){
     // A farmer can change visibility or stage while the teacher fills in the form.
     const rejected=values.get('preferredKey');
     const pending=plantChoices(null,rejected);
     choices.replaceWith(pending);choices=pending;
     const updated=plantChoices(await api('/plants/map'),rejected);
     choices.replaceWith(updated);choices=updated;
     throw error;
    }
    if(error.code!=='school_application_exists'||additional)throw error;
   }
   current.dataset.dirty='false';
   if(current.isConnected){tell('School registration received.');await render();}
  }));
  const name=input('schoolName',{maxLength:160,required:true,value:previous?.schoolName||(state.session.school?.kind==='school'?state.session.school.name:'')});
  name.autocomplete='organization';
  const suburb=input('suburb',{maxLength:100,required:true,value:previous?.suburb||''});suburb.autocomplete='address-level2';
  const schoolType=select('schoolType',[['','Choose school level'],['primary','Primary school'],['high','High school'],['combined','Primary and high school'],['other','Other school']],previous?.schoolType||'');schoolType.required=true;
  const fields=el('div',null,'plant-field-pair');fields.append(field('School suburb',suburb),field('School level',schoolType));
  if(!organisation){
   const address=input('address',{type:'textarea',maxLength:300,required:true,rows:2});address.autocomplete='street-address';
   addForm(f,field('School name',name),fields,field('Organisation address',address),
    check('Show our school name beside adopted plants on the public map.','publicName'),small('Your address stays private. You can add a school logo in settings.'));
  }else if(additional){
   const reason=input('reason',{type:'textarea',required:true,maxLength:1200,rows:3});reason.minLength=10;
   addForm(f,field('How will your school use this plant?',reason,'Include the class, learning activity and how you will follow its progress.'));
  }
  addForm(f,field('Preferred plant',choices,'The farm checks the field tag before offering a place.'),
   requiredCheck('I am authorised to register this school for educational adoption. The farm keeps and cares for the plant.','consent'),
   actions(submit(organisation?'Send application':'Register my school')),small('School contact · '+state.session.user.email));
  if(choices.required)
   box.append(notice('That position is currently unavailable.','Choose another preference or let the farm match your class.'));
  box.append(f);
  return box;
 }
 function plantRoute(route,orgId,applicationId,extra){
  const query=new URLSearchParams();
  if(orgId)query.set('orgId',orgId);
  if(applicationId)query.set('applicationId',applicationId);
  for(const [key,value] of Object.entries(extra||{}))if(value)query.set(key,value);
  return '#'+route+(query.size?'?'+query:'');
 }
 function organisationNav(record,selected){
  const nav=el('nav',null,'plant-org-nav');nav.setAttribute('aria-label','School plant workspace');
  const org=record.organisation;
  const school=el('a',org?.name||'My school','plant-school-name');school.href=plantRoute('plant',org?.id);
  const logo=org?.logoUrl;
  if(typeof logo==='string'&&logo.startsWith('/api/plants/')&&!logo.includes('\\')){
   const img=el('img');img.alt='';img.src=logo;img.width=42;img.height=42;img.addEventListener('error',()=>img.remove(),{once:true});school.prepend(img);
  }
  const links=el('div',null,'plant-org-links');
  for(const [text,route] of [['Plants','plant'],['School settings','plant-settings'],['Email preferences','plant-preferences']]){
   const a=plainLink(text,plantRoute(route,org?.id));
   if(selected===route)a.setAttribute('aria-current','page');
   links.append(a);
  }
  nav.append(school,links);
  if(record.organisations?.length>1){
   const selector=select('organisation',record.organisations.map(o=>[o.id,o.name]),org?.id);
   selector.onchange=()=>{location.hash=plantRoute(selected,selector.value);};nav.append(field('Switch school',selector));
  }
  return nav;
 }
 function applicationNav(record){
  const org=record.organisation,apps=record.applications||[];
  const current=apps.filter(a=>['pending','offered','active','cooling'].includes(a.status));
  const box=el('div',null,'plant-tree-switch');
  if(current.length>1){
   const control=select('classPlant',current.map(a=>[a.id,(plantPosition(a.plantKey||a.preferredKey)||'Plant request')+' · '+adoptionLabel(a.status)]),record.application?.id);
   control.onchange=()=>{location.hash=plantRoute('plant',org.id,control.value);};
   box.append(field('Choose a school plant',control));
  }
  if(org?.isMaster&&current.length<3 && current.length>0)box.append(plainLink('Apply for another plant',plantRoute('plant',org.id,null,{apply:'another'})));
  return box;
 }
 function adoptionLabel(status){
  return ({pending:'Under review',offered:'Offer ready',active:'Adopted',cooling:'Withdrawal requested',released:'Released',declined:'Declined'})[status]||labelKey(status);
 }
 function localPlantTime(value){
  if(!value)return '';
  const date=new Date(value);
  if(!Number.isFinite(date.getTime()))return '';
  return new Intl.DateTimeFormat('en-AU',{dateStyle:'medium',timeStyle:'short',timeZone:'Australia/Sydney'}).format(date);
 }
 function refreshAfterMutate(message,href){
  tell(message);
  if(href&&location.hash!==href){location.hash=href;return;}
  return render();
 }
 function confirmedAction(title,detail,actionLabel,run,requestHandover=false){
  const body=el('div');body.append(el('p',detail));
  const f=form(async values=>{await run(String(values.get('handover')||'').trim());if(dialog.open)closeDialog();});
  if(requestHandover)addForm(f,field('Handover note · optional',input('handover',{type:'textarea',maxLength:1200,rows:2}),'Saved to the school’s adoption history.'));
  addForm(f,actions(submit(actionLabel),button('Cancel',closeDialog,true)));body.append(f);openDialog(title,body);
 }
 function incomingInvitations(record){
  if(!record.incomingInvitations?.length)return null;
  const box=section('School invitations');
  for(const invite of record.incomingInvitations){
   const f=form(async()=>{const response=await api('/plants/invite/accept',{invitationId:invite.id});await refreshAfterMutate('You now share access to your school’s plants.',plantRoute('plant',response.orgId||invite.orgId));});
   const decline=button('Decline',()=>confirmedAction('Decline this invitation?',invite.schoolName,'Decline invitation',async()=>{await api('/plants/invite/decline',{invitationId:invite.id});await refreshAfterMutate('Invitation declined.');}),true);
   addForm(f,el('h3',invite.schoolName),small('Join with '+state.session.user.email+'. The school’s primary teacher manages membership.'),actions(submit('Join school'),decline));
   box.append(f);
  }
  return box;
 }
 function schoolSettings(record){
  const org=record.organisation,box=el('div',null,'plant-panel');
  box.append(organisationNav(record,'plant-settings'),heading('School settings',org.name,'SCHOOL PLANT PORTAL'));
  if(!org.isMaster)box.append(notice('Shared teacher access','You can follow the school’s plants and ask the farm questions. Your primary teacher manages school details and invitations.'));
  if(org.isMaster){
   const f=plantForm(form(async v=>{
    await api('/plants/organisation',{orgId:org.id,name:String(v.get('name')).trim(),address:String(v.get('address')).trim(),publicName:v.get('publicName')==='yes',revision:org.revision});
    await refreshAfterMutate('School details saved.');
   }));
   const address=input('address',{type:'textarea',value:org.address,maxLength:300,required:true,rows:2});address.autocomplete='street-address';
   addForm(f,field('School or organisation name',input('name',{value:org.name,maxLength:160,required:true})),field('Organisation address',address),
    check('Show our school name beside adopted plants on the public map.','publicName',Boolean(org.publicName)),small('Your address, teacher emails and school logo stay in the private workspace.'),
    actions(submit('Save school details')));
   box.append(section('Organisation profile',f));
   const logo=plantForm(form(async v=>{
    const file=v.get('logo');if(!file?.size)throw Error('Choose a school logo first.');
    const data=await prepareSchoolLogo(file);
    await api('/plants/organisation/logo',{orgId:org.id,logo:data});await refreshAfterMutate('School logo saved.');
   }));
   const file=input('logo',{type:'file',required:true});file.accept='image/png,image/jpeg,image/webp';
   const remove=org.logoUrl?button('Remove logo',()=>confirmedAction('Remove the school logo?',org.name,'Remove logo',async()=>{await api('/plants/organisation/logo',{orgId:org.id,logo:null});await refreshAfterMutate('School logo removed.');}),true):null;
   addForm(logo,field('Upload a school logo',file,'Choose a PNG, JPEG or WebP. The portal fits the whole logo within 512 × 512 pixels.'),actions(submit('Save logo'),remove));box.append(section('School logo',logo));
   const members=record.members||[],team=section('Teachers');
   const teamList=el('ul',null,'plant-member-list');
   for(const member of members){
    const item=el('li');item.append(el('strong',member.name||member.email),small((member.name?member.email+' · ':'')+(member.isMaster?'Primary teacher':'Shared teacher')));
    if(!member.isMaster)item.append(actions(
     button('Make primary teacher',()=>confirmedAction('Transfer the primary account?',member.email+' will manage invitations, school details and the same adopted plants. You will remain a shared teacher.','Transfer to this teacher',async reason=>{await api('/plants/transfer',{orgId:org.id,userId:member.id,reason});await refreshAfterMutate('Primary teacher changed.');},true),true),
     button('Remove access',()=>confirmedAction('Remove teacher access?',member.email+' will lose access to this school’s plant journals.','Remove access',async()=>{await api('/plants/member/remove',{orgId:org.id,userId:member.id});await refreshAfterMutate('Teacher access removed.');}),true)));
    teamList.append(item);
   }
   team.append(teamList);
   const invite=plantForm(form(async v=>{await api('/plants/invite',{orgId:org.id,email:String(v.get('email')).trim()});await refreshAfterMutate('Teacher invitation created.');}));
   const email=input('email',{type:'email',required:true,maxLength:254});
   addForm(invite,field('Invite a teacher by school email',email),actions(submit('Invite teacher')));team.append(invite);
   for(const inv of record.invitations||[]){
    const row=el('div',null,'plant-member-row');row.append(el('p',inv.email+' · Invitation pending'),button('Revoke invitation',()=>confirmedAction('Revoke this invitation?',inv.email,'Revoke invitation',async()=>{await api('/plants/invite/revoke',{orgId:org.id,invitationId:inv.id});await refreshAfterMutate('Invitation revoked.');}),true));team.append(row);
   }
   box.append(team);
  }else if(org.address){box.append(section('Organisation profile',el('p',org.address)));}
  const trees=section('School adoptions'),applications=record.applications||[];
  for(const a of applications){
   const row=el('article',null,'plant-member-row');
   row.append(el('strong',plantPosition(a.plantKey||a.preferredKey)||'Plant request'),small(adoptionLabel(a.status)));
   if(a.status==='active'&&org.isMaster)row.append(button('Request withdrawal',()=>{
    const formEl=form(async v=>{await api('/plants/withdraw',{applicationId:a.id,reason:String(v.get('reason')).trim()});if(dialog.open)closeDialog();await refreshAfterMutate('Withdrawal requested. You can cancel during the cooling period.');});
    const reason=input('reason',{type:'textarea',required:true,maxLength:1200,rows:3});reason.minLength=10;
    addForm(formEl,el('p','This plant stays reserved for five working days. The farm journal stays with the tree for its next school.'),field('Reason for withdrawing',reason,'Write at least 10 characters. Keep pupil details private.'),actions(submit('Start withdrawal'),button('Keep this adoption',closeDialog,true)));
    openDialog('Withdraw '+plantPosition(a.plantKey)+'?',formEl);
   },true));
   if(a.status==='cooling'){
    row.append(small('Scheduled release · '+localPlantTime(a.releaseAt)+' Sydney time'));
    if(org.isMaster)row.append(button('Cancel withdrawal',()=>confirmedAction('Keep this adoption?',plantPosition(a.plantKey),'Cancel withdrawal',async()=>{await api('/plants/withdraw/cancel',{applicationId:a.id});await refreshAfterMutate('Withdrawal cancelled.');}),true));
   }
   trees.append(row);
  }
  if(!applications.length)trees.append(small('Your plant requests will appear here.'));
  box.append(trees);
  if(record.events?.length){
   const history=el('details',null,'plant-history');history.append(el('summary','Adoption history'));
   for(const event of record.events){
    const row=el('div',null,'plant-member-row');
    row.append(el('strong',labelKey(event.action)),small([localPlantTime(event.createdAt),plantPosition(event.plantKey)].filter(Boolean).join(' · ')));
    if(event.reason)row.append(el('p',event.reason));history.append(row);
   }
   box.append(history);
  }
  return box;
 }
 function plantStatus(application,org,currentCount){
  const box=el('div',null,'plant-panel'),offered=application.status==='offered',pending=application.status==='pending';
  box.append(plantIntro(),heading(offered?'Your plant is ready':pending?(currentCount>1?'Application received':'School registered'):'Application update',application.schoolName,'SCHOOL PLANT PORTAL'));
  const card=el('section',null,'plant-status');
  if(offered){
   card.append(el('h2',plantPosition(application.plantKey)||'Your coffee plant'),el('p','The farm has offered this plant to your class. Accept to open your free journal.'));
   if(application.preferredKey&&application.plantKey!==application.preferredKey)card.append(small('Your original preference was '+plantPosition(application.preferredKey)+'.'));
   const f=form(async (_values,current)=>{
    try{await api('/plants/accept',{applicationId:application.id,plantKey:application.plantKey});}
    catch(error){
     if(error.code!=='offer_unavailable')throw error;
     if(current.isConnected){tell('The offer has changed. Review the current plant before accepting.');await render();}
     return;
    }
    if(current.isConnected){tell('Your plant journal is open.');await render();}
   });addForm(f,actions(submit('Accept this plant')));card.append(f);
  }else if(pending){
   card.append(el('h2','With the farm team'),el('p','We’re reviewing your school’s request. Return here to see your offer.'));
   if(application.preferredKey)card.append(small('Your preference: '+plantPosition(application.preferredKey)));
   card.append(actions(button('Check status',()=>render(),true)));
  }else{
   card.append(el('h2','A place hasn’t been offered'),el('p','Contact the farm if you’d like to discuss your application.'),actions(org?.isMaster&&currentCount<3?link('Apply again',plantRoute('plant',org.id,null,{apply:'again'})):null,link('Contact the farm','mailto:info@theglenolia.com.au',true)));
  }
  if(application.status==='released'){card.replaceChildren(el('h2','Plant released'),el('p','The withdrawal is complete. The farm keeps the plant’s field journal.'),actions(org?.isMaster&&currentCount<3?link('Apply for a plant',plantRoute('plant',org.id,null,{apply:'again'})):null));}
  if(offered&&org&&!org.isMaster){card.querySelector('form')?.remove();card.append(small('Your primary teacher can accept this offer.'));}
  box.append(card);return box;
 }
 function observedDate(entry){
  const stamp=String(entry.observedOn||'');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(stamp))return '';
  return new Intl.DateTimeFormat('en-AU',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(stamp+'T12:00:00Z'));
 }
 function observation(entry){
  const card=el('article',null,'plant-entry'),textBox=el('div',null,'plant-entry-note'),date=observedDate(entry);
  const photo=plantPhotoPath(entry.photoUrl);
  if(photo){
   const figure=el('figure'),img=el('img');img.src=photo;img.alt='Farm photograph of the class plant'+(date?' on '+date:'');img.decoding='async';
   img.addEventListener('error',()=>figure.replaceChildren(small('This photograph could not be loaded. Refresh to try again.')),{once:true});
   figure.append(img);card.append(figure);
  }
  const time=el('time',date);time.dateTime=entry.observedOn;
  textBox.append(time);if(entry.note)textBox.append(el('p',entry.note));append(textBox,fieldConditions(entry.weather));card.append(textBox);return card;
 }
 function plantJournal(record,classroom,guide,orgId,report=null,threadId=null){
  const {application,updates=[]}=record;
  const label=plantPosition(application.plantKey)||'Our coffee plant';
  const box=el('div',null,classroom?'plant-classroom':'plant-panel plant-journal');
  if(classroom){
   const exit=el('a','← Exit classroom view','edu-back plant-class-exit');exit.href=plantRoute('plant',orgId,application.id);
   box.append(exit,heading(label,'','CLASSROOM PLANT JOURNAL'));
   const stage=el('section',null,'plant-class-stage'),slide=el('div'),navigation=actions();
   let index=0;
   function showEntry(){
    slide.replaceChildren(updates.length?observation(updates[index]):notice('First field update to come.','Your farmer will add a dated photograph or observation here.'));
    if(updates.length>1){
     const newer=button('Newer update',()=>{index--;showEntry();newerButtonFocus();},true);
     const older=button('Earlier update',()=>{index++;showEntry();olderButtonFocus();},true);
     newer.disabled=index===0;older.disabled=index===updates.length-1;
     navigation.replaceChildren(newer,small((index+1)+' of '+updates.length),older);
    }
   }
   function newerButtonFocus(){const buttons=navigation.querySelectorAll('button');(buttons[0]?.disabled?buttons[1]:buttons[0])?.focus();}
   function olderButtonFocus(){const buttons=navigation.querySelectorAll('button');(buttons[1]?.disabled?buttons[0]:buttons[1])?.focus();}
   slide.setAttribute('aria-live','polite');showEntry();stage.append(slide,navigation);
   const prompt=el('section',null,'plant-prompt');
   const prompts=application.schoolType==='high'?['What evidence of change can we find?','Which conditions could explain a change?','What would we measure next?']:['What do you notice about this plant?','What looks different since last time?','What would you like to look for next?'];
   let step=0;const question=el('h2',prompts[0]);question.setAttribute('aria-live','polite');
   prompt.append(el('p','DISCUSS TOGETHER','edu-kicker'),question,
    actions(button('Next question',()=>{step=(step+1)%prompts.length;question.textContent=prompts[step];},true),button('Print activity',()=>window.print(),true)));
   box.append(stage,prompt);append(box,learningCard(guide,application.schoolType));return box;
  }
  const threads=plantThreadsPanel({applicationId:application.id,api,threadId});
  const jump=target=>{
   target.scrollIntoView({block:'start'});
   const title=target.querySelector('h2');
   if(title){title.tabIndex=-1;title.focus({preventScroll:true});}
  };
  const reportHeader=el('header',null,'plant-report-header');
  reportHeader.append(fieldHero({application,updates,report,classroomHref:plantRoute('plant-classroom',orgId,application.id),onMessage:()=>jump(threads)}));
  box.append(reportHeader);
  if(application.status==='cooling')box.append(notice('Withdrawal requested','This plant is reserved until '+localPlantTime(application.releaseAt)+' Sydney time. The primary teacher can cancel in School settings.'));
  const latest=section('Farmer journal',updates.length?observation(updates[0]):notice('Waiting for the first field note.','The farmer’s dated observations and photos will appear here.'));
  if(updates.length>1){
   const history=el('details',null,'plant-history');history.append(el('summary','Earlier updates ('+(updates.length-1)+')'));
   history.addEventListener('toggle',()=>{if(history.open&&history.children.length===1)for(const entry of updates.slice(1))history.append(observation(entry));});latest.append(history);
  }
  const facts=el('div',null,'field-context-grid');facts.append(fieldFacts(report),farmWeather(api));
  reportHeader.append(facts);
  const workshops=workshopShelf(api),award=schoolAward(api,application.id);
  const nav=el('nav',null,'field-shortcuts');nav.setAttribute('aria-label','On this plant page');
  for(const [label,section] of [['Farmer journal',latest],['Workshops & sheets',workshops],['Certificate & media kit',award]]){
   const control=el('button',label);control.type='button';control.addEventListener('click',()=>jump(section));nav.append(control);
  }
  reportHeader.append(nav);box.append(latest,threads,companionPrompt(artBase,guide?.item?.question));
  append(box,learningCard(guide,application.schoolType));
  const files=el('div',null,'field-download-grid');files.append(workshops,award);box.append(files);
  box.append(actions(button('Refresh journal',()=>render(),true),link('Teacher workspace','#library',true)));return box;
 }
 async function plantPage(route,query){
  const pref=query.get('prefer'),orgId=query.get('orgId'),appId=query.get('applicationId');
  const selector=new URLSearchParams();
  if(orgId)selector.set('orgId',orgId);if(appId)selector.set('applicationId',appId);
  const suffix=selector.size?'?'+selector:'';
  const closed=()=>empty('Classroom view is closed.','A teacher can open it from an adopted plant’s journal.',link('Back to plant portal','#plant',true));
  if(route==='plant-classroom'){
   try{
    const record=await api('/plants/classroom'+suffix);
    if(!['active','cooling'].includes(record.application?.status))return closed();
    return plantJournal(record,true,await learningForPlant(record.application.stage),orgId);
   }catch(error){if([401,403,404].includes(error.status))return closed();throw error;}
  }
  if(!state.session.user)return plantSignIn(pref);
  if(route==='plant-preferences')return preferencesPage(teacherPrefs,false);
  const record=await api('/plants/me'+suffix);
  const invitations=incomingInvitations(record),org=record.organisation,app=record.application;
  if(org&&route==='plant-settings')return append(schoolSettings(record),invitations);
  const active=(record.applications||[]).filter(a=>['active','cooling','pending','offered'].includes(a.status));
  const applyAgain=org?.isMaster&&query.get('apply')==='again'&&active.length<3;
  const additional=org&&['another','again'].includes(query.get('apply'))&&org.isMaster&&active.length>0&&active.length<3;
  let page;
  if(!additional&&['active','cooling'].includes(app?.status)){
   const [guide,report]=await Promise.all([learningForPlant(app.stage),api('/plants/field-report?applicationId='+encodeURIComponent(app.id)).catch(error=>{
    if([401,403,404].includes(error.status))throw error;
    return null;
   })]);
   page=plantJournal(record,false,guide,org?.id,report,query.get('thread'));
  }else if(!additional&&app&&['pending','offered','declined','released'].includes(app.status)&&!applyAgain){
   page=plantStatus(app,org,active.length);
  }else if(!org&&invitations&&query.get('apply')!=='new'){
   page=el('div',null,'plant-panel');page.append(heading('Join your school','Accept your invitation to open the school’s existing plant journals.','SCHOOL PLANT PORTAL'),invitations);
   page.append(actions(link('Register a different school','#plant?apply=new',true)));return page;
  }else if(org&&!org.isMaster){
   page=empty('Your school’s plant portal','The primary teacher can apply for a plant for this school.');
  }else{
   const map=await api('/plants/map');
   page=schoolApplication(map,pref,app,{organisation:org,additional});
  }
  if(org){page.prepend(organisationNav(record,'plant'));const nav=applicationNav(record);if(nav.childElementCount&&!additional){
   if(page.classList.contains('plant-journal')&&!nav.querySelector('select'))page.append(nav);
   else page.insertBefore(nav,page.querySelector('.plant-report-header,.edu-page-heading')||null);
  }}
  if(!page.classList.contains('plant-journal'))page.append(workshopShelf(api));
  if(invitations)page.prepend(invitations);
  return page;
 }
 async function learningForPlant(stage){
  if(!Number.isInteger(stage)||stage<1||stage>10)return null;
  try{if(!learningContent)learningContent=await api('/plants/learning');
   const item=learningContent.stages?.find(s=>s.stage===stage);return item?{item,source:learningContent.source,note:learningContent.note}:null;
  }catch{return null;}
 }
 function learningCard(guide,schoolType){
  if(!guide)return null;
  const {item,source}=guide;
  const box=el('section',null,'plant-learning'),stage=el('p','GROWTH STAGE '+item.stage+' OF 10','edu-kicker');
  box.append(stage,el('h2',item.name));
  for(const [title,content] of [['What to look for',item.lookFor],['What may happen next',item.next]])if(content)box.append(el('h3',title),el('p',content));
  const activity=el('details',null,'plant-activity');activity.append(el('summary','Classroom activity'));
  const audience=schoolType==='high'?[['Secondary',item.secondary]]:schoolType==='primary'?[['Primary',item.primary]]:[['Primary',item.primary],['Secondary',item.secondary]];
  for(const [label,value] of audience)if(value)activity.append(el('h3',label+' class'),el('p',value));
  if(item.question)activity.append(el('h3','Discuss together'),el('p',item.question));box.append(activity);
  if(guide.note)box.append(small(guide.note));
  if(source?.url&&safeLink(source.url)){
   const a=plainLink([source.title,source.authors,source.edition,item.pages].filter(Boolean).join(' · '),safeLink(source.url));a.target='_blank';a.rel='noopener noreferrer';
   const cite=el('p',null,'edu-small');cite.append(a);box.append(cite);
  }
  return box;
 }
 function fieldConditions(weather){
  if(!weather?.loggedAt)return null;
  const box=el('details',null,'plant-weather');box.append(el('summary','Farm conditions at logging'));
  const location=weather.location||{};box.append(small([location.name,plantPosition(location.plantKey),localPlantTime(weather.loggedAt)+' Sydney time'].filter(Boolean).join(' · ')));
  const now=weather.current,rain=weather.rainfall,observed=weather.observedDay;
  if(now){
   const values=[[now.temperatureC,'°C'],[now.humidityPct,'% humidity'],[now.windKmh,' km/h wind']].filter(([n])=>Number.isFinite(n)).map(([n,u])=>n+u);
   if(values.length)box.append(el('p',values.join(' · ')),small('Area weather estimate · '+localPlantTime(now.validAt)+(now.stale?' · Last available estimate':'')));
  }
  if(Number.isFinite(rain?.mm))box.append(el('p',rain.mm+' mm area rainfall · '+rain.day));
  if(observed&&(Number.isFinite(observed.minTemperatureC)||Number.isFinite(observed.rainfallMm))){
   const values=[Number.isFinite(observed.minTemperatureC)&&Number.isFinite(observed.maxTemperatureC)?observed.minTemperatureC+'–'+observed.maxTemperatureC+' °C':null,Number.isFinite(observed.rainfallMm)?observed.rainfallMm+' mm rain':null].filter(Boolean);
   box.append(small('Observation-day area record · '+observed.day+' · '+values.join(' · ')));
  }
  if(!now&&!rain&&!observed)box.append(small('Area weather was unavailable for this entry.'));
  const links=new Map();
  for(const data of [now,rain,observed])if(data?.source&&safeLink(data.sourceUrl))links.set(data.sourceUrl,data.source);
  if(links.size&&safeLink(weather.licenceUrl))links.set(weather.licenceUrl,'CC BY 4.0');
  const sourceLine=el('div',null,'plant-source-links');for(const [href,label] of links)sourceLine.append(plainLink(label,href));if(links.size)box.append(sourceLine);
  return box;
 }
 function authNeeded(message='Sign in with your work email to save resources and prepare your groups.'){return empty('Your teaching starts here.',message,link('Teacher sign in','#signin'));}
 function updateAccount(){const user=state.session.user,a=$('[data-account-link]');if(staffMode){a.href='#';a.textContent='Open teacher workspace';a.onclick=async event=>{event.preventDefault();try{const result=await api('/owner-workspace',{}),url=new URL(result.url);if(url.origin!=='https://glenolia-education.theglenolia.workers.dev'||url.pathname!=='/auth/verify')throw Error('The teacher workspace link could not be verified.');openDialog('Your teacher workspace.',notice('Open the working teacher portal.','This short-lived link opens your owner account without sending a sign-in email.'));$('[data-dialog-body]').append(actions(link('Open teacher workspace',url.href)));}catch(error){tell(error.message);}};return;}a.href=user?'#profile':'#signin';a.textContent=user?(user.name||user.email):staffMode?'Check staff access':'Teacher sign in';const bar=$('[data-workspace-context]'),school=state.session.school;bar.replaceChildren();bar.hidden=!user;if(user&&school){const text=el('p');text.append(el('strong',school.name||'Private planning workspace'),document.createTextNode(' · '+(school.evidenceEnabled?'School observations enabled':school.kind==='personal'?'Personal planning · no learner records':'Planning access · learner observations not enabled')));bar.append(text);const a=el('a','School and account');a.href='#profile';bar.append(a);}}
 async function workspace(force=false){if(!state.session.user)return null;if(!state.workspace||force)state.workspace=await api('/workspace');return state.workspace;}
 function resetIdentity(){
  state.session={user:null};teacherPrefs=null;pendingCode(null);state.workspace=null;state.resourceCache.clear();state.resources=[];resourcesLoaded=false;
  if(dialog.open)closeDialog();
  $('[data-dialog-body]').replaceChildren();updateAccount();
  const {route,query}=currentRoute();
  if(!staffMode&&isPlantRoute(route)){
   state.render++;
   plantShell(route);
   main.replaceChildren(route==='plant-classroom'?empty('Classroom view is closed.','Sign in with your teacher account to reopen this journal.',link('Back to plant portal','#plant',true)):plantSignIn(query.get('prefer')));
  }
 }
 if(!staffMode){
  window.addEventListener('storage',event=>{
   if(event.key!=='glenolia-educator-signout')return;
   resetIdentity();tell('You have signed out.');render();
  });
  // A restored page must establish the current session before showing a journal.
  window.addEventListener('pageshow',event=>{
   if(event.persisted&&isPlantRoute(currentRoute().route)){resetIdentity();main.replaceChildren(loading());initialise();}
  });
  window.addEventListener('pagehide',()=>{
   if(isPlantRoute(currentRoute().route)){main.replaceChildren(loading());$('[data-dialog-body]').replaceChildren();}
  });
 }
 function currentRoute(){const raw=location.hash.replace(/^#/,'')|| (staffMode?'staff-schools':'library'),[route,query]=raw.split('?');return {route,query:new URLSearchParams(query||'')};}
 function routeTo(route){location.hash=route;}
 function isDirty(){return [...root.querySelectorAll('form[data-dirty=true]')].some(f=>f.isConnected);}
 root.addEventListener('click',event=>{const a=event.target.closest('a[href^="#"]');if(a&&a.getAttribute('href')!=='#edu-main'&&isDirty()&&!window.confirm('Leave this page without saving your edits?'))event.preventDefault();});
 window.addEventListener('beforeunload',event=>{if(isDirty()){event.preventDefault();event.returnValue='';}});
 window.addEventListener('hashchange',()=>render());
 function normalisedResources(values){return (Array.isArray(values)?values:[]).map(resourceSummary).filter(Boolean);}
 async function getResource(id,version=null){const result=await api('/resources/'+encodeURIComponent(id)+(version?'?version='+encodeURIComponent(version):''));const resource=resourceSummary(result.resource);if(!resource)throw Error('This resource could not be opened just now.');return resource;}
 async function saveFavourite(id,saved,button){if(!state.session.user){routeTo('signin');return;}button.disabled=true;try{await api('/favourites',{resourceId:id,saved});await workspace(true);button.setAttribute('aria-pressed',String(saved));button.setAttribute('aria-label',(saved?'Remove favourite: ':'Save favourite: ')+(state.resources.find(r=>r.id===id)?.title||'resource'));tell(saved?'Saved to your favourites.':'Removed from your favourites.');if(state.filters.saved)render();}catch(error){tell(error.message);}finally{button.disabled=false;}}
 function bookmark(resource){const saved=Boolean(state.workspace?.favourites?.includes(resource.id)),b=button('',()=>saveFavourite(resource.id,b.getAttribute('aria-pressed')!=='true',b));b.className='edu-bookmark';b.setAttribute('aria-label',(saved?'Remove favourite: ':'Save favourite: ')+resource.title);b.setAttribute('aria-pressed',String(saved));b.innerHTML='<svg viewBox="0 0 20 24" aria-hidden="true"><path d="M4 2h12v20l-6-4-6 4Z"/></svg>';return b;}
 function resourceCard(r){const card=el('article',null,'edu-resource-card'),image=el('div',null,'edu-resource-image'),theme=['welcome','observe','measure','soil','weather','living','community','design','reflect','classroom','rest','explore'].includes(r.image)?r.image:THEMES[(r.unit||r.id.match(/u\d+$/)?.[0])]||'observe';const storyId=storyImageId(r.image);image.append(art(storyId?'stories/'+storyId:theme),bookmark(r));const content=el('div',null,'edu-resource-card-content'),tags=el('div',null,'edu-tags');tags.append(el('span',stageLabel(r.stage),'edu-tag'));if(r.term)tags.append(el('span','Term '+r.term,'edu-tag'));const h=el('h2'),a=el('a',r.title);a.href='#resource/'+encodeURIComponent(r.id);h.append(a);content.append(tags,h,el('p',r.summary));const bottom=el('div',null,'edu-card-bottom');if(r.syllabus||r.syllabusTitle)bottom.append(el('p',r.syllabusTitle||r.syllabus,'edu-card-meta'));bottom.append(actions(link('Explore resource',a.href,true)),small(r.availability==='public'?'Free public sample':r.availability==='selected'?'Free · school access required':'Free · verified adult teacher account'));content.append(bottom);card.append(image,content);return card;}
 async function libraryPage(query){if(state.session.user)await workspace();if(query.has('stage')&&STAGES[query.get('stage')])state.filters.stage=query.get('stage');const box=el('div');box.append(heading('A year of small discoveries.','Find a question for your class. Choose a stage, a term or a learning mode, then make it your lesson.'),guide('welcome','A good question is a lovely place to begin. What will your class notice today?','Pip, Milla & Dot'));const filters=el('form',null,'edu-filters'),q=input('search',{type:'search',value:state.filters.search,maxLength:120}),stage=select('stage',[['all','All stages'],...Object.entries(STAGES)],state.filters.stage),term=select('term',[['all','All terms'],...Array.from({length:4},(_,i)=>[String(i+1),'Term '+(i+1)])],state.filters.term),mode=select('mode',[['all','All learning modes'],...Object.entries(MODES)],state.filters.mode);q.placeholder='Plants, water, community…';filters.append(field('Find a resource',q),field('Learning stage',stage),field('Term',term),field('Learning mode',mode));filters.addEventListener('submit',e=>e.preventDefault());const footer=el('div',null,'edu-filter-footer'),count=el('p'),saved=check('My favourites','saved',state.filters.saved);if(!state.session.user)saved.querySelector('input').disabled=true;const reset=button('Clear filters',()=>{state.filters={search:'',stage:'all',term:'all',mode:'all',saved:false};q.value='';stage.value='all';term.value='all';mode.value='all';saved.querySelector('input').checked=false;paint();},true);reset.className='edu-text-button';footer.append(count,actions(saved,reset));const grid=el('div',null,'edu-resource-grid');function paint(){motion.results(grid);const f=state.filters;let matches=filterResources(state.resources,f);if(f.saved)matches=matches.filter(r=>state.workspace?.favourites?.includes(r.id));count.textContent=matches.length+' '+(matches.length===1?'resource':'resources')+' for your next discovery';grid.replaceChildren();if(!matches.length){grid.className='';grid.append(empty('A different question, perhaps.','Try another stage or clear a filter to explore the current library.'));}else{grid.className='edu-resource-grid';for(const r of matches)grid.append(resourceCard(r));}}for(const [control,key]of [[q,'search'],[stage,'stage'],[term,'term'],[mode,'mode']])control.addEventListener(control===q?'input':'change',()=>{state.filters[key]=control.value;paint();});saved.querySelector('input').addEventListener('change',event=>{state.filters.saved=event.target.checked;paint();});paint();box.append(classroomCollectionLinks(),filters,footer,grid,small('Original teaching resources for selected NSW syllabus contexts. Teachers check suitability, choose adjustments and make assessment judgements. A downloaded edition remains on your device even if future access changes.'));return box;}
 async function noteDialog(resource){if(!state.session.user){routeTo('signin');return;}const ws=await workspace(),record=ws.remarks?.find(r=>r.resourceId===resource.id),f=form(async data=>{await api('/remarks',{resourceId:resource.id,note:String(data.get('note')||''),expectedRevision:record?.revision||0});await workspace(true);f.dataset.dirty='false';closeDialog();tell('Private planning note saved.');});addForm(f,small('This note is private to you. Keep learner names, health details and personal records in your school’s approved system.'),field('A note for your teaching',input('note',{type:'textarea',value:record?.note||'',maxLength:2000,rows:6})),actions(submit('Save private note')));openDialog('A thought for later.',f);}
 async function assignmentDialog(resource){if(!state.session.user){routeTo('signin');return;}const ws=await workspace(true),groups=(ws.groups||[]).filter(g=>g.status!=='closed');if(!groups.length){openDialog('A group to grow with.',empty('Create your first group.','A group keeps selected resource editions and your teaching plan together.',link('Create a group','#groups',true)));return;}const f=form(async data=>{const groupId=data.get('groupId');if(picker.querySelector('input')&&!data.getAll('sections').length)throw Error('Choose at least one lesson or learner sheet for this assignment.');await api('/groups/'+encodeURIComponent(groupId)+'/assignments',{resourceId:resource.id,version:resource.version,selectedSections:data.getAll('sections'),instructions:String(data.get('instructions')||''),...(data.get('dueDate')?{dueDate:data.get('dueDate')}: {})});state.workspace=null;f.dataset.dirty='false';closeDialog();tell('Resource edition assigned to your group.');});const picker=el('div',null,'edu-resource-picker');for(const [kind,items]of [['lessons',resource.lessons||[]],['studentSheets',resource.studentSheets||[]]]){if(items.length)picker.append(el('p',kind==='lessons'?'Teaching sequence':'Learner sheets','edu-small'));for(const [i,item]of items.entries()){const c=check(item.title||(kind==='lessons'?'Lesson ':'Sheet ')+(i+1),'sections',true);c.querySelector('input').value=String(item.id||kind+':'+i);picker.append(c);}}addForm(f,small('This pins version '+resource.version+' to the group. Future resource changes will not silently replace this assignment.'),field('Group',select('groupId',groups.map(g=>[g.id,g.name]))),picker.children.length?el('strong','Choose lesson sections'):null,picker.children.length?picker:null,field('Teaching instructions · optional',input('instructions',{type:'textarea',maxLength:1500,rows:3})),field('Planned date · optional',input('dueDate',{type:'date'})),actions(submit('Assign this edition')));openDialog('Make it part of your plan.',f);}
 function accordion(title,content){const d=el('details',null,'edu-accordion');d.append(el('summary',title),append(el('div',null,'edu-accordion-body'),content));return d;}
 function resourceFacts(r){const d=el('dl',null,'edu-resource-facts');for(const [label,value]of [['Learning stage',stageLabel(r.stage)],['Term',r.term?'Term '+r.term:'Teacher choice'],['Edition','Version '+r.version],['Language','English']]){const n=el('div');n.append(el('dt',label),el('dd',value));d.append(n);}return d;}
 async function detailPage(id,query){const version=query?.get('version');const r=await getResource(id,version&&/^\d+$/.test(version)?Number(version):null);let scenes=[];if(r.storyScenes?.length){try{scenes=(await storyLibrary(3500)).scenes;}catch{tell('The teaching resource is available. Its character illustrations are taking a little pause.');}}if(state.session.user)await workspace();const box=el('div'),back=el('a','← Learning library','edu-back');back.href='#library';box.append(back,heading(r.title,r.summary,'A QUESTION TO GROW WITH'));const grid=el('div',null,'edu-detail-grid'),body=el('div'),aside=el('aside',null,'edu-detail-aside'),panel=el('div',null,'edu-note-panel');panel.append(resourceFacts(r),actions(link('Download teacher & learner PDF',gateway('/resources/'+encodeURIComponent(r.id)+'/pdf?version='+r.version))),actions(button('Assign to a group',()=>assignmentDialog(r),true),button('Private planning note',()=>noteDialog(r),true)),small('Free for authorised teaching use. Keep downloaded copies in line with your school’s records and resource licence.'));aside.append(panel);chapterMoments(r,scenes,'opening',body);if(r.question)body.append(el('p',r.question,'edu-detail-intro'));if(r.curriculumNote)body.append(notice('Curriculum context',r.curriculumNote));if(r.learningIntentions?.length)body.append(section('The learning intention',list(r.learningIntentions)));if(r.successCriteria?.length)body.append(section('What learners can show',list(r.successCriteria)));if(r.equipment?.length)body.append(section('Have these ready',list(r.equipment)));const lessons=section('Your lesson sequence');for(const [i,lesson]of (r.lessons||[]).entries()){const inner=el('div');chapterMoments(r,scenes,'lesson-'+(i+1),inner);if(lesson.duration)inner.append(small(durationLabel(lesson.duration)));for(const [key,label]of [['model','Model it'],['guided','Try it together'],['independent','Try it with your group'],['checks','Look for this evidence'],['answers','Teacher answer guidance']])if(lesson[key])inner.append(el('h3',label),rich(lesson[key]));lessons.append(accordion((i+1)+'. '+(lesson.title||'Learning lesson'),inner));}if(r.lessons?.length)body.append(lessons);chapterMoments(r,scenes,'reflection',body);if(r.studentSheets?.length){const sheets=section('Learner sheets');for(const sheet of r.studentSheets){const inner=el('div');if(sheet.prompt)inner.append(el('p',sheet.prompt));const columns=sheet.columns||sheet.tableColumns;if(columns?.length)inner.append(small('Record: '+columns.join(' · ')));if(sheet.answerGuidance)inner.append(el('h3','Teacher guidance'),rich(sheet.answerGuidance));sheets.append(accordion(sheet.title||'Learner sheet',inner));}body.append(sheets);}if(r.rubric?.length){const rubric=section('Teacher observation guide');for(const criterion of r.rubric){const inner=el('div');for(const [level,text]of Object.entries(criterion.descriptors||{}))inner.append(el('h3',LEVELS[level]||labelKey(level)),el('p',text));rubric.append(accordion(criterion.criterion,inner));}rubric.append(small('These are programme observation descriptors, not NESA grades. Use relevant evidence and your professional judgement.'));body.append(rubric);}const alternatives=section('Choose the right learning setting');for(const [key,label]of [['classroomAlternative','In the classroom'],['fieldAlternative','Optional field learning'],['homeAlternative','Optional home connection']])if(r[key])alternatives.append(el('h3',label),rich(r[key]));if(alternatives.children.length>1)body.append(alternatives);if(r.safety?.length)body.append(section('Care and safety',list(r.safety)));if(r.adjustments)body.append(section('Welcome different learners',rich(r.adjustments)));if(r.teacherMisconceptions?.length)body.append(section('Useful teacher checks',rich(r.teacherMisconceptions)));if(r.outcomes?.length){const mapped=section('Curriculum connections');for(const o of r.outcomes){mapped.append(el('h3',o.code||o.title||'Selected outcome'));if(o.partialLimit)mapped.append(el('p',o.partialLimit));if(o.source&&!/^https?:/.test(o.source))mapped.append(small(o.source));if(safeLink(o.url||o.source)){const a=el('a','Read the official outcome');a.href=safeLink(o.url||o.source);a.target='_blank';a.rel='noopener noreferrer';mapped.append(a);}}mapped.append(small('Check the edition and teaching year with your school. Selected outcome connections do not establish full syllabus coverage or NESA endorsement.'));body.append(mapped);}if(r.sources?.length){const sources=section('Sources and further reading');const ul=el('ul');for(const source of r.sources){const href=safeLink(source.url||source.source);if(!href)continue;const li=el('li'),a=el('a',source.title||'Source');a.href=href;a.target='_blank';a.rel='noopener noreferrer';li.append(a);if(source.accessedOn)li.append(document.createTextNode(' · Checked '+source.accessedOn));ul.append(li);}sources.append(ul);body.append(sources);}if(!r.storyScenes?.length&&r.characterPrompts?.length){const prompt=r.characterPrompts[0];body.prepend(guide(THEMES[r.id.match(/u\d+$/)?.[0]]||'observe',prompt.prompt||prompt.text,prompt.character||'Pip'));}grid.append(body,aside);box.append(grid);return box;}
 function signInPage(){return staffMode?authNeeded('Open the protected Education staff workspace from the owner admin.'):teacherCodeEntry(null,false);}
 async function groupsPage(){if(!state.session.user)return authNeeded();const ws=await workspace(true),box=el('div');box.append(heading('A group, a question, a plan.','Keep a class or teaching rotation together. Group labels should describe the learning, without learner names.',undefined,actions(button('Create a group',newGroupDialog))));const groups=ws.groups||[];if(!groups.length)box.append(empty('Your first group can start small.','Create a class or rotation, then assign a particular resource edition.',button('Create your first group',newGroupDialog,true)));else{const grid=el('div',null,'edu-info-grid');for(const g of groups){const c=el('article',null,'edu-group-card');c.append(el('span',stageLabel(g.stage),'edu-tag'),el('h2',g.name),small(g.status==='closed'?'Closed group':'Active group'));const counts=el('div',null,'edu-group-counters');for(const [value,label]of [[g.assignmentCount,'assignments'],[g.learnerCount,'learner aliases']])if(Number.isFinite(Number(value))){const s=el('span');s.append(el('strong',value),document.createTextNode(label));counts.append(s);}c.append(counts,actions(link('Open group','#group/'+encodeURIComponent(g.id),true)));grid.append(c);}box.append(grid);}return box;}
 function newGroupDialog(){const f=form(async data=>{const result=await api('/groups',{name:String(data.get('name')||''),stage:String(data.get('stage')||'')});state.workspace=null;f.dataset.dirty='false';closeDialog();tell('Group created. Choose a resource to start planning.');routeTo('group/'+result.group.id);});addForm(f,field('Class or group label',input('name',{required:true,maxLength:100}),'Use a teaching label such as “Garden investigators”. Keep learner names out of the group label.'),field('Learning stage',select('stage',Object.entries(STAGES))),actions(submit('Create group')));openDialog('A place for your group.',f);}
 function evidenceGate(){return notice('Planning is ready. Learner records come later.','Your school needs an approved processing agreement and an explicit learner-records grant before aliases, observations or reports can be added. Keep learner work in your school’s approved system while you plan here.');}
 async function groupPage(id){if(!state.session.user)return authNeeded();const result=await api('/groups/'+encodeURIComponent(id)),g=result.group,box=el('div');box.append(heading(g.name,'Keep the activity edition, teaching plan and relevant observations together.',stageLabel(g.stage),actions(button('Group settings',()=>groupSettings(g),true),link('Find resources','#library',true))));if(g.status==='closed')box.append(notice('This group is closed.','Your agreed school retention policy applies. Export the records your school needs before its retention window ends.'));const assignmentList=el('ul',null,'edu-list');for(const a of result.assignments||[]){const li=el('li'),r=state.resources.find(r=>r.id===(a.resourceId||a.resource_id));li.append(el('strong',a.title||r?.title||a.resourceId||a.resource_id),small('Assigned version '+a.version+(a.dueDate||a.due_date?' · Planned '+(a.dueDate||a.due_date):'')));if(a.instructions)li.append(el('p',a.instructions));li.append(actions(link('Open assigned edition','#resource/'+encodeURIComponent(a.resourceId||a.resource_id)+'?version='+a.version,true),link('Print selected handouts',gateway('/groups/'+g.id+'/assignments/'+a.id+'/print'),true),button('Remove assignment',()=>removeAssignment(g.id,a.id),true)));assignmentList.append(li);}box.append(section('Selected learning',assignmentList.children.length?assignmentList:empty('Choose the first activity.','Add a resource from the library to pin its edition to this group.',link('Browse resources','#library',true))));if(!result.canUseEvidence){box.append(evidenceGate());return box;}const learners=result.learners||[];const aliases=el('div',null,'edu-aliases');for(const learner of learners){const c=el('div',null,'edu-alias');c.append(el('span',learner.alias),button('Remove',()=>removeLearner(g.id,learner.id),true));aliases.append(c);}box.append(section('Learner aliases',small('Use codes only, such as P01. Your school keeps the identity key separately. Do not enter learner names, initials, birthdays or official IDs.'),aliases,actions(g.status==='closed'?null:button('Add a learner alias',()=>newLearnerDialog(g),true))));box.append(section('Teacher observations',small('Record only relevant learning evidence. Keep files, names, health details and sensitive records in your school’s approved system.'),actions(g.status==='closed'?null:button('Record an observation',()=>observationDialog(g,result),false)),observations(result.observations||[],learners,g.status==='closed'?null:g,result)));if((result.observations||[]).length)box.append(section('A report for your school',small('Review your observations before creating a report. Reports are learning summaries, not official grades. The report opens privately and can be printed or saved as PDF.'),actions(button('Review group report',()=>createReport(g.id)),...learners.map(l=>button('Review report: '+l.alias,()=>createReport(g.id,l.id),true)))));return box;}
 function groupSettings(g){const f=form(async data=>{await api('/groups/'+encodeURIComponent(g.id)+'/update',{name:String(data.get('name')||''),stage:String(data.get('stage')),status:String(data.get('status')),expectedRevision:g.revision});state.workspace=null;f.dataset.dirty='false';closeDialog();tell('Group settings saved.');render();});addForm(f,field('Group label',input('name',{value:g.name,maxLength:100,required:true})),field('Stage',select('stage',Object.entries(STAGES),g.stage)),field('Group status',select('status',[['active','Active'],['closed','Closed']],g.status)),small('Closing a group starts its agreed retention window. Check that your school has exported the records it needs.'),actions(submit('Save group settings')));openDialog('Care for this group.',f);}
 async function removeAssignment(groupId,id){openDialog('Remove this assignment?',notice('Your learner records may refer to this edition.','Removing an assignment does not recall downloaded copies. Continue only if this assignment is no longer needed.'));$('[data-dialog-body]').append(actions(button('Remove from group',async()=>{try{await api('/groups/'+encodeURIComponent(groupId)+'/assignments/'+encodeURIComponent(id)+'/remove',{});state.workspace=null;closeDialog();tell('Assignment removed.');render();}catch(e){tell(e.message);}}),button('Keep assignment',closeDialog,true)));}
 function newLearnerDialog(g){const f=form(async data=>{await api('/groups/'+encodeURIComponent(g.id)+'/learners',{alias:String(data.get('alias')||'')});f.dataset.dirty='false';closeDialog();tell('Learner alias added.');render();});const code=input('alias',{maxLength:24,required:true});code.pattern='[A-Za-z0-9-]{1,24}';addForm(f,field('Learner code',code,'Letters, numbers and hyphens only. Use a school-chosen pseudonym, never a name or official identifier.'),actions(submit('Add learner code')));openDialog('An alias, not an identity.',f);}
 async function removeLearner(groupId,id){openDialog('Remove this learner alias?',notice('Check your school’s records first.','This changes the group’s learner records. Export any observations required by your school before continuing.'));$('[data-dialog-body]').append(actions(button('Remove learner alias',async()=>{try{await api('/groups/'+encodeURIComponent(groupId)+'/learners/'+encodeURIComponent(id)+'/remove',{});closeDialog();tell('Learner alias removed.');render();}catch(e){tell(e.message);}}),button('Keep learner alias',closeDialog,true)));}
 function observations(items,learners,group=null,detail=null){if(!items.length)return empty('Look, listen and take a note.','No teacher observations are recorded for this group yet.');const out=el('div');for(const item of items){const c=el('article',null,'edu-observation-card'),alias=learners.find(l=>l.id===(item.learnerId||item.learner_id))?.alias||'Learner';c.append(el('h3',alias+' · '+(item.criterion||'Learning observation')),small((LEVELS[item.level]||item.level)+' · '+(item.observedOn||item.observed_on||'')+' · '+(MODES[item.mode]||item.mode)));if(item.evidence)c.append(el('p',item.evidence));if(item.feedback)c.append(el('p','Next teaching step: '+item.feedback));if(group&&detail)c.append(actions(button('Correct observation',()=>observationDialog(group,detail,item),true)));out.append(c);}return out;}
 async function observationDialog(g,data,existing=null){if(!data.learners?.length||!data.assignments?.length){openDialog('A little preparation first.',notice('Add a learner alias and a resource assignment.','An observation links a learner code to a particular learning activity and edition.'));return;}const resources=await Promise.all(data.assignments.map(async a=>{try{return await getResource(a.resourceId||a.resource_id,a.version);}catch{return null;}})),assignment=select('assignmentId',data.assignments.map(a=>[a.id,(a.title||state.resources.find(r=>r.id===(a.resourceId||a.resource_id))?.title||'Assigned resource')+' · v'+a.version])),criterion=select('criterion',[]);function setCriteria(){const i=data.assignments.findIndex(a=>a.id===assignment.value),r=resources[i];criterion.replaceChildren();for(const item of r?.rubric||[]){const o=el('option',item.criterion);o.value=item.criterion;criterion.append(o);}}if(existing)assignment.value=existing.assignmentId||existing.assignment_id;assignment.addEventListener('change',setCriteria);setCriteria();if(existing)criterion.value=existing.criterion;criterion.required=true;const f=form(async value=>{await api('/groups/'+encodeURIComponent(g.id)+'/observations',{learnerId:existing?(existing.learnerId||existing.learner_id):String(value.get('learnerId')),assignmentId:existing?(existing.assignmentId||existing.assignment_id):String(value.get('assignmentId')),criterion:existing?existing.criterion:String(value.get('criterion')),level:String(value.get('level')),evidence:String(value.get('evidence')||''),feedback:String(value.get('feedback')||''),mode:String(value.get('mode')),observedOn:String(value.get('observedOn')),...(existing?{id:existing.id,expectedRevision:existing.revision}:{})});f.dataset.dirty='false';closeDialog();tell('Teacher observation saved.');render();});addForm(f,field('Learner code',select('learnerId',data.learners.map(l=>[l.id,l.alias]),existing?.learnerId||existing?.learner_id)),field('Assigned activity',assignment),field('Learning criterion',criterion),field('Teacher judgement',select('level',Object.entries(LEVELS),existing?.level)),field('What evidence supports this judgement?',input('evidence',{type:'textarea',value:existing?.evidence||'',maxLength:1500,required:true,rows:4}),'Record a short learning observation. No names, health information or sensitive personal detail.'),field('Next teaching step · optional',input('feedback',{type:'textarea',value:existing?.feedback||'',maxLength:1000,rows:3})),append(el('div',null,'edu-inline-fields'),field('Learning setting',select('mode',Object.entries(MODES),existing?.mode)),field('Observation date',input('observedOn',{type:'date',value:existing?.observedOn||existing?.observed_on||'',required:true}))),actions(submit(existing?'Save observation correction':'Save teacher observation')));const levelInput=f.querySelector('[name=level]'),evidenceInput=f.querySelector('[name=evidence]');function evidenceRequirement(){evidenceInput.required=levelInput.value!=='not_observed';}levelInput.addEventListener('change',evidenceRequirement);evidenceRequirement();if(existing){f.querySelector('[name=learnerId]').disabled=true;assignment.disabled=true;criterion.disabled=true;}openDialog(existing?'Correct the learning record.':'What did the learning show?',f);}
 async function createReport(groupId,learnerId){try{const detail=await api('/groups/'+encodeURIComponent(groupId)),items=(detail.observations||[]).filter(o=>!learnerId||(o.learnerId||o.learner_id)===learnerId);if(!items.length){openDialog('A learning record comes first.',notice('There are no observations to report yet.','Review the activity and record relevant teacher observations before finalising a report. Missing evidence is not a failed assessment.'));return;}const f=form(async data=>{if(data.get('reviewed')!=='yes')throw Error('Review the observations before finalising this report.');const result=await api('/reports',{groupId,...(learnerId?{learnerId}:{})}),html=localDownloadURL(result.htmlUrl),csv=localDownloadURL(result.csvUrl);if(!html||!csv)throw Error('The private report links could not be verified. Please try again.');f.dataset.dirty='false';const ready=notice('Your private report is ready.','Open the HTML report, then use Print / Save as PDF. A later correction needs a new report version.');ready.append(actions(link('Open printable report',html),link('Download CSV',csv,true)));openDialog('A clear record of the learning.',ready);});addForm(f,el('p',detail.group.name),small(items.length+' teacher observations will be included. This finalises a dated snapshot; later changes do not silently rewrite it.'),observations(items,detail.learners||[]),check('I reviewed these learning observations and their limitations. This is a programme learning summary, not an official school grade.','reviewed'),actions(submit('Finalise private report')));f.querySelector('[name=reviewed]').required=true;openDialog('Review before finalising.',f);}catch(error){tell(error.message);}}
 function localDownloadURL(value){try{const u=new URL(value,location.href);return u.origin===location.origin&&u.pathname.startsWith(apiBase+'/')?u.href:null;}catch{return null;}}
 async function reportsPage(){if(!state.session.user)return authNeeded();const ws=await workspace(true),box=el('div');box.append(heading('Tell the learning story carefully.','Create a teacher-reviewed group or learner summary from the observations in an approved school workspace.'));if(!state.session.school?.evidenceEnabled||!state.session.school?.canAssess){box.append(evidenceGate());return box;}const groups=ws.groups||[];if(!groups.length)box.append(empty('A group comes first.','Create a group and record relevant learning observations before preparing a report.',link('Go to My groups','#groups',true)));else{const listEl=el('ul',null,'edu-list');for(const g of groups){const li=el('li');li.append(el('strong',g.name),small(stageLabel(g.stage)),actions(link('Review observations','#group/'+g.id,true),button('Review group report',()=>createReport(g.id))));listEl.append(li);}box.append(listEl);}box.append(notice('Teacher judgement stays with the school.','These summaries support programme learning. They do not create NESA grades, credentials, diagnoses or automated assessment decisions.'));return box;}
 async function visitPage(){const box=el('div');box.append(heading('A future visit starts with a question.','Tell us what your class is exploring. We can discuss a future learning experience as school and site readiness take shape.'),guide('community','Some good conversations start with “What if we tried…?”','Milla'));box.append(notice('An expression of interest, not a booking.','School visits are in preparation. Dates, access, facilities, programme fit and school approvals need to be confirmed before any visit is agreed.'));if(!state.session.user){box.append(authNeeded('Sign in with your work email to send a school learning enquiry. No student details are needed.'));return box;}const f=form(async data=>{await api('/interests',{stage:String(data.get('stage')),mode:String(data.get('mode')),preferredTerm:String(data.get('preferredTerm')),approximateCount:Number(data.get('approximateCount')),message:String(data.get('message')||'')});f.dataset.dirty='false';f.replaceChildren(notice('Thank you for sharing your idea.','Your enquiry is saved for the Glenolia team. This is not a booking confirmation. We will discuss the next practical step with your school.'));});f.className='edu-form-panel';addForm(f,field('Learning stage',select('stage',Object.entries(STAGES))),field('Preferred learning setting',select('mode',[['field','Future farm visit'],['indoor','Indoor learning workshop'],['classroom','Classroom resources / conversation']])),field('Preferred term or period',input('preferredTerm',{maxLength:80,required:true}),'For example, “Term 4, 2027”. Availability is subject to confirmation.'),field('Approximate learner count',input('approximateCount',{type:'number',min:1,max:500,required:true})),field('What would make the learning useful?',input('message',{type:'textarea',rows:5,maxLength:2000}),'Please leave out learner names, health information and other personal records.'),actions(submit('Send learning enquiry')));box.append(f);return box;}
 async function profilePage(){if(!state.session.user)return authNeeded();const u=state.session.user,school=state.session.school,box=el('div');box.append(heading('Your place in the learning.','Manage your adult teacher account and see the status of your school workspace.'));const profile=el('div',null,'edu-form-panel');profile.append(el('h2',u.name||'Teacher account'),el('p',u.email),small('Work email verified · Adult teaching account'));if(school)profile.append(notice(school.name,school.kind==='personal'?'This is your private planning workspace. It does not hold learner records.':school.evidenceEnabled?'Your school has learner observations enabled. Use only school-approved alias-based records.':'Your school planning workspace is available. Learner observations remain off until its agreement and access are approved.'));if(state.session.memberships?.length>1){const selector=select('schoolId',state.session.memberships.map(m=>[m.id,m.name]),school?.id),switchForm=form(async value=>{state.session=await api('/school/select',{schoolId:String(value.get('schoolId'))});state.workspace=null;state.resourceCache.clear();const latest=await api('/resources');state.resources=normalisedResources(latest.resources);switchForm.dataset.dirty='false';updateAccount();tell('Workspace changed. Only the selected school’s records are available.');await render();});addForm(switchForm,field('Active school or planning workspace',selector),actions(submit('Switch workspace')));profile.append(switchForm);}profile.append(actions(link('School plant settings','#plant-settings',true),link('Email preferences','#plant-preferences',true)),actions(link('Export my account data',gateway('/profile/export'),true),button('Sign out',async()=>{try{await api('/logout',{});resetIdentity();try{localStorage.setItem('glenolia-educator-signout',String(Date.now()));}catch{}tell('You have signed out.');routeTo('library');}catch(error){tell(error.message);}},true)),small('Portal messages serve your account and enquiries. A teacher account does not subscribe you to marketing.'));box.append(profile);return box;}
 async function render(){motion.cancel();const token=++state.render,{route,query}=currentRoute();if(!staffMode){updateAccount();plantShell(route);}main.replaceChildren(loading());for(const a of root.querySelectorAll('[data-edu-route]')){const active=route===a.dataset.eduRoute||(route==='plant-classroom'&&a.dataset.eduRoute==='plant')||(route.startsWith('resource/')&&a.dataset.eduRoute==='library')||(route.startsWith('group/')&&a.dataset.eduRoute==='groups');if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');}motion.selection();try{
  if(!staffMode&&route!=='plant-classroom'&&!identityLoaded){
   const session=await api('/session');if(token!==state.render)return;state.session=session;identityLoaded=true;updateAccount();
  }
  if(!staffMode&&route!=='plant-classroom'&&state.session.user){
   if(!teacherPrefs){const prefs=await api('/teacher/preferences');if(token!==state.render)return;teacherPrefs=prefs;}
   if(teacherPrefs.required){const entry=preferencesPage(teacherPrefs,true);main.replaceChildren(entry);motion.enter(entry);main.focus({preventScroll:true});document.title='Set up your teaching account | The Glenolia';return;}
  }
  if(!staffMode&&!isPlantRoute(route)&&!resourcesLoaded){
   const result=await api('/resources');if(token!==state.render)return;state.resources=normalisedResources(result.resources);resourcesLoaded=true;
  }
  let page;if(!staffMode&&isPlantRoute(route))page=await plantPage(route,query);else if(route==='library')page=await libraryPage(query);else if(route==='stories'&&!staffMode)page=await storiesPage(query);else if(route==='classroom'&&!staffMode)page=await classroomPage();else if(route.startsWith('resource/'))page=await detailPage(decodeURIComponent(route.slice(9)),query);else if(route==='signin')page=await signInPage();else if(route==='groups')page=await groupsPage();else if(route.startsWith('group/'))page=await groupPage(decodeURIComponent(route.slice(6)));else if(route==='reports')page=await reportsPage();else if(route==='visit')page=await visitPage();else if(route==='profile')page=await profilePage();else if(route.startsWith('staff-'))page=await staffPage(route);else page=await libraryPage(query);if(token!==state.render)return;main.replaceChildren(page);motion.enter(page);document.title=(main.querySelector('h1')?.textContent||'Teacher workspace')+' | The Glenolia';main.focus({preventScroll:true});}catch(error){if(token!==state.render)return;main.replaceChildren(errorPanel(error,render));}}
 async function dashboard(force=false){if(!staffMode)throw Error('Staff access is required.');if(!state.staffDashboard||force)state.staffDashboard=await api('/dashboard');return state.staffDashboard;}
 function staffTable(headers,rows){const wrap=el('div',null,'edu-table-wrap');wrap.tabIndex=0;wrap.setAttribute('role','region');wrap.setAttribute('aria-label',headers.join(', '));const table=el('table',null,'edu-table'),head=el('thead'),tr=el('tr');for(const text of headers){const th=el('th',text);th.scope='col';tr.append(th);}head.append(tr);table.append(head);const body=el('tbody');for(const row of rows){const tr=el('tr');for(const value of row){const td=el('td');append(td,value);tr.append(td);}body.append(tr);}table.append(body);wrap.append(table);return wrap;}
 async function schoolDialog(school=null){const data=await dashboard();if(!school){const teachers=(data.teachers||[]).filter(u=>!u.disabled),f=form(async value=>{await api('/schools',{name:String(value.get('name')||''),ownerEmail:String(value.get('ownerEmail')||'')});state.staffDashboard=null;f.dataset.dirty='false';closeDialog();tell('School created with planning access. Learner observations remain off.');render();});addForm(f,field('School name',input('name',{required:true,maxLength:160})),field('Verified school coordinator',select('ownerEmail',teachers.map(u=>[u.email,(u.name||u.email)+' · '+u.email]))),small('The adult coordinator must sign in once before a school can be created. Verify their school authority before granting access. Creating a school does not enable learner records.'),actions(submit('Create school planning workspace')));openDialog('A school to learn with.',f);return;}
  const f=form(async value=>{const enabled=value.get('evidenceEnabled')==='yes',status=String(value.get('status')),agreement=String(value.get('agreementReference')||'').trim();if(enabled&&(status!=='approved'||agreement.length<8))throw Error('Approve the school and enter the checked processing-agreement reference before enabling learner observations.');await api('/schools/'+school.id,{name:String(value.get('name')||''),status,evidenceEnabled:enabled,agreementReference:agreement,retentionDays:Number(value.get('retentionDays')),expectedRevision:school.revision});state.staffDashboard=null;f.dataset.dirty='false';closeDialog();tell('School settings saved. Access changes apply to future requests.');render();});addForm(f,field('School name',input('name',{value:school.name,maxLength:160,required:true})),field('Access status',select('status',[['pending','Planning / approval pending'],['approved','School approved'],['suspended','Access suspended']],school.status)),check('Enable alias-based learner observations under the checked school processing agreement.','evidenceEnabled',Boolean(school.evidence_enabled??school.evidenceEnabled)),field('Processing agreement reference',input('agreementReference',{value:school.agreement_reference||school.agreementReference||'',maxLength:300}),'Record the approved agreement or review reference. Do not paste learner records or private medical information.'),field('Retention after group closure · days',input('retentionDays',{type:'number',value:school.retention_days||school.retentionDays||90,min:7,max:730,required:true}),'School-agreed service setting, not a statement of a legal retention period. Check export, deletion and backup arrangements.'),notice('School approval and assessor access are separate.','This setting does not grant every teacher access to learner observations. Assign the relevant teacher permission separately.'),actions(submit('Save school settings')));openDialog('School access, kept clear.',f);
 }
 async function membershipDialog(user){const data=await dashboard(),schools=(data.schools||[]).filter(s=>s.status!=='suspended');if(!schools.length){openDialog('Create a school first.',notice('There is no active school workspace to select.','Create a checked school planning workspace, then grant teacher membership.'));return;}const school=select('schoolId',schools.map(s=>[s.id,s.name])),role=select('role',[['teacher','Teacher'],['coordinator','School coordinator']]),active=check('Membership is active.','active',true),assess=check('Permit learner observations and reports, only while this school’s agreement is enabled.','canAssess',false);function paint(){const m=(user.memberships||[]).find(m=>m.school_id===school.value||m.schoolId===school.value);role.value=m?.role||'teacher';active.querySelector('input').checked=m?Boolean(m.active):true;assess.querySelector('input').checked=Boolean(m?.can_assess??m?.canAssess);}school.addEventListener('change',paint);paint();const f=form(async value=>{await api('/memberships',{schoolId:String(value.get('schoolId')),userId:user.id,role:String(value.get('role')),active:value.get('active')==='yes',canAssess:value.get('canAssess')==='yes'});state.staffDashboard=null;f.dataset.dirty='false';closeDialog();tell('Teacher membership saved.');render();});addForm(f,el('p',(user.name||'Teacher')+' · '+user.email),field('School workspace',school),field('School role',role),active,assess,small('A school email domain alone is not proof of membership or school authority. Turning membership off revokes school access; do not grant a coordinator learner-record permission unless required.'),actions(submit('Save membership')));openDialog('A teacher’s school access.',f);}
 function cleanResource(pack){const value=JSON.parse(JSON.stringify(pack));for(const key of ['version','availability','pdfAvailable','pdfUrl','htmlUrl','publishedAt','revision'])delete value[key];return value;}
 function emptyResource(){return {id:'',title:'',stage:'S2',years:'Years 3–4',term:1,question:'',summary:'',language:'en',image:'observe',outcomes:[],learningIntentions:[],successCriteria:[],equipment:[],safety:[],adjustments:{},lessons:[],fieldAlternative:'',classroomAlternative:'',homeAlternative:'',studentSheets:[],rubric:[],teacherMisconceptions:[],characterPrompts:[],sources:[]};}
 function structuredEditor(label,value,forceJSON=false){const kind=forceJSON?'json':Array.isArray(value)&&value.every(v=>typeof v==='string')?'lines':value&&typeof value==='object'?'json':'text',control=input('structured',{type:'textarea',value:kind==='lines'?value.join('\n'):kind==='json'?JSON.stringify(value,null,2):value??'',maxLength:50000,rows:kind==='json'?8:4});if(kind==='json')control.classList.add('edu-code-field');const wrapper=field(label,control,kind==='lines'?'One item per line.':kind==='json'?'Structured section. Keep its existing field names and valid JSON.':null);return {wrapper,read(){if(kind==='lines')return control.value.split('\n').map(v=>v.trim()).filter(Boolean);if(kind==='json'){try{return JSON.parse(control.value);}catch{throw Error('Check the structured JSON in “'+label+'”. Your edits remain in the editor.');}}return control.value.trim();}};}
 function storyScenesEditor(value,choices){const wrapper=el('div'),grid=el('div',null,'edu-info-grid'),labels={opening:'Chapter opening','lesson-1':'Lesson / project phase 1','lesson-2':'Lesson / project phase 2','lesson-3':'Lesson / project phase 3','lesson-4':'Lesson / project phase 4',reflection:'Reflection'},titles=new Map(choices),sceneOptions=Array.from({length:40},(_,i)=>{const id='sl'+String(i+1).padStart(2,'0');return [id,id.toUpperCase()+' · '+(titles.get(id)||'Story scene')];}),controls=[];wrapper.append(small('Choose a story for each part of the resource. Leave a placement at None to keep it clear. An empty question uses the story library’s original question. These choices are saved with this resource edition.'));for(const row of storyEditorRows(value)){const panel=el('fieldset',null,'edu-group-card'),legend=el('legend',labels[row.placement]),scene=select('story-'+row.placement,[['','None'],...sceneOptions],row.sceneId),character=select('story-character-'+row.placement,[['Pip','Pip'],['Milla','Milla'],['Dot','Dot'],['Together','Together']],row.character),question=input('story-question-'+row.placement,{type:'textarea',value:row.question,maxLength:500,rows:3}),preview=el('a','Open scene image','edu-button edu-button-secondary edu-button-small');preview.target='_blank';preview.rel='noopener';question.placeholder='Use the story library question';function sync(){const active=Boolean(scene.value);character.disabled=question.disabled=!active;preview.hidden=!active;if(active)preview.href=artBase+'/stories/'+scene.value+'.webp';else preview.removeAttribute('href');}scene.addEventListener('change',sync);sync();panel.append(legend,field('Scene for '+labels[row.placement].toLowerCase(),scene),field('Who asks the question?',character),field('Question · optional',question,'Up to 500 characters. Leave blank to use the original story question.'),preview);grid.append(panel);controls.push({placement:row.placement,scene,character,question});}wrapper.append(grid);return {wrapper,read(){return storyScenesFromEditor(controls.map(c=>({placement:c.placement,sceneId:c.scene.value,character:c.character.value,question:c.question.value})));}};}
 async function staffResourceEditor(id=null){const detail=id?await api('/resources/'+encodeURIComponent(id)):null,data=await dashboard(),meta=detail?.resource,original=detail?.draft||emptyResource(),version=original.version||0,isPublished=Boolean(detail?.versions?.find(v=>v.version===version)?.publishedAt),pack=cleanResource(original),box=el('div');let illustrationChoices=[];try{illustrationChoices=(await storyLibrary(3500)).scenes.map(scene=>[scene.id,scene.title]);}catch{/* Keep the editor usable with its current illustration if the collection is unavailable. */}if(storyImageId(pack.image)&&!illustrationChoices.some(([id])=>id===pack.image))illustrationChoices.push([pack.image,'Current story illustration']);box.append(heading(id?pack.title||'Edit resource':'A new teaching resource.','Save a private draft, attach its checked PDF, then review access and publish the selected edition.','RESOURCE EDITOR',actions(link('Back to content','#staff-resources',true))));if(meta)box.append(notice(isPublished?'Current published edition · version '+version:'Private draft · version '+version,'The current public edition stays in place until publication completes. Saving creates a new immutable draft edition.'));const edits=[],capture=[];let savedRevision=meta?.revision||0;const resourceForm=form(async value=>{const next=JSON.parse(JSON.stringify(pack));next.id=String(value.get('id')||'');next.title=String(value.get('title')||'').trim();next.summary=String(value.get('summary')||'').trim();next.question=String(value.get('question')||'').trim();next.stage=String(value.get('stage'));next.term=Number(value.get('term'));next.image=String(value.get('image'));for(const read of capture)read(next);const result=await api('/resources/save',{resource:next,expectedRevision:savedRevision,availability:String(value.get('availability'))});state.staffDashboard=null;state.resourceCache.clear();resourceForm.dataset.dirty='false';tell('Private draft saved as version '+result.version+'. Check its PDF and publish when ready.');if(currentRoute().route==='staff-resource/'+result.resourceId)await render();else routeTo('staff-resource/'+result.resourceId);});resourceForm.className='edu-form-wide';const identity=input('id',{value:pack.id,maxLength:80,required:true});identity.pattern='[a-z0-9][a-z0-9-]{1,79}';identity.readOnly=Boolean(id);addForm(resourceForm,field('Resource ID',identity,'Lowercase letters, numbers and hyphens. The ID stays fixed after creation.'),field('Resource title',input('title',{value:pack.title,maxLength:180,required:true})),append(el('div',null,'edu-inline-fields'),field('Learning stage',select('stage',Object.entries(STAGES),pack.stage)),field('Term',select('term',[['1','Term 1'],['2','Term 2'],['3','Term 3'],['4','Term 4']],String(pack.term)))),field('Learning question',input('question',{value:pack.question,maxLength:500,required:true})),field('Library summary',input('summary',{type:'textarea',value:pack.summary,maxLength:2000,rows:4,required:true})),append(el('div',null,'edu-inline-fields'),field('Illustration',select('image',[...['welcome','observe','measure','soil','weather','living','community','design','reflect','classroom','rest','explore'].map(v=>[v,labelKey(v)]),...illustrationChoices],pack.image||'observe')),field('Draft access intention',select('availability',[['teacher','Free for verified adult teachers'],['selected','Selected schools or teachers'],['public','Public sample']],meta?.availability||'teacher'))));
  for(const [key,label]of [['learningIntentions','Learning intentions'],['successCriteria','Success criteria'],['equipment','Equipment and preparation'],['safety','Care and safety']]){const editor=structuredEditor(label,pack[key]||[]);capture.push(next=>next[key]=editor.read());addForm(resourceForm,accordion(label,editor.wrapper));}
  for(const [i,lesson]of (pack.lessons||[]).entries()){const content=el('div'),title=input('lessonTitle'+i,{value:lesson.title||'',maxLength:180}),duration=input('lessonDuration'+i,{value:lesson.duration||'',maxLength:40});content.append(field('Lesson title',title),field('Duration · minutes',duration));capture.push(next=>{next.lessons[i].title=title.value.trim();next.lessons[i].duration=duration.value.trim();});for(const [key,label]of [['model','Model it'],['guided','Guided activity'],['independent','Independent / group activity'],['checks','Learning checks'],['answers','Teacher answer guidance']]){const editor=structuredEditor(label,lesson[key]??'');content.append(editor.wrapper);capture.push(next=>next.lessons[i][key]=editor.read());}addForm(resourceForm,accordion('Lesson '+(i+1)+' · '+(lesson.title||'Teaching sequence'),content));}
  for(const [key,label]of [['fieldAlternative','Optional field route'],['classroomAlternative','Classroom equivalent'],['homeAlternative','Optional home connection'],['adjustments','Access and adjustments'],['studentSheets','Learner sheets'],['rubric','Observation rubric'],['outcomes','Curriculum mappings'],['sources','Sources and permissions'],['teacherMisconceptions','Teacher checks'],['characterPrompts','Character prompts']]){const editor=structuredEditor(label,pack[key]??'');capture.push(next=>next[key]=editor.read());addForm(resourceForm,accordion(label,editor.wrapper));}
  const storyEditor=storyScenesEditor(pack.storyScenes||[],illustrationChoices);capture.push(next=>next.storyScenes=storyEditor.read());addForm(resourceForm,accordion('Story scenes by chapter',storyEditor.wrapper));
  addForm(resourceForm,actions(submit('Save private resource draft')),small('Saving a draft does not replace a published resource, notify teachers or change an earlier assignment. Curriculum mappings, factual claims and PDF accessibility still need human review.'));box.append(section('Prepare the resource',resourceForm));if(!id)return box;
  const hasUnsaved=()=>resourceForm.dataset.dirty==='true';const pdfForm=form(async value=>{if(hasUnsaved())throw Error('Save your resource edits before attaching a PDF. Your edits remain in the editor.');const file=value.get('pdf');if(!(file instanceof File)||!file.size)throw Error('Choose a teaching-resource PDF.');if(file.size>2097152)throw Error('The PDF must be no larger than 2 MB. Optimise it without removing readable text or accessibility structure.');if(value.get('fileReview')!=='yes')throw Error('Confirm the file, rights and accessibility checks before upload.');const base64=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=()=>reject(Error('The PDF could not be read. Please choose it again.'));reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.readAsDataURL(file);});await api('/resources/'+id+'/pdf',{version,pdfBase64:base64});pdfForm.dataset.dirty='false';tell('PDF attached to the private draft. Nothing has been published.');state.staffDashboard=null;await render();});pdfForm.className='edu-form-panel';const file=input('pdf',{type:'file'});file.accept='application/pdf';file.required=true;addForm(pdfForm,field('Reviewed teacher & learner PDF · up to 2 MB',file),check('I checked this PDF’s content, rights, static file safety, readable type and accessible teaching alternative.','fileReview'),actions(submit('Attach PDF to this draft')));pdfForm.querySelector('[name=fileReview]').required=true;if(isPublished)box.append(section('The PDF is part of the edition',notice('Published files stay unchanged.','Save a new private draft before attaching an updated PDF. Existing downloaded files cannot be recalled.')));else box.append(section(original.pdfAvailable?'Replace the private draft PDF':'Attach the resource PDF',pdfForm));
  const publish=form(async value=>{if(hasUnsaved())throw Error('Save your resource edits before reviewing publication. Your edits remain in the editor.');if(!original.pdfAvailable)throw Error('Attach the reviewed PDF to this draft before publishing.');if(value.get('reviewed')!=='yes')throw Error('Complete the review confirmation before publishing.');const payload={version,expectedRevision:savedRevision,availability:String(value.get('availability')),schoolIds:value.getAll('schoolIds'),teacherIds:value.getAll('teacherIds'),reviewNote:String(value.get('reviewNote')||'').trim()};if(payload.availability==='selected'&&!payload.schoolIds.length&&!payload.teacherIds.length)throw Error('Choose at least one approved school or verified teacher for selected access.');const confirmation=notice('Publish version '+version+'?',payload.availability==='public'?'This full resource and its PDF will be accessible publicly. Confirm that it is intended as a public sample.':payload.availability==='selected'?'This edition will be available only to the selected approved schools and teachers.':'This edition will be free to verified adult teacher accounts.');confirmation.append(small('Publication replaces the current resource for new use. Existing assignments keep their selected version and downloaded files remain on devices.'),actions(button('Publish this edition',async event=>{const b=event.currentTarget;b.disabled=true;try{await api('/resources/'+id+'/publish',payload);state.staffDashboard=null;state.resourceCache.clear();publish.dataset.dirty='false';closeDialog();tell('Resource edition published.');await render();}catch(error){tell(error.message);b.disabled=false;}}),button('Keep as private draft',closeDialog,true)));openDialog('Ready for teachers?',confirmation);});publish.className='edu-form-panel';const access=select('availability',[['teacher','Free for verified adult teachers'],['selected','Selected schools or teachers'],['public','Public sample']],meta.availability);const grants=el('div',null,'edu-resource-picker');for(const school of (data.schools||[]).filter(s=>s.status==='approved')){const c=check('School · '+school.name,'schoolIds',detail.grants?.some(g=>g.school_id===school.id));c.querySelector('input').value=school.id;grants.append(c);}for(const teacher of (data.teachers||[]).filter(u=>!u.disabled)){const c=check('Teacher · '+(teacher.name||teacher.email)+' · '+teacher.email,'teacherIds',detail.grants?.some(g=>g.user_id===teacher.id));c.querySelector('input').value=teacher.id;grants.append(c);}const grantLabel=el('p','Select access recipients','edu-small');function toggle(){grants.hidden=grantLabel.hidden=access.value!=='selected';}access.addEventListener('change',toggle);toggle();addForm(publish,field('Publish access',access),grantLabel,grants,field('Review record',input('reviewNote',{type:'textarea',maxLength:1500,required:true,rows:4}),'Name the completed curriculum, factual, safety, rights and accessibility checks. This records a review; it is not a NESA endorsement.'),check('I checked the resource and PDF for this audience, edition and access level.','reviewed'),actions(submit('Review publication')));publish.querySelector('[name=reviewed]').required=true;box.append(section('Publish when ready',publish));
  const history=el('ul',null,'edu-list');for(const item of detail.versions||[]){const li=el('li');li.append(el('strong','Version '+item.version),small((item.publishedAt?'Published '+item.publishedAt:'Private draft')+' · '+(item.pdfAvailable?'PDF attached':'No PDF attached')));if(item.reviewNote)li.append(el('p',item.reviewNote));history.append(li);}box.append(section('Edition history',history));if(meta.status==='published')box.append(actions(button('Withdraw from new use',()=>{if(hasUnsaved()){tell('Save your resource edits before withdrawing the published resource.');return;}const n=notice('Withdraw this published resource?','New access will be blocked. Existing copies already downloaded cannot be recalled. Keep a clear replacement and correction plan for affected teachers.');n.append(actions(button('Withdraw resource',async()=>{try{await api('/resources/'+id+'/withdraw',{expectedRevision:savedRevision});state.staffDashboard=null;closeDialog();tell('Resource withdrawn from new use.');render();}catch(error){tell(error.message);}}),button('Keep resource available',closeDialog,true)));openDialog('A careful withdrawal.',n);},true)));return box;
 }
 async function staffPage(route){if(!staffMode||!state.staffAuthenticated)return authNeeded('Open the protected Education staff workspace from the owner admin.');const data=await dashboard();if(route.startsWith('staff-resource/'))return staffResourceEditor(decodeURIComponent(route.slice(15)));if(route==='staff-new-resource')return staffResourceEditor();const box=el('div');if(route==='staff-schools'){box.append(heading('School access, thoughtfully managed.','Create checked school workspaces, approve their processing arrangements and keep learner-record permissions specific.','OWNER EDUCATION TOOLS',actions(button('Create school',()=>schoolDialog()))));const schools=data.schools||[];if(!schools.length)box.append(empty('No school workspaces yet.','Teachers can use their personal planning space. Create a school workspace after its coordinator has signed in and its contact is checked.'));else{const grid=el('div',null,'edu-info-grid');for(const s of schools){const c=el('article',null,'edu-group-card');c.append(el('span',labelKey(s.status),'edu-tag'),el('h2',s.name),small((s.evidence_enabled?'Learner observations enabled':'Planning access only')+' · '+(s.retention_days||90)+'-day service retention after closure'),actions(button('Manage school',()=>schoolDialog(s),true)));grid.append(c);}box.append(grid);}box.append(notice('Email verification is not school approval.','Only enable learner observations after the school’s applicable privacy, processing, permission and retention requirements are recorded. No learner records are shown in these owner administration lists.'));}
  else if(route==='staff-teachers'){box.append(heading('Teachers in the learning community.','Manage adult school memberships and assessor access. A school role and learner-record permission are separate.','OWNER EDUCATION TOOLS'));const teachers=data.teachers||[];if(!teachers.length)box.append(empty('No verified teacher accounts yet.','Adult teachers appear here after they verify their email.'));else box.append(staffTable(['Teacher','Work email','School requested','Memberships','Manage'],teachers.map(u=>[u.name,u.email,u.requested_school||'—',String((u.memberships||[]).filter(m=>m.active).length),actions(button('School access',()=>membershipDialog(u),true))])));}
  else if(route==='staff-resources'){box.append(heading('A library worth returning to.','Edit teaching resources privately, check their PDF and publish a version with clear access.','OWNER CONTENT TOOLS',actions(link('Create a resource','#staff-new-resource'))));const resources=data.resources||[];if(!resources.length)box.append(empty('The first resource can start here.','Create an original teaching resource, attach its checked PDF and publish when ready.'));else box.append(staffTable(['Resource','Stage / term','State / version','Access','Edit'],resources.map(r=>[r.title,stageLabel(r.stage)+' · Term '+r.term,(r.status||'Draft')+' · v'+(r.version||0),r.availability||'teacher',link('Edit resource','#staff-resource/'+r.id,true)])));}
  else if(route==='staff-enquiries'){box.append(heading('Conversations about future learning.','Review teacher enquiries and record the next contact step. These requests do not reserve dates or create bookings.','OWNER EDUCATION TOOLS'));const interests=data.interests||[];if(!interests.length)box.append(empty('No learning enquiries yet.','Teacher expressions of interest appear here after submission.'));else{const items=el('ul',null,'edu-list');for(const interest of interests){const li=el('li');li.append(el('h2',(interest.teacher_name||'Teacher')+' · '+(interest.school_name||'Planning workspace')),el('p',interest.email),small(stageLabel(interest.stage)+' · '+(MODES[interest.mode]||interest.mode)+' · '+interest.preferred_term+' · Approx. '+interest.approximate_count+' learners'));if(interest.message)li.append(el('p',interest.message));const f=form(async value=>{await api('/interests/'+interest.id,{status:String(value.get('status'))});f.dataset.dirty='false';state.staffDashboard=null;tell('Enquiry status saved.');render();});addForm(f,field('Follow-up status',select('status',[['new','New'],['contacted','Contacted'],['closed','Closed']],interest.status)),actions(submit('Save status')));li.append(f);items.append(li);}box.append(items);}}
  else return staffPage('staff-schools');return box;
 }
 async function initialise(){try{if(staffMode){state.staffDashboard=await api('/dashboard');state.staffAuthenticated=true;state.resources=normalisedResources(state.staffDashboard.resources);updateAccount();await render();return;}const token=new URLSearchParams(location.hash.slice(1)).get('token');
  if(token&&location.pathname.includes('/auth/verify')){
   const destination=takePlantReturn()||'library';
   history.replaceState(null,'','/#'+destination);
   try{state.session=await api('/auth/verify',{token});identityLoaded=true;}
   catch(error){if(isPlantRoute(currentRoute().route)){plantShell(currentRoute().route);tell(error.message);main.replaceChildren(plantSignIn(currentRoute().query.get('prefer')));return;}throw error;}
   tell('Your work email is verified.');
  }else identityLoaded=false;
  updateAccount();await render();}catch(error){main.replaceChildren(errorPanel(error,initialise));}}
 if(!staffMode)plantShell(currentRoute().route);
 initialise();
}
