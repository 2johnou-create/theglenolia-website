-- Additive; existing plants have no new readings until a farmer records them.
CREATE TABLE IF NOT EXISTS edu_plant_field_profiles (
  scope_key TEXT NOT NULL,
  plant_key TEXT REFERENCES edu_plants(plant_key),
  revision INTEGER NOT NULL CHECK (revision >= 1),
  snapshot TEXT NOT NULL CHECK (json_valid(snapshot)),
  recorded_at TEXT NOT NULL,
  recorded_by TEXT NOT NULL,
  PRIMARY KEY (scope_key, revision),
  CHECK ((scope_key='farm' AND plant_key IS NULL) OR (plant_key IS NOT NULL AND scope_key=plant_key))
);
CREATE TABLE IF NOT EXISTS edu_plant_fertiliser (
  id TEXT PRIMARY KEY NOT NULL,
  scope_key TEXT NOT NULL,
  plant_key TEXT REFERENCES edu_plants(plant_key),
  observed_on TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TEXT NOT NULL,
  created_by TEXT NOT NULL,
  withdrawn_at TEXT,
  withdrawn_by TEXT,
  withdrawal_reason TEXT,
  CHECK ((scope_key='farm' AND plant_key IS NULL) OR (plant_key IS NOT NULL AND scope_key=plant_key)),
  CHECK ((withdrawn_at IS NULL)=(withdrawn_by IS NULL) AND (withdrawn_at IS NULL)=(withdrawal_reason IS NULL))
);
CREATE INDEX IF NOT EXISTS edu_plant_fertiliser_history ON edu_plant_fertiliser(scope_key,withdrawn_at,observed_on DESC,created_at DESC);
