-- Binary pictures are immutable and private until an exact programme revision publishes.
CREATE TABLE IF NOT EXISTS programme_media (
 image_id TEXT PRIMARY KEY,
 department TEXT NOT NULL CHECK(department IN ('cafe','coffee','workshops','local')),
 mime TEXT NOT NULL CHECK(mime IN ('image/jpeg','image/webp')),
 width INTEGER NOT NULL CHECK(width BETWEEN 1 AND 1600),
 height INTEGER NOT NULL CHECK(height BETWEEN 1 AND 1600),
 byte_length INTEGER NOT NULL CHECK(byte_length BETWEEN 1 AND 307200),
 sha256 TEXT NOT NULL CHECK(length(sha256)=64),
 bytes BLOB NOT NULL CHECK(length(bytes)=byte_length),
 created_at TEXT NOT NULL,
 created_by TEXT NOT NULL,
 first_published_at TEXT
);
CREATE INDEX IF NOT EXISTS programme_media_private_age ON programme_media(first_published_at,created_at);
-- Bytes and their department never change, including after public cache retention.
CREATE TRIGGER IF NOT EXISTS programme_media_immutable BEFORE UPDATE OF image_id,department,mime,width,height,byte_length,sha256,bytes ON programme_media BEGIN SELECT RAISE(ABORT,'immutable programme image'); END;
CREATE TRIGGER IF NOT EXISTS programme_media_published_retention BEFORE DELETE ON programme_media WHEN OLD.first_published_at IS NOT NULL BEGIN SELECT RAISE(ABORT,'retain published programme image'); END;
CREATE TRIGGER IF NOT EXISTS programme_media_publication_monotonic BEFORE UPDATE OF first_published_at ON programme_media WHEN OLD.first_published_at IS NOT NULL AND NEW.first_published_at IS NOT OLD.first_published_at BEGIN SELECT RAISE(ABORT,'retain publication marker'); END;
