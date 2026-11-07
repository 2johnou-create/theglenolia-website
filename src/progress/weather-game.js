import * as THREE from 'three';

// An opt-in, local toy. These values never replace a weather observation or a
// project record. Wind/rain use the environment's units; other levels are 0–1.
export const weatherGameTools=Object.freeze(['bucket','cloud','wind','storm','blizzard']);
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const finite=(value,fallback=0)=>Number.isFinite(value)?value:fallback;
const approach=(value,target,rate,dt)=>value+(target-value)*(1-Math.exp(-rate*dt));
const profiles={
  bucket:{wind:8,rain:5,snow:0,cloud:.18,flood:.31,panic:.38,hold:5},
  cloud:{wind:27,rain:12,snow:0,cloud:.78,flood:.24,panic:.55,hold:13},
  wind:{wind:82,rain:0,snow:0,cloud:.30,flood:0,panic:.76,hold:12},
  storm:{wind:90,rain:24,snow:0,cloud:1,flood:.55,panic:1,hold:17},
  blizzard:{wind:73,rain:0,snow:1,cloud:.82,flood:.08,panic:.94,hold:17},
};
function defaultState(){return {active:false,wind:0,rain:0,snow:0,flood:0,panic:0,lightning:0,cloud:0,elapsed:0,tool:null,target:{x:0,z:0}};}

/** Deterministic, bounded game state, usable without a browser or renderer. */
export function createWeatherGameState({seed=6143}={}) {
  const phase=(finite(seed,6143)>>>0)%17/17;
  let state=defaultState(),hold=0,stormCharge=0,pour=0;
  const snapshot=()=>({...state,target:{...state.target},pour});
  function reset(){state=defaultState();hold=0;stormCharge=0;pour=0;return snapshot();}
  function trigger(tool,target={}) {
    if(!weatherGameTools.includes(tool))return false;
    const p=profiles[tool];
    if(!state.active)state.elapsed=0;
    state.active=true;state.tool=tool;hold=p.hold;
    state.target={x:clamp(finite(target?.x),-12.5,12.5),z:clamp(finite(target?.z),-9.5,9.5)};
    // A new tool is legible immediately; repeated drops remain bounded. Switching
    // tools replaces airborne weather while accumulated water drains gradually.
    state.wind=p.wind;state.rain=p.rain;state.snow=p.snow;state.cloud=p.cloud;
    state.flood=clamp(state.flood+p.flood,0,1);state.panic=Math.max(p.panic,state.flood*.8);
    stormCharge=tool==='storm'?1:0;state.lightning=0;
    pour=tool==='bucket'?1:0;
    return snapshot();
  }
  function update(dt,{paused=false,reducedMotion=false}={}) {
    if(reducedMotion){state.lightning=0;return snapshot();}
    if(paused||!state.active)return snapshot();
    const delta=clamp(finite(dt),0,.1);if(!delta)return snapshot();
    state.elapsed+=delta;hold=Math.max(0,hold-delta);pour=Math.max(0,pour-delta/3.6);
    if(hold>0){
      state.flood=clamp(state.flood+state.rain*.00092*delta,0,1);
      state.panic=clamp(Math.max(state.panic,state.flood*.9));
    }else{
      for(const key of ['wind','rain','snow','cloud','panic'])state[key]=approach(state[key],0,.29,delta);
      state.flood=Math.max(0,state.flood-delta*.027);
      // The team keeps reacting while water is still high, even after the
      // cloud passes. Otherwise normal work could resume below the flood sheet.
      state.panic=Math.max(state.panic,state.flood*.8);
      stormCharge=Math.max(0,stormCharge-delta*.15);
    }
    // One slowly rising/falling illustrated bolt, at most every 10.4 seconds.
    // There is no full-screen flash or rapid flashing light.
    const pulse=(state.elapsed+phase)%10.4;
    state.lightning=stormCharge>.05&&state.elapsed>3.6&&pulse>4.1&&pulse<6.1
      ?Math.sin((pulse-4.1)/2*Math.PI)*.55*stormCharge:0;
    if(hold===0&&state.flood<.001&&state.wind<.08&&state.rain<.03&&state.snow<.002&&state.cloud<.002)return reset();
    return snapshot();
  }
  return {trigger,update,reset,getState:snapshot};
}

