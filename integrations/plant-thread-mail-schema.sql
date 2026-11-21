-- Apply after the school threads and plant notifications schemas. Replayable.
-- Leaving the previous queue in place preserves pending jobs during rollout.
CREATE TABLE IF NOT EXISTS edu_plant_thread_mail_outbox (
 id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES edu_users(id),
 reference TEXT NOT NULL REFERENCES edu_plant_thread_messages(id),
 application_id TEXT NOT NULL REFERENCES edu_plant_applications(id),
 state TEXT NOT NULL DEFAULT 'pending' CHECK(state IN ('pending','sending','sent','cancelled','review')),
 run_after INTEGER NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, changed_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS edu_thread_mail_due ON edu_plant_thread_mail_outbox(state,run_after,id);
CREATE INDEX IF NOT EXISTS edu_thread_mail_recipient ON edu_plant_thread_mail_outbox(user_id,reference) WHERE state='pending';

CREATE TRIGGER IF NOT EXISTS edu_thread_email_reply AFTER INSERT ON edu_plant_thread_messages
WHEN NEW.side='farm'
BEGIN
 INSERT OR IGNORE INTO edu_plant_thread_mail_outbox(id,user_id,reference,application_id,run_after,changed_at)
 SELECT 'reply:'||NEW.id||':'||u.id,u.id,NEW.id,a.id,unixepoch(),unixepoch()
 FROM edu_plant_questions q JOIN edu_plant_applications a ON a.id=q.application_id
 JOIN edu_schools s ON s.id=a.workspace_id AND s.status<>'suspended'
 JOIN edu_plant_thread_follows f ON f.thread_id=q.id AND f.following=1
 JOIN edu_plant_members m ON m.org_id=a.workspace_id AND m.user_id=f.user_id
 JOIN edu_users u ON u.id=m.user_id AND u.disabled=0
 JOIN edu_teacher_preferences p ON p.user_id=u.id
 WHERE q.id=NEW.thread_id AND (a.status='active' OR (a.status='cooling' AND a.release_at>strftime('%Y-%m-%dT%H:%M:%fZ','now')))
 AND p.privacy_version='plant-privacy-2026-11-21' AND p.education_version='educational-use-2026-11-21'
 AND NOT EXISTS(SELECT 1 FROM edu_memberships x WHERE x.school_id=m.org_id AND x.user_id=m.user_id AND x.active=0);
END;
CREATE TRIGGER IF NOT EXISTS edu_thread_email_unfollow AFTER UPDATE OF following ON edu_plant_thread_follows
WHEN OLD.following=1 AND NEW.following=0
BEGIN
 UPDATE edu_plant_thread_mail_outbox SET state='cancelled',changed_at=unixepoch()
 WHERE state='pending' AND user_id=NEW.user_id AND reference IN
 (SELECT id FROM edu_plant_thread_messages WHERE thread_id=NEW.thread_id);
END;
