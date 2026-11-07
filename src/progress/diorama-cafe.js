import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

// Original, illustrative miniature assets. These are authored geometry and
// procedural acting, not downloaded models, rigged clips or actual site plans.
export function createCafeProps({heightAt = () => .43,includeActors=true} = {}) {
  const root = new THREE.Group();
  root.name = 'Glenolia detailed cafe and nursery — illustrative';
  const animated = new Set(), actors = [], staticGroups = new Map();
  const materials = {};
  const palette = {green:0x2f4a3c, ivory:0xf5f1e8, sage:0xd9dfd0, copper:0xb57b5a, ink:0x3b332d};
  let randomSeed = 53931;
  function random() {randomSeed = (1664525 * randomSeed + 1013904223) >>> 0; return randomSeed / 4294967296;}
  function texture(kind) {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas'); canvas.width=canvas.height=256;
    const c = canvas.getContext('2d'); if (!c) return null;
    c.fillStyle = kind==='wood'?'#8c6546':kind==='soil'?'#514133':'#e8e3d7'; c.fillRect(0,0,256,256);
    if(kind==='wood') {
      for(let i=0;i<140;i++) {const x=random()*256; c.strokeStyle=`rgba(${random()>.5?'48,29,16':'207,173,126'},${.05+random()*.13})`;c.lineWidth=.25+random()*1.5;c.beginPath();c.moveTo(x,-10);for(let y=0;y<=270;y+=18)c.lineTo(x+Math.sin(y*.025+i)*(.6+random()*2.4),y);c.stroke();}
      for(let i=0;i<4;i++){c.strokeStyle='rgba(45,28,15,.10)';c.lineWidth=.7;c.beginPath();c.ellipse(random()*256,random()*256,3+random()*6,10+random()*20,.05,0,Math.PI*2);c.stroke();}
    } else {
      // Texture grains are deliberately tiny at miniature scale.
      for(let i=0;i<5200;i++){const v=random()>.5?255:0;c.fillStyle=`rgba(${v},${v},${v},${kind==='soil'?.05+random()*.12:.012+random()*.025})`;c.fillRect(random()*256,random()*256,.3+random()*1.8,.3+random()*1.8);}
    }
    const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;t.needsUpdate=true;return t;
  }
  const woodTexture=texture('wood'),soilTexture=texture('soil'),plasterTexture=texture('plaster');
  function material(name,color,roughness=.75,metalness=0,extra={}) {const Type=extra.clearcoat===undefined?THREE.MeshStandardMaterial:THREE.MeshPhysicalMaterial;return materials[name] ||= new Type({color,roughness,metalness,...extra});}
  const M={
    plaster:material('plaster',palette.ivory,.91,0,{map:plasterTexture}),
    tile:material('tile',palette.green,.22),tile2:material('tile2',0x486351,.27),tile3:material('tile3',0x355343,.20),
    grout:material('grout',0x758071,.91),stone:material('stone',0xe8e3d7,.56),
    wood:material('wood',0xffffff,.62,0,{map:woodTexture}),woodEdge:material('woodEdge',0x79583e,.68),
    ink:material('ink',palette.ink,.65),metal:material('metal',0xc0c5bf,.24,.78),brass:material('brass',0xa7835d,.30,.62),
    ceramic:material('ceramic',0xf1ede0,.23,0,{clearcoat:.8,clearcoatRoughness:.14}),sageCeramic:material('sageCeramic',0xc4d0bc,.26,0,{clearcoat:.7,clearcoatRoughness:.17}),
    terra:material('terra',0xa67151,.87),terraLight:material('terraLight',0xb98661,.83),
    soil:material('soil',0xffffff,1,0,{map:soilTexture}),leaf:material('leaf',0x31573c,.54),leafLight:material('leafLight',0x527648,.58),
    leafVein:material('leafVein',0x71905d,.75),dark:material('dark',0x17221b,.5),coffee:material('coffee',0x3b2419,.3),
    paper:material('paper',0xe9dfca,.92),apron:material('apron',palette.green,.89),shirt:material('shirt',0xe5dfcc,.94),
    shirtSage:material('shirtSage',0xa9b59b,.92),shirtCopper:material('shirtCopper',0xaf785a,.91),hair:material('hair',0x352b25,.88),
    hair2:material('hair2',0x694833,.88),skin:material('skin',0xd3a17a,.82),skin2:material('skin2',0x986947,.83),skin3:material('skin3',0xe3bc96,.82),
    lips:material('lips',0x9d6553,.9),glass:material('glass',0xadc8c4,.16,.12,{transparent:true,opacity:.52,depthWrite:false})
  };
  function group(parent,x=0,y=0,z=0) {const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);return g;}
  function mesh(parent,geometry,mat,x=0,y=0,z=0) {const m=new THREE.Mesh(geometry,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  const boxGeometry=new THREE.BoxGeometry(1,1,1),sphereGeometry=new THREE.SphereGeometry(1,12,9),cylinderGeometry=new THREE.CylinderGeometry(1,1,1,16);
  function box(parent,w,h,d,mat,x=0,y=0,z=0) {const m=mesh(parent,boxGeometry,mat,x,y,z);m.scale.set(w,h,d);return m;}
  function ball(parent,xr,yr,zr,mat,x=0,y=0,z=0) {const m=mesh(parent,sphereGeometry,mat,x,y,z);m.scale.set(xr,yr,zr);return m;}
  function cylinder(parent,r,h,mat,x=0,y=0,z=0) {const m=mesh(parent,cylinderGeometry,mat,x,y,z);m.scale.set(r,h,r);return m;}
  function bar(parent,a,b,r,mat) {const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),d=bv.sub(av),m=cylinder(parent,r,d.length(),mat);m.position.copy(av.addScaledVector(d,.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return m;}
  const roundedCache=new Map();
  function rounded(parent,w,h,d,r,mat,x=0,y=0,z=0) {
    const key=[w,h,d,r].join(':');let geo=roundedCache.get(key);
    if(!geo) {const s=new THREE.Shape(),a=-w/2,b=-d/2;s.moveTo(a+r,b);s.lineTo(a+w-r,b);s.quadraticCurveTo(a+w,b,a+w,b+r);s.lineTo(a+w,b+d-r);s.quadraticCurveTo(a+w,b+d,a+w-r,b+d);s.lineTo(a+r,b+d);s.quadraticCurveTo(a,b+d,a,b+d-r);s.lineTo(a,b+r);s.quadraticCurveTo(a,b,a+r,b);geo=new THREE.ExtrudeGeometry(s,{depth:h,bevelEnabled:true,bevelThickness:Math.min(.018,h*.18),bevelSize:Math.min(.018,r*.3),bevelSegments:2,curveSegments:4,steps:1});geo.rotateX(-Math.PI/2);geo.translate(0,-h/2,0);roundedCache.set(key,geo);}
    return mesh(parent,geo,mat,x,y,z);
  }
  function torus(parent,r,t,mat,x=0,y=0,z=0,arc=Math.PI*2) {return mesh(parent,new THREE.TorusGeometry(r,t,5,18,arc),mat,x,y,z);}
  function cup(parent,x,y,z,scale=1,colour=M.ceramic) {
    const g=group(parent,x,y,z);g.scale.setScalar(scale);
    const profile=[[.046,0],[.059,.013],[.069,.109],[.067,.121],[.056,.121],[.053,.105],[.049,.02]].map(([a,b])=>new THREE.Vector2(a,b));
    mesh(g,new THREE.LatheGeometry(profile,20),colour);cylinder(g,.054,.004,M.coffee,0,.112,0);
    const h=torus(g,.041,.009,colour,.076,.066,0,Math.PI*1.64);h.rotation.z=-Math.PI*.82;
    cylinder(g,.102,.012,colour,0,-.006,0);torus(g,.079,.003,colour,0,.002,0).rotation.x=Math.PI/2;
    return g;
  }
  function leafGeometry(length=.32,width=.13) {
    const v=[],uv=[],ind=[];for(let i=0;i<=7;i++){const t=i/7,spread=Math.pow(Math.sin(t*Math.PI),.80)*width,y=Math.sin(t*Math.PI)*.025,z=t*length;for(const side of [-1,0,1]){v.push(side*spread,y-(side? .012:0),z);uv.push((side+1)/2,t);}}
    for(let i=0;i<7;i++)for(let j=0;j<2;j++){const a=i*3+j;ind.push(a,a+3,a+1,a+1,a+3,a+4);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(ind);g.computeVertexNormals();return g;
  }
  const leafGeo=leafGeometry();M.leaf.side=M.leafLight.side=THREE.DoubleSide;
  function coffeePlant(parent,x,y,z,height=.62,age=1) {
    const g=group(parent,x,y,z);bar(g,[0,0,0],[.015,height,0],.012,M.woodEdge);
    const levels=age===0?2:4;
    for(let i=0;i<levels;i++)for(const side of [-1,1]){
      const h=.12+i*(height-.18)/Math.max(1,levels-1),a=i*.82+(side===1?0:Math.PI),s=(.72+(levels-i)*.10)*height/.6;
      const branch=group(g,Math.sin(a)*.045,h,Math.cos(a)*.045);branch.rotation.y=a;branch.rotation.x=-.06+i*.08;
      const l=mesh(branch,leafGeo,i%3===0?M.leafLight:M.leaf,0,0,0);l.scale.setScalar(s);
      bar(branch,[0,.002,0],[0,.02,.30*s],.0025,M.leafVein);
    }
    return g;
  }
  const potProfile=[[.125,0],[.139,.015],[.176,.225],[.187,.229],[.190,.264],[.175,.270],[.163,.245],[.139,.025]].map(([x,y])=>new THREE.Vector2(x,y));
  const potGeo=new THREE.LatheGeometry(potProfile,18);
  function nurseryPot(parent,x,y,z,scale=1,height=.62) {const g=group(parent,x,y,z);g.scale.setScalar(scale);mesh(g,potGeo,random()>.6?M.terraLight:M.terra);cylinder(g,.160,.018,M.soil,0,.242,0);coffeePlant(g,0,.246,0,height);return g;}
  function chair(parent,x,y,z,rotation=0) {
    const g=group(parent,x,y,z);g.rotation.y=rotation;
    rounded(g,.42,.055,.43,.065,M.wood,0,.45,0);
    for(const a of [-1,1])for(const b of [-1,1])bar(g,[a*.155,.43,b*.15],[a*.19,0,b*.18],.018,M.woodEdge);
    for(const a of [-1,1]){bar(g,[a*.16,.42,-.16],[a*.17,.87,-.20],.019,M.woodEdge);bar(g,[a*.18,.17,-.17],[a*.18,.17,.17],.012,M.woodEdge);}
    rounded(g,.39,.115,.045,.018,M.wood,0,.78,-.20);rounded(g,.39,.075,.045,.014,M.wood,0,.64,-.18);
    return g;
  }
  function cafeTable(parent,x,y,z,r=.45) {
    const g=group(parent,x,y,z);cylinder(g,r,.065,M.wood,0,.70,0);torus(g,r-.018,.014,M.woodEdge,0,.717,0).rotation.x=Math.PI/2;
    cylinder(g,.035,.65,M.ink,0,.34,0);cylinder(g,.20,.026,M.ink,0,.025,0);
    for(let i=0;i<3;i++){const a=i*Math.PI*2/3;bar(g,[0,.08,0],[Math.sin(a)*.31,.015,Math.cos(a)*.31],.016,M.ink);}
    cup(g,-.14,.742,.08,.75);cup(g,.17,.742,-.11,.75,M.sageCeramic);
    rounded(g,.17,.008,.22,.008,M.paper,.10,.741,.12).rotation.y=.23;return g;
  }

  const cafeY=heightAt(-3,-1)+.07,cafe=group(root,-3,cafeY,-1);
  rounded(cafe,5,.16,4,.12,M.woodEdge,0,-.08,0);
  for(let i=0;i<16;i++){const plank=rounded(cafe,4.94,.055,.239,.008,M.wood,0,.025,-1.85+i*.245);if(i%3===0)plank.rotation.y=.001;}
  // Low roofless walls keep sightlines into the miniature.
  rounded(cafe,4.95,1.40,.13,.025,M.plaster,0,.70,-1.94);
  rounded(cafe,.13,.95,3.35,.025,M.plaster,-2.45,.475,-.27);
  rounded(cafe,4.98,.055,.18,.018,M.stone,0,1.425,-1.94);
  rounded(cafe,.18,.055,3.4,.018,M.stone,-2.45,.975,-.27);
  const shelf=group(cafe,.82,.98,-1.78);rounded(shelf,1.35,.045,.26,.016,M.wood);bar(shelf,[-.50,-.18,-.06],[-.50,0,.08],.015,M.brass);bar(shelf,[.50,-.18,-.06],[.50,0,.08],.015,M.brass);
  for(let i=0;i<5;i++)cup(shelf,-.48+i*.23,.03,0,.65,i%2?M.ceramic:M.sageCeramic);
  const counter=group(cafe,-.35,0,-.73);
  rounded(counter,3.45,.75,.87,.045,M.grout,0,.425,0);
  for(let row=0;row<4;row++)for(let col=0;col<15;col++){const mat=[M.tile,M.tile2,M.tile3][(col*5+row*3)%3];rounded(counter,.219,.167,.023,.012,mat,-1.60+col*.229,.14+row*.178,.45);}
  for(let i=0;i<4;i++)rounded(counter,.025,.167,.79,.01,M.tile3,1.74,.14+i*.178,.0);
  rounded(counter,3.59,.085,1.02,.055,M.stone,0,.843,0);
  bar(counter,[-1.6,.27,.53],[1.60,.27,.53],.016,M.brass);
  for(const x of [-1.35,1.35])bar(counter,[x,.27,.45],[x,.27,.53],.017,M.brass);

  // Espresso equipment has curved housings, controls, feet and metal fittings.
  const machine=group(counter,-.42,.89,-.10);
  rounded(machine,1.18,.065,.53,.045,M.ink,0,.032,0);
  rounded(machine,1.13,.43,.47,.055,M.tile,0,.27,0);
  rounded(machine,1.22,.07,.55,.040,M.metal,0,.515,0);
  rounded(machine,1.18,.055,.58,.03,M.metal,0,.08,.10);
  rounded(machine,1.04,.025,.21,.015,M.ink,0,.115,.24);
  for(let i=0;i<13;i++)box(machine,.012,.008,.18,M.metal,-.46+i*.077,.132,.25);
  for(const x of [-.29,.29]) {
    const dial=torus(machine,.044,.006,M.metal,x,.37,.244);cylinder(machine,.034,.009,M.ink,x,.37,.249).rotation.x=Math.PI/2;dial.rotation.x=0;
    cylinder(machine,.034,.085,M.metal,x,.22,.29);bar(machine,[x,.20,.27],[x+.15,.20,.37],.015,M.ink);
    bar(machine,[x,.19,.27],[x,.15,.27],.011,M.metal);
    cup(machine,x,.145,.24,.7);
    for(const dx of [-.055,0,.055])ball(machine,.010,.010,.007,M.ceramic,x+dx,.45,.242);
  }
  bar(machine,[.49,.32,.19],[.58,.25,.27],.012,M.metal);bar(machine,[.58,.25,.27],[.58,.10,.32],.010,M.metal);
  for(const x of [-.25,0,.25])cup(machine,x,.56,0,.60);
  const grinder=group(counter,.67,.89,-.13);rounded(grinder,.30,.28,.31,.035,M.tile,0,.15,0);cylinder(grinder,.10,.10,M.metal,0,.36,0);mesh(grinder,new THREE.CylinderGeometry(.155,.09,.22,18),M.glass,0,.50,0);cylinder(grinder,.160,.024,M.ink,0,.621,0);cylinder(grinder,.115,.11,M.coffee,0,.47,0);box(grinder,.07,.035,.13,M.metal,0,.25,.19);
  const pitcher=group(counter,.98,.89,.13);mesh(pitcher,new THREE.CylinderGeometry(.085,.065,.18,18,1,true),M.metal,0,.09,0);torus(pitcher,.064,.009,M.metal,.085,.095,0,Math.PI*1.5).rotation.z=-Math.PI*.75;
  for(let i=0;i<3;i++)cup(counter,1.34,.90+i*.018,-.12,.78,M.sageCeramic);
  cafeTable(cafe,-1.30,0,1.02,.43);chair(cafe,-1.85,0,1.0,Math.PI/2);chair(cafe,-.76,0,1.18,-Math.PI/2);
  cafeTable(cafe,1.20,0,.86,.45);chair(cafe,1.90,0,.89,-Math.PI/2);chair(cafe,1.08,0,1.55,Math.PI);
  nurseryPot(cafe,-2.10,.06,1.50,.96,.65);nurseryPot(cafe,2.12,.06,-1.45,.90,.70);

  const gardenY=heightAt(3.3,1.5)+.05,garden=group(root,3.3,gardenY,1.5);
  const bench=group(garden,0,0,-.58);
  for(const x of [-1.5,1.5])for(const z of [-.32,.32])bar(bench,[x,0,z],[x,.69,z],.030,M.woodEdge);
  for(let i=0;i<5;i++)rounded(bench,3.35,.055,.15,.008,M.wood,0,.72,-.32+i*.16);
  for(const x of [-1.45,1.45])bar(bench,[x,.12,-.33],[x,.12,.33],.02,M.woodEdge);
  rounded(bench,3.25,.035,.61,.01,M.wood,0,.23,0);
  for(let i=0;i<6;i++)nurseryPot(bench,-1.20+i*.47,.755,.03,.73,.43+(i%3)*.055);
  for(let i=0;i<5;i++)nurseryPot(bench,-1.15+i*.52,.25,0,.57,.28);
  // Seed trays include cells and visible young leaf pairs rather than mature crops.
  const tray=group(garden,-1.06,.02,.73);rounded(tray,1.54,.13,.91,.035,M.ink,0,.065,0);
  for(let row=0;row<3;row++)for(let col=0;col<5;col++){
    const x=-.60+col*.30,z=-.30+row*.30;mesh(tray,new THREE.CylinderGeometry(.116,.084,.10,10),M.terraLight,x,.12,z);cylinder(tray,.105,.012,M.soil,x,.173,z);coffeePlant(tray,x,.18,z,.16+(col%2)*.04,0);
  }
  const bed=group(garden,.86,0,.86);rounded(bed,1.70,.20,1.11,.025,M.woodEdge,0,.10,0);rounded(bed,1.59,.05,1.0,.018,M.soil,0,.205,0);
  for(let row=0;row<2;row++)for(let col=0;col<3;col++)coffeePlant(bed,-.52+col*.52,.23,-.26+row*.52,.35+(col+row)%2*.08,0);
  for(const x of [-.76,.76])rounded(bed,.065,.06,1.12,.01,M.wood,x,.24,0);for(const z of [-.54,.54])rounded(bed,1.72,.06,.065,.01,M.wood,0,.24,z);
  const can=group(garden,1.62,.03,-.11);mesh(can,new THREE.CylinderGeometry(.15,.18,.30,18),M.sageCeramic,0,.17,0);bar(can,[.10,.17,0],[.39,.29,0],.035,M.sageCeramic);mesh(can,new THREE.CylinderGeometry(.057,.031,.055,12),M.sageCeramic,.40,.30,0).rotation.z=-.85;torus(can,.18,.018,M.ink,0,.22,-.03).rotation.y=Math.PI/2;
  bar(garden,[1.78,.02,-1.3],[1.92,1.15,-1.32],.017,M.woodEdge);rounded(garden,.17,.21,.028,.025,M.metal,1.77,.13,-1.30);
  for(let i=0;i<3;i++){const sack=rounded(garden,.35,.38,.27,.09,M.paper,1.35+i*.08,.20,-1.31+i*.04);sack.rotation.y=.1+i*.2;}

  function actor(parent,x,y,z,{skin=M.skin,shirt=M.shirt,hat=false}={}) {
    const g=group(parent,x,y,z),body=group(g,0,.0,0);animated.add(g);
    rounded(body,.31,.40,.22,.08,shirt,0,.67,0);rounded(body,.25,.30,.027,.025,M.apron,0,.62,.126);
    rounded(body,.11,.055,.013,.005,M.woodEdge,0,.56,.146);
    const head=group(body,0,1.03,0);ball(head,.172,.193,.163,skin);
    for(const s of [-1,1]){ball(head,.030,.046,.028,skin,s*.169,-.01,0);ball(head,.012,.017,.008,M.dark,s*.056,.008,.155);}
    ball(head,.025,.031,.031,skin,0,-.022,.158);
    const smile=torus(head,.028,.003,M.lips,0,-.066,.151,Math.PI);smile.rotation.z=Math.PI;
    mesh(head,new THREE.SphereGeometry(.177,16,8,0,Math.PI*2,0,Math.PI*.48),skin===M.skin2?M.hair:M.hair2,0,.015,-.01);
    if(hat){cylinder(head,.225,.025,M.terraLight,0,.172,0);mesh(head,new THREE.CylinderGeometry(.13,.16,.12,16),M.paper,0,.232,0);torus(head,.157,.008,M.woodEdge,0,.189,0).rotation.x=Math.PI/2;}
    const arms=[],legs=[];
    for(const s of [-1,1]){
      const arm=group(body,s*.19,.82,0);mesh(arm,new THREE.CapsuleGeometry(.046,.19,3,8),shirt,0,-.12,0);ball(arm,.046,.058,.043,skin,0,-.26,0);arms.push(arm);
      const leg=group(body,s*.09,.46,0);rounded(leg,.11,.30,.12,.035,M.ink,0,-.15,0);rounded(leg,.125,.10,.20,.034,M.woodEdge,0,-.35,.035);legs.push(leg);
    }
    const a={root:g,body,head,arms,legs,baseX:x,baseZ:z};actors.push(a);return a;
  }
  let barista=null,gardener=null,carrier=null;
  if(includeActors){
    barista=actor(cafe,-.65,.07,-1.35,{skin:M.skin2,shirt:M.shirt});barista.root.rotation.y=Math.PI*.10;
  barista.arms[0].rotation.x=-.9;barista.arms[1].rotation.x=-.8;
    gardener=actor(garden,.58,0,-1.28,{skin:M.skin3,shirt:M.shirtSage,hat:true});gardener.root.rotation.y=Math.PI;
    carrier=actor(garden,-1.95,0,.11,{skin:M.skin,shirt:M.shirtCopper});carrier.root.rotation.y=Math.PI*.7;
  const carriedPot=group(carrier.body,0,.67,.32);nurseryPot(carriedPot,0,0,0,.49,.25);carrier.arms.forEach((a,i)=>{a.rotation.x=-.9;a.rotation.z=i?-.16:.16;});

  }

  // Static scenery uses one draw call per material; small independently animated
  // people remain separate. This preserves readable material detail on phones.
  // Bake static geometry in each component's own local coordinate system.
  // Returning empty transform groups with world-baked meshes would prevent
  // live consumers from independently placing the cafe and nursery.
  root.updateMatrixWorld(true);
  for(const component of [cafe,garden]){
    const inverse=new THREE.Matrix4().copy(component.matrixWorld).invert(),remove=[],batches=new Map();
    component.traverse(o=>{
      if(!o.isMesh||o.isInstancedMesh)return;
      for(let p=o;p&&p!==component;p=p.parent)if(animated.has(p))return;
      const key=o.material.uuid;if(!batches.has(key))batches.set(key,{material:o.material,geos:[]});
      const geo=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();
      geo.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse,o.matrixWorld));batches.get(key).geos.push(geo);remove.push(o);
    });
    for(const [key,{material,geos}] of batches){const merged=mergeGeometries(geos,false);geos.forEach(g=>g.dispose());if(merged)mesh(component,merged,material);staticGroups.set(component.uuid+':'+key,{material});}
    remove.forEach(o=>o.removeFromParent());
  }
  const anchors={cafe:new THREE.Vector3(-3,cafeY+1.5,-1),garden:new THREE.Vector3(3.3,gardenY+1.2,1.5)};
  const stats={meshCount:0,triangles:0,staticMaterialBatches:staticGroups.size,characters:actors.length};
  root.traverse(o=>{if(o.isMesh){stats.meshCount++;stats.triangles+=(o.geometry.index?o.geometry.index.count:o.geometry.attributes.position.count)/3;}});
  function update(seconds) {
    if(!includeActors)return;
    const t=Number.isFinite(seconds)?seconds:0;
    barista.head.rotation.y=Math.sin(t*.48)*.15;barista.arms[1].rotation.x=-.90+Math.sin(t*1.8)*.11;barista.arms[0].rotation.x=-.82+Math.sin(t*.9)*.04;
    gardener.body.rotation.x=.10+Math.sin(t*.8)*.025;gardener.arms[0].rotation.x=-.83+Math.sin(t*1.7)*.10;gardener.arms[1].rotation.x=-.93+Math.sin(t*1.7+.7)*.10;gardener.head.rotation.x=.12;
    const p=(t*.10)%1,along=p<.5?p*2:(1-p)*2,smooth=along*along*(3-2*along);
    carrier.root.position.x=carrier.baseX+.65*smooth;carrier.root.position.z=carrier.baseZ+.26*Math.sin(smooth*Math.PI);
    const walking=p>.05&&p<.45||p>.55&&p<.95;
    carrier.root.rotation.y=p<.5?Math.PI*.68:-Math.PI*.32;
    carrier.legs.forEach((leg,i)=>leg.rotation.x=walking?Math.sin(t*5.7+i*Math.PI)*.25:0);carrier.body.position.y=walking?Math.abs(Math.sin(t*5.7))*.012:0;carrier.head.rotation.y=Math.sin(t*.5)*.08;
  }
  update(0);
  return {root,update,anchors,stats,cafeRoot:cafe,gardenRoot:garden};
}
