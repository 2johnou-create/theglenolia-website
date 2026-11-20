-- Apply to the education D1 database after plant-schema.sql, as one transactional file.
-- Widen the legacy field-register constraint while retaining its keys, unique tags,
-- availability, verification dates and all foreign keys from offers and journals.
PRAGMA defer_foreign_keys = ON;
CREATE TABLE edu_atlas_verified_copy AS
  SELECT plant_key,row_num,position,tag,available,verified_at FROM edu_plants;
DROP TABLE edu_plants;
CREATE TABLE edu_plants (
  plant_key TEXT PRIMARY KEY,
  row_num INTEGER NOT NULL CHECK(row_num BETWEEN 1 AND 12),
  position INTEGER NOT NULL CHECK(position BETWEEN 1 AND 19),
  tag TEXT NOT NULL COLLATE NOCASE UNIQUE,
  available INTEGER NOT NULL DEFAULT 1 CHECK(available IN (0,1)),
  verified_at TEXT NOT NULL,
  CHECK(plant_key = 'r' || row_num || '-p' || position),
  UNIQUE(row_num,position)
);
INSERT INTO edu_plants(plant_key,row_num,position,tag,available,verified_at)
  SELECT plant_key,row_num,position,tag,available,verified_at FROM edu_atlas_verified_copy;
DROP TABLE edu_atlas_verified_copy;

-- Atlas positions are illustration settings. A verified physical tag remains a separate record.
CREATE TABLE IF NOT EXISTS edu_atlas_rows (
  row_num INTEGER PRIMARY KEY CHECK(row_num BETWEEN 1 AND 12),
  enabled_count INTEGER NOT NULL CHECK(enabled_count BETWEEN 0 AND 19),
  revision INTEGER NOT NULL DEFAULT 1 CHECK(revision >= 1)
);
CREATE TABLE IF NOT EXISTS edu_atlas_positions (
  plant_key TEXT PRIMARY KEY,
  row_num INTEGER NOT NULL REFERENCES edu_atlas_rows(row_num),
  position INTEGER NOT NULL CHECK(position BETWEEN 1 AND 19),
  stage INTEGER NOT NULL CHECK(stage BETWEEN 1 AND 10),
  revision INTEGER NOT NULL DEFAULT 1 CHECK(revision >= 1),
  CHECK(plant_key = 'r' || row_num || '-p' || position),
  UNIQUE(row_num,position)
);
WITH RECURSIVE numbers(n) AS (VALUES(1) UNION ALL SELECT n+1 FROM numbers WHERE n<12)
INSERT OR IGNORE INTO edu_atlas_rows(row_num,enabled_count)
  SELECT n,MAX(CASE n WHEN 1 THEN 19 WHEN 2 THEN 8 ELSE 0 END,
    COALESCE((SELECT MAX(position) FROM edu_plants WHERE row_num=n),0)) FROM numbers;
WITH RECURSIVE numbers(n) AS (VALUES(1) UNION ALL SELECT n+1 FROM numbers WHERE n<19)
INSERT OR IGNORE INTO edu_atlas_positions(plant_key,row_num,position,stage)
  SELECT 'r'||r.row_num||'-p'||n,r.row_num,n,
    CASE WHEN r.row_num=1 OR (r.row_num=2 AND n<=8) OR EXISTS
      (SELECT 1 FROM edu_plants p WHERE p.row_num=r.row_num AND p.position=n)
    THEN 2 ELSE 1 END
  FROM edu_atlas_rows r CROSS JOIN numbers;
