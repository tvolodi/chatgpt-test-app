# DOCUMENT_TYPE: MASTER_INDEX
# VERSION: 1.0

# AI-Dala Documentation Index

> **Entry point for AI Agents and Humans**. Use this index to navigate the documentation database.

---

## Quick Links

| Document | Purpose | Path |
|----------|---------|------|
| [AI-Agent-Rules](AI-Agent-Rules.md) | Development workflow & standards | `docs/AI-Agent-Rules.md` |
| [AI-Guide](AI-Guide.md) | Implementation guide | `docs/AI-Guide.md` |
| [Requirements Index](requirements/index.md) | All REQ-XXX documents | `docs/requirements/` |
| [Modules Index](modules/index.md) | All MOD-XXX documents | `docs/modules/` |
| [Tests Index](tests/index.md) | Test coverage & traceability | `docs/tests/` |
| [API Contract](contracts/openapi.yaml) | OpenAPI specification | `docs/contracts/` |

---

## Document Registries

### 1. Requirements (`docs/requirements/`)

See [requirements/index.md](requirements/index.md) for full list.

| Status | Count | Description |
|--------|-------|-------------|
| implemented | 15 | Ready for production |
| approved | 1 | Approved, awaiting implementation |
| draft | 1 | Under development |

**Next REQ Number**: REQ-018

### 2. Modules (`docs/modules/`)

See [modules/index.md](modules/index.md) for full list.

| Type | Count |
|------|-------|
| Backend (MOD-BE-*) | 2 |
| Frontend (MOD-FE-*) | 3 |

### 3. Tests (`docs/tests/`)

See [tests/index.md](tests/index.md) for full coverage matrix.

| Type | Count |
|------|-------|
| E2E (Playwright) | 23 |
| Backend Integration | 3 |
| Test Specs | 10 |

---

## Cross-Reference Map

### Requirement → Module → Test

```
REQ-001 (Login) ─────────────> MOD-BE-Auth ──────────> login.spec.ts
                └─────────────> MOD-FE-Login ─────────> req-001-token-refresh.spec.ts

REQ-007 (Tags) ──────────────> MOD-BE-Tags ──────────> tags.spec.ts
                └─────────────> MOD-FE-Tags

REQ-010 (Articles) ──────────> MOD-BE-Articles ──────> articles.spec.ts
                └─────────────> MOD-FE-Articles ──────> req-011-*.spec.ts
```

---

## Documentation Rules

1. **Atomic Documents**: Each REQ/MOD/Test is a separate file
2. **Index Maintenance**: Indexes MUST be updated when adding/modifying documents
3. **Cross-References**: Use REQ/MOD IDs for linking, not file paths
4. **Status Sync**: REQ status must match actual implementation state

---

## For AI Agents

### Finding Information

| Query | Where to Look |
|-------|---------------|
| "What's implemented?" | `requirements/index.md` → Status column |
| "Next REQ number?" | This file → "Next REQ Number" or scan `requirements/` |
| "Tests for REQ-015?" | `tests/index.md` → REQ Coverage column |
| "API for Articles?" | `contracts/openapi.yaml` or `modules/MOD-BE-Articles/` |

### Updating Documentation

After any implementation:
1. Update `requirements/index.md` status
2. Update `tests/index.md` if tests added
3. Update `modules/index.md` if module created
4. Update this file's counts if needed

---

**Last Updated**: 2025-11-29
