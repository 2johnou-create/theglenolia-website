import {nearby,sceneMotion} from './motion.js';
const {config,copy:c}=JSON.parse(document.getElementById('progress-data').textContent);
const canvas=document.getElementById('home-world-canvas'), container=canvas.parentElement;
const fallback=()=>container.classList.remove('is-interactive');
nearby(container,async()=>{
  try {
    const {createWorld}=await import('./world.js');
    canvas.addEventListener('worldready',()=>container.classList.add('is-interactive'),{once:true});
    const world=createWorld(canvas,{onError:fallback});
    if(!world)return;
    world.set('farm',config.currentStage);
    const button=document.getElementById('home-pause');
    button.onclick=sceneMotion(world,paused=>{
      button.textContent=paused?c.play:c.pause;button.setAttribute('aria-pressed',String(paused));
      button.disabled=document.documentElement.dataset.reduceMotion==='true'||matchMedia('(prefers-reduced-motion: reduce)').matches;
    });
  } catch {fallback();}
});
