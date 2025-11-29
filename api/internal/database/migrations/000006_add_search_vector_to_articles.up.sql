-- Add search_vector column for full-text search
ALTER TABLE articles ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create GIN index for fast search
CREATE INDEX IF NOT EXISTS articles_search_idx ON articles USING GIN(search_vector);

-- Create trigger to automatically update search_vector
DROP TRIGGER IF EXISTS articles_search_update ON articles;
CREATE TRIGGER articles_search_update
  BEFORE INSERT OR UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION
    tsvector_update_trigger(search_vector, 'pg_catalog.english', title, body);