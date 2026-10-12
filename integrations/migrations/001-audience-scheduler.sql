ALTER TABLE campaigns RENAME TO campaigns_before_audience_scheduler;
CREATE TABLE IF NOT EXISTS campaigns (
 edition_id TEXT NOT NULL,
 language TEXT NOT NULL,
 brevo_id INTEGER,
 phase TEXT NOT NULL CHECK(phase IN ('creating','scheduled','needs_review','awaiting_audience','paused_review','no_audience')),
 updated_at TEXT NOT NULL,
 PRIMARY KEY(edition_id,language)
);

INSERT INTO campaigns SELECT * FROM campaigns_before_audience_scheduler;
