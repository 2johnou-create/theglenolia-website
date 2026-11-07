const TOOLS=Object.freeze(['bucket','cloud','wind','storm','blizzard']);

/** Return a bounded drop only when a pointer actually lands inside the scene. */
export function weatherDropPoint(rect,x,y){
  if(!rect||![rect.left,rect.top,rect.width,rect.height,x,y].every(Number.isFinite)||rect.width<=0||rect.height<=0)return null;
  const u=(x-rect.left)/rect.width,v=(y-rect.top)/rect.height;
  return u>=0&&u<=1&&v>=0&&v<=1?{u,v}:null;
}

/** Pointer dragging is an enhancement; every tool also works by tap or keyboard. */
export function mountWeatherGame(root,{getWorld=()=>null,onActiveChange=()=>{},copy:g}={}){
  const panel=root?.querySelector('[data-weather-game]'),canvas=root?.querySelector('canvas');
  if(!panel||!canvas||!g)return{refresh(){},dispose(){}};
  const doc=root.ownerDocument,abort=new AbortController(),signal=abort.signal;
  const query=s=>root.querySelector(s),tools=[...root.querySelectorAll('[data-weather-tool]')];
  const status=query('[data-weather-game-status]'),aim=query('[data-weather-game-aim]');
  const mode=query('[data-weather-game-mode]'),details=query('[data-weather-game-details]'),quickTools=query('[data-weather-game-quick-tools]');
  let selected=null,lastActive=false,lastState={},notice=null,drag=null,ghost=null,canvasTap=null,suppressClickUntil=0,disposed=false;
  function listen(target,type,handler,options={}){target?.addEventListener(type,handler,{...options,signal});}
  function world(){try{return getWorld();}catch{return null;}}
  function tell(text){if(status&&status.textContent!==text)status.textContent=text;}
  function refresh(snapshot){
    if(disposed)return;
    const w=world(),ready=Boolean(w&&typeof w.weatherGameAction==='function');
    const value=snapshot&&typeof snapshot==='object'?snapshot:(w?.getWeatherGameState?.()||{});
    const active=value.active===true;
    if(lastActive&&!active){notice='returned';selected=null;}
    lastState=value;
    panel.querySelectorAll('button').forEach(button=>button.disabled=!ready);
    for(const button of tools)button.disabled=!ready;
    const quick=query('[data-weather-game-quick-reset]');if(quick)quick.disabled=!ready;
    const play=query('[data-weather-game-play]');if(play){play.hidden=!active||!value.paused;play.disabled=!ready;}
    root.classList.toggle('is-weather-playing',active);
    root.dataset.weatherPlay=active?'active':'normal';
    for(const button of tools)button.setAttribute('aria-pressed',String(button.dataset.weatherTool===selected));
    if(mode){mode.hidden=!active;query('[data-weather-game-badge]').textContent=g.badge;}
    if(quickTools)quickTools.hidden=!ready||!active;
    if(!active&&(quickTools?.contains(doc.activeElement)||doc.activeElement===quick))query('[data-programme-reset]')?.focus({preventScroll:true});
    if(aim)aim.hidden=!selected;
    if(!ready)tell(w?g.unavailable:g.loading);
    else if(active&&value.paused)tell(value.motionReason==='reduced'?g.motionReduced:g.motionPaused);
    else if(active)tell((Number(value.flood)>.22?g.states.flood:g.states[value.tool]||g.states.active));
    else tell(notice==='cancelled'?g.cancelled:notice==='returned'?g.returned:g.ready);
    if(active!==lastActive)onActiveChange(active,value);
    lastActive=active;
  }
  function apply(tool,target){
    if(!TOOLS.includes(tool))return;
    const w=world();if(typeof w?.weatherGameAction!=='function'){refresh();return;}
    selected=tool;notice=null;
    try{const result=w.weatherGameAction(tool,target);refresh(result&&typeof result==='object'?result:undefined);}
    catch{tell(g.unavailable);}
  }
  function revealScene(){
    const reduced=doc.documentElement.dataset.reduceMotion==='true'||doc.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches||world()?.paused;
    canvas.parentElement.scrollIntoView({block:'center',inline:'nearest',behavior:reduced?'auto':'smooth'});
  }
  function clearDrag(){
    if(drag?.button?.hasPointerCapture?.(drag.id))drag.button.releasePointerCapture(drag.id);
    drag=null;ghost?.remove();ghost=null;
    root.classList.remove('is-weather-dragging');canvas.parentElement.classList.remove('is-weather-drop-target');
  }
  function reset(){
    clearDrag();selected=null;notice='returned';
    const w=world();try{w?.resetWeatherGame?.();}catch{tell(g.unavailable);return;}
    refresh();
  }
  for(const button of tools){
    listen(button,'click',event=>{
      if(Date.now()<suppressClickUntil){event.preventDefault();return;}
      apply(button.dataset.weatherTool);
      revealScene();
      if(event.detail===0)quickTools?.querySelector('[data-weather-tool="'+button.dataset.weatherTool+'"]')?.focus({preventScroll:true});
    });
    listen(button,'pointerdown',event=>{
      if(button.disabled||event.isPrimary===false||event.button!==0)return;
      drag={id:event.pointerId,button,tool:button.dataset.weatherTool,x:event.clientX,y:event.clientY,moving:false};
    });
    listen(button,'dragstart',event=>event.preventDefault());
  }
  listen(doc,'pointermove',event=>{
    if(!drag||event.pointerId!==drag.id)return;
    if(!drag.moving&&Math.hypot(event.clientX-drag.x,event.clientY-drag.y)<9)return;
    if(!drag.moving){
      drag.moving=true;drag.button.setPointerCapture?.(drag.id);
      ghost=doc.createElement('div');ghost.className='weather-play-ghost';ghost.setAttribute('aria-hidden','true');
      const icon=drag.button.querySelector('svg');if(icon)ghost.append(icon.cloneNode(true));
      const label=doc.createElement('span');label.textContent=g.tools[drag.tool];ghost.append(label);doc.body.append(ghost);
      root.classList.add('is-weather-dragging');
    }
    event.preventDefault();
    const point=weatherDropPoint(canvas.getBoundingClientRect(),event.clientX,event.clientY);
    canvas.parentElement.classList.toggle('is-weather-drop-target',Boolean(point));
    ghost.classList.toggle('is-over-world',Boolean(point));
    ghost.style.transform=`translate(${event.clientX+12}px,${event.clientY-42}px)`;
  },{passive:false});
  listen(doc,'pointerup',event=>{
    if(!drag||event.pointerId!==drag.id)return;
    const moving=drag.moving,tool=drag.tool;
    if(moving){
      event.preventDefault();suppressClickUntil=Date.now()+500;
      const point=weatherDropPoint(canvas.getBoundingClientRect(),event.clientX,event.clientY);
      clearDrag();
      if(point)apply(tool,point);else{notice='cancelled';tell(g.cancelled);}
    }else clearDrag();
  },{passive:false});
  listen(doc,'pointercancel',event=>{if(drag?.id===event.pointerId){suppressClickUntil=Date.now()+500;clearDrag();}});
  listen(doc,'keydown',event=>{if(event.key==='Escape'&&drag){suppressClickUntil=Date.now()+500;clearDrag();}});
  // An ordinary canvas drag stays an OrbitControls gesture. Only a short tap
  // reapplies the selected tool, and pointer events are never stopped mid-orbit.
  listen(canvas,'pointerdown',event=>{
    if(event.isPrimary===false){canvasTap=null;return;}
    if(event.button===0&&selected&&(details?.open||lastState.active===true))canvasTap={id:event.pointerId,x:event.clientX,y:event.clientY};
  },{capture:true});
  listen(canvas,'pointerup',event=>{
    if(!canvasTap||canvasTap.id!==event.pointerId)return;
    const tap=canvasTap;canvasTap=null;
    if(!selected||Math.hypot(tap.x-event.clientX,tap.y-event.clientY)>8)return;
    const point=weatherDropPoint(canvas.getBoundingClientRect(),event.clientX,event.clientY);
    if(point)apply(selected,point);
  });
  listen(canvas,'pointercancel',()=>canvasTap=null);
  listen(query('[data-weather-game-reset]'),'click',reset);
  listen(query('[data-weather-game-quick-reset]'),'click',reset);
  listen(query('[data-weather-game-play]'),'click',()=>{world()?.pause(false);refresh();query('[data-programme-pause]')?.focus({preventScroll:true});});
  listen(canvas,'weathergamechange',event=>refresh(event.detail));
  listen(details,'toggle',()=>refresh());
  refresh();
  return{refresh,dispose(){if(disposed)return;clearDrag();disposed=true;abort.abort();root.classList.remove('is-weather-playing');}};
}
