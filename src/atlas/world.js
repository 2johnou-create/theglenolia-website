import * as T from 'three';
import { coffeeModel, loadPlantMaterials } from './models.js';
import { viewOffset } from './relief.js';
import { createHeadland } from './headland.js';
import { positionsPerView } from '../../public/assets/plant-portal/atlas-framing.js';
import { createOrchard, pitch, plantX, rowZ } from './orchard.js';
import { plantIllustration } from '../../public/assets/plant-portal/plant-illustration.js';


const stageHeight=[0,.08,.69,1.1,1.58,1.98,2.13,2.16,2.19,2.19,2.19];

export async function createAtlasWorld({canvas,assets,project,contextLost}) {
  const renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});
  let orchard,headland;
  try { [orchard,headland]=await Promise.all([createOrchard(assets),createHeadland(assets),loadPlantMaterials(assets)]); } catch(error){renderer.dispose();throw error;}
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;
  const scene=new T.Scene(),camera=new T.OrthographicCamera(-30,30,14,-14,.1,200);
  scene.add(new T.HemisphereLight(0xfffcf4,0xd9dcce,2));
  const sun=new T.DirectionalLight(0xfff5df,1.38);sun.position.set(-14,38,20);sun.castShadow=true;
  sun.shadow.mapSize.set(1536,1024);
  Object.assign(sun.shadow.camera,{left:-34,right:34,top:25,bottom:-25,near:1,far:100});
  sun.shadow.normalBias=.016;sun.shadow.bias=-.00025;scene.add(sun,sun.target);
  scene.add(headland.root);
  const lanes=new Map(), boundaries=new Map(),plants=new Map();
  for(let row=1;row<=12;row++){
    const lane=orchard.lane(row), water=orchard.irrigation();lane.add(water);scene.add(lane);
    lanes.set(row,{lane,water});
  }
  for(let i=1;i<=13;i++){const edge=orchard.boundary(i);scene.add(edge.g);boundaries.set(i,edge);}
  const target=new T.Vector3(),at=new T.Vector3(),point=new T.Vector3();
  let currentRow=1,section=0,wholeField=false,focus=null,width=0,height=0,view=null,span=18,wantedSpan=18;
  let visible=false,playing=true,dirty=true,raf=0,previousTime=0,animTime=0;
  let previousDraw=0,shadowRow=0;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const observer=new ResizeObserver(resize);
  observer.observe(canvas.parentElement);
  const visibility=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();});
  visibility.observe(canvas);
  function schedule(){
    if(visible&&!document.hidden&&!raf)raf=requestAnimationFrame(frame);
  }
  function resizedBounds(){
    if(!view||!width||!height)return;
    const narrow=width<670, aspect=width/height, row=currentRow;
    const start=row<=2?1:Math.max(3,Math.min(10,row-1)),end=start+2;
    if(shadowRow!==row){shadowRow=row;sun.position.set(-14,38,rowZ(row)+20);sun.target.position.set(0,0,rowZ(row));}
    renderer.shadowMap.needsUpdate=true;
    const per=positionsPerView(width,wholeField), overview=per===19;
    const first=section*per+1,last=Math.min(19,first+per-1);
    const left=first===1?-26.9:plantX(first)-1.6, right=plantX(last)+2.1;
    const centreX=overview?0:(left+right)*.5-(first===1?.8:0);
    const focusPlant=plants.get(focus);
    if(focusPlant){
      target.set(focusPlant.mesh.position.x,stageHeight[focusPlant.record.stage]*.55,rowZ(row));
      wantedSpan=Math.max(1.14,stageHeight[focusPlant.record.stage]*.88);
    }else{
      const centreZ = narrow ? rowZ(row)+(row===start?2.0:0) : (rowZ(start)+rowZ(end))*.5+(overview?0:.8);
      target.set(centreX,overview?.8:1.18,centreZ);
      const halfWidth=overview?28.7:Math.max(narrow?7.3:12.5,(right-left)*.5+1.65);
      wantedSpan=Math.max(halfWidth/aspect,overview?11.7:narrow?5.5:7.2);
    }
    for(const [id,{lane}] of lanes)lane.visible=id>=start&&id<=end;
    for(const [id,{g,specimens}] of boundaries){
      g.visible=id>=start&&id<=end+1;
      // Keep the two outer tree lines rooted inside the visible cutaway.
      g.position.z=rowZ(id)-pitch/2+(id===end+1?-.67:1.25);
      for(const {tree,x} of specimens)tree.visible=!(focusPlant&&g.position.z>target.z&&Math.abs(x-target.x)<5.8);
    }
    for(const p of plants.values())p.mesh.visible=p.record.row>=start&&p.record.row<=end;
    headland.root.visible=start===1;
    dirty=true;schedule();
  }
  function resize(){
    const w=canvas.parentElement.clientWidth,h=canvas.parentElement.clientHeight;
    if(!w||!h||(w===width&&h===height))return;
    width=w;height=h;renderer.setPixelRatio(Math.min(devicePixelRatio||1,width<670?1.5:1.65));
    renderer.setSize(width,height,false);resizedBounds();if(!previousDraw){at.copy(target);span=wantedSpan;}
    dirty=true;schedule();
  }
  function draw(updatePins){
    if(!width||!height)return;
    const aspect=width/height;
    camera.left=-span*aspect;camera.right=span*aspect;camera.top=span;camera.bottom=-span;
    camera.position.copy(at).add(viewOffset);camera.lookAt(at);camera.updateProjectionMatrix();camera.updateMatrixWorld();
    renderer.render(scene,camera);
    if(!updatePins)return;
    const coords=[],rowLabels=[];
    for(const [key,p] of plants){
      if(!p.mesh.visible||(focus&&key!==focus))continue;
      const per=positionsPerView(width,wholeField);
      if(!focus&&(p.record.position<=section*per||p.record.position>(section+1)*per))continue;
      point.set(p.mesh.position.x,focus?stageHeight[p.record.stage]+.11:.03,p.mesh.position.z).project(camera);
      coords.push({key,x:(point.x+1)*width/2,y:(1-point.y)*height/2,focused:key===focus});
    }
    if(!focus)for(const [r,{lane}] of lanes)if(lane.visible){
      const per=positionsPerView(width,wholeField);
      const labelX=plantX(section*per+1)-1.72;
      point.set(labelX,0,rowZ(r)-1.32).project(camera);
      rowLabels.push({row:r,x:(point.x+1)*width/2,y:(1-point.y)*height/2});
    }
    project(coords,width,height,rowLabels);
  }
  function frame(now){
    raf=0;if(!visible||document.hidden)return;
    const dt=Math.min((now-(previousTime||now))/1000,.1);previousTime=now;
    const moving=at.distanceToSquared(target)>.00003||Math.abs(span-wantedSpan)>.005;
    const ambient=playing;
    if(!dirty&&!moving&&(!ambient||now-previousDraw<90)){if(ambient)schedule();return;}
    const mix=(!playing||reduced.matches)?1:1-Math.exp(-dt*8);
    if(moving){at.lerp(target,mix);span+=(wantedSpan-span)*mix;}else{at.copy(target);span=wantedSpan;}
    if(ambient){
      animTime+=Math.min((now-(previousDraw||now))/1000,.13);
      headland.animate(animTime);
      for(const p of plants.values())if(p.mesh.visible&&p.record.stage>1)p.mesh.rotation.z=.012*Math.sin(animTime*1.55+p.record.position*1.1);
      for(const {g,specimens} of boundaries.values())if(g.visible)for(const {tree,x} of specimens)tree.rotation.z=.007*Math.sin(animTime*.93+x);
    }
    previousDraw=now;draw(dirty||moving);dirty=false;
    if(ambient||moving)schedule();
  }
  function data(records){
    for(const [key,p] of plants)if(!records.has(key)){scene.remove(p.mesh);plants.delete(key);}
    const enabled=new Set();
    for(const [key,record] of records){
      enabled.add(record.row);
      let p=plants.get(key);
      if(!p||p.record.stage!==record.stage){
        if(p)scene.remove(p.mesh);
        const mesh=coffeeModel(record.stage,plantIllustration(record.stage,record).variant);
        mesh.traverse(o=>{if(o.isMesh)o.castShadow=true;});
        mesh.position.set(plantX(record.position),.025,rowZ(record.row));scene.add(mesh);p={mesh,record};plants.set(key,p);
      }else p.record=record;
    }
    for(const [row,{water}] of lanes)water.visible=enabled.has(row);
    if(!plants.has(focus))focus=null;
    resizedBounds();
  }
  function navigate(row,page,key,immediate=false,overview=false){
    const first=!view;view=true;currentRow=row;section=page;focus=key;wholeField=overview;
    resizedBounds();
    if(first||immediate||reduced.matches||!playing){at.copy(target);span=wantedSpan;dirty=true;schedule();}
  }
  function changed(){dirty=true;schedule();}
  function lost(e){e.preventDefault();contextLost();}
  canvas.addEventListener('webglcontextlost',lost);document.addEventListener('visibilitychange',changed);reduced.addEventListener('change',changed);resize();
  return {data,navigate,pause(pause){playing=!pause;changed();},destroy(){
    cancelAnimationFrame(raf);raf=0;visible=false;observer.disconnect();visibility.disconnect();
    canvas.removeEventListener('webglcontextlost',lost);document.removeEventListener('visibilitychange',changed);reduced.removeEventListener('change',changed);
    headland.dispose();
    orchard.dispose();renderer.dispose();
  }};
}
