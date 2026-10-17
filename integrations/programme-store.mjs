/** Private D1 drafts and an explicitly published, allowlisted public projection.
 * Authentication, request-size/origin checks and response headers belong to the
 * caller. Every mutation requires an authenticated actor and optimistic revision.
 */
export const departmentIds = Object.freeze(['cafe', 'coffee', 'workshops', 'local']);
export const programmeLanguages = Object.freeze(['en', 'zh', 'ja']);
export const programmeStatuses = Object.freeze(['planning', 'developing', 'trialling', 'ready']);
export const trialStages = Object.freeze(['seed', 'germinating', 'seedling', 'grafting', 'growing', 'flowering', 'cherries', 'harvest']);
// Both tracks can advance through the full growing cycle; grafting is optional.
export const seedStages = trialStages;
const seedVarieties = ['IPR107', 'NR25', 'Marsellesa'];

export class ProgrammeError extends Error {
  constructor(status, code, path) {
    super(code);
    this.name = 'ProgrammeError';
    this.status = status;
    this.code = code;
    if (path) this.path = path;
  }
}
const invalid = path => { throw new ProgrammeError(400, 'invalid_programme', path); };
const unavailable = () => new ProgrammeError(503, 'programme_unavailable');
const conflict = () => new ProgrammeError(409, 'changed_elsewhere');
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value) && [Object.prototype, null].includes(Object.getPrototypeOf(value));
function fields(value, names, path) {
  if (!object(value) || Object.keys(value).length !== names.length || !names.every(key => Object.hasOwn(value, key))) invalid(path);
}
function text(value, maximum, path, required = false) {
  if (typeof value !== 'string') invalid(path);
  const result = value.trim().normalize('NFC');
  if ((required && !result) || [...result].length > maximum || /[<>\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(result) || /(?:[a-z][a-z\d+.-]*:\/\/|https?:|javascript:|data:|www\.|\/\/|\b(?:[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?\.)+[a-z]{2,63}(?:\b|\/))/iu.test(result)) invalid(path);
  return result;
}
function isoDate(value, path, clear = false) {
  if (clear && value === '') return '';
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) invalid(path);
  const parsed = new Date(value+'T00:00:00Z');
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) invalid(path);
  return value;
}
function revision(value) {
  if (!Number.isSafeInteger(value) || value < 0) invalid('expectedRevision');
  return value;
}
function editorialMeta(actor, now) {
  if (typeof actor !== 'string' || !actor.trim() || actor.length > 254 || /[<>\u0000-\u001f\u007f]/u.test(actor)) invalid('actor');
  const time = new Date(now ?? Date.now());
  if (!Number.isFinite(time.getTime())) invalid('now');
  const day = new Intl.DateTimeFormat('en-CA', {timeZone:'Australia/Sydney', year:'numeric', month:'2-digit', day:'2-digit'}).format(time);
  return {actor:actor.trim(), at:time.toISOString(), day};
}

