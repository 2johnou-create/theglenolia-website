// Deterministic miniature routines, not a record of real staff or opening hours.
// Coordinates are shared with the model so switch visits stay in clear lanes.
export const departmentLightStations = Object.freeze({
  cafe:Object.freeze({x:-4.5,z:-2.05,approach:Object.freeze({x:-4.5,z:-1.25,face:Math.PI})}),
  coffee:Object.freeze({x:8.55,z:-2.05,approach:Object.freeze({x:8.55,z:-1.25,face:Math.PI})}),
  workshops:Object.freeze({x:-4.65,z:2.1,approach:Object.freeze({x:-4.65,z:1.3,face:0})}),
  local:Object.freeze({x:4.65,z:2.1,approach:Object.freeze({x:4.65,z:1.3,face:0})}),
});
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const activeDuty=new Set(['working','leaving','returning']);
const near=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z)<.0001;
const isWet=environment=>environment.rain>0||environment.weatherCode>=51;

export function createProgrammeNightBehavior(specs,stations=departmentLightStations) {
  const actors=specs.map(spec=>{
    const start=spec.route[0],participant=spec.lightParticipant!==false&&spec.id!=='garden-helper';
    return {id:spec.id,department:spec.department,route:spec.route,speed:spec.speed||.8,offset:spec.offset||0,
      x:start.x,z:start.z,index:0,wait:Math.max(0,start.hold-(spec.offset||0)),face:start.face||0,
      activity:start.activity||'planning',moving:false,seated:false,participant,duty:participant?'working':'away',
      gate:null,visit:null,lap:0,lightAction:null};
  });
  const lights=Object.keys(stations).map(id=>({id,on:false,level:0,afterglow:0,reserved:null,occupants:0,switches:0}));
  const byId=Object.fromEntries(lights.map(light=>[light.id,light]));
  let previousDay=null;
  function countOccupants(id) {return actors.filter(actor=>actor.participant&&actor.department===id&&activeDuty.has(actor.duty)).length;}
  function command(light,on) {
    if(light.on!==on){light.on=on;light.switches++;}
    light.afterglow=on?0:5;
  }
  function syncEnvironment(environment,reduced) {
    if(previousDay!==Boolean(environment.isDay)) {
      previousDay=Boolean(environment.isDay);
      for(const light of lights) {
        light.occupants=countOccupants(light.id);light.on=!environment.isDay&&light.occupants>0;
        light.afterglow=0;light.level=light.on?1:0;
      }
      // A changing clock never transports a worker back to its route waypoint.
      // Finish a switch detour by walking back; daylight needs no switching.
      if(environment.isDay)for(const actor of actors)if(actor.visit){actor.visit.phase='back';actor.visit.action='check';actor.lightAction=null;}
    }
    if(reduced)for(const light of lights){light.afterglow=0;light.level=!environment.isDay&&light.on?1:0;}
    for(const actor of actors)if(!actor.moving&&!actor.visit&&!actor.gate){actor.activity=stationActivity(actor,environment);actor.seated=['resting','lunch'].includes(actor.activity);}
  }
  function stationActivity(actor,environment) {
    const activity=actor.route[actor.index].activity||'walking';
    if(activity==='watering'&&(!environment.isDay||isWet(environment)))return 'checking';
    if(!environment.isDay&&(actor.id==='garden-helper'||(activity==='writing'&&actor.duty==='away')))return activity==='resting'?'resting':'checking';
    if(activity==='resting'&&environment.isDay&&environment.hour>=11.5&&environment.hour<13.5)return 'lunch';
    return activity;
  }
  function move(actor,target,delta,environment) {
    const dx=target.x-actor.x,dz=target.z-actor.z,distance=Math.hypot(dx,dz),step=delta*actor.speed*(environment.isDay?1:.62);
    actor.moving=distance>.0001;actor.seated=false;actor.activity=actor.moving?'walking':actor.activity;
    if(distance>.0001)actor.face=Math.atan2(dx,dz);
    if(distance<=step||distance<.0001){actor.x=target.x;actor.z=target.z;actor.moving=false;return true;}
    if(step>0){actor.x+=dx/distance*step;actor.z+=dz/distance*step;}return false;
  }
  function startVisit(actor,action) {
    const light=byId[actor.department];
    if(light.reserved&&light.reserved!==actor.id)return false;
    light.reserved=actor.id;actor.visit={phase:'to',action,anchor:{x:actor.x,z:actor.z},remaining:1.8,applied:false};actor.lightAction=action==='check'?null:action;return true;
  }
  function advanceVisit(actor,delta,environment) {
    const visit=actor.visit,light=byId[actor.department],station=stations[actor.department].approach;
    if(visit.action==='off'&&!visit.applied&&countOccupants(light.id)>0){visit.action='check';actor.lightAction=null;}
    if(visit.phase==='to') {
      if(move(actor,station,delta,environment)){visit.phase='operate';actor.activity=visit.action==='check'?'checking':'switching';actor.face=station.face;}
    } else if(visit.phase==='operate') {
      actor.moving=false;actor.seated=false;actor.face=station.face;actor.activity=visit.action==='check'?'checking':'switching';
      visit.remaining=Math.max(0,visit.remaining-delta);
      if(!visit.applied&&visit.remaining<=.95) {
        visit.applied=true;
        if(!environment.isDay&&visit.action==='on')command(light,true);
        if(!environment.isDay&&visit.action==='off'&&countOccupants(light.id)===0)command(light,false);
      }
      if(visit.remaining===0)visit.phase='back';
    } else if(move(actor,visit.anchor,delta,environment)) {
      light.reserved=null;actor.visit=null;actor.lightAction=null;actor.gate=null;
    }
  }
  function advanceRoute(actor,delta,environment) {
    actor.lightAction=null;
    if(actor.gate){actor.moving=false;actor.activity=actor.gate==='entry'?'checking':stationActivity(actor,environment);return;}
    if(actor.wait>0) {
      actor.wait=Math.max(0,actor.wait-delta);actor.activity=stationActivity(actor,environment);actor.moving=false;
      actor.face=actor.route[actor.index].face||0;actor.seated=['resting','lunch'].includes(actor.activity);return;
    }
    const next=(actor.index+1)%actor.route.length,target=actor.route[next];
    if(actor.participant&&actor.index===0)actor.duty='leaving';
    if(!move(actor,target,delta,environment))return;
    actor.index=next;actor.wait=target.hold*(environment.isDay?1:target.activity==='resting'?1.8:1.2);
    actor.activity=stationActivity(actor,environment);actor.face=target.face||actor.face;
    if(next===0){actor.lap++;if(actor.participant)actor.duty='working';}
    if(actor.participant&&next===1){actor.duty='away';actor.gate='exit';}
    if(actor.participant&&next===actor.route.length-1){actor.duty='returning';actor.gate='entry';}
  }
  function resolveGates(environment) {
    // Resolve after every actor has moved, so a shared café never depends on array order.
    for(const light of lights)light.occupants=countOccupants(light.id);
    for(const actor of actors) {
      if(!actor.gate||actor.visit)continue;
      const light=byId[actor.department];
      if(environment.isDay){actor.gate=null;continue;}
      if(actor.gate==='entry') {
        if(!light.on||light.afterglow>0)startVisit(actor,'on');
        else if(actor.lap%3===2)startVisit(actor,'check');
        else actor.gate=null;
      } else if(light.occupants===0&&light.on)startVisit(actor,'off');
      else actor.gate=null;
    }
  }
  function advance(delta,environment,{paused=false,reduced=false}={}) {
    syncEnvironment(environment,reduced);
    // No timers, gates, poses or switches advance for a zero step or a pause.
    const dt=paused||reduced?0:clamp(Number(delta)||0,0,.1);
    if(dt>0) {
      for(const actor of actors){if(actor.visit)advanceVisit(actor,dt,environment);else advanceRoute(actor,dt,environment);}
      resolveGates(environment);
      for(const light of lights) {
        light.occupants=countOccupants(light.id);
        // Shared occupancy prevents any still-active work light from fading.
        if(light.occupants>0&&light.on)light.afterglow=0;
        if(environment.isDay){light.on=false;light.afterglow=0;light.level=0;continue;}
        if(light.afterglow>0)light.afterglow=Math.max(0,light.afterglow-dt);
        const target=light.on||light.afterglow>0?1:0;
        const step=dt*(target>light.level?1.7:.65);
        light.level=target>light.level?Math.min(target,light.level+step):Math.max(target,light.level-step);
      }
    }
    return {actors,lights};
  }
  return {advance,getSnapshot:()=>JSON.parse(JSON.stringify({actors,lights}))};
}
