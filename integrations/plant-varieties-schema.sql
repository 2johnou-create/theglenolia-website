-- Variety catalogue and immutable planting identity. Position keys are existing atlas keys.
-- Seedlings and planted trees are distinct facts: cataloguing a variety does not plant it.
CREATE TABLE IF NOT EXISTS edu_coffee_varieties (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL COLLATE NOCASE UNIQUE,
  source_url TEXT,
  identity_note TEXT NOT NULL DEFAULT '',
  traits TEXT NOT NULL DEFAULT '{}' CHECK(json_valid(traits)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS edu_coffee_plantings (
  id TEXT PRIMARY KEY NOT NULL,
  plant_key TEXT NOT NULL REFERENCES edu_atlas_positions(plant_key),
  variety_id TEXT NOT NULL REFERENCES edu_coffee_varieties(id),
  planted_on TEXT,
  recorded_at TEXT NOT NULL,
  recorded_by TEXT NOT NULL,
  ended_at TEXT,
  ended_by TEXT,
  replacement_reason TEXT,
  CHECK ((ended_at IS NULL AND ended_by IS NULL AND replacement_reason IS NULL)
     OR (ended_at IS NOT NULL AND ended_by IS NOT NULL AND length(trim(replacement_reason))>0))
);
CREATE UNIQUE INDEX IF NOT EXISTS edu_coffee_one_current_planting
  ON edu_coffee_plantings(plant_key) WHERE ended_at IS NULL;
CREATE INDEX IF NOT EXISTS edu_coffee_planting_history
  ON edu_coffee_plantings(plant_key, recorded_at);
INSERT OR IGNORE INTO edu_coffee_varieties(id,name,source_url,identity_note,traits,created_at,updated_at)
VALUES
 ('paraiso','Paraíso','https://varieties.worldcoffeeresearch.org/varieties/paraiso','Owner-confirmed pilot variety.','{}',strftime('%Y-%m-%dT%H:%M:%fZ','now'),strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 ('ipr107','IPR107','https://varieties.worldcoffeeresearch.org/varieties/ipr-107','Consultant recommended; reported as starting from seed on 17 October 2026.','{}',strftime('%Y-%m-%dT%H:%M:%fZ','now'),strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 ('nr25','NR25',NULL,'Consultant recommended; exact variety identity remains unconfirmed. Reported as starting from seed on 17 October 2026.','{}',strftime('%Y-%m-%dT%H:%M:%fZ','now'),strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 ('marsellesa','Marsellesa','https://varieties.worldcoffeeresearch.org/varieties/marsellesa','Consultant recommended; reported as starting from seed on 17 October 2026.','{}',strftime('%Y-%m-%dT%H:%M:%fZ','now'),strftime('%Y-%m-%dT%H:%M:%fZ','now'));
-- John confirmed P1-P27 as Paraíso. Positions are not equivalent to verified tags.
-- P1-P19 = row 1, P20-P27 = row 2 positions 1-8.
INSERT OR IGNORE INTO edu_coffee_plantings(id,plant_key,variety_id,planted_on,recorded_at,recorded_by)
SELECT 'owner-confirmed-2026-11-21-'||plant_key,plant_key,'paraiso','2026-11-01',
       strftime('%Y-%m-%dT%H:%M:%fZ','now'),'owner-confirmed 2026-11-21'
FROM edu_atlas_positions WHERE row_num=1 OR (row_num=2 AND position<=8);
