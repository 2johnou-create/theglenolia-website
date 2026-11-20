-- Additive migration for the education database. Physical plants are registered by farm staff.
CREATE TABLE IF NOT EXISTS edu_plants (
  plant_key TEXT PRIMARY KEY,
  row_num INTEGER NOT NULL CHECK(row_num IN (1,2)),
  position INTEGER NOT NULL CHECK(position BETWEEN 1 AND 19),
  tag TEXT NOT NULL COLLATE NOCASE UNIQUE,
  available INTEGER NOT NULL DEFAULT 1 CHECK(available IN (0,1)),
  verified_at TEXT NOT NULL,
  CHECK(plant_key = 'r' || row_num || '-p' || position),
  UNIQUE(row_num, position)
);
CREATE TABLE IF NOT EXISTS edu_plant_applications (
  id TEXT PRIMARY KEY,
  teacher_id TEXT NOT NULL REFERENCES edu_users(id),
  workspace_id TEXT NOT NULL REFERENCES edu_schools(id),
  school_name TEXT NOT NULL, suburb TEXT NOT NULL, school_type TEXT NOT NULL,
  preferred_key TEXT, plant_key TEXT REFERENCES edu_plants(plant_key),
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','offered','active','declined')),
  created_at TEXT NOT NULL, decided_at TEXT, accepted_at TEXT,
  CHECK((plant_key IS NOT NULL) = (status IN ('offered','active')))
);
CREATE UNIQUE INDEX IF NOT EXISTS edu_plant_one_open_application ON edu_plant_applications(teacher_id) WHERE status <> 'declined';
CREATE UNIQUE INDEX IF NOT EXISTS edu_plant_one_class ON edu_plant_applications(plant_key) WHERE status IN ('offered','active');
CREATE TABLE IF NOT EXISTS edu_plant_updates (
  id TEXT PRIMARY KEY, plant_key TEXT NOT NULL REFERENCES edu_plants(plant_key),
  observed_on TEXT NOT NULL, note TEXT NOT NULL, created_at TEXT NOT NULL,
  photo_mime TEXT, photo_bytes BLOB, request_hash TEXT NOT NULL, withdrawn INTEGER NOT NULL DEFAULT 0,
  CHECK((photo_mime IS NULL) = (photo_bytes IS NULL))
);
CREATE INDEX IF NOT EXISTS edu_plant_journal ON edu_plant_updates(plant_key,withdrawn,observed_on DESC,created_at DESC);
CREATE TABLE IF NOT EXISTS edu_plant_questions (
  id TEXT PRIMARY KEY, application_id TEXT NOT NULL REFERENCES edu_plant_applications(id),
  question TEXT NOT NULL, answer TEXT, created_at TEXT NOT NULL, answered_at TEXT
);
CREATE INDEX IF NOT EXISTS edu_plant_class_questions ON edu_plant_questions(application_id,created_at DESC);
