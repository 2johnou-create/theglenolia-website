CREATE TABLE IF NOT EXISTS edu_plant_stage_photos (
  plant_key TEXT NOT NULL REFERENCES edu_plants(plant_key),
  stage INTEGER NOT NULL CHECK(stage BETWEEN 1 AND 10),
  photo_mime TEXT NOT NULL,
  photo_bytes BLOB NOT NULL,
  recorded_at TEXT NOT NULL,
  recorded_by TEXT NOT NULL,
  PRIMARY KEY(plant_key,stage)
);
