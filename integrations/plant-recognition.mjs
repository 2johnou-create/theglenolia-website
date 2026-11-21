import {all,fail,json,SECURITY} from './education-common.mjs';
import {orgMember} from './plant-organisation.mjs';
import {renderRecognition} from './recognition-art.mjs';

const files=[
 ['certificate.pdf','School care certificate','A4 landscape PDF','application/pdf'],
 ['feed.png','School announcement','1080 × 1350 PNG','image/png'],
 ['story.png','Classroom story','1080 × 1920 PNG','image/png'],
 ['landscape.png','School newsletter image','1920 × 1080 PNG','image/png'],
 ['captions.txt','Suggested captions and alt text','Text file','text/plain; charset=utf-8']
];
const columns=`w.application_id AS id,w.school_name AS schoolName,w.plant_key AS plantKey,w.accepted_at AS acceptedAt,w.edition,
 CASE WHEN a.status='cooling' AND a.release_at<=strftime('%Y-%m-%dT%H:%M:%fZ','now') THEN 'released' ELSE a.status END AS status`;
const tables=' FROM edu_plant_awards w JOIN edu_plant_applications a ON a.id=w.application_id ';
const staffRoot='/api/education/plants/recognition',teacherRoot='/api/plants/recognition';
function manifest(row,base) {
 const [,r,p]=/^r(\d+)-p(\d+)$/.exec(row.plantKey);
 const plantLabel='P'+((Number(r)-1)*19+Number(p));
 return {...row,plantLabel,files:files.map(([filename,label,format])=>({label,format,url:base+'/'+row.id+'/'+filename}))};
}
function attachment(award,filename,bytes,mime) {
 return new Response(bytes instanceof Uint8Array || bytes instanceof ArrayBuffer ? bytes : new Uint8Array(bytes),{headers:{
  ...SECURITY,'X-Robots-Tag':'noindex, nofollow','Content-Type':mime,
  'Content-Disposition':'attachment; filename="The-Glenolia-'+award.plantLabel+'-'+filename+'"'
 }});
}
export async function recognitionRoute(request,env,path,actor=null) {
 const staff=!actor,root=staff?'/plants/recognition':teacherRoot,base=staff?staffRoot:teacherRoot;
 if(path!==root&&!path.startsWith(root+'/'))return null;
 if(request.method!=='GET')fail(405,'method');
 const db=env.EDU_DB;
 if(staff&&path===root) {
  const rows=await all(db.prepare('SELECT '+columns+tables+'ORDER BY w.school_name COLLATE NOCASE,w.accepted_at DESC,w.application_id'));
  return json({awards:rows.map(row=>manifest(row,base))});
 }
 const suffix=path.slice(root.length);
 const parts=suffix ? suffix.slice(1).split('/') : [];
 if(parts.length!==0&&parts.length!==2)fail(404,'not_found');
 const id=parts.length?parts[0]:new URL(request.url).searchParams.get('applicationId');
 if(!/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(id||''))fail(404,'not_found');
 const file=parts.length?files.find(f=>f[0]===parts[1]):null;
 if(parts.length&&!file)fail(404,'not_found');
 const access=staff?'':" AND w.org_id IN ("+orgMember+") AND (a.status='active' OR (a.status='cooling' AND a.release_at>strftime('%Y-%m-%dT%H:%M:%fZ','now')))";
 const row=await db.prepare('SELECT '+columns+tables+' WHERE w.application_id=?'+access).bind(...(staff?[id]:[id,actor.id])).first();
 if(!row)fail(404,'not_found');
 const award=manifest(row,base);
 if(!file)return json({award});
 const [filename,,,mime]=file;
 const cached=await db.prepare('SELECT bytes FROM edu_plant_award_files WHERE application_id=? AND filename=?').bind(id,filename).first();
 if(cached)return attachment(award,filename,cached.bytes,mime);
 const rendered=await renderRecognition(env,award,filename);
 const saved=await db.prepare('INSERT OR IGNORE INTO edu_plant_award_files(application_id,filename,bytes) VALUES(?,?,?)').bind(id,filename,rendered).run();
 if(saved.meta.changes)return attachment(award,filename,rendered,mime);
 // Preserve the winner of simultaneous first downloads.
 const stored=await db.prepare('SELECT bytes FROM edu_plant_award_files WHERE application_id=? AND filename=?').bind(id,filename).first();
 return attachment(award,filename,stored.bytes,mime);
}
