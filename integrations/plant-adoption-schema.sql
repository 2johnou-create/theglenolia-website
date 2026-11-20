-- Apply once, after plant-atlas-schema.sql, as one D1 transaction.
-- Keep existing application IDs and question foreign keys, and leave every plant journal in place.
PRAGMA defer_foreign_keys=ON;
CREATE TABLE edu_plant_organisations (
 id TEXT PRIMARY KEY REFERENCES edu_schools(id), master_id TEXT NOT NULL REFERENCES edu_users(id),
 name TEXT NOT NULL, suburb TEXT NOT NULL, school_type TEXT NOT NULL,
 address TEXT NOT NULL DEFAULT '', public_name INTEGER NOT NULL DEFAULT 0 CHECK(public_name IN (0,1)),
 logo_mime TEXT,logo_bytes BLOB, revision INTEGER NOT NULL DEFAULT 1,
 created_at TEXT NOT NULL, changed_by TEXT,transfer_note TEXT,
 CHECK((logo_mime IS NULL)=(logo_bytes IS NULL))
);
CREATE UNIQUE INDEX edu_plant_school_address ON edu_plant_organisations(lower(trim(name)),lower(trim(address)),lower(trim(suburb))) WHERE address<>'';
-- Retain former names so renaming a profile cannot create another three slots for that campus.
CREATE TABLE edu_plant_school_names (
 name_key TEXT NOT NULL,suburb_key TEXT NOT NULL,org_id TEXT NOT NULL REFERENCES edu_plant_organisations(id),
 PRIMARY KEY(name_key,suburb_key)
);
CREATE TABLE edu_plant_members (
 org_id TEXT NOT NULL REFERENCES edu_plant_organisations(id),user_id TEXT NOT NULL REFERENCES edu_users(id),
 joined_at TEXT NOT NULL, PRIMARY KEY(org_id,user_id)
);
CREATE INDEX edu_plant_member_user ON edu_plant_members(user_id,org_id);
CREATE TABLE edu_plant_invitations (
 id TEXT PRIMARY KEY,org_id TEXT NOT NULL REFERENCES edu_plant_organisations(id),email TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN('pending','accepted','declined','revoked','expired')),
 created_at TEXT NOT NULL,expires_at TEXT NOT NULL,changed_by TEXT NOT NULL
);
CREATE UNIQUE INDEX edu_plant_invitation_pending ON edu_plant_invitations(org_id,email) WHERE status='pending';
CREATE INDEX edu_plant_invited_email ON edu_plant_invitations(email,status,expires_at);
CREATE TABLE edu_plant_events (
 id INTEGER PRIMARY KEY, org_id TEXT NOT NULL REFERENCES edu_plant_organisations(id), application_id TEXT,
 plant_key TEXT, action TEXT NOT NULL,actor_id TEXT,related_user_id TEXT, reason TEXT NOT NULL DEFAULT '',created_at TEXT NOT NULL
);
CREATE INDEX edu_plant_org_history ON edu_plant_events(org_id,id DESC);
-- Existing educators retain their programme access without sharing their personal planning workspace.
INSERT INTO edu_plant_organisations(id,master_id,name,suburb,school_type,created_at)
 SELECT workspace_id, teacher_id,school_name,suburb,school_type,created_at FROM
 (SELECT a.*,ROW_NUMBER() OVER(PARTITION BY workspace_id ORDER BY created_at,id) AS first_teacher FROM edu_plant_applications a)
 WHERE first_teacher=1;
INSERT INTO edu_plant_members SELECT workspace_id,teacher_id,MIN(created_at) FROM edu_plant_applications GROUP BY workspace_id,teacher_id;
INSERT OR IGNORE INTO edu_plant_school_names SELECT lower(trim(name)),lower(trim(suburb)),id
 FROM edu_plant_organisations ORDER BY created_at,id;
