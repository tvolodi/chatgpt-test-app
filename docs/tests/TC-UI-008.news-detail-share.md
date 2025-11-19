# DOCUMENT_TYPE: TEST_CASE
# TC_ID: TC-UI-008
# VERSION: 0.1

## 1. Summary

- Title: News detail view and sharing
- Type: ui
- Scope: REQ-002 (AI News)

## 2. Preconditions

- A news item with slug exists in fixtures; detail page at `/news/[slug]` renders.

## 3. Steps

1. From list, click a news item to open `/news/[slug]`.
2. Verify title, published date, hero image (if provided), and rendered body (Markdown to HTML) are present.
3. Verify share buttons/links for Telegram and LinkedIn are visible and have correct href targets.
4. Check head tags: canonical `/news/[slug]`, OG/Twitter tags using item title/summary/image; JSON-LD `NewsArticle`.

## 4. Expected Results

- Detail page shows required fields and rendered body.
- Share buttons present with valid links.
- SEO metadata and schema for `NewsArticle` present and correct.

## 5. Traceability

- Requirements: REQ-002 (AC-9, AC-10, AC-11, AC-12)
- Modules: MOD-FE-News

## 6. Notes

- Ensure slug is lowercase/hyphenated and matches link from list.***
