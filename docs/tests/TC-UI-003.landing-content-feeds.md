# DOCUMENT_TYPE: TEST_CASE
# TC_ID: TC-UI-003
# VERSION: 0.1

## 1. Summary

- Title: Landing news and articles blocks (fixtures)
- Type: ui
- Scope: REQ-001 (Landing)

## 2. Preconditions

- Fixture endpoints `/api/content/news` and `/api/content/articles` available and return valid JSON.

## 3. Steps

1. Open `/`.
2. Assert Latest articles renders 2-3 cards with title, summary, link, updated date.
3. Assert AI News renders 3-5 items with title, summary, link, published date.
4. Validate card links and dates match fixture data.

## 4. Expected Results

- Articles and News sections render within required counts; data matches fixture payloads.
- No empty or error states; links are valid hrefs.

## 5. Traceability

- Requirements: REQ-001 (AC-3, AC-5, AC-6, AC-10, AC-11)
- Modules: MOD-FE-Landing

## 6. Notes

- Can be automated with contract mocks or by hitting local fixture endpoints.*** End Patch
