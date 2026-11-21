import * as T from 'three';
import { coffeeModel, farmEquipment, loadPlantMaterials } from './models.js';
import { createOrchard, plantX, rowZ } from './orchard.js';
import { plantIllustration } from '../../public/assets/plant-portal/plant-illustration.js';

const direction=new T.Vector3(-19,47,68);
const stageHeight=[0,.08,.69,1.1,1.58,1.98,2.13,2.16,2.19,2.19,2.19];

export async function createAtlasWorld({canvas,assets,project,contextLost}) {
  const renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});
  let orchard;
  try { [orchard]=await Promise.all([createOrchard(assets),loadPlantMaterials(assets)]); } catch(error){renderer.dispose();throw error;}
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;
  const scene=new T.Scene(),camera=new T.OrthographicCamera(-30,30,14,-14,.1,200);
  scene.add(new T.HemisphereLight(0xfffcf4,0xd9dcce,2));
  const sun=new T.DirectionalLight(0xfff5df,1.38);sun.position.set(-14,38,20);sun.castShadow=true;
  sun.shadow.mapSize.set(1536,1024);
  Object.assign(sun.shadow.camera,{left:-34,right:34,top:25,bottom:-25,near:1,far:100});
  sun.shadow.normalBias=.016;sun.shadow.bias=-.00025;scene.add(sun,sun.target);
  const equipment=farmEquipment();for(const prop of Object.values(equipment))prop.castShadow=true;scene.add(equipment.equipment,equipment.worker,equipment.barrow);
  const lanes=new Map(), boundaries=new Map(),plants=new Map();
  for(let row=1;row<=12;row++){
    const lane=orchard.lane(row), water=orchard.irrigation();lane.add(water);scene.add(lane);
    lanes.set(row,{lane,water});
  }
  for(let i=1;i<=13;i++){const edge=orchard.boundary(i);scene.add(edge.g);boundaries.set(i,edge);}
  const target=new T.Vector3(),at=new T.Vector3(),point=new T.Vector3();
  let currentRow=1,section=0,focus=null,width=0,height=0,view=null,span=18,wantedSpan=18;
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
    const pageStart=section*6+1,lastPos=Math.min(19,pageStart+5);
    const centreX=narrow?(plantX(pageStart)+plantX(lastPos))/2:0;
    const focusPlant=plants.get(focus);
    if(focusPlant){
      target.set(focusPlant.mesh.position.x,stageHeight[focusPlant.record.stage]*.55,rowZ(row));
      wantedSpan=Math.max(1.14,stageHeight[focusPlant.record.stage]*.88);
    }else{
      target.set(centreX,.45,narrow?rowZ(row):(rowZ(start)+rowZ(end))*.5);
      const halfWidth=narrow?8.8:28.9;
      wantedSpan=Math.max(halfWidth/aspect,narrow?4.9:(end-start===2?12.8:10.8));
    }
    for(const [id,{lane}] of lanes)lane.visible=id>=start&&id<=end;
    for(const [id,{g,specimens}] of boundaries){
      g.visible=id>=start&&id<=end+1;
      for(const {tree,x} of specimens)tree.visible=!(focusPlant&&g.position.z>target.z&&Math.abs(x-target.x)<5.8);
    }
    for(const p of plants.values())p.mesh.visible=p.record.row>=start&&p.record.row<=end;
    for(const p of Object.values(equipment))p.visible=start===1;
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
    camera.position.copy(at).add(direction);camera.lookAt(at);camera.updateProjectionMatrix();camera.updateMatrixWorld();
    renderer.render(scene,camera);
    if(!updatePins)return;
    const coords=[],rowLabels=[];
    for(const [key,p] of plants){
      if(!p.mesh.visible||(focus&&key!==focus))continue;
      if(width<670&&!focus&&(p.record.position<=section*6||p.record.position>Math.min(19,section*6+6)))continue;
      point.set(p.mesh.position.x,focus?stageHeight[p.record.stage]+.11:.03,p.mesh.position.z).project(camera);
      coords.push({key,x:(point.x+1)*width/2,y:(1-point.y)*height/2,focused:key===focus});
    }
    if(!focus)for(const [r,{lane}] of lanes)if(lane.visible){
      const labelX=width<670?plantX(section*6+1)-1.75:-23.55;
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
      const shift=.48*Math.sin(animTime*.42);
      equipment.worker.position.x=shift;equipment.barrow.position.x=shift;
      equipment.worker.position.y=.013*Math.cos(animTime*3.2);
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
  function navigate(row,page,key,immediate=false){
    const first=!view;view=true;currentRow=row;section=page;focus=key;
    resizedBounds();
    if(first||immediate||reduced.matches||!playing){at.copy(target);span=wantedSpan;dirty=true;schedule();}
  }
  function changed(){dirty=true;schedule();}
  function lost(e){e.preventDefault();contextLost();}
  canvas.addEventListener('webglcontextlost',lost);document.addEventListener('visibilitychange',changed);reduced.addEventListener('change',changed);resize();
  return {data,navigate,pause(pause){playing=!pause;changed();},destroy(){
    cancelAnimationFrame(raf);raf=0;visible=false;observer.disconnect();visibility.disconnect();
    canvas.removeEventListener('webglcontextlost',lost);document.removeEventListener('visibilitychange',changed);reduced.removeEventListener('change',changed);
    for(const ob of Object.values(equipment))ob.geometry.dispose();
    orchard.dispose();renderer.dispose();
  }};
}
