import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {createDioramaFinish,fitDioramaCamera} from './diorama-renderer.js';
import {createPhysicalFarm,createPhysicalInterior,setPhysicalLogo} from './physical-detailed-props.js';

// Illustrative model stages share the authoritative labels in progress-content.
// Selecting a scene here never changes the confirmed project milestone.
export function createWorld(canvas,{onHotspots,onError}={}) {
  let renderer;
  try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});}
  catch{onError?.();return null;}
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate=false;
  const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-16,16,10,-10,.1,160);
  const controls=new OrbitControls(camera,canvas);
  controls.enablePan=false;controls.enableDamping=true;controls.dampingFactor=.065;
  controls.minPolarAngle=.40;controls.maxPolarAngle=1.25;controls.enableZoom=true;
  controls.minZoom=.8;controls.maxZoom=2.5;controls.rotateSpeed=.5;controls.zoomSpeed=.7;
  controls.autoRotate=false;canvas.style.touchAction='pan-y pinch-zoom';
  const finish=createDioramaFinish(renderer,scene,camera,{mobile:innerWidth<600});
  scene.add(new THREE.HemisphereLight(0xf2f2e6,0x8b755b,.58));
  const sun=new THREE.DirectionalLight(0xffedd9,3.45);sun.position.set(-12,24,15);sun.castShadow=true;
  const shadowSize=innerWidth<600?1024:2048;sun.shadow.mapSize.set(shadowSize,shadowSize);
  Object.assign(sun.shadow.camera,{left:-23,right:23,top:23,bottom:-23,near:1,far:75});
  sun.shadow.camera.updateProjectionMatrix();
  sun.shadow.normalBias=.025;sun.shadow.bias=-.00012;sun.shadow.radius=3;scene.add(sun);
  const fill=new THREE.DirectionalLight(0xe9edf0,.32);fill.position.set(15,10,-10);scene.add(fill);
  const shadowFloor=new THREE.Mesh(new THREE.PlaneGeometry(150,150),new THREE.ShadowMaterial({opacity:.15}));
  shadowFloor.rotation.x=-Math.PI/2;shadowFloor.receiveShadow=true;scene.add(shadowFloor);

  let view='farm',stage=0,active,t=0,last=performance.now(),renderedAt=0,shadowAt=0;
  let paused=document.documentElement.dataset.reduceMotion==='true'||matchMedia('(prefers-reduced-motion: reduce)').matches;
  let dirty=true,visible=true,frames=0,disposed=false,ready=false;
  const cache=new Map(),base=document.querySelector('meta[name=site-base]')?.content||'';
  const logoTexture=new THREE.TextureLoader().load(base+'/assets/email/logo-compact.png',()=>{dirty=true;});
  logoTexture.colorSpace=THREE.SRGBColorSpace;setPhysicalLogo(logoTexture);

  function bounds(){return new THREE.Box3().setFromObject(active.root);}
  function reset(){
    const centre=bounds().getCenter(new THREE.Vector3());
    controls.target.copy(centre);
    camera.position.copy(centre).add(new THREE.Vector3(view==='farm'?23:22,view==='farm'?24:23,27));
    controls.update();camera.zoom=1;resize();dirty=true;
  }
  function resize(){
    if(!active||disposed)return;
    const w=canvas.parentElement.clientWidth,h=canvas.parentElement.clientHeight;
    if(!(w>0&&h>0))return;
    fitDioramaCamera(camera,controls,bounds(),w,h,{padding:view==='farm'?1.11:1.10});
    finish.resize(w,h);renderer.shadowMap.needsUpdate=true;dirty=true;
  }
  function set(nextView,nextStage=stage){
    if(disposed||!['farm','cafe'].includes(nextView)||!Number.isInteger(nextStage)||nextStage<0||nextStage>3)return false;
    view=nextView;stage=nextStage;const key=view+stage;
    if(active)scene.remove(active.root);
    if(!cache.has(key))cache.set(key,view==='farm'?createPhysicalFarm(stage):createPhysicalInterior(stage));
    active=cache.get(key);scene.add(active.root);shadowFloor.position.y=active.bottom-.04;
    canvas.dataset.view=view;canvas.dataset.stage=String(stage);
    canvas.dataset.modelMeshes=String(active.stats.meshes);canvas.dataset.modelTriangles=String(Math.round(active.stats.triangles));
    reset();return true;
  }
  function project(){
    const rect=canvas.parentElement.getBoundingClientRect();
    onHotspots?.(active.anchors.map(a=>{const p=a.clone().project(camera);return{x:(p.x*.5+.5)*rect.width,y:(-.5*p.y+.5)*rect.height,visible:p.z<1&&Math.abs(p.x)<.90&&Math.abs(p.y)<.85};}));
  }
  const onChange=()=>{if(active){const w=canvas.parentElement.clientWidth,h=canvas.parentElement.clientHeight;fitDioramaCamera(camera,controls,bounds(),w,h,{padding:view==='farm'?1.11:1.10,resetZoom:false});}dirty=true;};controls.addEventListener('change',onChange);
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(canvas.parentElement);
  const visibilityObserver=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)dirty=true;},{rootMargin:'120px'});
  visibilityObserver.observe(canvas.parentElement);
  function onContextLost(event){event.preventDefault();paused=true;onError?.();}
  canvas.addEventListener('webglcontextlost',onContextLost);
  function onKey(event){
    if(event.ctrlKey||event.metaKey||event.altKey)return;
    if(event.key.toLowerCase()==='r'){reset();return;}
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;
    event.preventDefault();const delta=camera.position.clone().sub(controls.target),s=new THREE.Spherical().setFromVector3(delta);
    if(event.key==='ArrowLeft')s.theta-=.13;if(event.key==='ArrowRight')s.theta+=.13;
    if(event.key==='ArrowUp')s.phi=Math.max(.40,s.phi-.07);if(event.key==='ArrowDown')s.phi=Math.min(1.25,s.phi+.07);
    camera.position.copy(new THREE.Vector3().setFromSpherical(s).add(controls.target));controls.update();dirty=true;
  }
  canvas.addEventListener('keydown',onKey);
  function loop(now){
    if(disposed)return;requestAnimationFrame(loop);
    if(!visible||document.hidden){last=now;return;}
    if(now-renderedAt<1000/30)return;
    const delta=Math.min((now-last)/1000,.05);last=now;renderedAt=now;
    if(!paused)t+=delta;
    const moved=controls.update();
    if(!paused||dirty||moved){
      for(const animate of active.animations)animate(t);
      if(!paused&&now-shadowAt>(innerWidth<600?500:250)){renderer.shadowMap.needsUpdate=true;shadowAt=now;}
      finish.render();project();dirty=false;canvas.dataset.rendered='true';canvas.dataset.paused=String(paused);
      if(!ready){ready=true;canvas.dispatchEvent(new Event('worldready'));}
      frames++;if(frames%20===0){canvas.dataset.frames=String(frames);canvas.dataset.animationTime=t.toFixed(3);canvas.dataset.drawCalls=String(renderer.info.render.calls);}canvas.dataset.renderedView=view;canvas.dataset.renderedStage=String(stage);
    }
  }
  set('farm',0);requestAnimationFrame(loop);
  return {
    set,reset,
    pause(value){paused=Boolean(value);canvas.dataset.paused=String(paused);dirty=true;},
    get paused(){return paused;},get scene(){return scene;},
    dispose(){
      if(disposed)return;disposed=true;resizeObserver.disconnect();visibilityObserver.disconnect();
      canvas.removeEventListener('keydown',onKey);canvas.removeEventListener('webglcontextlost',onContextLost);
      controls.dispose();finish.dispose();renderer.dispose();logoTexture.dispose();
      const geometries=new Set(),materials=new Set();for(const model of cache.values())model.root.traverse(o=>{if(o.geometry)geometries.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])if(m)materials.add(m);});
      for(const geometry of geometries)geometry.dispose();for(const material of materials)material.dispose();cache.clear();
    },
  };
}
