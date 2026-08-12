-- One-time helper for "adopting" an existing D1 database.
--
-- Use this when your database already contains the schema/data (tables exist),
-- but Wrangler's migration history table is empty/missing, causing
-- `wrangler d1 migrations apply` to try re-applying old migrations.
--
-- Run (example):
--   npx wrangler d1 execute limosen-mock --remote --file ./scripts/adopt-d1-migrations.sql
--
-- IMPORTANT:
-- - This does NOT apply schema changes. It only marks migrations as already applied.
-- - Only list migrations that truly match the current remote schema.

CREATE TABLE IF NOT EXISTS d1_migrations(
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT UNIQUE,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Mark the existing baseline migrations as applied.
-- These are the historical Prisma "auto_migration" files that created/redefined the core schema.
INSERT OR IGNORE INTO d1_migrations (name) VALUES ('20260112003644_auto_migration.sql');
INSERT OR IGNORE INTO d1_migrations (name) VALUES ('20260112074300_auto_migration.sql');
INSERT OR IGNORE INTO d1_migrations (name) VALUES ('20260112095623_auto_migration.sql');
INSERT OR IGNORE INTO d1_migrations (name) VALUES ('20260112103419_auto_migration.sql');
INSERT OR IGNORE INTO d1_migrations (name) VALUES ('20260112110511_auto_migration.sql');

