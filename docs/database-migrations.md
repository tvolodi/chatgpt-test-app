# Database Migrations

This document describes the database migration system used in the AI-Dala API project.

## Overview

We use [golang-migrate/migrate](https://github.com/golang-migrate/migrate) for database schema management. Migrations are automatically executed when the application starts.

## Migration Files

Migration files are located in two places:
- **Source**: `migrations/` - For development and version control
- **Embedded**: `internal/database/migrations/` - Embedded in the binary for production

Each migration consists of two files:
- `{timestamp}_{name}.up.sql` - Forward migration
- `{timestamp}_{name}.down.sql` - Rollback migration

### Example

```sql
-- 000001_create_tags_table.up.sql
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tags_code ON tags(code);
```

```sql
-- 000001_create_tags_table.down.sql
DROP TABLE IF EXISTS tags;
```

## Creating New Migrations

Use the Makefile command to create new migration files:

```bash
make migrate-create NAME=create_users_table
```

This will:
1. Create timestamped migration files in `migrations/`
2. Copy them to `internal/database/migrations/` for embedding
3. Generate template SQL with comments

## Migration Workflow

### Automatic Migrations (Production)

Migrations run automatically when the application starts:

```bash
go run main.go
# or
./bin/api
```

Output:
```
Running database migrations...
Current migration version: 1 (dirty: false)
Database migrations completed successfully
```

### Manual Migration Commands

While the application handles migrations automatically, you can also use these commands for development:

```bash
# Show current migration version
make migrate-version

# Create new migration
make migrate-create NAME=add_users_table
```

## Migration States

- **Version**: Current migration number (e.g., `1`, `2`, `3`)
- **Dirty**: Indicates if a migration failed mid-execution
  - `false`: Clean state, all migrations successful
  - `true`: Failed migration, manual intervention required

## Handling Failed Migrations

If a migration fails (dirty state):

1. **Check the error** in application logs
2. **Fix the SQL** in the migration file
3. **Rebuild** the application to embed the fixed migration
4. **Restart** the application

## Best Practices

### DO ✅
- **Always create both up and down migrations**
- **Test migrations locally before committing**
- **Use transactions where possible** (wrap in `BEGIN`/`COMMIT`)
- **Make migrations idempotent** (use `IF NOT EXISTS`, `IF EXISTS`)
- **Keep migrations small and focused**
- **Add comments** explaining complex migrations

### DON'T ❌
- **Don't modify existing migrations** after they've been deployed
- **Don't delete migration files**
- **Don't skip version numbers**
- **Don't put data migrations in schema migrations** (create separate migrations)

## Example Migrations

### Adding a Column

```sql
-- up
ALTER TABLE tags ADD COLUMN IF NOT EXISTS description TEXT;

-- down
ALTER TABLE tags DROP COLUMN IF EXISTS description;
```

### Creating an Index

```sql
-- up
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags USING GIN (name);

-- down
DROP INDEX IF EXISTS idx_tags_name;
```

### Data Migration

```sql
-- up
UPDATE tags SET name = '{"en": "Default"}' WHERE name = '{}';

-- down
-- Data migrations often can't be reversed
-- Document the original state or make it a no-op
```

## Troubleshooting

### Migration Not Running

**Problem**: New migration doesn't execute

**Solution**:
1. Check if migration files are in `internal/database/migrations/`
2. Rebuild the application to embed new migrations
3. Verify migration version is higher than current

### Dirty State

**Problem**: Migration failed, database in dirty state

**Solution**:
1. Check logs for the error
2. Fix the migration SQL
3. Rebuild and restart

### Version Mismatch

**Problem**: Application expects different version than database

**Solution**:
- Ensure all team members have latest migrations
- Check if migrations were added out of order
- Verify database is on correct version

## Architecture

```
┌─────────────────┐
│   Application   │
│     Startup     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ RunMigrations() │
│  (embedded FS)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │
│  schema_migrations │
└─────────────────┘
```

The `schema_migrations` table tracks which migrations have been applied.

## References

- [golang-migrate Documentation](https://github.com/golang-migrate/migrate)
- [PostgreSQL Best Practices](https://www.postgresql.org/docs/current/ddl.html)
- [ADR-0002: Database Localization](../architecture/ADR-0002.database-localization.md)
