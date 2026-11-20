-- Additive, replayable migration on the education D1 after the plant tables.
-- The existing MET forecast cache reader is reused with a separate database.
CREATE TABLE IF NOT EXISTS programme_weather (
 id INTEGER PRIMARY KEY CHECK(id=1),
 payload TEXT,
 expires_at INTEGER NOT NULL DEFAULT 0,
 modified TEXT,
 fetched_at INTEGER NOT NULL DEFAULT 0,
 refresh_until INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS edu_plant_climate_cache (
 cache_key TEXT PRIMARY KEY,
 payload TEXT,
 through_date TEXT,
 fetched_at INTEGER NOT NULL DEFAULT 0,
 refresh_until INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS edu_plant_weather_logs (
 update_id TEXT PRIMARY KEY REFERENCES edu_plant_updates(id) ON DELETE CASCADE,
 payload TEXT NOT NULL CHECK(json_valid(payload))
);
