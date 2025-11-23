ALTER TABLE articles ADD COLUMN IF NOT EXISTS slug TEXT;

-- Update existing records to have a temporary slug (we'll need to fix this in app logic or manual update if needed)
-- For now, we'll use the ID as a fallback to ensure uniqueness if there are existing records
UPDATE articles SET slug = id::text WHERE slug IS NULL;

ALTER TABLE articles ALTER COLUMN slug SET NOT NULL;
ALTER TABLE articles ADD CONSTRAINT articles_slug_key UNIQUE (slug);

CREATE INDEX idx_articles_slug ON articles(slug);
