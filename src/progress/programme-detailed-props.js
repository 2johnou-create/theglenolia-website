import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

// Original illustrative classroom and local-product planning props. No text,
// product identity, actual facility or partnership is established by these models.
export function createDetailedProgrammeProps({groundY=.43}={}) {
  const root=new THREE.Group(),cache=new Map(),materials=new Map();
  let seed=2271;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  function grain(){if(typeof document==='undefined')return null;const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');if(!x)return null;x.fillStyle='#9b7956';x.fillRect(0,0,128,128);for(let i=0;i<90;i++){x.strokeStyle=`rgba(${i%2?'52,34,21':'226,207,172'},${.06+rand()*.13})`;x.lineWidth=.3+rand();x.beginPath();const start=rand()*128;x.moveTo(start,0);for(let y=0;y<=128;y+=16)x.lineTo(start+Math.sin(y*.04+i)*2,y);x.stroke();}const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;}
  function mat(name,color,roughness=.75,extra={}){if(!materials.has(name))materials.set(name,new THREE.MeshStandardMaterial({color,roughness,...extra}));return materials.get(name);}
  const M={wood:mat('wood',0xffffff,.65,{map:grain()}),edge:mat('edge',0x785a40,.72),green:mat('green',0x2f4a3c,.62),sage:mat('sage',0xd9dfd0,.83),ivory:mat('ivory',0xf5f1e8,.86),paper:mat('paper',0xeee6d7,.98),ink:mat('ink',0x3b332d,.65),copper:mat('copper',0xb57b5a,.55),ceramic:mat('ceramic',0xd3dfce,.24),brass:mat('brass',0xa5825a,.34,{metalness:.62}),glass:mat('glass',0xa9c0b8,.15,{metalness:.15,transparent:true,opacity:.57,depthWrite:false})};
  const boxGeo=new THREE.BoxGeometry(1,1,1),cylGeo=new THREE.CylinderGeometry(1,1,1,16),ballGeo=new THREE.SphereGeometry(1,12,8);
  const g=(p,x=0,y=0,z=0)=>{const o=new THREE.Group();o.position.set(x,y,z);p.add(o);return o;};
  function mesh(p,geo,m,x=0,y=0,z=0){const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;p.add(o);return o;}
  function box(p,w,h,d,m,x=0,y=0,z=0){const o=mesh(p,boxGeo,m,x,y,z);o.scale.set(w,h,d);return o;}
  function cyl(p,r,h,m,x=0,y=0,z=0){const o=mesh(p,cylGeo,m,x,y,z);o.scale.set(r,h,r);return o;}
  function ball(p,xr,yr,zr,m,x=0,y=0,z=0){const o=mesh(p,ballGeo,m,x,y,z);o.scale.set(xr,yr,zr);return o;}
  function bar(p,a,b,r,m){const av=new THREE.Vector3(...a),d=new THREE.Vector3(...b).sub(av),o=cyl(p,r,d.length(),m);o.position.copy(av.addScaledVector(d,.5));o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return o;}
  function rounded(p,w,h,d,r,m,x=0,y=0,z=0){const key=[w,h,d,r].join(':');if(!cache.has(key)){const s=new THREE.Shape(),a=-w/2,b=-d/2;s.moveTo(a+r,b);s.lineTo(a+w-r,b);s.quadraticCurveTo(a+w,b,a+w,b+r);s.lineTo(a+w,b+d-r);s.quadraticCurveTo(a+w,b+d,a+w-r,b+d);s.lineTo(a+r,b+d);s.quadraticCurveTo(a,b+d,a,b+d-r);s.lineTo(a,b+r);s.quadraticCurveTo(a,b,a+r,b);const geo=new THREE.ExtrudeGeometry(s,{depth:h,bevelEnabled:true,bevelSize:Math.min(.018,r*.3),bevelThickness:Math.min(.018,h*.18),bevelSegments:2,curveSegments:4,steps:1});geo.rotateX(-Math.PI/2);geo.translate(0,-h/2,0);cache.set(key,geo);}return mesh(p,cache.get(key),m,x,y,z);}
  function paper(p,x,y,z,w=.8,d=.55){const o=rounded(p,w,.012,d,.008,M.paper,x,y,z);o.rotation.y=(rand()-.5)*.12;for(let i=0;i<3;i++)box(o,w*.62-i*.08,.005,.008,M.sage,0,.012,-d*.25+i*.10);return o;}
  function table(p,x,z,w=2.9,d=1.3,h=.98){const o=g(p,x,groundY,z);rounded(o,w,.09,d,.07,M.wood,0,h,0);for(const a of[-1,1])for(const b of[-1,1])bar(o,[a*(w/2-.18),.03,b*(d/2-.14)],[a*(w/2-.22),h-.04,b*(d/2-.17)],.035,M.edge);for(const a of[-1,1])bar(o,[a*(w/2-.2),.28,-d/2+.15],[a*(w/2-.2),.28,d/2-.15],.018,M.edge);return o;}
  function chair(p,x,z,rotation=0){const o=g(p,x,groundY,z);o.rotation.y=rotation;rounded(o,.59,.07,.55,.06,M.sage,0,.58,0);for(const a of[-1,1])for(const b of[-1,1])bar(o,[a*.23,.02,b*.21],[a*.21,.56,b*.19],.022,M.edge);for(const a of[-1,1])bar(o,[a*.22,.48,-.21],[a*.24,1.05,-.26],.024,M.edge);rounded(o,.55,.17,.06,.018,M.wood,0,.97,-.25);rounded(o,.55,.10,.05,.014,M.wood,0,.76,-.23);}
  function bottle(p,x,y,z,scale=1){const o=g(p,x,y,z);o.scale.setScalar(scale);const profile=[[.0,0],[.13,0],[.15,.045],[.15,.38],[.10,.43],[.063,.45],[.063,.51]].map(([a,b])=>new THREE.Vector2(a,b));mesh(o,new THREE.LatheGeometry(profile,18),M.ceramic);cyl(o,.072,.065,M.copper,0,.54,0);rounded(o,.18,.16,.013,.012,M.paper,0,.25,.151);return o;}
  function gift(p,x,y,z,w=.55,h=.40,d=.45){const o=g(p,x,y,z);rounded(o,w,h,d,.025,M.ivory,0,h/2,0);rounded(o,w+.025,.055,d+.025,.020,M.sage,0,h+.02,0);box(o,.045,h+.07,d+.03,M.green,0,(h+.07)/2,0);box(o,w+.03,.012,.045,M.green,0,h+.055,0);for(const s of[-1,1]){const a=ball(o,.09,.027,.055,M.copper,s*.07,h+.09,0);a.rotation.z=s*.4;}return o;}
  function tote(p,x,y,z){const o=g(p,x,y,z);rounded(o,.46,.50,.25,.055,M.paper,0,.25,0);const h=mesh(o,new THREE.TorusGeometry(.115,.013,5,18,Math.PI),M.edge,0,.51,.06);h.rotation.z=0;box(o,.018,.47,.012,M.sage,-.18,.27,.135);box(o,.018,.47,.012,M.sage,.18,.27,.135);return o;}

  // Workshop tables remain at the original action targets and route clearance.
  const workshopFloor=rounded(root,8.0,.075,6.35,.18,M.ivory,-6.3,groundY+.005,4.7);
  for(let i=0;i<13;i++)rounded(root,7.78,.035,.455,.009,M.wood,-6.3,groundY+.056,1.88+i*.46);
  const board=g(root,-9.55,groundY,5.55);board.rotation.y=Math.PI/2;
  for(const s of[-1,1]){bar(board,[s*1.5,0,0],[s*1.5,2.70,0],.045,M.edge);rounded(board,.62,.10,.75,.035,M.wood,s*1.5,.05,0);}
  rounded(board,3.6,1.68,.11,.055,M.green,0,1.91,0);
  for(const s of[-1,1]){const face=g(board,0,1.91,s*.067);face.rotation.y=s<0?Math.PI:0;rounded(face,3.37,1.43,.016,.025,M.ivory);bar(face,[-1.03,-.51,.018],[-1.03,.47,.018],.012,M.green);for(let i=0;i<3;i++)for(const side of[-1,1]){const l=ball(face,.17,.032,.065,M.sage,-1.03+side*.14,-.25+i*.22,.027);l.rotation.z=side*.45;}for(let i=0;i<4;i++)rounded(face,1.15-i*.13,.025,.015,.008,i===0?M.copper:M.green,.53,.39-i*.22,.026);}
  const work=table(root,-6.2,4.25,3.6,1.35,1.02);paper(work,-.8,1.08,0,.95,.65);paper(work,.4,1.08,.12,.8,.55);cyl(work,.12,.22,M.ceramic,1.3,1.18,-.1);for(let i=0;i<4;i++)bar(work,[1.24+i*.04,1.20,-.1],[1.23+i*.045,1.52,-.10+(i%2)*.05],.009,i%2?M.copper:M.green);
  for(const x of[-8.35,-4.15]){const desk=table(root,x,6.1,1.5,.9,.83);paper(desk,0,.89,0,.75,.53);bar(desk,[-.16,.91,.15],[.24,.91,.02],.012,M.copper);chair(root,x,5.12);}
  const resources=table(root,-8.8,3.4,1.05,1.5,.78);for(let i=0;i<3;i++){const b=rounded(resources,.69,.06,.93,.016,i%2?M.sage:M.green,0,.85+i*.067,0);b.rotation.y=.07*i;for(let j=0;j<4;j++)box(b,.64,.002,.003,M.paper,0,-.018+j*.009,.468);}

  // Open-backed shelves let visitors see the planning crew through the display.
  rounded(root,8.0,.075,6.35,.18,M.ivory,6.3,groundY+.005,4.7);
  for(const sx of[4.75,7.85]){
    const shelf=g(root,sx,groundY,7.05);
    for(const side of[-1,1]){rounded(shelf,.10,2.68,.62,.024,M.green,side*1.32,1.34,0);bar(shelf,[side*1.31,.12,-.25],[-side*1.31,2.55,-.25],.015,M.edge);}
    for(const h of[.2,1.0,1.8,2.62])rounded(shelf,2.76,.075,.72,.025,M.wood,0,h,0);
    for(const h of[.25,1.05,1.85]){bottle(shelf,-.78,h,.07,.70);gift(shelf,0,h,.05,.55,.38,.45);tote(shelf,.78,h,.04);}
  }
  const selection=table(root,6.3,4.25,4.2,1.6,1.02);paper(selection,-1.25,1.08,0,.9,.65);bottle(selection,-.25,1.08,.15,.65);bottle(selection,.4,1.08,.15,.65);gift(selection,1.2,1.08,.05,.70,.43,.60);
  const swatches=table(root,3.9,6.1,1.25,1,.80);for(let i=0;i<3;i++)rounded(swatches,.62,.025,.50,.015,[M.ivory,M.green,M.sage][i],0,.85+i*.033,0).rotation.y=.12*i;

  // Batch original static geometry per material, preserving all local detail.
  root.updateMatrixWorld(true);const batches=new Map(),remove=[];
  root.traverse(o=>{if(!o.isMesh)return;const key=o.material.uuid;if(!batches.has(key))batches.set(key,{material:o.material,geos:[]});const geo=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();geo.applyMatrix4(o.matrixWorld);batches.get(key).geos.push(geo);remove.push(o);});
  for(const {material,geos}of batches.values()){const merged=mergeGeometries(geos,false);geos.forEach(g=>g.dispose());if(merged){merged.computeBoundingBox();mesh(root,merged,material);}}
  remove.forEach(o=>o.removeFromParent());return{root};
}
