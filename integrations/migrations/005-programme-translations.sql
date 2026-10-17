-- Private, bounded translation reuse and attempt allowance. No subscriber data.
CREATE TABLE IF NOT EXISTS programme_translation_cache (
 cache_key TEXT PRIMARY KEY,
 translations_json TEXT NOT NULL,
 created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS programme_translation_cache_time ON programme_translation_cache(created_at);
CREATE TABLE IF NOT EXISTS programme_translation_attempts (
 id TEXT PRIMARY KEY,
 created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS programme_translation_attempts_time ON programme_translation_attempts(created_at);