/** Return a fresh safe document. Empty now/next fields are allowed in drafts. */
export function normaliseProgramme(value, {complete = false} = {}) {
  fields(value, ['version', 'updatedAt', 'departments', 'coffee'], 'programme');
  if (value.version !== 1) invalid('version');
  fields(value.departments, departmentIds, 'departments');
  const departments = {};
  for (const id of departmentIds) {
    const item = value.departments[id];
    fields(item, ['status', 'translations'], 'departments.'+id);
    if (!programmeStatuses.includes(item.status)) invalid('departments.'+id+'.status');
    fields(item.translations, programmeLanguages, 'departments.'+id+'.translations');
    const translations = {};
    for (const language of programmeLanguages) {
      const entry = item.translations[language], path = 'departments.'+id+'.translations.'+language;
      fields(entry, ['now', 'next', 'done'], path);
      if (!Array.isArray(entry.done) || entry.done.length > 4) invalid(path+'.done');
      translations[language] = {
        now:text(entry.now, 280, path+'.now', complete),
        next:text(entry.next, 280, path+'.next', complete),
        // Blank lines are a deliberate way to clear checklist items.
        done:entry.done.map((line, index) => text(line, 120, path+'.done.'+index)).filter(Boolean),
      };
    }
    if (complete && new Set(programmeLanguages.map(language => translations[language].done.length)).size !== 1) invalid('departments.'+id+'.translations.done');
    departments[id] = {status:item.status, translations};
  }
  const c = value.coffee;
  fields(c, ['seedVarieties', 'seedStage', 'trialName', 'trialStage', 'heightCm', 'observedOn'], 'coffee');
  if (!Array.isArray(c.seedVarieties) || c.seedVarieties.length !== 3 || c.seedVarieties.some((name, index) => name !== seedVarieties[index])) invalid('coffee.seedVarieties');
  if (!seedStages.includes(c.seedStage)) invalid('coffee.seedStage');
  if (c.trialName !== 'Paraíso') invalid('coffee.trialName');
  if (!trialStages.includes(c.trialStage)) invalid('coffee.trialStage');
  if (typeof c.heightCm !== 'number' || !Number.isFinite(c.heightCm) || c.heightCm < 0 || c.heightCm > 300) invalid('coffee.heightCm');
  return {version:1, updatedAt:isoDate(value.updatedAt, 'updatedAt'), departments, coffee:{seedVarieties:[...seedVarieties], seedStage:c.seedStage, trialName:'Paraíso', trialStage:c.trialStage, heightCm:c.heightCm, observedOn:isoDate(c.observedOn, 'coffee.observedOn', true)}};
}
export function validateProgramme(value, options) {
  try { normaliseProgramme(value, options); return true; } catch { return false; }
}
function initialDocument(initial) {
  if (initial === undefined || initial === null) return null;
  try { return normaliseProgramme(initial, {complete:true}); } catch { throw unavailable(); }
}
function storedDocument(json, complete = false) {
  try { return normaliseProgramme(JSON.parse(json), {complete}); } catch { throw unavailable(); }
}
function publicProjection(programme, publishedAt) {
  return {version:1, updatedAt:programme.updatedAt, publishedAt, departments:programme.departments, coffee:programme.coffee};
}
async function readState(db) {
  if (!db?.prepare) throw unavailable();
  try {
    return await db.prepare('SELECT draft_json,published_json,revision,published_revision,updated_at,published_at FROM programme_state WHERE id=1').first();
  } catch { throw unavailable(); }
}
function privateState(row, initial) {
  if (!row) {
    if (!initial) throw unavailable();
    return {draft:structuredClone(initial), published:structuredClone(initial), revision:0, publishedRevision:0, updatedAt:null, publishedAt:null};
  }
  return {draft:storedDocument(row.draft_json), published:row.published_json ? storedDocument(row.published_json, true) : initial ? structuredClone(initial) : null, revision:row.revision, publishedRevision:row.published_revision, updatedAt:row.updated_at, publishedAt:row.published_at};
}
export async function fetchProgramme(db, initial) {
  const baseline = initialDocument(initial);
  return privateState(await readState(db), baseline);
}
export async function fetchPublicProgramme(db, initial) {
  const baseline = initialDocument(initial);
  if (!db?.prepare) throw unavailable();
  let row;
  try { row = await db.prepare('SELECT published_json,published_at FROM programme_state WHERE id=1').first(); }
  catch { throw unavailable(); }
  const programme = row?.published_json ? storedDocument(row.published_json, true) : baseline;
  if (!programme) throw unavailable();
  return publicProjection(programme, row?.published_at ?? null);
}
function statement(db, sql, values) {
  try { return db.prepare(sql).bind(...values); } catch { throw unavailable(); }
}
async function atomicWrite(db, statement, audit, expected) {
  if (!db?.batch || !db?.prepare) throw unavailable();
  let results;
  try { results = await db.batch([statement, audit]); } catch { throw unavailable(); }
  if (Number(results?.[0]?.meta?.changes) !== 1) throw conflict();
  if (Number(results?.[1]?.meta?.changes) !== 1) throw unavailable();
  return expected;
}

/** Save a draft, retaining the last publication or reviewed initial baseline. */
export async function saveProgramme(db, input, {actor, now, initial} = {}) {
  fields(input, ['programme', 'expectedRevision'], 'input');
  const expected = revision(input.expectedRevision), programme = normaliseProgramme(input.programme), baseline = initialDocument(initial), meta = editorialMeta(actor, now);
  programme.updatedAt = meta.day;
  if (!db?.prepare) throw unavailable();
  const update = expected === 0
    ? statement(db, 'INSERT OR IGNORE INTO programme_state (id,draft_json,published_json,revision,published_revision,updated_at,published_at,updated_by,published_by) VALUES (1,?,?,1,0,?,NULL,?,NULL)', [JSON.stringify(programme), baseline ? JSON.stringify(baseline) : null, meta.at, meta.actor])
    : statement(db, 'UPDATE programme_state SET draft_json=?,revision=revision+1,updated_at=?,updated_by=? WHERE id=1 AND revision=?', [JSON.stringify(programme), meta.at, meta.actor, expected]);
  const audit = statement(db, "INSERT INTO programme_audit (action,revision,published_revision,actor,created_at) SELECT 'save',revision,published_revision,?,? FROM programme_state WHERE id=1 AND revision=? AND changes()=1", [meta.actor, meta.at, expected+1]);
  await atomicWrite(db, update, audit, expected+1);
  return fetchProgramme(db, baseline);
}

/** Publish only the saved, complete draft at the exact revision reviewed. */
export async function publishProgramme(db, {expectedRevision, actor, now, initial} = {}) {
  const expected = revision(expectedRevision), meta = editorialMeta(actor, now), baseline = initialDocument(initial);
  const state = privateState(await readState(db), baseline);
  if (state.revision !== expected) throw conflict();
  if (expected === 0) throw new ProgrammeError(409, 'save_before_publish');
  // Validation is repeated at the trust boundary; client-side checks are optional.
  normaliseProgramme(state.draft, {complete:true});
  if (state.publishedRevision === expected) return state;
  const update = statement(db, 'UPDATE programme_state SET published_json=draft_json,published_revision=revision,published_at=?,published_by=? WHERE id=1 AND revision=? AND published_revision<>revision', [meta.at, meta.actor, expected]);
  const audit = statement(db, "INSERT INTO programme_audit (action,revision,published_revision,actor,created_at) SELECT 'publish',revision,published_revision,?,? FROM programme_state WHERE id=1 AND revision=? AND published_revision=? AND changes()=1", [meta.actor, meta.at, expected, expected]);
  await atomicWrite(db, update, audit, expected);
  return fetchProgramme(db, baseline);
}
