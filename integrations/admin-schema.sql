CREATE TABLE IF NOT EXISTS editions (
 id TEXT PRIMARY KEY,
 payload TEXT NOT NULL,
 revision INTEGER NOT NULL DEFAULT 1,
 updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS campaigns (
 edition_id TEXT NOT NULL,
 language TEXT NOT NULL,
 brevo_id INTEGER,
 phase TEXT NOT NULL CHECK(phase IN ('creating','scheduled','needs_review','awaiting_audience','paused_review','no_audience')),
 updated_at TEXT NOT NULL,
 PRIMARY KEY(edition_id,language)
);
