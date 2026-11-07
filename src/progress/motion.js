import {createScenePlayback} from './scene-playback.js';
// Share the website preference; explicit scene playback never changes other media.
export function sceneMotion(world, onChange) {
  const os = matchMedia('(prefers-reduced-motion: reduce)');
  const playback=createScenePlayback(()=>document.documentElement.dataset.reduceMotion==='true'||os.matches);
  const apply = () => {
    world.pause(playback.paused);
    onChange(world.paused);
  };
  const preference=()=>{playback.preferenceChanged();apply();};
  new MutationObserver(preference).observe(document.documentElement, {attributes:true, attributeFilter:['data-reduce-motion']});
  os.addEventListener('change',preference);
  apply();
  return () => {playback.pause(!playback.paused);apply();};
}

export function nearby(element, start) {
  if (!('IntersectionObserver' in window)) {start(); return;}
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {observer.disconnect(); start();}
  }, {rootMargin:'200px'});
  observer.observe(element);
}
