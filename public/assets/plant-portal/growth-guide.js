import {STAGE_NAMES} from './stages.js';
import {stageIllustrationFile} from './plant-illustration.js';

// Relative timings describe the general sequence, not a forecast for a particular tree.
export const GROWTH_STAGES = Object.freeze([
  {timing:'Before planting',description:'The farmer prepares a place for the young plant, considering soil, drainage and room for roots.',observe:'What can you notice about the soil and ground cover?'},
  {timing:'Early growth',description:'A small seedling grows an upright stem and its first leaves. Roots establish below the surface.',observe:'Look for the growing tip and count the leaves you can see.'},
  {timing:'Early growth · over months',description:'More leaves unfold as the seedling captures light and grows. New leaves may look different from older ones.',observe:'Compare a new leaf near the tip with one lower down.'},
  {timing:'Developing plant · over months',description:'Side branches begin to grow from the main stem. These branches help form the plant’s canopy.',observe:'Can you trace a branch back to the upright stem?'},
  {timing:'Growing towards maturity · over years',description:'The coffee plant becomes a leafy shrub. World Coffee Research lists first production for Paraíso in year 3; local timing can vary.',observe:'Compare the outline of the plant in two dated photos.'},
  {timing:'Before flowering · timing varies',description:'Small buds may appear in clusters where a leaf meets a branch. As they develop, they can open into flowers.',observe:'Look closely at the junction between a leaf and a branch.'},
  {timing:'Flowering · individual blooms are brief',description:'White coffee flowers open along the branches. After flowering, some flower sites can develop into fruit.',observe:'Which branch would you photograph again to look for tiny fruit?'},
  {timing:'After flowering · developing over months',description:'Young coffee cherries start green and grow on the branch. Each cherry usually contains two seeds, the future coffee beans.',observe:'Look for green fruit and compare its size in dated photos.'},
  {timing:'Fruit ripening · over months',description:'As the fruit matures, its skin begins to change colour. Cherries on the same tree may ripen at different times.',observe:'Can you find cherries of different colours in one photograph?'},
  {timing:'Often around 7–11 months after flowering',description:'Ripe cherries reach the mature colour of their variety. The farmer checks the fruit before deciding when to harvest.',observe:'What colour are the ripe cherries for this variety?'}
]);

export function mountGrowthGuide({guide,list,details,assets}) {
  const buttons=[];
  function show(index) {
    const item=GROWTH_STAGES[index];
    if (!item) return;
    for (const [i,button] of buttons.entries()) button.setAttribute('aria-pressed',String(i===index));
    const kicker=document.createElement('p');kicker.className='stage-detail-kicker';kicker.textContent='STAGE '+(index+1)+' OF 10';
    const title=document.createElement('h3');title.textContent=STAGE_NAMES[index];
    const timing=document.createElement('p');timing.className='stage-timing';timing.textContent=item.timing;
    const description=document.createElement('p');description.textContent=item.description;
    const observe=document.createElement('p');observe.className='stage-observe';observe.textContent=item.observe;
    details.replaceChildren(kicker,title,timing,description,observe);
  }
  for (const [index,name] of STAGE_NAMES.entries()) {
    const li=document.createElement('li'),button=document.createElement('button'),drawing=new Image(70,79);
    button.type='button';button.className='stage-choice';button.setAttribute('aria-controls',details.id);
    drawing.alt='';drawing.src=assets+'/stages/'+stageIllustrationFile(index+1,1);
    const caption=document.createElement('span');caption.textContent=(index+1)+'. '+name;
    button.append(drawing,caption);
    button.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')show(index);});
    button.addEventListener('focus',()=>show(index));
    button.addEventListener('click',()=>{
      show(index);
      if(matchMedia('(max-width: 600px)').matches)details.scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    });
    li.append(button);list.append(li);buttons.push(button);
  }
  show(0);
  guide.addEventListener('toggle',()=>{if(guide.open && !details.childElementCount)show(0);});
}
