# DOCUMENT_TYPE: TEST_CASE
# TC_ID: TC-UI-007
# VERSION: 0.1

## 1. Summary

- Title: News list SEO and structured data
- Type: ui
- Scope: REQ-002 (AI News)

## 2. Preconditions

- News page `/news` built with metadata configured.

## 3. Steps

1. Open `/news`.
2. Validate head tags: title "AI-Dala News | Latest updates"; description "Stay current with AI-Dala updates, OpenAI news, tools, and market insights."; canonical `https://ai-dala.com/news`.
3. Validate OG/Twitter tags use same title/description and an image (logo or provided).
4. Validate JSON-LD schema includes `CollectionPage` with `ItemList` entries pointing to news items.

## 4. Expected Results

- Title/description/canonical/OG/Twitter tags present and correct.
- JSON-LD present and valid with list/schema types.

## 5. Traceability

- Requirements: REQ-002 (AC-6, AC-8, AC-12)
- Modules: MOD-FE-News

## 6. Notes

- Verify no duplicate/conflicting meta tags.***
