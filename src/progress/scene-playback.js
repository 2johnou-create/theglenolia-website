// Honour reduced motion initially; a visitor can explicitly play this scene.
// Weather selection resumes an ordinary manual pause without changing settings.
export function createScenePlayback(reducedPreference=()=>false) {
  let manual=false,explicitPlay=false;
  const reduced=()=>Boolean(reducedPreference())&&!explicitPlay;
  const paused=()=>manual||reduced();
  return {
    get paused(){return paused();},
    get reduced(){return reduced();},
    get reason(){return manual?'manual':reduced()?'reduced':'playing';},
    pause(value){manual=Boolean(value);explicitPlay=!manual;},
    requestAnimation(){manual=false;},
    preferenceChanged(){explicitPlay=false;},
  };
}
