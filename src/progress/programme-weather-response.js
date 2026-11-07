// Local play never edits the latest real weather or the normal staff routine.
export function effectiveProgrammeWeather(real,game={}) {
  if(!game.active)return {...real};
  return {...real,wind:Math.max(real.wind||0,game.wind||0),rain:Math.max(real.rain||0,game.rain||0),
    cloud:Math.max(real.cloud||0,(game.rain>0||game.snow>0)?.92:game.wind>20?.55:.2)};
}

export function createWeatherEvacuation(specs) {
  const entries=new Map();
  return {
    reset(){entries.clear();},
    update(normal,game,delta,{paused=false}={}) {
      if(!game.active||game.panic<.04){entries.clear();return normal.map(s=>({...s,emergency:false}));}
      const dt=paused?0:Math.max(0,Math.min(.1,Number.isFinite(delta)?delta:0));
      return normal.map((state,i)=>{
        const spec=specs[i];
        if(!entries.has(spec.id))entries.set(spec.id,{x:state.x,z:state.z,index:((state.index||0)+1)%spec.route.length,face:state.face});
        const e=entries.get(spec.id);let remaining=dt*(2.0+Math.min(1,game.panic)*2.7),guard=0;
        while(remaining>0&&guard++<spec.route.length+1){
          const target=spec.route[e.index],dx=target.x-e.x,dz=target.z-e.z,d=Math.hypot(dx,dz);
          if(d<.001){e.index=(e.index+1)%spec.route.length;continue;}
          e.face=Math.atan2(dx,dz);const step=Math.min(d,remaining);e.x+=dx/d*step;e.z+=dz/d*step;remaining-=step;
          if(step===d)e.index=(e.index+1)%spec.route.length;
        }
        return {...state,x:e.x,z:e.z,y:.43+Math.min(1,game.flood||0)*.55,face:e.face,
          moving:true,seated:false,activity:'running-for-cover',lightAction:null,wait:0,emergency:true};
      });
    },
  };
}