function randomSource(seed){let s=finite(seed,6143)>>>0;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};}
function roundedSheet(w,d,r=.8){
  const s=new THREE.Shape(),x=-w/2,z=-d/2;
  s.moveTo(x+r,z);s.lineTo(x+w-r,z);s.quadraticCurveTo(x+w,z,x+w,z+r);s.lineTo(x+w,z+d-r);s.quadraticCurveTo(x+w,z+d,x+w-r,z+d);s.lineTo(x+r,z+d);s.quadraticCurveTo(x,z+d,x,z+d-r);s.lineTo(x,z+r);s.quadraticCurveTo(x,z,x+r,z);
  return new THREE.ShapeGeometry(s,8);
}

/** Original low-draw-call effects, with no texture/network dependency. */
export function createWeatherGame({seed=6143}={}) {
  const game=createWeatherGameState({seed}),rand=randomSource(seed),root=new THREE.Group();
  root.name='Local weather play effects';root.visible=false;
  const resources=new Set(),addGeometry=g=>(resources.add(g),g),addMaterial=m=>(resources.add(m),m);
  const mat=(options)=>addMaterial(new THREE.MeshStandardMaterial(options));
  const waterMat=mat({color:0x8db5a9,transparent:true,opacity:.28,roughness:.23,metalness:.03,side:THREE.DoubleSide,depthWrite:false});
  const flood=new THREE.Mesh(addGeometry(roundedSheet(29.1,23.1)),waterMat);flood.rotation.x=-Math.PI/2;flood.position.y=.46;flood.renderOrder=3;root.add(flood);
  const snowMat=mat({color:0xf5f1e8,transparent:true,opacity:.55,roughness:.96,side:THREE.DoubleSide,depthWrite:false});
  const snowCover=new THREE.Mesh(addGeometry(roundedSheet(29,23)),snowMat);snowCover.rotation.x=-Math.PI/2;snowCover.position.y=.46;snowCover.renderOrder=2;root.add(snowCover);
  const temp=new THREE.Object3D();
  const edgeWater=new THREE.InstancedMesh(addGeometry(new THREE.PlaneGeometry(1,1)),waterMat,20);edgeWater.name='Play water spilling over the miniature edge';edgeWater.renderOrder=3;root.add(edgeWater);
  for(let i=0;i<20;i++){
    const side=i%4,offset=(Math.floor(i/4)-2)*4.6;
    temp.position.set(side===0?-14.55:side===1?14.55:offset,-.67,side===2?-11.55:side===3?11.55:offset*.75);
    temp.rotation.set(0,side<2?Math.PI/2:0,0);temp.scale.set(1.6,2.15,1);temp.updateMatrix();edgeWater.setMatrixAt(i,temp.matrix);
  }
  const rippleMat=addMaterial(new THREE.MeshBasicMaterial({color:0xd9dfd0,transparent:true,opacity:.5,side:THREE.DoubleSide,depthWrite:false}));
  const ripples=new THREE.InstancedMesh(addGeometry(new THREE.TorusGeometry(1,.018,4,28)),rippleMat,8);ripples.renderOrder=4;root.add(ripples);

  const cloudMat=mat({color:0x869188,roughness:1,transparent:true,opacity:.94});
  const clouds=new THREE.InstancedMesh(addGeometry(new THREE.SphereGeometry(1,12,8)),cloudMat,21);clouds.name='Draggable heavy weather clouds';root.add(clouds);
  const cloudSeeds=Array.from({length:21},(_,i)=>({cluster:Math.floor(i/7),x:(rand()-.5)*3.4,y:rand()*.5,z:(rand()-.5)*1.4,s: .6+rand()*.45}));
  const rainCount=420,rainArray=new Float32Array(rainCount*6),rainGeometry=addGeometry(new THREE.BufferGeometry());
  rainGeometry.setAttribute('position',new THREE.BufferAttribute(rainArray,3));rainGeometry.setDrawRange(0,0);
  const rainMat=addMaterial(new THREE.LineBasicMaterial({color:0xc5e0d8,transparent:true,opacity:.78,depthWrite:false}));
  const rain=new THREE.LineSegments(rainGeometry,rainMat);rain.name='Play rainfall';rain.frustumCulled=false;root.add(rain);
  const seeds=Array.from({length:620},()=>({x:(rand()-.5)*28,z:(rand()-.5)*22,y:rand()*6.2,speed:4+rand()*5,p:rand()*Math.PI*2}));
  const snowArray=new Float32Array(620*3),snowGeometry=addGeometry(new THREE.BufferGeometry());snowGeometry.setAttribute('position',new THREE.BufferAttribute(snowArray,3));
  // Screen-sized points stay legible with the orthographic camera on a phone.
  // Round the original procedural points without a downloaded sprite texture.
  const flakeMat=addMaterial(new THREE.PointsMaterial({color:0xf5f1e8,size:3.2,sizeAttenuation:false,transparent:true,opacity:.94,depthWrite:false}));
  flakeMat.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <clipping_planes_fragment>','#include <clipping_planes_fragment>\nif (distance(gl_PointCoord, vec2(0.5)) > 0.5) discard;');};
  flakeMat.customProgramCacheKey=()=> 'glenolia-round-weather-snow';
  const flakes=new THREE.Points(snowGeometry,flakeMat);flakes.frustumCulled=false;flakes.name='Play snow flurries';root.add(flakes);
  const windArray=new Float32Array(48*6),windGeometry=addGeometry(new THREE.BufferGeometry());windGeometry.setAttribute('position',new THREE.BufferAttribute(windArray,3));
  const windLines=new THREE.LineSegments(windGeometry,addMaterial(new THREE.LineBasicMaterial({color:0xd9dfd0,transparent:true,opacity:.25,depthWrite:false})));windLines.frustumCulled=false;root.add(windLines);

  const bucket=new THREE.Group();bucket.name='Tipping play water bucket';root.add(bucket);
  const bucketMat=mat({color:0xd9dfd0,roughness:.38,metalness:.32,side:THREE.DoubleSide});
  bucket.add(new THREE.Mesh(addGeometry(new THREE.CylinderGeometry(.47,.34,.68,14,1,true)),bucketMat));
  const rim=new THREE.Mesh(addGeometry(new THREE.TorusGeometry(.47,.035,5,18)),bucketMat);rim.rotation.x=Math.PI/2;rim.position.y=.34;bucket.add(rim);
  const handle=new THREE.Mesh(addGeometry(new THREE.TorusGeometry(.37,.028,5,16,Math.PI)),bucketMat);handle.position.y=.32;bucket.add(handle);
  const pourMat=addMaterial(new THREE.LineBasicMaterial({color:0xb6dacf,transparent:true,opacity:.95,depthWrite:false}));
  const pourArray=new Float32Array(18*6),pourGeometry=addGeometry(new THREE.BufferGeometry());pourGeometry.setAttribute('position',new THREE.BufferAttribute(pourArray,3));
  const pouring=new THREE.LineSegments(pourGeometry,pourMat);pouring.frustumCulled=false;root.add(pouring);

  const boltPath=new THREE.CurvePath(),boltPoints=[[0,5.9,0],[-.35,4.7,.05],[.1,4.8,.05],[-.55,3.5,.1],[-.1,3.6,.1],[-.6,2.2,.15]].map(p=>new THREE.Vector3(...p));
  for(let i=1;i<boltPoints.length;i++)boltPath.add(new THREE.LineCurve3(boltPoints[i-1],boltPoints[i]));
  const boltGeometry=addGeometry(new THREE.TubeGeometry(boltPath,40,.06,5,false));
  const boltMat=addMaterial(new THREE.MeshBasicMaterial({color:0xf5f1e8,transparent:true,opacity:0,depthWrite:false}));
  const bolt=new THREE.Mesh(boltGeometry,boltMat);bolt.name='Slow illustrated lightning bolt';bolt.renderOrder=5;root.add(bolt);
  const glow=new THREE.PointLight(0xf5f1e8,0,12,2);glow.position.set(0,4.3,0);root.add(glow);
  let disposed=false,current=game.getState();

  function draw(s,{reducedMotion=false}={}){
    current=s;root.visible=s.active;if(!s.active)return;
    const time=s.elapsed,moving=!reducedMotion,wind=s.wind/90;
    flood.visible=s.flood>.005;flood.position.y=.465+s.flood*.82;waterMat.opacity=.18+s.flood*.28;
    edgeWater.visible=s.flood>.36;edgeWater.scale.y=1+s.flood*.08;edgeWater.position.y=flood.position.y-.43;
    snowCover.visible=s.snow>.02;snowMat.opacity=s.snow*.48;
    clouds.visible=s.cloud>.025;cloudMat.opacity=clamp(.4+s.cloud*.57);
    cloudMat.color.setHex(s.tool==='storm'?0x58615c:s.snow>.02?0x88948f:0x869188);
    for(let i=0;i<cloudSeeds.length;i++){
      const c=cloudSeeds[i],cx=c.cluster===0?s.target.x:c.cluster===1?-7:7,cz=c.cluster===0?s.target.z:c.cluster===1?-5:5;
      const drift=moving?Math.sin(time*.38+c.cluster)*wind*.7:0;
      temp.position.set(clamp(cx+c.x+drift,-13.6,13.6),5.4+c.y,clamp(cz+c.z,-10,10));temp.rotation.set(0,0,0);temp.scale.set(c.s*1.6,c.s*.70,c.s*1.05);temp.updateMatrix();clouds.setMatrixAt(i,temp.matrix);
    }
    clouds.instanceMatrix.needsUpdate=true;
    rain.visible=s.rain>.02;const visibleRain=Math.round(rainCount*clamp(s.rain/18));rainGeometry.setDrawRange(0,visibleRain*2);
    for(let i=0;i<rainCount;i++){
      const q=seeds[i],j=i*6,y=.5+(6.1-(time*q.speed+q.y)%6.1),x=q.x+(moving?Math.sin(time*.17+q.p)*wind:0),drift=wind*.5;
      rainArray[j]=x;rainArray[j+1]=y;rainArray[j+2]=q.z;rainArray[j+3]=x-drift;rainArray[j+4]=y+.30+wind*.3;rainArray[j+5]=q.z+.06;
    }
    rainGeometry.attributes.position.needsUpdate=true;
    flakes.visible=s.snow>.02;snowGeometry.setDrawRange(0,Math.round(620*s.snow));
    for(let i=0;i<seeds.length;i++){
      const q=seeds[i],j=i*3;snowArray[j]=((q.x+14+time*(.8+wind*3))%28)-14;snowArray[j+1]=.5+(6-(time*(.8+q.speed*.1)+q.y)%6);snowArray[j+2]=q.z+Math.sin(time*.8+q.p)*.2;
    }
    snowGeometry.attributes.position.needsUpdate=true;
    windLines.visible=s.wind>35;windLines.material.opacity=wind*.24;
    for(let i=0;i<48;i++){
      const q=seeds[i],j=i*6,x=((q.x+14+time*(3+wind*8))%28)-14,y=.8+(i%6)*.55;
      windArray[j]=x;windArray[j+1]=y;windArray[j+2]=q.z;windArray[j+3]=Math.min(14,x+.4+wind*.85);windArray[j+4]=y+.03;windArray[j+5]=q.z;
    }
    windGeometry.attributes.position.needsUpdate=true;
    bucket.visible=s.pour>0;pouring.visible=s.pour>0;
    bucket.position.set(s.target.x,5.75,s.target.z);bucket.rotation.set(.25,0,-1.1);
    for(let i=0;i<18;i++){
      const j=i*6,q=seeds[i],offset=(i%6-2.5)*.045,y=.55+((i/18*4.7+time*5)%4.7);
      pourArray[j]=s.target.x+offset;pourArray[j+1]=y;pourArray[j+2]=s.target.z+q.z*.006;
      pourArray[j+3]=s.target.x+offset+.02;pourArray[j+4]=Math.min(5.28,y+.55);pourArray[j+5]=s.target.z+q.z*.006;
    }
    pourGeometry.attributes.position.needsUpdate=true;
    ripples.visible=s.flood>.005||s.rain>.05||s.pour>0;rippleMat.opacity=.12+Math.min(s.flood+.2,s.rain/20+.2)*.4;
    for(let i=0;i<8;i++){
      const q=seeds[i],phase=(time*.45+i*.137)%1,r=.15+phase*.8;
      temp.position.set(s.pour>0?s.target.x+(i%3-1)*.35:q.x*.8,flood.position.y+.025,s.pour>0?s.target.z+(Math.floor(i/3)-1)*.3:q.z*.8);temp.rotation.set(Math.PI/2,0,0);temp.scale.set(r,r,1);temp.updateMatrix();ripples.setMatrixAt(i,temp.matrix);
    }
    ripples.instanceMatrix.needsUpdate=true;
    bolt.visible=s.lightning>.001&&!reducedMotion;boltMat.opacity=Math.min(.92,s.lightning*1.6);bolt.position.set(s.target.x,0,s.target.z);
    glow.position.set(s.target.x,4.3,s.target.z);glow.intensity=reducedMotion?0:s.lightning*.42;
  }
  function reset(){const s=game.reset();root.visible=false;glow.intensity=0;draw(s);return s;}
  return {
    root,
    trigger(tool,target){if(disposed)return false;const s=game.trigger(tool,target);if(s)draw(s);return s;},
    update(dt,options={}){if(disposed)return current;const s=game.update(dt,options);draw(s,options);return s;},
    reset,getState:()=>game.getState(),
    dispose(){if(disposed)return;disposed=true;root.visible=false;for(const resource of resources)resource.dispose();root.clear();},
  };
}
