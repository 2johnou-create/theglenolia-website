CREATE TABLE IF NOT EXISTS owner_notifications (
 subscriber_key TEXT PRIMARY KEY,
 phase TEXT NOT NULL CHECK(phase IN ('baseline','pending','sending','sent','needs_review')),
 request_id TEXT NOT NULL,
 detected_at TEXT NOT NULL,
 first_attempt_at INTEGER,
 last_attempt_at INTEGER,
 message_id TEXT,
 reason TEXT
);
