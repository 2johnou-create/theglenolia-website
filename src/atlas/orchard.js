import * as T from 'three';
import { seeded } from './models.js';
import { paintedMaterial, placeRelief, reliefGeometry } from './relief.js';

export const pitch = 8.4;
// The illustrated sheet starts at the far side. Positive Z is nearer the reader.
export const rowZ = row => (row - 2) * pitch;
export const plantX = position => -20 + (position - 1) * 2.28;
const groundWidth = 54;

function shadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 96;
  const ctx = canvas.getContext('2d'), fade = ctx.createRadialGradient(48,48,6,48,48,46);
  fade.addColorStop(0,'rgba(55,69,38,.40)');
  fade.addColorStop(.52,'rgba(62,83,43,.22)');
  fade.addColorStop(1,'rgba(75,95,47,0)');
  ctx.fillStyle = fade; ctx.fillRect(0,0,96,96);
  return new T.CanvasTexture(canvas);
}

export async function createOrchard(assetPath) {
  const loader = new T.TextureLoader();
  const names = ['magnolia-ink-1','magnolia-ink-2','magnolia-ink-3','magnolia-ink-4','pasture-ink','headland-ink','meadow-detail','meadow-tuft'];
  const textures = await Promise.all(names.map(name => loader.loadAsync(assetPath+'/world/'+name+'.webp')));
  const [grassMap, gravelMap, meadowMap, tuftMap] = textures.slice(4);
  const crowns = textures.slice(0,4).map(paintedMaterial);
  const relief = reliefGeometry(), flat = new T.PlaneGeometry(1,1), cube = new T.BoxGeometry();
  const meadowPlane=new T.PlaneGeometry(1,1).translate(0,.5,0);
  const shadowMap = shadowTexture(), meadow = paintedMaterial(meadowMap), tuft = paintedMaterial(tuftMap);
  for (const map of [grassMap,gravelMap]) {
    map.colorSpace = T.SRGBColorSpace;
    map.wrapS = map.wrapT = T.RepeatWrapping;
    map.anisotropy = 4;
  }
  grassMap.repeat.set(11, 2);
  gravelMap.repeat.set(2.3, 4.1);
  const grass = new T.MeshBasicMaterial({map:grassMap});
  const gravel = new T.MeshBasicMaterial({map:gravelMap});
  const shade = new T.MeshBasicMaterial({map:shadowMap,transparent:true,depthWrite:false});
  const contact = new T.ShadowMaterial({opacity:.27,depthWrite:false});
  const materialCache = new Map(), irrigationParts = [];
  function material(colour) {
    if (!materialCache.has(colour)) materialCache.set(colour,new T.MeshBasicMaterial({color:colour}));
    return materialCache.get(colour);
  }
  function box(parent,x,y,z,w,h,d,colour) {
    const mesh = new T.Mesh(cube,material(colour));
    mesh.position.set(x,y,z); mesh.scale.set(w,h,d); parent.add(mesh);
    return mesh;
  }
  function groundPlane(parent,x,y,z,w,d,mat) {
    const mesh = new T.Mesh(flat,mat);
    mesh.rotation.x=-Math.PI/2; mesh.position.set(x,y,z); mesh.scale.set(w,d,1); parent.add(mesh);
    return mesh;
  }
  function lane(row) {
    const g = new T.Group(); g.position.z = rowZ(row);
    box(g,0,-.26,0,groundWidth,.52,pitch,'#82785e');
    box(g,0,-.235,0,groundWidth+.007,.405,pitch+.001,'#d2bd96');
    box(g,0,-.04,0,groundWidth+.009,.068,pitch+.002,'#e7d9b1');
    groundPlane(g,0,.009,0,groundWidth,pitch,grass);
    for (const x of [-24.78,24.78]) {
      groundPlane(g,x,.03,0,4.42,pitch,gravel);
      const verge=x<0?x+2.21:x-2.21;
      box(g,verge,.026,0,.032,.018,pitch,'#a39968');
    }
    groundPlane(g,0,.045,0,groundWidth,pitch,contact).receiveShadow=true;

    const rand=seeded(4804+row*127), count=46;
    const stamp = new T.Object3D();
    for (const [coating,n] of [[meadow,14],[tuft,count]]) {
      const flowers = new T.InstancedMesh(meadowPlane,coating,n);
      const ratio = coating.map.image.width/coating.map.image.height;
      for (let i=0;i<n;i++) {
        const x=(rand()-.5)*44.5, z=(rand()<.5?-1:1)*(.78+rand()*2.5);
        const size=.18+rand()*.4;
        placeRelief(stamp,x,z,(rand()<.5?-1:1)*size,size/ratio,.22);
        flowers.setMatrixAt(i,stamp.matrix);
      }
      flowers.computeBoundingSphere(); g.add(flowers);
    }
    return g;
  }
  function boundary(index) {
    const g = new T.Group(), rand=seeded(530+index*377);
    g.position.z = rowZ(index)-pitch/2;
    const specimens=[];
    for (let x=-20.9+rand()*.85;x<22;x+=5.7+rand()*2.5) {
      const kind=Math.floor(rand()*4), width=2.75+rand()*2.5, z=(rand()-.5)*.6;
      const ratio=textures[kind].image.width/textures[kind].image.height;
      const tree=new T.Mesh(relief,crowns[kind]);
      const height=Math.min(width/ratio, index===1?5.7:4.55);
      placeRelief(tree,x,z,(rand()<.46?-1:1)*height*ratio,height,width*1.1);
      tree.castShadow=true; g.add(tree);
      groundPlane(g,x+.32,.046,z-.13,width*.76,width*.52,shade);
      specimens.push({tree,x,z});
    }
    return {g,specimens};
  }
  function irrigation() {
    const g=new T.Group();
    const pipeGeometry=new T.CylinderGeometry(.031,.031,44.2,8);
    const pipe=new T.Mesh(pipeGeometry,material('#626e68'));
    pipe.rotation.z=Math.PI/2; pipe.position.set(0,.075,-.53); g.add(pipe);
    const emitterShape = new T.CylinderGeometry(.055,.061,.085,8);
    const collarShape = new T.CylinderGeometry(.045,.045,.075,8);
    irrigationParts.push(pipeGeometry,emitterShape,collarShape);
    const drops=new T.InstancedMesh(emitterShape,material('#50615b'),19);
    const joins=new T.InstancedMesh(collarShape,material('#485750'),19);
    const o=new T.Object3D();
    for (let p=1;p<=19;p++) {
      o.rotation.set(0,0,0); o.position.set(plantX(p),.1,-.53); o.updateMatrix(); drops.setMatrixAt(p-1,o.matrix);
      o.rotation.z=Math.PI/2; o.position.set(plantX(p)+.13,.075,-.53); o.updateMatrix(); joins.setMatrixAt(p-1,o.matrix);
    }
    g.add(drops,joins); return g;
  }
  function dispose() {
    for(const part of [relief,meadowPlane,flat,cube,contact,shadowMap,grass,gravel,shade,meadow,tuft,...textures,...crowns,...irrigationParts,...materialCache.values()]) part.dispose();
  }
  return {lane,boundary,irrigation,dispose};
}
