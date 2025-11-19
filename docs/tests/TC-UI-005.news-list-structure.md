# DOCUMENT_TYPE: TEST_CASE
# TC_ID: TC-UI-005
# VERSION: 0.1

## 1. Summary

- Title: News list structure and ordering
- Type: ui
- Scope: REQ-002 (AI News)

## 2. Preconditions

- News page available at `/news`; API `/api/content/news` returns fixtures with required fields.

## 3. Steps

1. Open `/news`.
2. Assert list shows 10 items (page size) ordered by `published_at` desc (most recent first).
3. For each item: title, summary, published date, link present; link targets `/news/[slug]`.
4. Verify hero/nav/footer landmarks are present (semantic).

## 4. Expected Results

- Exactly 10 items on initial load, sorted newest first.
- Each item displays required fields and valid links.
- Page landmarks exist for accessibility.

## 5. Traceability

- Requirements: REQ-002 (AC-1, AC-2, AC-7, AC-9)
- Modules: MOD-FE-News

## 6. Notes

- For sorting, compare visible dates against fixture data.***
