// Small presentation helpers. Greeting a character never changes programme data
// or the route/occupancy state used by the night-lighting routines.
export const helloDepartments=['cafe','coffee','workshops','local'];
export const waveDuration=2.2;

export function createCharacterTap({distance=9,duration=650}={}) {
  const pointers=new Set();let candidate=null;
  return {
    down(event){
      pointers.add(event.pointerId);
      if(pointers.size!==1||event.button!==0||event.isPrimary===false){candidate=null;return;}
      candidate={id:event.pointerId,x:event.clientX,y:event.clientY,at:event.timeStamp};
    },
    move(event){if(candidate?.id===event.pointerId&&Math.hypot(event.clientX-candidate.x,event.clientY-candidate.y)>distance)candidate=null;},
    up(event){
      const tap=candidate;candidate=null;pointers.delete(event.pointerId);
      return tap?.id===event.pointerId&&event.isPrimary!==false&&!pointers.size&&event.timeStamp-tap.at>=0&&event.timeStamp-tap.at<=duration&&Math.hypot(event.clientX-tap.x,event.clientY-tap.y)<=distance?{x:event.clientX,y:event.clientY}:null;
    },
    cancel(event){pointers.delete(event.pointerId);candidate=null;},
    reset(){pointers.clear();candidate=null;},
  };
}

export function pickCharacter(actors,x,y,radius=28) {
  return actors.filter(actor=>actor.visible&&Number.isFinite(actor.hitX)&&Number.isFinite(actor.hitY))
    .map(actor=>({actor,distance:Math.hypot(x-actor.hitX,y-actor.hitY)}))
    .filter(item=>item.distance<=radius).sort((a,b)=>a.distance-b.distance||(a.actor.depth??0)-(b.actor.depth??0))[0]?.actor||null;
}

export function wavePose(elapsed,{paused=false,reduced=false,activity=''}={}) {
  if(paused||reduced||!Number.isFinite(elapsed)||elapsed<0||elapsed>=waveDuration)return null;
  const ease=value=>{const p=Math.max(0,Math.min(1,value));return p*p*(3-2*p);};
  const amount=ease(elapsed/.25)*ease((waveDuration-elapsed)/.35);
  // Keep the switching, watering and measuring hand free for its existing task.
  const arm=['switching','watering','measuring'].includes(activity)?0:1;
  return {arm,amount,lift:-2.35,sway:(arm===0?-1:1)*(.42+Math.sin(elapsed*11)*.15)};
}

export function placeGreeting(anchor,{width,height,bubbleWidth,bubbleHeight,clock=null}) {
  const pad=12,w=Math.min(bubbleWidth,width-pad*2),h=Math.min(bubbleHeight,height-pad*2);
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  let x=clamp((anchor?.x??width/2)-w/2,pad,width-w-pad);
  let y=clamp((anchor?.y??height/2)-h-24,pad,height-h-pad);
  if(clock&&x<clock.right+8&&x+w>clock.left-8&&y<clock.bottom+8&&y+h>clock.top-8){
    if(clock.bottom+12+h<=height-pad)y=clock.bottom+12;
    else if(clock.right+12+w<=width-pad)x=clock.right+12;
    else if(clock.left-12-w>=pad)x=clock.left-12-w;
    else y=clamp(clock.bottom+12,pad,height-h-pad);
  }
  return {x,y};
}
