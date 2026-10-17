CREATE TABLE IF NOT EXISTS programme_weather (
 id INTEGER PRIMARY KEY CHECK (id=1),
 payload TEXT,
 expires_at INTEGER NOT NULL DEFAULT 0,
 modified TEXT,
 fetched_at INTEGER NOT NULL DEFAULT 0,
 refresh_until INTEGER NOT NULL DEFAULT 0
);
