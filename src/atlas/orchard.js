import * as T from 'three';
import { seeded } from './models.js';

export const pitch = 7;
export const rowZ = row => (2-row)*pitch;
export const plantX = position => -20 + (position-1)*2.28;
export const groundWidth = 54;

function fieldTexture() {
  const canvas=document.createElement('canvas');canvas.width=canvas.height=512;
  const ctx=canvas.getContext('2d'), random=seeded(374);
  ctx.fillStyle='#c6d29e';ctx.fillRect(0,0,512,512);
  for(let i=0;i<28000;i++){
    ctx.fillStyle=i%3?'rgba(72,103,48,.08)':'rgba(255,251,194,.31)';
    ctx.fillRect(random()*512,random()*512,random()*1.7+.6,random()*1.6+.4);
  }
  for(let i=0;i<135;i++){
    const x=random()*512,y=random()*512;
    ctx.strokeStyle=i%3?'#9cad78':'#b5c38b';ctx.lineWidth=.8;
    ctx.beginPath();ctx.moveTo(x-2,y-2);ctx.lineTo(x,y+1);ctx.lineTo(x+1,y-4);ctx.moveTo(x,y+1);ctx.lineTo(x+4,y-2);ctx.stroke();
  }
  const tex=new T.CanvasTexture(canvas);tex.colorSpace=T.SRGBColorSpace;tex.wrapS=tex.wrapT=T.RepeatWrapping;
  return tex;
}
function shadowTexture(){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=96;
  const c=canvas.getContext('2d'),g=c.createRadialGradient(48,48,7,48,48,45);
  g.addColorStop(0,'rgba(54,76,55,.54)');g.addColorStop(.65,'rgba(71,91,61,.38)');g.addColorStop(1,'rgba(71,91,61,0)');
  c.fillStyle=g;c.fillRect(0,0,96,96);return new T.CanvasTexture(canvas);
}
function reliefCrown(){
  // Bend the painted surface in depth so its limbs and crown have parallax in a close pass.
  const g=new T.PlaneGeometry(1,1,18,20),pos=g.attributes.position;
  for(let i=0;i<pos.count;i++){
    const x=pos.getX(i),y=pos.getY(i)+.5;
    const canopy=Math.max(0,Math.sin(Math.PI*Math.max(0,(y-.18)/.82)));
    pos.setZ(i,Math.max(0,1-4*x*x)*canopy*.20 + .02*Math.sin(x*19+y*8)*canopy);
    pos.setY(i,y);
  }
  g.computeVertexNormals();return g;
}
export async function createOrchard(assetPath) {
  const loader=new T.TextureLoader(),textures=await Promise.all([1,2,3,4].map(i=>loader.loadAsync(assetPath+'/world/magnolia-'+i+'.webp')));
  const crowns=textures.map(tex=>{tex.colorSpace=T.SRGBColorSpace;return new T.MeshBasicMaterial({map:tex,alphaTest:.38,side:T.DoubleSide});});
  const relief=reliefCrown(),flat=new T.PlaneGeometry(1,1),cube=new T.BoxGeometry(),turf=fieldTexture();
  turf.repeat.set(7.5,1);
  const grass=new T.MeshBasicMaterial({color:0xffffff,map:turf});
  const shadowMap=shadowTexture();
  const shade=new T.MeshBasicMaterial({map:shadowMap,transparent:true,depthWrite:false});
  const contact=new T.ShadowMaterial({opacity:.20,depthWrite:false});
  const materialCache=new Map();
  function material(colour){if(!materialCache.has(colour))materialCache.set(colour,new T.MeshLambertMaterial({color:colour}));return materialCache.get(colour);}
  function box(parent,x,y,z,w,h,d,colour){
    const mesh=new T.Mesh(cube,material(colour));mesh.position.set(x,y,z);mesh.scale.set(w,h,d);parent.add(mesh);return mesh;
  }
  function groundPlane(parent,x,y,z,w,d,mat){const mesh=new T.Mesh(flat,mat);mesh.rotation.x=-Math.PI/2;mesh.position.set(x,y,z);mesh.scale.set(w,d,1);parent.add(mesh);return mesh;}
  const base='#ddcfaf';
  const pathTexture=fieldTexture();pathTexture.repeat.set(1.0,1.9);
  const gravel=new T.MeshBasicMaterial({color:'#efc2a6',map:pathTexture});
  // Desaturate the turf texture to retain its paper grain on the headland.
  const ctx=pathTexture.image.getContext('2d');
  const flecks=ctx.getImageData(0,0,512,512);
  for(let i=0;i<flecks.data.length;i+=4){
    const grey=Math.min(255,27+flecks.data[i+1]);flecks.data[i]=flecks.data[i+1]=flecks.data[i+2]=grey;
  }
  ctx.putImageData(flecks,0,0);pathTexture.needsUpdate=true;
  function lane(row){
    const g=new T.Group();g.position.z=rowZ(row);
    box(g,0,-.17,0,groundWidth,.34,pitch,base);
    groundPlane(g,0,.009,0,groundWidth,pitch,grass);
    for(const x of [-24.8,24.8])groundPlane(g,x,.04,0,4.35,pitch,gravel);
    groundPlane(g,0,.047,0,groundWidth,pitch,contact).receiveShadow=true;
    // A planned lane has grass and mature magnolias. Irrigation is drawn with the enabled positions.
    return g;
  }
  function boundary(index) {
    const g=new T.Group();g.position.z=rowZ(index)+pitch/2;const rand=seeded(530+index*377);
    const specimens=[];
    for(let x=-20.8;x<22;x+=5.2+rand()*2.4){
      const kind=Math.floor(rand()*4),width=2.4+rand()*2.3,z=(rand()-.5)*.61,height=width*(kind===1?1.32:1.07);
      const tree=new T.Mesh(relief,crowns[kind]);tree.position.set(x,.03,z);
      tree.rotation.y=-.30;tree.scale.set((rand()<.45?-1:1)*width,height,width);
      tree.castShadow=true;g.add(tree);
      groundPlane(g,x+.43,.051,z-.26,width*1.25,width*.77,shade);
      specimens.push({tree,x,z});
    }
    return {g,specimens};
  }
  function irrigation() {
    const g=new T.Group();
    const pipe=new T.Mesh(new T.CylinderGeometry(.036,.036,44.2,9),material('#536d63'));
    pipe.rotation.z=Math.PI/2;pipe.position.set(0,.075,-.53);g.add(pipe);
    for(let p=1;p<=19;p++){
      const x=plantX(p),emitter=new T.Mesh(new T.CylinderGeometry(.058,.072,.098,9),material('#6b7870'));
      emitter.position.set(x,.109,-.53);g.add(emitter);
      const collar=new T.Mesh(new T.CylinderGeometry(.050,.050,.080,8),material('#445a54'));collar.rotation.z=Math.PI/2;collar.position.set(x+.13,.075,-.53);g.add(collar);
      box(g,x,.167,-.53,.084,.021,.066,'#c68d61');
    }
    return g;
  }
  function dispose(){for(const p of [relief,flat,cube,contact,turf,shadowMap,pathTexture,grass,gravel,shade,...textures,...crowns,...materialCache.values()])p.dispose();}
  return {lane,boundary,irrigation,dispose};
}
