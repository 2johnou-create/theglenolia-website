-- Replayable on the education database after plant-adoption-schema.sql.
CREATE TABLE IF NOT EXISTS edu_plant_awards (
 application_id TEXT PRIMARY KEY REFERENCES edu_plant_applications(id),
 org_id TEXT NOT NULL REFERENCES edu_plant_organisations(id),
 school_name TEXT NOT NULL, plant_key TEXT NOT NULL,
 accepted_at TEXT NOT NULL, edition INTEGER NOT NULL DEFAULT 1 CHECK(edition>0)
);
CREATE TABLE IF NOT EXISTS edu_plant_award_files (
 application_id TEXT NOT NULL REFERENCES edu_plant_awards(application_id),
 filename TEXT NOT NULL, bytes BLOB NOT NULL,
 PRIMARY KEY(application_id,filename)
);
CREATE TRIGGER IF NOT EXISTS edu_plant_award_on_accept
AFTER UPDATE OF status ON edu_plant_applications
WHEN NEW.status='active' AND NEW.accepted_at IS NOT NULL AND NEW.plant_key IS NOT NULL
BEGIN
 INSERT OR IGNORE INTO edu_plant_awards(application_id,org_id,school_name,plant_key,accepted_at)
 SELECT NEW.id,NEW.workspace_id,o.name,NEW.plant_key,NEW.accepted_at FROM edu_plant_organisations o WHERE o.id=NEW.workspace_id;
END;
-- For an earlier acceptance the application school name is the historical record.
INSERT OR IGNORE INTO edu_plant_awards(application_id,org_id,school_name,plant_key,accepted_at)
SELECT a.id,a.workspace_id,a.school_name,a.plant_key,a.accepted_at FROM edu_plant_applications a
WHERE a.accepted_at IS NOT NULL AND a.plant_key IS NOT NULL AND a.status IN ('active','cooling','released');
