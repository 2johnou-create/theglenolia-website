CREATE TABLE IF NOT EXISTS edu_plant_class_preferences (
  user_id TEXT PRIMARY KEY REFERENCES edu_users(id) ON DELETE CASCADE,
  band TEXT NOT NULL CHECK (band IN ('','ES1','S1','S2','S3','S4','S5')),
  interests TEXT NOT NULL,
  skipped INTEGER NOT NULL CHECK (skipped IN (0,1)),
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS edu_plant_class_feedback (
  user_id TEXT NOT NULL REFERENCES edu_users(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  band TEXT NOT NULL,
  topic TEXT NOT NULL,
  format TEXT NOT NULL,
  PRIMARY KEY(user_id,month)
);
CREATE TABLE IF NOT EXISTS edu_plant_class_monthly (
  month TEXT PRIMARY KEY,
  topic TEXT NOT NULL,
  band TEXT NOT NULL,
  format TEXT NOT NULL,
  votes INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  published_at TEXT
);
CREATE INDEX IF NOT EXISTS edu_plant_class_feedback_month ON edu_plant_class_feedback(month);
