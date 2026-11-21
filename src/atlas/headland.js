import * as T from 'three';
import { paintedMaterial, placeRelief, reliefGeometry } from './relief.js';
import { pitch } from './orchard.js';
import { timberGate } from './models.js';

// Each prop has an independent footprint, depth, silhouette and contact shadow.
// Only the worker and barrow move. The hand-painted equipment stays on the headland.
export async function createHeadland(assetPath) {
  const props = [
    {name:'water-tank', x:-24.9,z:-7.8, width:3.95, depth:3.0},
    {name:'potting-bench', x:-24.8,z:-2.6, width:3.85, depth:1.5},
    {name:'farm-tractor', x:-24.65,z:3.0, width:4.6, depth:2.7},
    {name:'farmer-barrow', x:-23.95,z:7.03, width:2.9, depth:1.4},
    {name:'garden-hose', x:-25.5,z:8.4, width:1.95, depth:.35},
  ];
  const loader = new T.TextureLoader(), surface=reliefGeometry(), root=new T.Group();
  const textures = await Promise.all(props.map(p=>loader.loadAsync(assetPath+'/world/'+p.name+'.webp')));
  const materials=textures.map(paintedMaterial);
  const gate=timberGate();
  gate.position.z=pitch*1.5-10.5;
  gate.castShadow=true; root.add(gate);
  let worker;
  props.forEach((p,i)=>{
    const mesh=new T.Mesh(surface,materials[i]), image=textures[i].image;
    placeRelief(mesh,p.x,p.z,p.width,p.width*image.height/image.width,p.depth);
    mesh.castShadow=true; root.add(mesh);
    if(p.name==='farmer-barrow')worker=mesh;
  });
  const home = worker.position.clone();
  return {
    root,
    animate(t) {
      worker.position.x=home.x+.21*Math.sin(t*.42);
      worker.position.y=home.y+.012*Math.sin(t*3);
    },
    dispose() {
      for (const part of [surface,gate.geometry,...textures,...materials]) part.dispose();
    }
  };
}
