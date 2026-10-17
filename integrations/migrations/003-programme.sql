-- Owner-edited programme drafts are separate from the public projection.
CREATE TABLE IF NOT EXISTS programme_state (
 id INTEGER PRIMARY KEY CHECK(id = 1),
 draft_json TEXT NOT NULL,
 published_json TEXT,
 revision INTEGER NOT NULL CHECK(revision >= 1),
 published_revision INTEGER NOT NULL DEFAULT 0 CHECK(published_revision >= 0),
 updated_at TEXT NOT NULL,
 published_at TEXT,
 updated_by TEXT NOT NULL,
 published_by TEXT,
 CHECK(published_revision <= revision)
);
CREATE TABLE IF NOT EXISTS programme_audit (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 action TEXT NOT NULL CHECK(action IN ('save', 'publish')),
 revision INTEGER NOT NULL,
 published_revision INTEGER NOT NULL,
 actor TEXT NOT NULL,
 created_at TEXT NOT NULL
);
