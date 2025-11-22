# ADR-0002: Database Localization Strategy

## Status
Accepted

## Context
The application requires localization for system directory items such as Tags and Categories. These entities typically have a small number of text fields (e.g., `name`) that need to be presented in multiple languages (EN, RU, KK). We need a standard approach for storing these translations in the PostgreSQL database.

## Decision
We will use **PostgreSQL JSONB columns** to store localized text for simple entities.

For an entity like `Tag`, instead of a separate `tag_translations` table, we will use a `name` column of type `JSONB`.

### Schema Example
```sql
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Data Structure
The JSONB column will store keys as ISO language codes and values as the translated text.
```json
{
  "en": "Technology",
  "ru": "Технологии",
  "kk": "Технологиялар"
}
```

## Consequences

### Pros
*   **Simplicity**: No need for complex joins (e.g., `JOIN tag_translations`) for every fetch.
*   **Performance**: Faster reads for simple lookups.
*   **Flexibility**: Easy to add new languages without schema migrations.
*   **Frontend Alignment**: Maps easily to frontend i18n structures.

### Cons
*   **Query Complexity**: Searching for a specific translated value requires JSONB operators (e.g., `name->>'en' ILIKE '%tech%'`).
*   **Integrity**: Database doesn't strictly enforce that "en" exists (though check constraints can be added if needed).

## Alternatives Considered
*   **Separate Translation Table**: Better for entities with many localized fields or strict referential integrity needs, but overkill for simple "lookup" tables like Tags.
*   **Column per Language**: (`name_en`, `name_ru`) requires schema changes for every new language. Rejected due to lack of flexibility.
