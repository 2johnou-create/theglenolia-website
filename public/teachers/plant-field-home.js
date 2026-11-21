import {plantIllustration} from '../assets/plant-portal/plant-illustration.js';
import {STAGE_NAMES} from '../assets/plant-portal/stages.js';

const FARM_ART = 'https://theglenolia.com.au/assets/plant-portal/stages/';
const photoPath = /^\/api\/plants\/photos\/[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;
const dateFormat = new Intl.DateTimeFormat('en-AU',{timeZone:'Australia/Sydney',day:'numeric',month:'short',year:'numeric'});
const timeFormat = new Intl.DateTimeFormat('en-AU',{timeZone:'Australia/Sydney',day:'numeric',month:'short',hour:'numeric',minute:'2-digit',timeZoneName:'short'});
function dateOf(value,withTime=false) {
  if (!value) return '';
  const instant = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? value+'T12:00:00Z' : value);
  return Number.isFinite(instant.getTime()) ? (withTime?timeFormat:dateFormat).format(instant) : '';
}
function element(tag,cls,text) {
  const node = document.createElement(tag);
  if (cls) node.className=cls;
  if (text!==null&&text!==undefined) node.textContent=text;
  return node;
}
function anchor(label,href,cls) {
  const a=element('a',cls,label);a.href=href;return a;
}
function source(scope){return scope==='plant'?'This tree':scope==='farm'?'Farm-wide record':'';}
function fact(grid,label,value,detail) {
  const group=element('div','field-fact');group.append(element('dt',null,label),element('dd',null,value));
  if(detail)group.append(element('dd','field-fact-source',detail));
  grid.append(group);
}
function stagePlate(stage,key) {
  const match=/^r([1-9]|1[0-2])-p([1-9]|1[0-9])$/.exec(key);
  if (!match||!STAGE_NAMES[stage-1])return null;
  const variant=plantIllustration(stage,{row:Number(match[1]),position:Number(match[2])});
  const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg'),img=document.createElementNS(ns,'image');
  // Frame the existing transparent botanical plates closely enough to read a tiny seedling.
  const frame=stage===1?'52 190 152 108':stage===2?'52 134 152 148':stage<=4?'22 82 214 202':'0 26 256 260';
  svg.setAttribute('viewBox',frame);svg.setAttribute('role','img');svg.setAttribute('aria-label',STAGE_NAMES[stage-1]+' growth-stage illustration');
  img.setAttribute('href',FARM_ART+variant.file);img.setAttribute('width','256');img.setAttribute('height','288');
  img.style.transformOrigin='128px 259px';img.style.transform=variant.transform;svg.append(img);
  return svg;
}
function latestPhoto(report,updates) {
  const record=report?.latestPhoto||updates.find(u=>photoPath.test(u.photoUrl));
  return record && photoPath.test(record.photoUrl)?record:null;
}
export function fieldHero({application,report,updates,classroomHref,onMessage}) {
  const key=application.plantKey,match=/^r(\d+)-p(\d+)$/.exec(key),label=match?'P'+((Number(match[1])-1)*19+Number(match[2])):'Coffee plant';
  const stage=report?.plant?.stage??application.stage,stageName=STAGE_NAMES[stage-1];
  const photo=latestPhoto(report,updates),fields=report?.fields||{};
  const area=element('section','field-cover'+(photo?' field-cover-photo':'')),intro=element('div','field-cover-intro');
  const where=match?'Row '+match[1]+' · Position '+match[2]:'Glenorie';
  intro.append(element('p','edu-kicker','Class plant · '+where),element('h1',null,label));
  if(stageName)intro.append(element('p','field-stage-name',stageName+' · Stage '+stage+' of 10'));
  if(fields.condition?.value)intro.append(element('p','field-current-condition',fields.condition.value),element('p','field-condition-byline',[source(fields.condition.scope),dateOf(fields.condition.recordedAt)].filter(Boolean).join(' · ')));
  else intro.append(element('p','field-current-condition',report?'The farmer hasn’t recorded a condition yet.':'Field condition unavailable.'));
  const controls=element('div','edu-actions');
  controls.append(anchor('Open classroom view',classroomHref,'edu-button'));
  const ask=element('button','edu-button edu-button-secondary','Ask the farmer');ask.type='button';ask.addEventListener('click',onMessage);controls.append(ask);intro.append(controls);
  const plate=stagePlate(stage,key);
  const sketch=element('figure','field-stage-plate');
  if(plate)sketch.append(plate,element('figcaption',null,'Stage illustration'));
  else sketch.append(element('figcaption',null,'Growth stage awaiting a field record'));
  if(!photo)sketch.append(element('p','field-photo-pending','Field photograph pending'));
  area.append(intro,sketch);
  if(photo) {
    const figure=element('figure','field-cover-camera'),img=element('img');img.src=photo.photoUrl;img.alt='Farmer photograph of '+label+(photo.observedOn?' on '+dateOf(photo.observedOn):'');img.decoding='async';
    const caption=element('figcaption',null,['Farmer photograph',dateOf(photo.observedOn)].filter(Boolean).join(' · '));
    img.addEventListener('error',()=>{img.hidden=true;caption.textContent='Farmer photograph could not be loaded.';},{once:true});
    figure.append(img,caption);area.append(figure);
  }
  return area;
}
export function fieldFacts(report) {
  const wrap=element('section','field-facts-panel');
  wrap.append(element('h2',null,'Field record'));
  if(!report) {wrap.append(element('p','edu-small','The field record couldn’t be loaded. Refresh the journal to try again.'));return wrap;}
  const fields=report.fields||{},grid=element('dl','field-facts');
  for(const [label,key] of [['Coffee variety','variety'],['Soil','soil'],['Soil pH','soilPh'],['Planted','plantedOn']]) {
    const entry=fields[key],raw=entry?.value;
    fact(grid,label,raw==null||raw===''?'Not recorded':key==='plantedOn'?dateOf(raw):String(raw),entry?[source(entry.scope),dateOf(entry.recordedAt)].filter(Boolean).join(' · '):null);
  }
  const log=report.lastFertiliser;
  fact(grid,'Last fertiliser',log?.description||'No entry yet',log?[source(log.scope),dateOf(log.observedOn)].filter(Boolean).join(' · '):null);
  if(fields.growerFocus?.value)fact(grid,'Farmer’s focus',fields.growerFocus.value,source(fields.growerFocus.scope));
  wrap.append(grid);
  return wrap;
}
function liveContent(region,load) {
  const run=async()=>{
    region.setAttribute('aria-busy','true');region.replaceChildren(element('p','edu-small','Loading…'));
    try{region.replaceChildren(await load());}
    catch{
      const message=element('p','edu-small','Couldn’t load this section.');
      const retry=element('button','field-text-action','Try again');retry.type='button';retry.onclick=run;
      region.replaceChildren(message,retry);
    }finally{region.removeAttribute('aria-busy');}
  };
  void run();
}
function modelNumber(value,unit){return Number.isFinite(value)?new Intl.NumberFormat('en-AU',{maximumFractionDigits:1}).format(value)+unit:null;}
export function farmWeather(api) {
  const wrap=element('section','field-weather-panel'),content=element('div','field-weather-content');
  wrap.append(element('h2',null,'Glenorie weather'),content);
  liveContent(content,async()=>{
    const data=await api('/plants/weather'),now=data.current,history=data.history||{};
    const body=element('div'),line=element('dl','field-weather-readings');
    for(const [title,value,unit] of [['Temperature',now?.temperatureC,' °C'],['Humidity',now?.humidityPct,'%'],['Wind',now?.windKmh,' km/h'],['Rain forecast · next hour',now?.rainNextHourMm,' mm']])fact(line,title,modelNumber(value,unit)||'Unavailable');
    body.append(line);
    const attribution=element('p','edu-small',now?.validAt?(now.stale?'Last available estimate · ':'Area estimate · ')+dateOf(now.validAt,true)+' · ':'Current area estimate unavailable. ');
    attribution.append(anchor('MET Norway','https://api.met.no/'),document.createTextNode(' · '),anchor('CC BY 4.0','https://creativecommons.org/licenses/by/4.0/'));
    body.append(attribution);
    if(Number.isFinite(history.latestRainfallMm)) {
      const observed=element('p','edu-small','Daily rainfall · '+modelNumber(history.latestRainfallMm,' mm')+' · '+dateOf(history.latestRainfallDay)+' · ');
      observed.append(anchor('Queensland SILO','https://www.longpaddock.qld.gov.au/silo/'));body.append(observed);
    }
    return body;
  });return wrap;
}
export function workshopShelf(api) {
  const wrap=element('section','plant-workshop-shelf'),content=element('div');
  wrap.append(element('h2',null,'Classroom workshops'),content);
  liveContent(content,async()=>{
    const {workshops}=await api('/plants/workshops'),list=element('ul','field-download-list');
    for(const pack of workshops||[]){
      if(!/^\/api\/plants\/workshops\/[a-z0-9-]+\.pdf$/.test(pack.downloadUrl))continue;
      const entry=element('li'),label=anchor(pack.title,pack.downloadUrl,'field-download');
      label.append(element('span','field-file-meta',[pack.minutes&&pack.minutes+' min',pack.pages&&pack.pages+' pages','PDF ↓'].filter(Boolean).join(' · ')));
      label.download='';entry.append(label);
      if(pack.summary)entry.append(element('p','edu-small',pack.summary));
      list.append(entry);
    }
    return list.childElementCount?list:element('p','edu-small','No workshop sheets are available yet.');
  });return wrap;
}
export function schoolAward(api,appId) {
  const wrap=element('section','plant-award-shelf'),content=element('div');
  wrap.append(element('h2',null,'School certificate & media kit'),content);
  liveContent(content,async()=>{
    const {award}=await api('/plants/recognition?applicationId='+encodeURIComponent(appId));
    const list=element('ul','field-download-list');
    for(const file of award?.files||[]){
      if(typeof file.url!=='string'||!file.url.startsWith('/api/plants/recognition/')||new URL(file.url,location.origin).origin!==location.origin)continue;
      const entry=element('li'),label=anchor(file.label,file.url,'field-download');label.download='';
      label.append(element('span','field-file-meta',(file.format||'Download').toUpperCase()+' ↓'));entry.append(label);list.append(entry);
    }
    return list.childElementCount?list:element('p','edu-small','Your school’s files are currently unavailable.');
  });return wrap;
}
export function companionPrompt(artBase,question) {
  const wrap=element('aside','plant-field-companions'),img=element('img');
  img.src=artBase+'/observe.webp';img.alt='Pip, Milla and Dot examine a young coffee plant using a magnifying glass.';img.width=240;img.height=160;img.loading='lazy';
  const copy=element('div');
  copy.append(element('p','edu-kicker','Pip, Milla & Dot'),element('h2',null,'Look closer'),element('p',null,question||'Which detail would you like to check again in the next field photograph?'));
  wrap.append(img,copy);return wrap;
}
