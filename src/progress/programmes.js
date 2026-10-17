import {nearby} from './motion.js';
import {sydneyState} from './programme-time.js';
const source=document.getElementById('programme-data');
const {copy:c,initial,language,apiOrigin}=JSON.parse(source.textContent);
const root=document.querySelector('[data-programme-world]'),canvas=document.getElementById('programme-world-canvas');
const $=selector=>document.querySelector(selector),all=selector=>document.querySelectorAll(selector);
const state={programme:initial,weather:null,world:null,department:'all',growth:'actual',manualPaused:false,lastProgramme:0,lastWeather:0,clock:null};
const locale=c.lang;
const day=value=>value?new Intl.DateTimeFormat(locale,{timeZone:'Australia/Sydney',year:'numeric',month:'short',day:'numeric'}).format(new Date(value.length===10?value+'T12:00:00+11:00':value)):'';
const number=value=>new Intl.NumberFormat(locale,{maximumFractionDigits:1}).format(value);
function clock(){
 if(document.hidden)return;
 const before=state.clock;state.clock=sydneyState(new Date(),locale);
 all('[data-programme-time]').forEach(el=>{el.textContent=state.clock.formatted;el.dateTime=state.clock.iso;});
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
 }
 all('[data-programme-updated]').forEach(el=>{el.textContent=day(state.programme.updatedAt);el.dateTime=state.programme.updatedAt;});
 plantSummary();
}
function validProgramme(data){
 return data?.version===1&&/^\d{4}-\d{2}-\d{2}$/.test(data.updatedAt)&&['cafe','coffee','workshops','local'].every(id=>{
  const d=data.departments?.[id],t=d?.translations?.[language];return c.statusLabels[d?.status]&&typeof t?.now==='string'&&typeof t?.next==='string'&&Array.isArray(t?.done)&&t.done.length<=4&&t.done.every(s=>typeof s==='string');
 })&&Object.hasOwn(c.growth.stages,data.coffee?.seedStage)&&Object.hasOwn(c.growth.stages,data.coffee?.trialStage)&&Number.isFinite(data.coffee?.heightCm);
}
async function get(path){
 const r=await fetch(apiOrigin+path,{credentials:'omit',headers:{Accept:'application/json'},signal:AbortSignal.timeout(10000)});
 if(!r.ok||!r.headers.get('Content-Type')?.includes('application/json'))throw Error('unavailable');
 return r.json();
}
async function refreshProgramme(){
 if(document.hidden)return;state.lastProgramme=Date.now();
 try{const data=await get('/public/programme');if(!validProgramme(data))throw Error('invalid');state.programme=data;renderProgramme();if($('[data-programme-data-status]'))$('[data-programme-data-status]').textContent=c.latestUpdate+' · '+day(data.updatedAt);}
 catch{if($('[data-programme-data-status]'))$('[data-programme-data-status]').textContent=c.updatesUnavailable+' · '+day(state.programme.updatedAt);}
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
 if(!state.world)return;const paused=state.world.paused;
 all('[data-programme-pause]').forEach(button=>{button.textContent=paused?c.resume:c.pause;button.setAttribute('aria-pressed',String(paused));button.disabled=document.documentElement.dataset.reduceMotion==='true'||matchMedia('(prefers-reduced-motion: reduce)').matches;});
 if(paused)$('[data-programme-thought]').hidden=true;
}
let bubbleKey='',bubbleBucket=-1,bubbleActor=null;
function thoughts(actors){
 const bubble=$('[data-programme-thought]');
 if(state.world?.paused||state.growth!=='actual'){bubble.hidden=true;return;}
 const bucket=Math.floor(Date.now()/8500),visible=actors.filter(a=>a.visible&&(state.department==='all'||a.department===state.department));
 if(!visible.length){bubble.hidden=true;return;}
 if(bucket!==bubbleBucket){bubbleBucket=bucket;bubbleActor=visible[Math.floor(Math.random()*visible.length)].id;}
 const actor=visible.find(a=>a.id===bubbleActor)||visible[0],activity=({measuring:'working',writing:'working',watering:'working',selecting:'working',closing:'night'})[actor.activity]||actor.activity;
 const key=actor.id+':'+activity+':'+bucket;
 if(key!==bubbleKey){bubbleKey=key;const choices=c.thoughts[actor.department]?.[activity]||c.thoughts[actor.department].planning;bubble.querySelector('span').textContent=choices[Math.floor(Math.random()*choices.length)];}
 const edge=innerWidth<600?95:120,w=canvas.parentElement.clientWidth;
 bubble.style.left=Math.max(edge,Math.min(w-edge,actor.x))+'px';bubble.style.top=Math.max(100,actor.y-8)+'px';
 bubble.hidden=Date.now()%8500>6800;
}
function fail(){document.body.classList.remove('programme-has-world');root.classList.remove('is-interactive','is-loading');$('[data-programme-loading]').hidden=true;$('[data-programme-fallback]').hidden=false;}
function focus(id){
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
  state.world=createProgrammeWorld(canvas,{onError:fail,onReady(){document.body.classList.add('programme-has-world');root.classList.add('is-interactive');root.classList.remove('is-loading');$('[data-programme-loading]').hidden=true;},onActors:thoughts});
  if(!state.world){fail();return;}
  environment();plantSummary();pauseLabel();
  all('[data-programme-pause]').forEach(b=>b.onclick=()=>{state.manualPaused=!state.manualPaused;state.world.pause(state.manualPaused);pauseLabel();});
  all('[data-programme-reset]').forEach(b=>b.onclick=()=>{state.world.reset();focus('all');});
  all('button[data-programme-department]').forEach(b=>b.onclick=()=>focus(b.dataset.programmeDepartment));
  if($('[data-growth-next]'))$('[data-growth-next]').onclick=()=>{const ids=Object.keys(c.growth.stages),i=ids.indexOf(state.growth);growth(ids[(i+1)%ids.length]);};
  if($('[data-growth-previous]'))$('[data-growth-previous]').onclick=()=>{const ids=Object.keys(c.growth.stages),i=ids.indexOf(state.growth);growth(ids[i<0?ids.length-1:(i-1+ids.length)%ids.length]);};
  all('button[data-growth-stage]').forEach(b=>b.onclick=()=>growth(b.dataset.growthStage));
  new MutationObserver(pauseLabel).observe(document.documentElement,{attributes:true,attributeFilter:['data-reduce-motion']});
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',pauseLabel);
 }catch{fail();}
});
clock();renderProgramme();refreshProgramme();refreshWeather();
setInterval(clock,1000);
setInterval(refreshProgramme,60000);
setInterval(refreshWeather,15*60000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden){clock();if(Date.now()-state.lastProgramme>60000)refreshProgramme();if(Date.now()-state.lastWeather>15*60000)refreshWeather();}});