CREATE TABLE edu_plant_application_v2_copy AS SELECT * FROM edu_plant_applications;
DROP TABLE edu_plant_applications;
CREATE TABLE edu_plant_applications (
 id TEXT PRIMARY KEY,teacher_id TEXT NOT NULL REFERENCES edu_users(id),workspace_id TEXT NOT NULL REFERENCES edu_schools(id),
 school_name TEXT NOT NULL, suburb TEXT NOT NULL, school_type TEXT NOT NULL, preferred_key TEXT,
 plant_key TEXT REFERENCES edu_plants(plant_key),
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','offered','active','declined','cooling','released')),
 created_at TEXT NOT NULL,decided_at TEXT,accepted_at TEXT, reason TEXT NOT NULL DEFAULT '',
 withdrawal_reason TEXT, release_at TEXT,released_at TEXT,changed_by TEXT,
 CHECK((plant_key IS NOT NULL)=(status IN ('offered','active','cooling','released'))),
 CHECK(status<>'cooling' OR (release_at IS NOT NULL AND withdrawal_reason IS NOT NULL))
);
INSERT INTO edu_plant_applications(id,teacher_id,workspace_id,school_name,suburb,school_type,preferred_key,plant_key,status,created_at,decided_at,accepted_at)
 SELECT id,teacher_id,workspace_id,school_name,suburb,school_type,preferred_key,plant_key,status,created_at,decided_at,accepted_at FROM edu_plant_application_v2_copy;
DROP TABLE edu_plant_application_v2_copy;
CREATE UNIQUE INDEX edu_plant_one_class ON edu_plant_applications(plant_key) WHERE status IN('offered','active','cooling');
CREATE INDEX edu_plant_org_status ON edu_plant_applications(workspace_id,status);
CREATE INDEX edu_plant_release_schedule ON edu_plant_applications(release_at) WHERE status='cooling';
INSERT INTO edu_plant_events(org_id,application_id,plant_key,action,actor_id,created_at)
 SELECT workspace_id,id,plant_key,'legacy_'||status,teacher_id,COALESCE(accepted_at,decided_at,created_at) FROM edu_plant_applications;
CREATE TRIGGER edu_plant_school_capacity BEFORE INSERT ON edu_plant_applications
 WHEN NEW.status IN ('pending','offered','active','cooling') AND
 (SELECT COUNT(*) FROM edu_plant_applications WHERE workspace_id=NEW.workspace_id AND status IN('pending','offered','active','cooling'))>=3
 BEGIN SELECT RAISE(ABORT,'plant_school_limit'); END;
CREATE TRIGGER edu_plant_apply_log AFTER INSERT ON edu_plant_applications
 BEGIN
 INSERT INTO edu_plant_events(org_id,application_id,plant_key,action,actor_id,reason,created_at)
 SELECT NEW.workspace_id,NEW.id,NEW.preferred_key,'applied',NEW.teacher_id,NEW.reason,NEW.created_at
 WHERE EXISTS(SELECT 1 FROM edu_plant_organisations WHERE id=NEW.workspace_id);
 END;
CREATE TRIGGER edu_plant_state_log AFTER UPDATE OF status ON edu_plant_applications WHEN OLD.status<>NEW.status
 BEGIN
 INSERT INTO edu_plant_events(org_id,application_id,plant_key,action,actor_id,reason,created_at)
 VALUES(NEW.workspace_id,NEW.id,COALESCE(NEW.plant_key,OLD.plant_key),CASE WHEN OLD.status='cooling' AND NEW.status='active' THEN 'withdrawal_cancelled' WHEN NEW.status='cooling' THEN 'withdrawal_requested' WHEN OLD.status='offered' AND NEW.status='pending' THEN 'offer_withdrawn' ELSE NEW.status END,NEW.changed_by,COALESCE(NEW.withdrawal_reason,''),strftime('%Y-%m-%dT%H:%M:%fZ','now'));
 END;
CREATE TRIGGER edu_plant_org_log AFTER INSERT ON edu_plant_organisations BEGIN
 INSERT INTO edu_plant_school_names VALUES(lower(trim(NEW.name)),lower(trim(NEW.suburb)),NEW.id);
 INSERT INTO edu_plant_members VALUES(NEW.id,NEW.master_id,NEW.created_at);
 INSERT INTO edu_plant_events(org_id,action,actor_id,created_at) VALUES(NEW.id,'organisation_registered',NEW.master_id,NEW.created_at);
 END;
