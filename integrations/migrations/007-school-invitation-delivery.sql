CREATE TABLE IF NOT EXISTS school_invitation_deliveries (
  id TEXT PRIMARY KEY,
  school_id TEXT NOT NULL,
  school_name TEXT NOT NULL,
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT NOT NULL,
  scheduled_for TEXT,
  due_at INTEGER NOT NULL,
  phase TEXT NOT NULL CHECK (phase IN ('queued','sending','accepted','failed','needs_review','cancelled')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  message_id TEXT,
  reason TEXT
);

CREATE INDEX IF NOT EXISTS school_invitation_delivery_due
ON school_invitation_deliveries (phase,due_at);
CREATE UNIQUE INDEX IF NOT EXISTS school_invitation_delivery_in_flight
ON school_invitation_deliveries (school_id,recipient)
WHERE phase IN ('queued','sending','needs_review');
