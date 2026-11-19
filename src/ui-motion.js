/* The Glenolia: coordinated interface motion. No data or scene state is owned here. */
export function entryPlan(count, {duration=280, stagger=35, distance=8}={}) {
  const length=Math.min(Math.max(count,0),8);
  return Array.from({length},(_,i)=>({duration,delay:Math.min(i*stagger,175),distance}));
}

export function markerFrames(before, after) {
  if(!after.width||!after.height)return null;
  const transform=box=>`translate(${box.x}px, ${box.y}px) scale(${box.width/after.width}, ${box.height/after.height})`;
  return [{transform:transform(before)},{transform:transform(after)}];
}

export function createAnimator(allowed) {
  const running=new Map();
  function cancel(element) { const current=running.get(element);if(current){running.delete(element);current.cancel();} }
  function animate(element,frames,timing) {
    cancel(element);
    if(!allowed()||typeof element.animate!=='function')return null;
    const animation=element.animate(frames,{...timing,fill:'none'});
    running.set(element,animation);
    animation.finished.then(()=>{if(running.get(element)===animation)running.delete(element);},()=>{});
    return animation;
  }
  function enter(elements,options={}) {
    const visible=[...elements].filter(el=>el&&!el.hidden&&el.getClientRects().length);
    entryPlan(visible.length,options).forEach((plan,i)=>animate(visible[i],[
      {opacity:.45,transform:`translateY(${plan.distance}px)`},
      {opacity:1,transform:'translateY(0)'}
    ],{duration:plan.duration,delay:plan.delay,easing:'cubic-bezier(.22,1,.36,1)'}));
  }
  return {animate,enter,cancel,settle(){for(const element of [...running.keys()])cancel(element);},get size(){return running.size;}};
}

