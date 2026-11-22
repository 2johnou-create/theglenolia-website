export const bands = {
  ES1:'Kindergarten', S1:'Years 1–2', S2:'Years 3–4', S3:'Years 5–6', S4:'Years 7–8', S5:'Years 9–10'
};
export const interests = {workbook:'Classroom workbooks',seeds:'Seeds and plants',visit:'Site visit and tour',colouring:'Story colouring'};
export const topics = {
  leaves:{title:'Looking closely at leaves',art:'observe',plan:'Project a dated photo of your plant. Sketch two visible features. Compare it with a later view taken from a similar angle.', question:'What changed that we can point to?',secondary:'Explain how angle and scale affect the comparison.'},
  weather:{title:'Weather and our coffee plant',art:'weather',plan:'Read a dated farm note alongside a local weather record. List what each source can tell you. Find one pattern and suggest a possible explanation.',question:'What extra reading would help us test our idea?',secondary:'Compare matching dates and distinguish a regional estimate from a field reading.'},
  soil:{title:'Water in the soil',art:'soil',plan:'With an adult, compare two classroom soil samples using equal amounts of water. Observe which drains faster. Compare your results with the farmer’s description of the tree’s soil.',question:'What did we keep the same to make our comparison fair?',secondary:'Propose a repeat trial and explain why these results cannot establish the orchard soil’s properties.'},
  seeds:{title:'From seed to seedling',art:'living',plan:'Set up two identical classroom seed pots. Label the date and seed type. Record days to emergence and sketch the first leaves. Compare your sequence with a dated farm view.',question:'Which changes could we see and which were hidden?',secondary:'Plan a comparison that changes only one growing condition. State your sample size.'},
  growth:{title:'Measuring change over time',art:'measure',plan:'Look for two dated readings in the farm journal. Record the method and units. If only one reading exists, plan the next observation and practise with a classroom model.',question:'How would we know our measurements are comparable?',secondary:'Graph compatible readings and explain how missing points affect the conclusion.'},
  harvest:{title:'Following the coffee cherry',art:'community',plan:'Put a bud, open flower and ripe coffee cherry in order using the growth guide. Check the actual journal and mark which steps your class can already see.',question:'Which event would you look for next?',secondary:'Give a claim, evidence and a limit. Explain why the example sequence cannot predict the date of this tree’s harvest.'}
};
const activityAlternatives = {
  leaves:[
    ['Look across a leaf', 'Draw the margin, tip and visible veins from a dated photograph. Beside each feature write one word that describes it.','Which description could another class verify from the same photograph?'],
    ['Compare two leaf shapes', 'Choose one visible coffee leaf and one magnolia leaf from a photo or teacher-supplied example. Use a labelled sketch to compare edges and tips.','Which features help you tell the leaves apart?']
  ],
  weather:[
    ['A rainy week at Glenorie','Read seven consecutive days of rainfall. Rank the readings you have. Mark missing days separately and compare the wettest day with a dated farmer note.','Which parts of the weather record apply only to the wider area?'],
    ['Find the warmest observation','Match two published farmer notes to the dates of available local temperature readings. Record the sources and compare the notes.','What would you need before connecting temperature and growth?']
  ],
  soil:[
    ['Two samples after watering','Add the same volume of water to two classroom soil samples. Record how they look before watering and after five minutes.','When would you need an extra trial to check what you observed?'],
    ['Where did the water go?','Compare the water collected below two classroom soil samples using the same timer, water volume and containers. Record the volume and units.','Which part of the test tells you about drainage?']
  ],
  seeds:[
    ['Count days to emergence','Start identical classroom pots with school-supplied seeds. Check them on the same days. Mark each day you first see an emerging shoot.','What would you record if the first shoot appeared between checks?'],
    ['Draw the first leaves','Project two dated views of a school seedling. Sketch the first visible leaves and record a later change. Compare with a farm journal photo if it shows a seedling.','Which changes in the two plants are safe to compare?']
  ],
  growth:[
    ['Our tree at two dates','Find two dated photos of your tree. Check angle and scale. Mark one visible change and plan a follow-up photograph with the same framing.','Which change can we describe without a height reading?'],
    ['Would you trust this graph?','Sketch a graph using compatible readings, or use clearly marked classroom-model observations. Label the dates, units and any gaps.','What would change if the next reading used a different method?']
  ],
  harvest:[
    ['Bud, flower or cherry?','Study the growth guide and a dated plant entry. Draw the evidence for one stage or explain why the entry is inconclusive.','What detail would distinguish a bud from a small green fruit?'],
    ['Read the colour of a cherry','Compare illustrations of green, ripening and ripe fruit from the stage guide. Record characteristics you can see and compare with a dated image if available.','What else would a grower check before deciding to harvest?']
  ]
};
export function monthlyActivity(topic,month){
  const base=topics[topic], alternatives=activityAlternatives[topic];
  const [year,number]=month.split('-').map(Number);
  const sequence=(year*12+number+Object.keys(topics).indexOf(topic))%3;
  if(sequence===0)return base;
  const [title,plan,question]=alternatives[sequence-1];
  return {...base,title,plan,question};
}
export const monthlyModes={
  workbook:'Capture the evidence in a paper table or a labelled sketch.',
  seeds:'Use a school-supplied plant or seed tray for comparison. Label school observations separately.',
  visit:'Use the farm atlas and journal as a virtual trail. Discuss any future on-site visit with the farm.',
  colouring:'Draw the evidence in three frames and add a caption to each.'
};
export const packs = [
 {id:'teacher-handbook',title:'Teacher’s field handbook',type:'Teacher handbook',pages:7,art:'classroom',desc:'Three ready-to-run lessons, curriculum links, assessment prompts and visit planning.'},
 ...Object.entries(bands).map(([band,range],i)=>({id:'student-'+band.toLowerCase(),title:['My first coffee plant','Coffee plant detectives','Our coffee field journal','How does our coffee grow?','Evidence from an orchard','Testing claims about coffee growth'][i],
  type:'Student workbook',band,range,pages:4,art:['welcome','observe','measure','soil','weather','design'][i],desc:['Look, point, draw and say what you noticed.','Compare two appearances and record a change.','Sketch, measure and represent dated observations.','Compare environments and design a fair test.','Graph readings and analyse their limits.','Evaluate a claim using evidence and repeatable methods.'][i]})),
 {id:'seed-lab',title:'Start a classroom seed tray',type:'Seeds and plants',pages:4,art:'living',desc:'A teacher-led bean or pea seed investigation with a dated observation sheet.'},
 {id:'field-trail',title:'Plan an orchard visit',type:'Site visit and tour',pages:4,art:'explore',desc:'Prepare learning stops, record evidence and take a virtual trail from school.'}
];
export const stories = [
 {id:'rain-gauge',title:'Pip and the rain gauge',art:'weather',lines:['Pip puts out an empty rain gauge. Where will the drops land?','Rain has fallen. Pip finds the line where the water stops.','Pip and Dot compare two marks on the gauge. Colour between the marks.']},
 {id:'leaf-hunt',title:'Milla’s leaf hunt',art:'observe',lines:['Milla finds two leaves. Can you spot one way they look different?','Milla looks closely at the edge of a leaf. Trace the edge with your pencil.','Milla makes a leaf picture. Add a leaf shape of your own.']},
 {id:'underfoot',title:'Dot looks underfoot',art:'soil',lines:['Dot wonders what is under the ground. Colour the surface of the soil.','Dot finds roots. Follow each root from the plant into the soil.','Dot and Pip compare what they found. Draw another thing they might see in soil.']},
 {id:'window-light',title:'Pip finds the light',art:'design',lines:['Pip finds a sunny window. Colour the part where the light falls.','Pip and Milla find a shaded spot. How is it different?','Pip notices a fresh leaf. What would you look for next time?']},
 {id:'seed-tray',title:'A seat by the seed tray',art:'living',lines:['Pip makes a place for each seed. Count the seeds as you colour them.','Milla brings water. What else might a seed need?','Dot finds a seedling. Circle the first shoot.']},
 {id:'orchard-trail',title:'The orchard trail',art:'explore',lines:['Milla and Pip follow the orchard path. Colour the path so they can see where to go.','Pip spots a young plant. Point to its leaves.','Dot draws what they saw. Add one detail to the page.']},
 {id:'little-tree',title:'Dot measures a little tree',art:'measure',lines:['Dot and Pip line up a ruler with a plant. Where should they start measuring?','Pip compares two plant outlines. Colour the taller one.','Dot writes down an observation. Draw a picture of what Dot might record.']},
 {id:'coffee-cherry',title:'Milla and the coffee cherry',art:'community',lines:['Milla notices a small bud. Draw a circle around it.','Some buds have opened into flowers. Colour the leaves around the flowers.','Milla and Dot find ripe cherries. Draw one flower and one cherry side by side.']}
];
