import * as THREE from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {GTAOPass} from 'three/addons/postprocessing/GTAOPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';

// A shared finish for the approved miniature landscapes. Small-screen rendering
// keeps the same models/materials with cheaper lighting composition.
export function createDioramaFinish(renderer,scene,camera,{mobile=false}={}) {
  const small=()=>mobile||(typeof window!=='undefined'&&window.innerWidth<600);
  const canvas=renderer.domElement;
  renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio||1,small()?1.35:1.65));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.02;
  renderer.info.autoReset=false;
  const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();
  const environment=pmrem.fromScene(room,.03);room.dispose();
  scene.environment=environment.texture;scene.environmentIntensity=.40;
  let composer=null,ao=null,disposed=false;
  try {
    composer=new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene,camera));
    ao=new GTAOPass(scene,camera,512,512,undefined,
      {radius:.4,distanceExponent:1.2,thickness:1.1,scale:1,samples:8},
      {lumaPhi:10,depthPhi:2,normalPhi:3,radius:5,samples:8});
    ao.blendIntensity=.62;composer.addPass(ao);composer.addPass(new OutputPass());
    ao.enabled=!small();
  } catch {composer?.dispose();composer=null;ao=null;}
  function quality(){canvas.dataset.renderQuality=ao?.enabled?'diorama-contact':'diorama-light';canvas.dataset.diorama='true';}
  quality();
  return {
    render(){
      if(disposed)return;
      renderer.info.reset();
      if(composer&&ao?.enabled){
        try{composer.render();}
        catch{ao.enabled=false;quality();renderer.render(scene,camera);}
      }else renderer.render(scene,camera);
    },
    resize(width,height){
      if(disposed||!(width>0&&height>0))return;
      const ratio=Math.min(globalThis.devicePixelRatio||1,small()?1.35:1.65);
      renderer.setPixelRatio(ratio);renderer.setSize(width,height,false);
      if(composer){composer.setPixelRatio(ratio);composer.setSize(width,height);}
      if(ao)ao.enabled=!small();quality();
    },
    dispose(){
      if(disposed)return;disposed=true;
      for(const pass of composer?.passes||[])pass.dispose?.();
      composer?.dispose();environment.dispose();pmrem.dispose();
      if(scene.environment===environment.texture)scene.environment=null;
    },
  };
}

/** Fit only the intended model, excluding sky/floor, at the current orientation. */
export function fitDioramaCamera(camera,controls,bounds,width,height,{padding=1.1,resetZoom=true}={}) {
  if(!(width>0&&height>0)||!bounds||bounds.isEmpty())return false;
  const coordinates=[...bounds.min.toArray(),...bounds.max.toArray()];
  if(!coordinates.every(Number.isFinite))return false;
  const target=controls.target,direction=camera.position.clone().sub(target);
  if(direction.lengthSq()<1e-8)direction.set(1,1,1);
  direction.normalize();
  const right=new THREE.Vector3(0,1,0).cross(direction);
  if(right.lengthSq()<1e-8)right.set(1,0,0);else right.normalize();
  const up=direction.clone().cross(right).normalize(),aspect=width/height;
  let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity,distance=1;
  const tanV=camera.isPerspectiveCamera?Math.tan(THREE.MathUtils.degToRad(camera.fov/2)):0;
  for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z]){
    const relative=new THREE.Vector3(x,y,z).sub(target),sx=relative.dot(right),sy=relative.dot(up);
    minX=Math.min(minX,sx);maxX=Math.max(maxX,sx);minY=Math.min(minY,sy);maxY=Math.max(maxY,sy);
    if(camera.isPerspectiveCamera){const depth=relative.dot(direction);distance=Math.max(distance,Math.abs(sx)/(tanV*aspect)+depth,Math.abs(sy)/tanV+depth);}
  }
  if(camera.isOrthographicCamera){
    const half=Math.max(.1,(maxY-minY)/2,(maxX-minX)/(2*aspect))*padding;
    const cx=(minX+maxX)/2,cy=(minY+maxY)/2;
    camera.left=cx-half*aspect;camera.right=cx+half*aspect;camera.top=cy+half;camera.bottom=cy-half;
    if(resetZoom)camera.zoom=1;
  }else if(camera.isPerspectiveCamera){
    distance*=padding;camera.aspect=aspect;
    camera.position.copy(target).addScaledVector(direction,distance);
    if(Number.isFinite(controls.maxDistance))controls.maxDistance=Math.max(controls.maxDistance,distance*1.05);
  }else return false;
  camera.lookAt(target);camera.updateProjectionMatrix();camera.updateMatrixWorld(true);
  return true;
}