export function mountPublicMotion(doc=document,win=window) {
  const root=doc.documentElement,query=win.matchMedia('(prefers-reduced-motion: reduce)');
  const allowed=()=>!doc.hidden&&!query.matches&&root.dataset.reduceMotion!=='true';
  const animator=createAnimator(allowed),cleanups=[],markers=[];
  let frame=0,disposed=false;
  const on=(target,event,fn,options)=>{target.addEventListener(event,fn,options);cleanups.push(()=>target.removeEventListener(event,fn,options));};
  const observer=(target,options,fn)=>{const ob=new MutationObserver(fn);ob.observe(target,options);cleanups.push(()=>ob.disconnect());return ob;};
  function selection(container,selector,kind='pill',hover=false) {
    if(!container)return;
    const marker=doc.createElement('span');marker.className='ui-selection-marker';marker.setAttribute('aria-hidden','true');marker.hidden=true;
    container.append(marker);container.dataset.uiSelectionReady=kind;
    let target=null,queued=0;
    const active=()=>container.querySelector(`${selector}[aria-pressed="true"],${selector}[aria-current]`);
    function update(immediate=false) {
      if(disposed)return;
      const selected=target?.isConnected?target:active();
      if(!selected?.getClientRects().length){if(!marker.hidden)marker.hidden=true;animator.cancel(marker);return;}
      const parent=container.getBoundingClientRect(),box=selected.getBoundingClientRect();
      const offsetX=parent.left+container.clientLeft-container.scrollLeft,offsetY=parent.top+container.clientTop-container.scrollTop;
      const next=kind==='underline'?{x:box.left-offsetX,y:box.bottom-offsetY-2,width:box.width,height:2}:
        {x:box.left-offsetX,y:box.top-offsetY,width:box.width,height:box.height};
      const current=marker.hidden?null:marker.getBoundingClientRect();
      const previous=current?{x:current.left-offsetX,y:current.top-offsetY,width:current.width,height:current.height}:next;
      animator.cancel(marker);if(marker.hidden)marker.hidden=false;marker.style.width=next.width+'px';marker.style.height=next.height+'px';marker.style.transform=`translate(${next.x}px, ${next.y}px)`;
      if(!immediate&&current)animator.animate(marker,markerFrames(previous,next),{duration:300,easing:'cubic-bezier(.22,1,.36,1)'});
    }
    const schedule=()=>{if(!queued)queued=win.requestAnimationFrame(()=>{queued=0;update();});};
    observer(container,{attributes:true,subtree:true,attributeFilter:['aria-pressed','aria-current','hidden']},schedule);
    if(hover){
      on(container,'pointerover',event=>{if(event.pointerType==='touch')return;const link=event.target.closest(selector);if(link?.parentElement===container){target=link;schedule();}});
      on(container,'pointerleave',()=>{target=null;schedule();});
      on(container,'focusin',event=>{const link=event.target.closest(selector);if(link?.parentElement===container){target=link;schedule();}});
      on(container,'focusout',()=>{target=null;schedule();});
    }
    const resize=new ResizeObserver(()=>update(true));resize.observe(container);for(const child of container.querySelectorAll(selector))resize.observe(child);
    cleanups.push(()=>{resize.disconnect();win.cancelAnimationFrame(queued);marker.remove();delete container.dataset.uiSelectionReady;});
    markers.push(()=>update(true));update(true);
  }
  selection(doc.querySelector('.main-nav'),'a:not(.button)','underline',true);
  for(const group of doc.querySelectorAll('.scene-toggle,.programme-department-tabs,.growth-stage-buttons,.stage-selectors'))selection(group,'button');

  // Only the opening editorial sequence moves on navigation; long pages remain calm.
  const introduction=doc.querySelector('.hero-copy,.page-intro,.register-layout > div,.edu-public-hero-copy');
  if(introduction)animator.enter([...introduction.children].filter(el=>el.matches('h1,.eyebrow,.lead,.hero-actions,.opening-note')),{distance:10,duration:340,stagger:40});

  const textTargets=[...doc.querySelectorAll('#detail-title,#detail-body,#stage-body,[data-growth-title],[data-growth-body]')];
  const textCache=new Map(textTargets.map(el=>[el,el.textContent]));
  let pendingText=new Set();
  for(const element of textTargets)observer(element,{childList:true,characterData:true,subtree:true},()=>{
    if(textCache.get(element)===element.textContent)return;
    textCache.set(element,element.textContent);pendingText.add(element);
    if(!frame)frame=win.requestAnimationFrame(()=>{frame=0;animator.enter(pendingText,{duration:260,stagger:35,distance:6});pendingText=new Set();});
  });
  for(const panel of doc.querySelectorAll('[data-hello-panel],[data-growth-previewbar]'))observer(panel,{attributes:true,attributeFilter:['hidden']},()=>{
    if(!panel.hidden)animator.enter([panel],{duration:240,distance:6});else animator.cancel(panel);
  });

  // Semantic open/close happens in app.js. Animate only the menu's visual layer.
  const menu=doc.querySelector('.main-nav'),header=doc.querySelector('.site-header');
  if(menu&&header)on(doc,'glenolia:menu',event=>{
    if(event.detail.open)animator.enter([...menu.querySelectorAll('a')],{duration:240,stagger:25,distance:6});
    else for(const link of menu.querySelectorAll('a'))animator.cancel(link);
    markers.forEach(update=>update());
  });
  function settle(){animator.settle();markers.forEach(update=>update());}
  on(query,'change',settle);on(doc,'visibilitychange',settle);
  observer(root,{attributes:true,attributeFilter:['data-reduce-motion']},settle);
  on(win,'pageshow',event=>{if(event.persisted)settle();});
  doc.fonts?.ready.then(()=>{if(!disposed)markers.forEach(update=>update());});
  return {animator,destroy(){disposed=true;animator.settle();win.cancelAnimationFrame(frame);for(const cleanup of cleanups)cleanup();}};
}

if(typeof document!=='undefined'&&typeof window!=='undefined')mountPublicMotion();
