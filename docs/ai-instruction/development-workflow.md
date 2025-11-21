# DOCUMENT_TYPE: DEVELOPMENT_WORKFLOW
# VERSION: 1.0

## 1. Purpose

Practical guardrails and ready-to-use pre-prompts for AI agents that implement features, test them, and keep the documentation system consistent.

## 2. Roles

- **Business analyst (human)**: Owns and updates `docs/requirements/REQ-*`.
- **AI agent (Codex)**: Implements code, tests, and documentation changes while preserving end-to-end traceability.



### 3.3 Documentation Integrity Prompt (before handoff/PR)

> You are ensuring docs and traceability stay consistent.  
> 1) Update requirement links in module docs and endpoint/UI specs; reflect status changes.  
> 2) If contracts changed, sync OpenAPI, regenerate stubs/SDKs, and note versions.  
> 3) Capture rendering/cache choices per route (per ADR-0001) and any new ADRs/decisions.  
> 4) Update test index/module test docs with added/modified cases.  
> 5) Note observability additions (metrics/logs/traces/alerts) per `docs/infrastructure/monitoring.md`.  
> 6) Summarize what changed and what was not done; call out follow-ups clearly.

## 4. Common Workflow

Proposed workflow tailored to your docs and role split (BA owns REQ-*, AI agent builds + tests + docs):

Source of truth & intake: Use the product brief only for high-level context and feature slots (F*, KPIs, constraints); keep it light and current (docs/product/brief.md (line 6), docs/product/brief.md (line 32), docs/product/brief.md (line 71)). BA drafts/updates requirements in docs/requirements/ and updates the index so traceability stays green (docs/requirements/REQ-001.login.example.md (line 5), docs/requirements/index.example.md (line 6)). Each new requirement must carry acceptance criteria, NFR hooks, and links to modules/tests.

Design before build: For new scope, the AI agent creates/updates module indexes and endpoint/UI specs before coding (e.g., docs/modules/MOD-BE-Auth/module.example.md (line 6), docs/modules/MOD-BE-Auth/ep-EP-Login.example.md (line 6), docs/modules/MOD-FE-Login/ui-UI-Login-Screen.example.md (line 6)). Map each feature to rendering mode per ADR-0001 and record TTL/invalidations (docs/adr/ADR-0001-ssr-ssg-isr.md (line 11), docs/modules/MOD-BE-Auth/module.example.md (line 26)). Keep runtime flows aligned when auth or rendering changes (docs/architecture/runtime-flows.md (line 4)).

Contract-first: Treat docs/contracts/openapi.yaml as the API contract. For any backend change, update the contract first, generate stubs/SDKs, and then implement to avoid drift (docs/infrastructure/ci-cd.md (line 6), docs/infrastructure/ci-cd.md (line 7)).

Identity alignment: When implementing auth flows, sync client IDs, redirects, and token lifetimes with Keycloak config (docs/identity/keycloak-config.md (line 5)). Revalidate flows against runtime docs (docs/architecture/runtime-flows.md (line 10)) and the login endpoint spec (docs/modules/MOD-BE-Auth/ep-EP-Login.example.md (line 8)).

Performance/security baked in: Pull relevant NFRs into the design/DoD up front (e.g., login p95 <500ms and secure password hashing, docs/requirements/REQ-010.performance-login.example.md (line 16), docs/requirements/REQ-011.security-password-storage.example.md (line 16)). Make sure module specs and tests cite these IDs so regressions are caught.

Testing strategy: Keep the test index current and mirror it in CI (unit/func/e2e per docs/tests/index.example.md (line 6)). Each endpoint/UI spec should list its required test cases; add or update them alongside code. Reference acceptance criteria directly in test names or descriptions.

Observability and SLOs: For each module/endpoint, define metrics, logs, tracing, and rate limits in the module docs (docs/modules/MOD-BE-Auth/module.example.md (line 33)) and keep them consistent with the monitoring guide (docs/infrastructure/monitoring.md (line 4)). Capture any new alert/SLO targets when NFRs are added.

Delivery pipeline: Enforce CI gates in this order: format/lint/typecheck → contract validation/codegen → unit/functional/component → image build → deploy → smoke tests (docs/infrastructure/ci-cd.md (line 4)). Document image tags/env and follow the Hetzner deploy playbook for every release (docs/infrastructure/hetzner-deployment.md (line 7)).

AI search considerations: When adding content/features that affect search, update the embedding/indexing plan and triggers so freshness rules stay explicit (docs/architecture/ai-search.md (line 13), docs/architecture/ai-search.md (line 19)).

Documentation maintenance loop: Every change should land with updated requirement links, module specs, contracts, and tests. If a decision shifts architecture or rendering, add/modify an ADR and adjust system/runtime docs (docs/architecture/system-context.md (line 8), docs/architecture/runtime-flows.md (line 27)).

Suggested cadence: BA proposes/updates REQs → AI agent drafts/updates module + contract + test specs → review (traceability + ADR impact) → implement with tests → CI/CD run → update docs (requirements index, module status, test index) → deploy and log observability deltas.
