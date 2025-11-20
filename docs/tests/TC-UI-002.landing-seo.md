# DOCUMENT_TYPE: TEST_CASE
# TC_ID: TC-UI-002
# VERSION: 0.1

## 1. Summary

- Title: Landing SEO and metadata
- Type: ui
- Scope: REQ-003 (Landing)

## 2. Preconditions

- Landing page built; metadata configured.

## 3. Steps

1. Open `/`.
2. Inspect HTML head: title, meta description, canonical.
3. Inspect Open Graph/Twitter tags for title, description, image `/AI-Dala-logo.png`, URL `https://ai-dala.com/`.
4. Inspect JSON-LD schema for `WebSite`, `Organization`, `Person` entries.

## 4. Expected Results

- Title/description match requirement baseline.
- Canonical present and correct.
- OG/Twitter tags populated with logo image.
- Schema present with logo and URLs.

## 5. Traceability

- Requirements: REQ-003 (AC-5, AC-6, AC-7)
- Modules: MOD-FE-Landing

## 6. Notes

- Validate absence of duplicate/conflicting tags.*** End Patch
