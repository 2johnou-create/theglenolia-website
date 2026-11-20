-- Apply after the plant-organisation migration. Safe to replay with existing consent and dispatch records.
CREATE TABLE IF NOT EXISTS edu_auth_codes (
  token_hash TEXT PRIMARY KEY REFERENCES edu_auth_tokens(hash) ON DELETE CASCADE,
  verifier TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0 CHECK(attempts BETWEEN 0 AND 5)
);
CREATE INDEX IF NOT EXISTS edu_auth_browser_challenge ON edu_auth_tokens(email,browser_hash,created_at DESC);

CREATE TABLE IF NOT EXISTS edu_teacher_preferences (
  user_id TEXT PRIMARY KEY REFERENCES edu_users(id),
  privacy_version TEXT NOT NULL, education_version TEXT NOT NULL,
  immediate INTEGER NOT NULL CHECK(immediate IN (0,1)),
  monthly INTEGER NOT NULL CHECK(monthly IN (0,1)),
  updated_at TEXT NOT NULL, source TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS edu_teacher_consent_history (
  id INTEGER PRIMARY KEY, user_id TEXT NOT NULL REFERENCES edu_users(id),
  privacy_version TEXT NOT NULL, education_version TEXT NOT NULL,
  immediate INTEGER NOT NULL, monthly INTEGER NOT NULL, changed_at TEXT NOT NULL, source TEXT NOT NULL
);
CREATE TRIGGER IF NOT EXISTS edu_teacher_consent_created AFTER INSERT ON edu_teacher_preferences
BEGIN
  INSERT INTO edu_teacher_consent_history(user_id,privacy_version,education_version,immediate,monthly,changed_at,source)
  VALUES(NEW.user_id,NEW.privacy_version,NEW.education_version,NEW.immediate,NEW.monthly,NEW.updated_at,NEW.source);
END;
CREATE TRIGGER IF NOT EXISTS edu_teacher_consent_changed AFTER UPDATE ON edu_teacher_preferences
WHEN OLD.privacy_version<>NEW.privacy_version OR OLD.education_version<>NEW.education_version OR OLD.immediate<>NEW.immediate OR OLD.monthly<>NEW.monthly
BEGIN
  INSERT INTO edu_teacher_consent_history(user_id,privacy_version,education_version,immediate,monthly,changed_at,source)
  VALUES(NEW.user_id,NEW.privacy_version,NEW.education_version,NEW.immediate,NEW.monthly,NEW.updated_at,NEW.source);
END;
CREATE TABLE IF NOT EXISTS edu_plant_mail_outbox (
  id TEXT PRIMARY KEY, kind TEXT NOT NULL CHECK(kind IN ('update','monthly','invite')),
  user_id TEXT, reference TEXT NOT NULL, application_id TEXT,
  state TEXT NOT NULL DEFAULT 'pending' CHECK(state IN ('pending','sending','sent','cancelled','review')),
  run_after INTEGER NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, changed_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS edu_plant_mail_due ON edu_plant_mail_outbox(state,run_after,id);
CREATE TABLE IF NOT EXISTS edu_plant_mail_periods(period TEXT PRIMARY KEY,queued_at TEXT NOT NULL);
CREATE TRIGGER IF NOT EXISTS edu_plant_mail_new_observation AFTER INSERT ON edu_plant_updates
WHEN NEW.withdrawn=0
BEGIN
  INSERT OR IGNORE INTO edu_plant_mail_outbox(id,kind,user_id,reference,application_id,run_after,changed_at)
  SELECT 'update:'||NEW.id||':'||m.user_id,'update',m.user_id,NEW.id,a.id,unixepoch(),unixepoch()
  FROM edu_plant_applications a JOIN edu_plant_organisations o ON o.id=a.workspace_id
  JOIN edu_plant_members m ON m.org_id=o.id JOIN edu_teacher_preferences p ON p.user_id=m.user_id
  JOIN edu_schools s ON s.id=o.id JOIN edu_users u ON u.id=m.user_id
  WHERE a.plant_key=NEW.plant_key AND a.status='active' AND s.status<>'suspended' AND u.disabled=0 AND p.immediate=1
    AND NOT EXISTS(SELECT 1 FROM edu_memberships x WHERE x.school_id=m.org_id AND x.user_id=m.user_id AND x.active=0);
END;
CREATE TRIGGER IF NOT EXISTS edu_plant_mail_invitation AFTER INSERT ON edu_plant_invitations
WHEN NEW.status='pending'
BEGIN
  INSERT OR IGNORE INTO edu_plant_mail_outbox(id,kind,reference,run_after,changed_at)
  VALUES('invite:'||NEW.id,'invite',NEW.id,unixepoch(),unixepoch());
END;
CREATE TRIGGER IF NOT EXISTS edu_plant_mail_opt_out AFTER UPDATE OF immediate,monthly ON edu_teacher_preferences
BEGIN
  UPDATE edu_plant_mail_outbox SET state='cancelled',changed_at=unixepoch() WHERE user_id=NEW.user_id AND state='pending'
    AND ((kind='update' AND NEW.immediate=0) OR (kind='monthly' AND NEW.monthly=0));
END;