CREATE TRIGGER edu_plant_org_rename AFTER UPDATE OF name ON edu_plant_organisations WHEN OLD.name<>NEW.name BEGIN
 INSERT INTO edu_plant_school_names(name_key,suburb_key,org_id) SELECT lower(trim(NEW.name)),lower(trim(NEW.suburb)),NEW.id
 WHERE NOT EXISTS(SELECT 1 FROM edu_plant_school_names WHERE name_key=lower(trim(NEW.name)) AND suburb_key=lower(trim(NEW.suburb)) AND org_id=NEW.id);
END;
CREATE TRIGGER edu_plant_org_edit AFTER UPDATE ON edu_plant_organisations BEGIN
 INSERT INTO edu_plant_events(org_id,action,actor_id,related_user_id,reason,created_at) VALUES(NEW.id,
 CASE WHEN OLD.master_id<>NEW.master_id THEN 'lead_teacher_transferred'
 WHEN OLD.logo_bytes IS NOT NEW.logo_bytes THEN 'logo_updated' ELSE 'organisation_updated' END,NEW.changed_by,
 CASE WHEN OLD.master_id<>NEW.master_id THEN NEW.master_id END,
 CASE WHEN OLD.master_id<>NEW.master_id THEN COALESCE(NEW.transfer_note,'') ELSE '' END,strftime('%Y-%m-%dT%H:%M:%fZ','now'));
 END;
CREATE TRIGGER edu_plant_invite_log AFTER INSERT ON edu_plant_invitations BEGIN
 INSERT INTO edu_plant_events(org_id,action,actor_id,reason,created_at) VALUES(NEW.org_id,'teacher_invited',NEW.changed_by,NEW.email,NEW.created_at);
 END;
CREATE TRIGGER edu_plant_invite_status AFTER UPDATE OF status ON edu_plant_invitations WHEN NEW.status<>OLD.status BEGIN
 INSERT INTO edu_plant_events(org_id,action,actor_id,reason,created_at) VALUES(NEW.org_id,'invitation_'||NEW.status,NEW.changed_by,NEW.email,strftime('%Y-%m-%dT%H:%M:%fZ','now'));
 INSERT INTO edu_plant_members(org_id,user_id,joined_at) SELECT NEW.org_id,NEW.changed_by,strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE NEW.status='accepted' ON CONFLICT DO NOTHING;
 END;
CREATE TRIGGER edu_plant_member_removed AFTER DELETE ON edu_plant_members BEGIN
 INSERT INTO edu_plant_events(org_id,action,actor_id,reason,created_at)
 SELECT id,'teacher_removed',master_id,OLD.user_id,strftime('%Y-%m-%dT%H:%M:%fZ','now') FROM edu_plant_organisations WHERE id=OLD.org_id;
 END;

ALTER TABLE edu_plant_questions ADD COLUMN submitted_by TEXT;
ALTER TABLE edu_plant_questions ADD COLUMN answered_by TEXT;
ALTER TABLE edu_plant_updates ADD COLUMN posted_by TEXT;
ALTER TABLE edu_plant_updates ADD COLUMN withdrawn_by TEXT;
ALTER TABLE edu_plant_updates ADD COLUMN withdrawn_at TEXT;
CREATE TRIGGER edu_plant_question_log AFTER INSERT ON edu_plant_questions BEGIN
 INSERT INTO edu_plant_events(org_id,application_id,plant_key,action,actor_id,created_at)
 SELECT workspace_id,id,plant_key,'question_submitted',NEW.submitted_by,NEW.created_at FROM edu_plant_applications WHERE id=NEW.application_id;
END;
CREATE TRIGGER edu_plant_answer_log AFTER UPDATE OF answer ON edu_plant_questions WHEN OLD.answer IS NOT NEW.answer BEGIN
 INSERT INTO edu_plant_events(org_id,application_id,plant_key,action,actor_id,created_at)
 SELECT workspace_id,id,plant_key,'question_answered',NEW.answered_by,NEW.answered_at FROM edu_plant_applications WHERE id=NEW.application_id;
END;
