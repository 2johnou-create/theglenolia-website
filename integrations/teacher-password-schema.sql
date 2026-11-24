CREATE TABLE IF NOT EXISTS edu_teacher_passwords (
 user_id TEXT PRIMARY KEY REFERENCES edu_users(id) ON DELETE CASCADE,
 salt TEXT NOT NULL,
 verifier TEXT NOT NULL,
 updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS edu_teacher_devices (
 hash TEXT PRIMARY KEY,
 user_id TEXT NOT NULL REFERENCES edu_users(id) ON DELETE CASCADE,
 expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS edu_teacher_devices_user ON edu_teacher_devices(user_id);

CREATE TABLE IF NOT EXISTS edu_teacher_access_links (
 hash TEXT PRIMARY KEY,
 email TEXT NOT NULL,
 purpose TEXT NOT NULL CHECK(purpose IN('setup','browser')),
 destination TEXT NOT NULL,
 password_salt TEXT,
 created_at INTEGER NOT NULL,
 expires_at INTEGER NOT NULL,
 mail_state TEXT NOT NULL DEFAULT 'pending' CHECK(mail_state IN('pending','accepted','rejected','needs_review')),
 redeemed_by TEXT
);
CREATE INDEX IF NOT EXISTS edu_teacher_access_links_email ON edu_teacher_access_links(email);
CREATE INDEX IF NOT EXISTS edu_teacher_access_links_expiry ON edu_teacher_access_links(expires_at);
