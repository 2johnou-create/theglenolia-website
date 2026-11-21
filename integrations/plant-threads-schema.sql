-- Apply after plant-adoption-schema.sql. Existing class questions stay with their original adoption.
CREATE TABLE IF NOT EXISTS edu_plant_thread_messages (
 id TEXT PRIMARY KEY, thread_id TEXT NOT NULL REFERENCES edu_plant_questions(id),
 side TEXT NOT NULL CHECK(side IN ('farm','school')), body TEXT NOT NULL,
 actor_id TEXT, created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS edu_plant_thread_posts ON edu_plant_thread_messages(thread_id,created_at,id);
CREATE TABLE IF NOT EXISTS edu_plant_thread_follows (
 thread_id TEXT NOT NULL REFERENCES edu_plant_questions(id),
 user_id TEXT NOT NULL REFERENCES edu_users(id),
 following INTEGER NOT NULL CHECK(following IN(0,1)), changed_at TEXT NOT NULL,
 PRIMARY KEY(thread_id,user_id)
);
-- Keep older, one-answer clients and their original replies readable.
INSERT OR IGNORE INTO edu_plant_thread_messages(id,thread_id,side,body,actor_id,created_at)
 SELECT q.id,q.id,'farm',q.answer,q.answered_by,COALESCE(q.answered_at,q.created_at)
 FROM edu_plant_questions q WHERE q.answer IS NOT NULL
 AND NOT EXISTS(SELECT 1 FROM edu_plant_thread_messages m WHERE m.thread_id=q.id AND m.side='farm');
CREATE TRIGGER IF NOT EXISTS edu_plant_legacy_reply AFTER UPDATE OF answer ON edu_plant_questions
WHEN NEW.answer IS NOT NULL AND OLD.answer IS NULL
 AND NOT EXISTS (SELECT 1 FROM edu_plant_thread_messages m WHERE m.thread_id=NEW.id AND m.side='farm')
BEGIN
 INSERT INTO edu_plant_thread_messages(id,thread_id,side,body,actor_id,created_at)
 VALUES(NEW.id,NEW.id,'farm',NEW.answer,NEW.answered_by,COALESCE(NEW.answered_at,NEW.created_at));
END;
CREATE TRIGGER IF NOT EXISTS edu_plant_thread_first_answer AFTER INSERT ON edu_plant_thread_messages
WHEN NEW.side='farm'
BEGIN
 UPDATE edu_plant_questions SET answer=NEW.body,answered_at=NEW.created_at,answered_by=NEW.actor_id
 WHERE id=NEW.thread_id AND answer IS NULL;
END;
