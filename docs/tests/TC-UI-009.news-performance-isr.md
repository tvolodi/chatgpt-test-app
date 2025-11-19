# DOCUMENT_TYPE: TEST_CASE
# TC_ID: TC-UI-009
# VERSION: 0.1

## 1. Summary

- Title: News performance and ISR freshness
- Type: perf
- Scope: REQ-002 (AI News)

## 2. Preconditions

- News list and detail use ISR with 30m revalidate; content endpoints available.

## 3. Steps

1. Measure p95 TTFB+render for `/news` under normal conditions (e.g., Lighthouse/WebPageTest).
2. Measure p95 for `/news/[slug]`.
3. Simulate content update (e.g., change fixture timestamp) and verify ISR revalidation within <=30m for list and detail.

## 4. Expected Results

- p95 < 500ms for list and detail under normal conditions.
- ISR refreshes content on change or within 30m without manual intervention.

## 5. Traceability

- Requirements: REQ-002 (AC-4, AC-5, AC-11)
- Modules: MOD-FE-News

## 6. Notes

- Capture evidence/metrics for CI perf gate if available.***
