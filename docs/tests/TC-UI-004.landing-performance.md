# DOCUMENT_TYPE: TEST_CASE
# TC_ID: TC-UI-004
# VERSION: 0.1

## 1. Summary

- Title: Landing performance and ISR freshness
- Type: perf
- Scope: REQ-003 (Landing)

## 2. Preconditions

- Landing deployed with ISR revalidate 30m; fixtures available.

## 3. Steps

1. Measure initial page load (TTFB + render) under normal conditions (e.g., Lighthouse or WebPageTest).
2. Verify ISR revalidation runs within <=30m when content is updated (simulate by changing fixture or timestamp).

## 4. Expected Results

- p95 initial load < 500ms under normal conditions.
- Content blocks (news/articles) refresh on change or after 30m without manual intervention.

## 5. Traceability

- Requirements: REQ-003 (AC-5, AC-6)
- Modules: MOD-FE-Landing

## 6. Notes

- Capture metrics and include evidence in CI perf checks if available.*** End Patch" json? wrong. Need no json. undo. apply_patch fail. need rerun proper. Let's ensure string patch. Let's call apply_patch with string. Let's resend using plain text starting with *** Begin Patch etc. Let's do correct. 
