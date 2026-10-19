import {nearby} from './motion.js';
import {sydneyState,moonPhasePath} from './programme-time.js';
import {helloDepartments,placeGreeting,createCharacterTap} from './programme-hello.js';
import {validSnapshots,snapshotItems} from './programme-snapshots.js';
const source=document.getElementById('programme-data');
const {copy:c,initial,language,apiOrigin}=JSON.parse(source.textContent);
const root=document.querySelector('[data-programme-world]'),canvas=document.getElementById('programme-world-canvas');
const $=selector=>document.querySelector(selector),all=selector=>document.querySelectorAll(selector);
const state={programme:initial,weather:null,world:null,department:'all',growth:'actual',manualPaused:false,lastProgramme:0,lastWeather:0,clock:null,hello:null,programmeMessage:c.updatesLoading};
const locale=c.lang;
const day=value=>value?new Intl.DateTimeFormat(locale,{timeZone:'Australia/Sydney',year:'numeric',month:'short',day:'numeric'}).format(new Date(value.length===10?value+'T12:00:00+11:00':value)):'';
const number=value=>new Intl.NumberFormat(locale,{maximumFractionDigits:1}).format(value);
function clock(){
 if(document.hidden)return;
 const before=state.clock;state.clock=sydneyState(new Date(),locale);
 all('[data-programme-time]').forEach(el=>{el.textContent=state.clock.dateLabel;el.dateTime=state.clock.iso;});
 all('[data-programme-clock]').forEach(el=>{
  el.dateTime=state.clock.iso;
  el.setAttribute('aria-label',c.clock.place+' · '+c.clock.label+' · '+state.clock.formatted+' · '+(state.clock.isDay?c.day:c.night));
 });
 for(const hand of ['hour','minute','second'])all('[data-clock-'+hand+']').forEach(el=>el.setAttribute('transform','rotate('+state.clock.angles[hand]+' 50 50)'));
 all('[data-sky-sun]').forEach(el=>el.toggleAttribute('hidden',!state.clock.isDay));
 all('[data-sky-moon]').forEach(el=>el.toggleAttribute('hidden',state.clock.isDay));
 all('[data-sky-label]').forEach(el=>el.textContent=state.clock.isDay?c.day:c.night);
 if(!before||before.iso.slice(0,16)!==state.clock.iso.slice(0,16))all('[data-sky-moon-lit]').forEach(el=>el.setAttribute('d',moonPhasePath(state.clock.moonPhase)));
 root.classList.add('is-clock-ready');
 all('[data-programme-day]').forEach(el=>el.textContent=state.clock.isDay?c.day:c.night);
 root.classList.toggle('is-night',!state.clock.isDay);
 if(!before||before.hour!==state.clock.hour||before.isDay!==state.clock.isDay)environment();
}
function environment(){
 if(!state.world||!state.clock)return;
 const w=state.weather;
 state.world.setEnvironment({...state.clock,weatherCode:({clear:0,cloudy:3,fog:45,rain:61,snow:71,thunderstorm:95})[w?.condition]??0,rain:w?.rainNextHourMm??0,wind:w?.windKmh??0,cloud:(w?.cloud??30)/100});
}
function plantSummary(){
 const p=state.programme.coffee;
 state.world?.setPlantData(p);
 if($('[data-seed-actual]'))$('[data-seed-actual]').textContent=c.growth.stages[p.seedStage].title;
 if($('[data-trial-actual]'))$('[data-trial-actual]').textContent=c.growth.stages[p.trialStage].title;
 if($('[data-plant-height]'))$('[data-plant-height]').textContent='~'+number(p.heightCm)+' cm';
 if($('[data-plant-observed]')){const el=$('[data-plant-observed]');el.textContent=day(p.observedOn);el.dateTime=p.observedOn;}
}
function renderProgramme(){
 for(const card of all('[data-department-card]')){
  const d=state.programme.departments[card.dataset.departmentCard],t=d.translations[language];
  card.querySelector('[data-status]').textContent=c.statusLabels[d.status];
  card.querySelector('[data-now]').textContent=t.now;card.querySelector('[data-next]').textContent=t.next;
  const ul=card.querySelector('[data-done]');ul.replaceChildren();
  for(const text of t.done){const li=document.createElement('li');li.textContent=text;ul.append(li);}
  ul.hidden=!t.done.length;card.querySelector('[data-no-done]').hidden=Boolean(t.done.length);
  renderSnapshots(card.querySelector('[data-programme-snapshots]'),d.snapshots);
 }
 all('[data-programme-updated]').forEach(el=>{el.textContent=day(state.programme.updatedAt);el.dateTime=state.programme.updatedAt;});
 plantSummary();
 renderHelloNotes();
}
function validProgramme(data){
 return data?.version===1&&/^\d{4}-\d{2}-\d{2}$/.test(data.updatedAt)&&['cafe','coffee','workshops','local'].every(id=>{
  const d=data.departments?.[id],t=d?.translations?.[language];return c.statusLabels[d?.status]&&typeof t?.now==='string'&&typeof t?.next==='string'&&Array.isArray(t?.done)&&t.done.length<=4&&t.done.every(s=>typeof s==='string')&&validSnapshots(d.snapshots);
 })&&Object.hasOwn(c.growth.stages,data.coffee?.seedStage)&&Object.hasOwn(c.growth.stages,data.coffee?.trialStage)&&Number.isFinite(data.coffee?.heightCm);
}
async function get(path){
 const r=await fetch(apiOrigin+path,{credentials:'omit',headers:{Accept:'application/json'},signal:AbortSignal.timeout(10000)});
 if(!r.ok||!r.headers.get('Content-Type')?.includes('application/json'))throw Error('unavailable');
 return r.json();
}
async function refreshProgramme(){
 if(document.hidden)return;state.lastProgramme=Date.now();
 try{const data=await get('/public/programme');if(!validProgramme(data))throw Error('invalid');state.programme=data;state.programmeMessage=c.latestUpdate;renderProgramme();if($('[data-programme-data-status]'))$('[data-programme-data-status]').textContent=c.latestUpdate+' · '+day(data.updatedAt);}
 catch{state.programmeMessage=c.updatesUnavailable;renderHelloNotes();if($('[data-programme-data-status]'))$('[data-programme-data-status]').textContent=c.updatesUnavailable+' · '+day(state.programme.updatedAt);}
}
async function refreshWeather(){
 if(document.hidden)return;state.lastWeather=Date.now();
 try{
  const data=await get('/public/weather');
  if(![data.temperatureC,data.windKmh,data.rainNextHourMm,data.cloud].every(Number.isFinite)||!Number.isFinite(Date.parse(data.validAt))||!Number.isFinite(Date.parse(data.modelUpdatedAt))||Date.now()-Date.parse(data.modelUpdatedAt)>24*3600000)throw Error('invalid');
  state.weather=data;
  all('[data-weather-status]').forEach(el=>el.textContent=(c.weather.conditions[data.condition]||c.weather.conditions.unknown)+(data.stale?' · '+c.weather.stale:''));
  all('[data-weather-temperature]').forEach(el=>el.textContent=number(data.temperatureC)+' °C');
  all('[data-weather-wind]').forEach(el=>el.textContent=number(data.windKmh)+' km/h');
  all('[data-weather-rain]').forEach(el=>el.textContent=number(data.rainNextHourMm)+' mm');
  const at=new Intl.DateTimeFormat(locale,{timeZone:'Australia/Sydney',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(data.validAt));
  all('[data-weather-asof]').forEach(el=>el.textContent=c.weather.asOf+' '+at);
 }catch{
  state.weather=null;all('[data-weather-status]').forEach(el=>el.textContent=c.weather.unavailable);
  all('[data-weather-temperature],[data-weather-wind],[data-weather-rain]').forEach(el=>el.textContent='—');
  all('[data-weather-asof]').forEach(el=>el.textContent='');
 }
 environment();
}
function pauseLabel(){
 const reduced=document.documentElement.dataset.reduceMotion==='true'||matchMedia('(prefers-reduced-motion: reduce)').matches;
 root.classList.toggle('is-motion-paused',Boolean(state.manualPaused||reduced||state.world?.paused));
 if(!state.world)return;const paused=state.world.paused;
 all('[data-programme-pause]').forEach(button=>{button.textContent=paused?c.resume:c.pause;button.setAttribute('aria-pressed',String(paused));button.disabled=reduced;});
 if(paused)$('[data-programme-thought]').hidden=true;
}
let bubbleKey='',bubbleBucket=-1,bubbleActor=null;
function thoughts(actors){
 const bubble=$('[data-programme-thought]');
 if(state.hello||state.world?.paused||state.growth!=='actual'){bubble.hidden=true;return;}
 const bucket=Math.floor(Date.now()/8500),visible=actors.filter(a=>a.visible&&(state.department==='all'||a.department===state.department));
 if(!visible.length){bubble.hidden=true;return;}
 if(bucket!==bubbleBucket){bubbleBucket=bucket;bubbleActor=visible[Math.floor(Math.random()*visible.length)].id;}
 const switching=visible.find(a=>a.activity==='switching');
 const actor=switching||visible.find(a=>a.id===bubbleActor)||visible[0],activity=({measuring:'working',writing:'working',watering:'working',selecting:'working',checking:'working',closing:'night'})[actor.activity]||actor.activity;
 const key=actor.id+':'+activity+':'+bucket;
 if(key!==bubbleKey){bubbleKey=key;const choices=activity==='switching'&&c.lightingThoughts?.length?c.lightingThoughts:c.thoughts[actor.department]?.[activity]||c.thoughts[actor.department].planning;bubble.querySelector('span').textContent=choices[Math.floor(Math.random()*choices.length)];}
 const edge=innerWidth<600?95:120,w=canvas.parentElement.clientWidth;
 bubble.style.left=Math.max(edge,Math.min(w-edge,actor.x))+'px';bubble.style.top=Math.max(100,actor.y-8)+'px';
 bubble.hidden=!switching&&Date.now()%8500>6800;
}
const helloBubble=$('[data-hello-bubble]'),helloPanel=$('[data-hello-panel]'),helloTargets=$('[data-hello-targets]'),helloMore=$('[data-hello-more]');
const targetButtons=new Map();let lastActors=[],helloSize={width:244,height:180};
function renderSnapshots(section,snapshots){
 if(!section)return;
 const items=snapshotItems(snapshots,language),key=JSON.stringify(items);section.hidden=!items.length;
 if(section.dataset.snapshotKey===key)return;section.dataset.snapshotKey=key;
 const grid=section.querySelector('[data-snapshot-grid]');grid.replaceChildren();
 for(const item of items){
  const figure=document.createElement('figure'),image=document.createElement('img');
  figure.dataset.snapshotImage=item.imageId;image.alt=item.alt;image.loading='lazy';image.decoding='async';image.referrerPolicy='no-referrer';image.crossOrigin='anonymous';image.src=item.url;
  image.addEventListener('error',()=>{image.hidden=true;const note=document.createElement('p');note.className='snapshot-unavailable';note.textContent=c.snapshots.unavailable;figure.prepend(note);},{once:true});
  figure.append(image);
  if(item.caption){const caption=document.createElement('figcaption');caption.textContent=item.caption;figure.append(caption);}
  if(item.capturedOn&&item.kind==='photo'){const date=document.createElement('time');date.dateTime=item.capturedOn;date.textContent=c.snapshots.capturedOn+' '+day(item.capturedOn);figure.append(date);}
  grid.append(figure);
 }
}
function renderHelloNotes(){
 if(!state.hello||!helloPanel)return;
 const id=state.hello.department,record=state.programme.departments[id],notes=record.translations[language];
 $('[data-hello-title]').textContent=c.departments[id].title;
 $('[data-hello-status]').textContent=c.statusLabels[record.status];
 $('[data-hello-now]').textContent=notes.now;$('[data-hello-next]').textContent=notes.next;
 const date=$('[data-hello-updated]');date.textContent=day(state.programme.updatedAt);date.dateTime=state.programme.updatedAt;
 $('[data-hello-data-status]').textContent=state.programmeMessage;
 renderSnapshots(helloPanel.querySelector('[data-programme-snapshots]'),record.snapshots);
}
function positionHello(){
 if(!state.hello||!helloBubble||helloBubble.hidden)return;
 const actor=lastActors.find(actor=>actor.id===state.hello.id&&actor.visible),hud=$('.programme-clock-hud');
 const clock=hud?{left:hud.offsetLeft,top:hud.offsetTop,right:hud.offsetLeft+hud.offsetWidth,bottom:hud.offsetTop+hud.offsetHeight}:null;
 const position=placeGreeting(actor,{width:canvas.clientWidth,height:canvas.clientHeight,bubbleWidth:helloSize.width,bubbleHeight:helloSize.height,clock});
 helloBubble.style.left=position.x+'px';helloBubble.style.top=position.y+'px';
}
function markHello(){
 for(const [id,button] of targetButtons)button.setAttribute('aria-pressed',String(state.hello?.id===id));
 all('[data-hello-department]').forEach(button=>button.setAttribute('aria-current',String(state.hello?.department===button.dataset.helloDepartment)));
}
function showHello(selection,trigger=null,wave=true){
 const requested=typeof selection==='string'?selection:selection?.id,department=typeof selection==='string'?selection:selection?.department;
 if(!helloDepartments.includes(department))return;
 const actor=(wave?state.world?.greet(requested):selection)||{id:requested,department};
 state.hello={id:actor.id,department,trigger};
 helloPanel.hidden=true;helloMore.setAttribute('aria-expanded','false');
 helloBubble.hidden=false;$('[data-hello-greeting]').textContent=c.sayHello.greetings[department];
 $('[data-programme-thought]').hidden=true;renderHelloNotes();markHello();
 helloSize={width:helloBubble.offsetWidth,height:helloBubble.offsetHeight};positionHello();
 if(trigger?.hasAttribute('data-hello-department')){
   helloBubble.scrollIntoView({block:'nearest',behavior:'auto'});helloMore.focus({preventScroll:true});
 }
}
function closeHello(restore=true){
 const trigger=state.hello?.trigger;state.hello=null;helloBubble.hidden=true;helloPanel.hidden=true;helloMore.setAttribute('aria-expanded','false');state.world?.clearGreeting();markHello();
 if(restore)(trigger?.isConnected&&!trigger.hidden&&trigger.getClientRects().length?trigger:$('.programme-hello-chooser summary'))?.focus({preventScroll:true});
}
function actorUpdates(actors){
 lastActors=actors;
 if(helloTargets){
  helloTargets.hidden=!root.classList.contains('is-interactive');
  const represented=new Set(),placed=[],hud=$('.programme-clock-hud'),clockRight=hud?hud.offsetLeft+hud.offsetWidth:0,clockBottom=hud?hud.offsetTop+hud.offsetHeight:0;
  for(const actor of actors){
   let button=targetButtons.get(actor.id);
   if(!button){
    button=document.createElement('button');button.type='button';button.className='programme-hello-target';button.dataset.helloActor=actor.id;button.setAttribute('aria-label',c.sayHello.teamLabels[actor.department]);button.setAttribute('aria-pressed','false');
    button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 10V5a1.5 1.5 0 0 1 3 0v5-7a1.5 1.5 0 0 1 3 0v7-5a1.5 1.5 0 0 1 3 0v6-3a1.5 1.5 0 0 1 3 0v6c0 4-2 7-6 7h-1c-2 0-3-1-4-2l-5-6a1.5 1.5 0 0 1 2-2l2 2"/></svg>';
    const tap=createCharacterTap();
    button.addEventListener('pointerdown',event=>tap.down(event),{passive:true});
    button.addEventListener('pointermove',event=>tap.move(event),{passive:true});
    button.addEventListener('pointercancel',event=>tap.cancel(event),{passive:true});
    button.addEventListener('pointerleave',()=>tap.reset(),{passive:true});
    button.addEventListener('pointerup',event=>{if(tap.up(event))showHello(actor,button);},{passive:true});
    button.onclick=event=>{if(event.detail===0)showHello(actor,button);};helloTargets.append(button);targetButtons.set(actor.id,button);
   }
   const x=actor.x,y=actor.y-10;
   const allowed=actor.visible&&(state.department==='all'||state.department===actor.department)&&!represented.has(actor.department)&&x>24&&x<canvas.clientWidth-24&&y>24&&y<canvas.clientHeight-24&&!(x<clockRight+24&&y<clockBottom+24)&&!placed.some(p=>Math.hypot(p.x-x,p.y-y)<46);
   button.hidden=!allowed;
   if(allowed){represented.add(actor.department);placed.push({x,y});button.style.left=x+'px';button.style.top=y+'px';}
  }
 }
 positionHello();thoughts(actors);
}
all('[data-hello-department]').forEach(button=>button.onclick=event=>{event.preventDefault();showHello(button.dataset.helloDepartment,button);});
if(helloMore)helloMore.onclick=()=>{
 if(!state.hello)return;
 renderHelloNotes();helloPanel.hidden=false;helloMore.setAttribute('aria-expanded','true');
 helloPanel.scrollIntoView({block:'nearest',behavior:!state.world||state.world.paused?'auto':'smooth'});$('[data-hello-title]').focus({preventScroll:true});
};
if($('[data-hello-dismiss]'))$('[data-hello-dismiss]').onclick=()=>closeHello();
if($('[data-hello-close]'))$('[data-hello-close]').onclick=()=>closeHello();
root.addEventListener('keydown',event=>{if(event.key==='Escape'&&state.hello){event.preventDefault();closeHello();}});
if(helloBubble)new ResizeObserver(()=>{helloSize={width:helloBubble.offsetWidth,height:helloBubble.offsetHeight};positionHello();}).observe(helloBubble);
function fail(){document.body.classList.remove('programme-has-world');root.classList.remove('is-interactive','is-loading');$('[data-programme-loading]').hidden=true;$('[data-programme-fallback]').hidden=false;if(helloTargets)helloTargets.hidden=true;}
function focus(id){
 if(state.hello)closeHello(false);
 if(id!=='coffee'&&state.growth!=='actual')growth('actual',false,false);
 if($('[data-growth-previewbar]'))$('[data-growth-previewbar]').hidden=id!=='coffee';
 state.department=id;state.world?.focusDepartment(id==='all'?null:id);
 all('button[data-programme-department]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.programmeDepartment===id)));
 all('[data-department-card]').forEach(card=>card.classList.toggle('is-selected',card.dataset.departmentCard===id));
}
function growth(stage,scroll=true,selectCoffee=true){
 state.growth=stage;state.world?.setGrowthStage(stage);if(selectCoffee)focus('coffee');
 if($('[data-preview-label]'))$('[data-preview-label]').textContent=stage==='actual'?c.growth.actualLabel:c.growth.previewLabel;
 if($('[data-preview-stage]'))$('[data-preview-stage]').textContent=stage==='actual'?'':c.growth.stages[stage].title;
 all('button[data-growth-stage]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.growthStage===stage)));
 $('[data-growth-label]').textContent=stage==='actual'?c.growth.actualLabel:c.growth.previewLabel;
 $('[data-growth-title]').textContent=stage==='actual'?c.growth.actualLabel:c.growth.stages[stage].title;
 $('[data-growth-body]').textContent=stage==='actual'?c.growth.futureNote:c.growth.stages[stage].body;
 if(scroll)root.scrollIntoView({behavior:state.world?.paused?'auto':'smooth',block:'center'});
}
nearby(root,async()=>{
 root.classList.add('is-loading');$('[data-programme-loading]').hidden=false;
 try{
  const {createProgrammeWorld}=await import('./programme-world.js');
  state.world=createProgrammeWorld(canvas,{onError:fail,onReady(){document.body.classList.add('programme-has-world');root.classList.add('is-interactive');root.classList.remove('is-loading');$('[data-programme-loading]').hidden=true;},onActors:actorUpdates,onHello:selection=>showHello(selection,canvas,false)});
  if(!state.world){fail();return;}
  environment();plantSummary();pauseLabel();
  all('[data-programme-pause]').forEach(b=>b.onclick=()=>{state.manualPaused=!state.manualPaused;state.world.pause(state.manualPaused);pauseLabel();});
  all('[data-programme-reset]').forEach(b=>b.onclick=()=>{state.world.reset();focus('all');});
  all('button[data-programme-department]').forEach(b=>b.onclick=()=>focus(b.dataset.programmeDepartment));
  if($('[data-growth-next]'))$('[data-growth-next]').onclick=()=>{const ids=Object.keys(c.growth.stages),i=ids.indexOf(state.growth);growth(ids[(i+1)%ids.length]);};
  if($('[data-growth-previous]'))$('[data-growth-previous]').onclick=()=>{const ids=Object.keys(c.growth.stages),i=ids.indexOf(state.growth);growth(ids[i<0?ids.length-1:(i-1+ids.length)%ids.length]);};
  all('button[data-growth-stage]').forEach(b=>b.onclick=()=>growth(b.dataset.growthStage));
 }catch{fail();}
});
new MutationObserver(pauseLabel).observe(document.documentElement,{attributes:true,attributeFilter:['data-reduce-motion']});
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',pauseLabel);
clock();pauseLabel();renderProgramme();refreshProgramme();refreshWeather();
setInterval(clock,1000);
setInterval(refreshProgramme,60000);
setInterval(refreshWeather,15*60000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden){clock();if(Date.now()-state.lastProgramme>60000)refreshProgramme();if(Date.now()-state.lastWeather>15*60000)refreshWeather();}});
