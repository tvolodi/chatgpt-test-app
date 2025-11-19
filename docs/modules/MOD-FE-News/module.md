# DOCUMENT_TYPE: MODULE_INDEX
# MODULE_ID: MOD-FE-News
# MODULE_TYPE: frontend
# VERSION: 1.0

## 1. Meta

- Name: News (listing + detail)
- Owner: TBD
- Status: in_progress
- Tech Stack:
  - Language: TypeScript
  - Framework: Next.js (app router)
  - External Services: `/api/content/news` (fixtures/real CMS)

## 2. Linked Requirements

- REQ-002 (AI News page)

## 3. Endpoint / UI Artifacts

- ui-News-List (page `/news`)
- ui-News-Detail (page `/news/[slug]`)
- api content feeds: `/api/content/news`

## 4. Delivery, Rendering & Caching

- Rendering / delivery policy: ISR (list + detail)
- Revalidation / TTL (if SSG/ISR): 30m
- Cache headers / CDN policy: standard static cache with revalidate 30m; honor Next.js defaults.
- Dependencies that invalidate cache: content changes in news feed (CMS/fixtures).

## 5. Observability, QoS & Limits

- Metrics (p95 targets / SLIs): p95 < 500ms for list and detail under normal conditions.
- Logs (structure, PII handling): structured logs for fetch errors; avoid PII.
- Tracing (propagation): propagate request IDs; capture fetch spans.
- Rate limits: none for public pages; ensure API respects reasonable limits.
- Feature flags / kill switches: none initially.

## 6. Other Artifacts

- data-models.md (optional)
- tests.md

## 7. Notes for AI AGENTS

- Keep contracts in sync with content API shape (includes slug, summary, body MD).
- Document ISR choices and TTLs; align with ADR-0001.
