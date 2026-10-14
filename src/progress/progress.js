import {nearby, sceneMotion} from './motion.js';

const $ = id => document.getElementById(id);
const {config,copy:c,roomCopy,coffeeUrl} = JSON.parse($('progress-data').textContent);
const coffeeLink=(document.querySelector('meta[name=site-base]')?.content||'')+coffeeUrl;
const state = {view:'farm',stage:config.currentStage,zone:0};
const section = $('scenes'), canvas = $('world-canvas');
let world;

function failed() {
  section.classList.remove('is-interactive','is-loading');
  $('loading').hidden = true;
  $('fallback').hidden = false;
  // Restore the authoritative server-rendered scene when WebGL fails.
  state.view='farm';state.stage=config.currentStage;state.zone=0;
  details();stageCopy();
}

function details() {
  const i=state.zone, inside=state.view==='cafe';
  $('detail-number').textContent=String(i+1).padStart(2,'0');
  $('detail-label').textContent=inside?c.interiorTags[i]:c.hotspots[i];
  $('detail-title').textContent=inside?roomCopy.titles[i]:c.zoneTitle[i];
  $('detail-body').textContent=inside?roomCopy.bodies[i]:c.zoneBody[i];
  const link=$('detail-link');
  link.textContent=(inside?c.farm:c.zoneLinks[i])+' ↗';
  link.href=!inside&&i===0?coffeeLink:'#scenes';
  link.onclick=event=>{
    if(!inside&&i===0)return;
    event.preventDefault();
    if(inside)setView('farm');else if(i===1)setView('cafe');else world?.reset();
  };
  document.querySelectorAll('[data-zone]').forEach((button,n)=>{
    button.setAttribute('aria-pressed',String(i===n));
    button.setAttribute('aria-label',(inside?c.interiorTags[n]:c.hotspots[n])+', '+c.open);
    button.querySelector('b').textContent=inside?c.interiorTags[n]:c.hotspots[n];
  });
}

function stageCopy() {
  const preview=state.stage!==config.currentStage, future=state.stage>config.currentStage;
  $('scene-status').textContent=preview?(future?c.futureWord:c.pastWord)+' · '+c.stages[state.stage]:c.currentLabels[config.currentStage];
  $('future-label').textContent=future?c.future:c.past;
  $('future-label').hidden=!preview;
  $('stage-body').textContent=preview?c.stageText[state.stage]:c.currentText[config.currentStage];
  $('chapter-symbol').textContent=String(state.stage+1).padStart(2,'0');
  $('stage-preview-note').textContent=preview?(future?c.future:c.past)+' · '+c.current+': '+c.currentLabels[config.currentStage]:c.now;
  document.querySelectorAll('button[data-stage]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.stage)===state.stage)));
}

function setView(view) {
  state.view=view;state.zone=0;
  $('world-stage').dataset.view=view;
  document.querySelectorAll('button[data-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.view===view)));
  world?.set(view,state.stage);details();
  canvas.setAttribute('aria-label',view==='farm'?c.farm:c.cafe);
}

nearby(section,async()=>{
  section.classList.add('is-loading');$('loading').hidden=false;
  try {
    const {createWorld}=await import('./world.js');
    canvas.addEventListener('worldready',()=>{
      section.classList.add('is-interactive');section.classList.remove('is-loading');$('loading').hidden=true;
    },{once:true});
    world=createWorld(canvas,{onError:failed,onHotspots(points){
      document.querySelectorAll('[data-zone]').forEach((button,i)=>{
        button.style.left=points[i].x+'px';button.style.top=points[i].y+'px';
        button.style.visibility=points[i].visible?'visible':'hidden';
      });
    }});
    if(!world){failed();return;}
    $('pause').onclick=sceneMotion(world,paused=>{
      $('pause-label').textContent=paused?c.play:c.pause;
      $('pause-icon').textContent=paused?'▷':'Ⅱ';
      $('pause').setAttribute('aria-pressed',String(paused));
      $('pause').disabled=document.documentElement.dataset.reduceMotion==='true'||matchMedia('(prefers-reduced-motion: reduce)').matches;
    });
    $('reset').onclick=()=>world.reset();
    document.querySelectorAll('button[data-view]').forEach(button=>button.onclick=()=>setView(button.dataset.view));
    document.querySelectorAll('[data-zone]').forEach(button=>button.onclick=()=>{state.zone=Number(button.dataset.zone);details();});
    document.querySelectorAll('button[data-stage]').forEach(button=>button.onclick=()=>{
      state.stage=Number(button.dataset.stage);world.set(state.view,state.stage);stageCopy();
      $('world-stage').scrollIntoView({behavior:world.paused?'auto':'smooth',block:'center'});
    });
    setView('farm');stageCopy();
  } catch {failed();}
});
