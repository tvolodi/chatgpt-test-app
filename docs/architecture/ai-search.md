# DOCUMENT_TYPE: AI_SEARCH
# VERSION: 1.0

## 1. Goals

Hybrid search (keyword + vector) with reliable, fresh embeddings.

## 2. Sources

- Primary content from Postgres/CMS.
- Public page HTML (for fallback crawling) if needed.

## 3. Pipeline

- Extract records -> clean -> embed -> upsert into vector store (pgvector/Qdrant).
- Store metadata (ids, language, url, updated_at) for filtering.
- Maintain keyword index (Postgres full-text) for hybrid queries.

## 4. Refresh & Quality

- Reindex on content change events and periodic full sweeps.
- Track embedding model/version; rerun on model upgrades.

## 5. Serving

- API combines keyword + vector; optional rerank.
- Return URLs and snippets aligned with canonical pages.

## 6. Notes for AI AGENTS

- Keep schema stable to avoid index churn.
- Document embedding cadence and triggers per domain.
