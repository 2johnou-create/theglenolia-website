// Share the website motion preference; a scene pause never changes other media.
export function sceneMotion(world, onChange) {
  let manual = false;
  const os = matchMedia('(prefers-reduced-motion: reduce)');
  const apply = () => {
    world.pause(manual || document.documentElement.dataset.reduceMotion === 'true' || os.matches);
    onChange(world.paused);
  };
  new MutationObserver(apply).observe(document.documentElement, {attributes:true, attributeFilter:['data-reduce-motion']});
  os.addEventListener('change',apply);
  apply();
  return () => {manual = !manual; apply();};
}

export function nearby(element, start) {
  if (!('IntersectionObserver' in window)) {start(); return;}
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {observer.disconnect(); start();}
  }, {rootMargin:'200px'});
  observer.observe(element);
}
