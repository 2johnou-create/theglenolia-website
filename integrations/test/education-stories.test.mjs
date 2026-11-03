import test from 'node:test';
import assert from 'node:assert/strict';
import {storyImageId,classroomToolPath,normaliseStoryLibrary,filterStoryScenes,resourceStoryMoments,storyEditorRows,storyScenesFromEditor} from '../../public/teachers/teacher-ui.js';
const scene=(id='sl01',extra={})=>({id,title:'A question for the map',theme:'Notice a place',unit:'u1',cast:['Pip','Milla','Dot'],alt:'Three learning companions unfold a blank map.',question:'What helps us find our way?',stages:['ES1','S2','S5'],image:id,...extra});

test('character image paths use only the forty intended scene identifiers',()=>{
 for(let n=1;n<=40;n++){const id='sl'+String(n).padStart(2,'0');assert.equal(storyImageId(id),id);assert.equal(storyImageId('stories/'+id),id);}
 for(const bad of ['sl00','sl41','sl1','sl001','../sl01','stories/../sl01','https://outside.test/sl01','sl01.webp','sl01?token=private','sl01#detail','%73l01','SL01'])assert.equal(storyImageId(bad),null,bad);
});

test('classroom downloads remain in the intended public PDF folder',()=>{
 assert.equal(classroomToolPath('Glenolia-2027-Calendar.pdf'),'/assets/education/classroom/Glenolia-2027-Calendar.pdf');
 for(const bad of ['../private.pdf','https://outside.test/file.pdf','/private/packs/a/v1.pdf','file.pdf?token=private','file.svg','file.PDF','x.pdf#payload','a/b.pdf','x%2epdf','x\\a.pdf','file.pdf.exe','..pdf'])assert.equal(classroomToolPath(bad),null,bad);
});

test('public story normalisation excludes private production fields and invalid download targets',()=>{
 const rows=normaliseStoryLibrary({scenes:[scene('sl01',{privatePrompt:'PRIVATE_PROMPT_SENTINEL',image:'https://outside.test/asset.png',stages:['S2','private'],cast:['Pip','Invented mascot']}),scene('sl01'),scene('sl41'),null],classroomTools:[{id:'calendar',title:'Classroom calendar',description:'A blank year for your ideas.',file:'calendar.pdf',pages:12,paper:'A4',category:'Planning',printNote:'Add school dates.',privateNotes:'PRIVATE_NOTES_SENTINEL'},{id:'bad-tool',title:'Unsafe target',file:'../private.pdf'}]});
 assert.equal(rows.scenes.length,1);assert.equal(rows.scenes[0].image,'sl01');assert.deepEqual(rows.scenes[0].stages,['S2']);assert.deepEqual(rows.scenes[0].cast,['Pip']);assert.equal(rows.classroomTools.length,1);assert.equal(rows.classroomTools[0].pages,12);assert.ok(!JSON.stringify(rows).includes('PRIVATE_'));assert.ok(!JSON.stringify(rows).includes('outside.test'));
});

test('story search combines theme, stage and character without hiding all-stage scenes',()=>{
 const scenes=normaliseStoryLibrary({scenes:[scene('sl01'),scene('sl06',{theme:'Growing questions',unit:'u2',cast:['Pip'],stages:['S1']}),scene('sl11',{title:'A slow pause',theme:'Care and soil',unit:'u3',cast:['Dot'],stages:[]})]}).scenes;
 assert.deepEqual(filterStoryScenes(scenes,{stage:'S5'}).map(s=>s.id),['sl01','sl11']);assert.deepEqual(filterStoryScenes(scenes,{search:'PIP',theme:'Growing questions'}).map(s=>s.id),['sl06']);assert.deepEqual(filterStoryScenes(scenes,{stage:'S2',theme:'Growing questions'}),[]);assert.equal(filterStoryScenes(scenes).length,3);
});

test('story placements are explicit edition data rather than inferred additions to pinned versions',()=>{
 const scenes=normaliseStoryLibrary({scenes:[scene(),scene('sl02')]}).scenes;
 assert.deepEqual(resourceStoryMoments({id:'s2-u1',version:1},scenes,'opening'),[]);
 const v2={version:2,storyScenes:[{sceneId:'sl01',placement:'opening',question:'Our own class question.',character:'Together'},{sceneId:'sl02',placement:'lesson-1',character:'Dot'},{sceneId:'sl41',placement:'opening'}]};
 assert.equal(resourceStoryMoments(v2,scenes,'opening').length,1);assert.equal(resourceStoryMoments(v2,scenes,'opening')[0].question,'Our own class question.');assert.equal(resourceStoryMoments(v2,scenes,'lesson-1')[0].character,'Dot');assert.deepEqual(resourceStoryMoments(v2,scenes,'staff-only'),[]);assert.deepEqual(resourceStoryMoments(v2,scenes,'lesson-4'),[]);
});

test('the native story editor preserves six fixed placements and existing selected values',()=>{
 const original=[{sceneId:'sl28',placement:'opening',character:'Pip',question:'Which step does our model show?'},{sceneId:'sl36',placement:'lesson-1',character:'Together',question:'What can our records show?'}];
 const rows=storyEditorRows(original);
 assert.deepEqual(rows.map(r=>r.placement),['opening','lesson-1','lesson-2','lesson-3','lesson-4','reflection']);
 assert.equal(rows.length,6);assert.deepEqual(rows[0],original[0]);assert.deepEqual(rows[1],original[1]);assert.equal(rows[5].sceneId,'');
 assert.deepEqual(storyScenesFromEditor(rows),original);
 assert.deepEqual(storyScenesFromEditor(storyEditorRows([])),[]);
});

test('blank native-editor questions omit overrides and removing a scene removes its moment',()=>{
 const rows=storyEditorRows([{sceneId:'sl01',placement:'opening',character:'Together',question:'Old question'}]);
 rows[0].question='   ';
 assert.deepEqual(storyScenesFromEditor(rows),[{sceneId:'sl01',placement:'opening',character:'Together'}]);
 rows[0].sceneId='';rows[0].question='Retained locally while no scene is selected';
 assert.deepEqual(storyScenesFromEditor(rows),[]);
});

test('native story editor output rejects duplicate placements and values outside the backend contract',()=>{
 const row={placement:'opening',sceneId:'sl01',character:'Together',question:''};
 for(const bad of [[row,row],[{...row,placement:'private'}],[{...row,sceneId:'../sl01'}],[{...row,sceneId:'stories/sl01'}],[{...row,character:'Another mascot'}],[{...row,question:'x'.repeat(501)}],Array(7).fill(row)])assert.throws(()=>storyScenesFromEditor(bad));
 assert.equal(storyScenesFromEditor([{...row,question:'x'.repeat(500)}])[0].question.length,500);
});
