# DOCUMENT_TYPE: TEST_CASE
# TC_ID: TC-UI-006
# VERSION: 0.1

## 1. Summary

- Title: News filters and load more
- Type: ui
- Scope: REQ-002 (AI News)

## 2. Preconditions

- News page `/news` available; fixtures contain items in each category (“OpenAI”, “Tools”, “Market”, “AI-Dala updates”) totaling at least 30 items.

## 3. Steps

1. Open `/news`.
2. Click "Load more" twice until at least 30 items are loaded; confirm items increase in multiples of 10.
3. Select each filter pill; ensure list updates to items matching that category; click "Load more" to fetch more within the filtered set.

## 4. Expected Results

- Load more fetches next 10 items per click until 30 items are shown.
- Filters constrain results to category; load more respects filter.
- No duplicate items; ordering remains newest first within filter.

## 5. Traceability

- Requirements: REQ-002 (AC-2, AC-3, AC-4)
- Modules: MOD-FE-News

## 6. Notes

- Validate that filters are toggleable and only one is active at a time (if multi-select not supported).***
