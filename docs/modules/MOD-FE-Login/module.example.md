# DOCUMENT_TYPE: MODULE_INDEX
# MODULE_ID: MOD-XXX
# MODULE_TYPE: backend | frontend | worker
# VERSION: 1.1

## 1. Meta

- Name:
- Owner:
- Status: in_progress | approved
- Tech Stack:
  - Language:
  - Framework:
  - Database:
  - External Services:

## 2. Linked Requirements

- REQ-...

## 3. Endpoint / UI Artifacts

- ep-...
- ui-...

## 4. Delivery, Rendering & Caching

- Rendering / delivery policy: SSG | ISR | SSR | client-only | API-only
- Revalidation / TTL (if SSG/ISR):
- Cache headers / CDN policy:
- Dependencies that invalidate cache:

## 5. Observability, QoS & Limits

- Metrics (p95 targets / SLIs):
- Logs (structure, PII handling):
- Tracing (propagation):
- Rate limits:
- Feature flags / kill switches:

## 6. Other Artifacts

- data-models.md
- tests.md

## 7. Notes for AI AGENTS

- Keep contracts in sync with OpenAPI/GraphQL specs under docs/contracts.
- Document caching/ISR choices before rollout.
