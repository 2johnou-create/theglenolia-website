CREATE TABLE IF NOT EXISTS edu_coffee_bulk_requests (
  request_id TEXT PRIMARY KEY,
  fingerprint TEXT NOT NULL,
  plant_count INTEGER NOT NULL CHECK(plant_count>0),
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS edu_plant_replacement_reviews (
  request_id TEXT PRIMARY KEY,
  old_planting_id TEXT NOT NULL REFERENCES edu_coffee_plantings(id),
  new_planting_id TEXT NOT NULL REFERENCES edu_coffee_plantings(id),
  application_id TEXT REFERENCES edu_plant_applications(id),
  removed_confirmed INTEGER NOT NULL CHECK(removed_confirmed=1),
  replanted_confirmed INTEGER NOT NULL CHECK(replanted_confirmed=1),
  adoption_reviewed INTEGER NOT NULL CHECK(adoption_reviewed IN (0,1)),
  adoption_outcome TEXT,
  recorded_at TEXT NOT NULL,
  recorded_by TEXT NOT NULL,
  old_stage INTEGER NOT NULL CHECK(old_stage BETWEEN 1 AND 10),
  new_stage INTEGER NOT NULL CHECK(new_stage BETWEEN 1 AND 10),
  CHECK((application_id IS NULL AND adoption_reviewed=0 AND adoption_outcome IS NULL)
     OR (application_id IS NOT NULL AND adoption_reviewed=1 AND adoption_outcome='continue'))
);
CREATE TABLE IF NOT EXISTS edu_stage_photo_archive (
  planting_id TEXT NOT NULL REFERENCES edu_coffee_plantings(id),
  stage INTEGER NOT NULL,
  photo_mime TEXT NOT NULL,
  photo_bytes BLOB NOT NULL,
  recorded_at TEXT NOT NULL,
  recorded_by TEXT NOT NULL,
  PRIMARY KEY(planting_id,stage)
);
-- Existing records are associated with the planting in place when the feature is enabled.
ALTER TABLE edu_plant_updates ADD COLUMN planting_id TEXT REFERENCES edu_coffee_plantings(id);
ALTER TABLE edu_plant_field_profiles ADD COLUMN planting_id TEXT REFERENCES edu_coffee_plantings(id);
UPDATE edu_plant_updates SET planting_id=(SELECT id FROM edu_coffee_plantings p WHERE p.plant_key=edu_plant_updates.plant_key AND p.ended_at IS NULL);
UPDATE edu_plant_field_profiles SET planting_id=(SELECT id FROM edu_coffee_plantings p WHERE p.plant_key=edu_plant_field_profiles.plant_key AND p.ended_at IS NULL) WHERE plant_key IS NOT NULL;
ALTER TABLE edu_plant_fertiliser ADD COLUMN planting_id TEXT REFERENCES edu_coffee_plantings(id);
UPDATE edu_plant_fertiliser SET planting_id=(SELECT id FROM edu_coffee_plantings p WHERE p.plant_key=edu_plant_fertiliser.plant_key AND p.ended_at IS NULL) WHERE plant_key IS NOT NULL;

-- Source-backed catalogue facts are variety characteristics, not farm observations.
UPDATE edu_coffee_varieties SET traits='{"stature":"Compact","leafTip":"Green","beanSize":"Large","firstFruit":"Year 3","ripening":"Average","nutrition":"High"}'
 WHERE id='paraiso' AND traits='{}';
UPDATE edu_coffee_varieties SET traits='{"stature":"Compact","leafTip":"Green or bronze","beanSize":"Large","yieldPotential":"High","firstFruit":"Year 3","ripening":"Early","rust":"Highly resistant","nutrition":"High"}'
 WHERE id='ipr107' AND traits='{}';
UPDATE edu_coffee_varieties SET traits='{"stature":"Compact","leafTip":"Green","beanSize":"Average","yieldPotential":"High","firstFruit":"Year 3","ripening":"Average","rust":"Intermediate resistance","nutrition":"High"}'
 WHERE id='marsellesa' AND traits='{}';
