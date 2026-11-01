CREATE TABLE IF NOT EXISTS subscribers (
  email      TEXT PRIMARY KEY,
  blog       INTEGER NOT NULL DEFAULT 0,  -- 1 = wants blog post notifications
  eventos    INTEGER NOT NULL DEFAULT 0,  -- 1 = wants event/workshop notifications
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
