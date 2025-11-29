# DOCUMENT_TYPE: MODULES_INDEX
# VERSION: 1.0

# Module Specifications Index

> Registry of all technical module specifications (MOD-*).

---

## 1. Backend Modules (MOD-BE-*)

| MOD_ID | Title | Related REQs | Path |
|--------|-------|--------------|------|
| MOD-BE-Auth | Authentication Module | REQ-001 | `MOD-BE-Auth/` |
| MOD-BE-Tags | Tags Backend Module | REQ-007 | `MOD-BE-Tags/` |

### Module Details

#### MOD-BE-Auth
- **Purpose**: Keycloak integration, JWT validation, session management
- **Location**: `api/internal/auth/`
- **Requirements**: REQ-001 (Login)
- **Tests**: `login.spec.ts`, `req-001-token-refresh.spec.ts`

#### MOD-BE-Tags
- **Purpose**: Tag CRUD operations, database schema
- **Location**: `api/internal/modules/tags/`
- **Requirements**: REQ-007 (Tag Entity)
- **Tests**: `tags.spec.ts`, `repository_integration_test.go`

---

## 2. Frontend Modules (MOD-FE-*)

| MOD_ID | Title | Related REQs | Path |
|--------|-------|--------------|------|
| MOD-FE-Articles | Articles UI Components | REQ-010, REQ-011, REQ-012, REQ-013 | `MOD-FE-Articles.md` |
| MOD-FE-Login | Login UI Components | REQ-001 | `MOD-FE-Login/` |
| MOD-FE-News | News UI Components | REQ-002 | `MOD-FE-News/` |

### Module Details

#### MOD-FE-Articles
- **Purpose**: Article list, editor, viewer components
- **Location**: `web/src/app/[locale]/dashboard/articles/`, `web/src/app/[locale]/articles/`
- **Requirements**: REQ-010, REQ-011, REQ-012, REQ-013
- **Tests**: `articles.spec.ts`, `req-011-*.spec.ts`, `req-012-*.spec.ts`, `req-013-*.spec.ts`

#### MOD-FE-Login
- **Purpose**: Login page, auth flow UI
- **Location**: `web/src/app/[locale]/login/`
- **Requirements**: REQ-001
- **Tests**: `login.spec.ts`

#### MOD-FE-News
- **Purpose**: News list and detail pages
- **Location**: `web/src/app/[locale]/news/`
- **Requirements**: REQ-002
- **Tests**: `news.spec.ts`

---

## 3. Implied Modules (Not Yet Documented)

These modules exist in code but lack formal MOD-* documentation:

| Implied Module | Location | Should Document? |
|----------------|----------|------------------|
| Categories Backend | `api/internal/modules/categories/` | Yes |
| Articles Backend | `api/internal/modules/articles/` | Yes |
| Comments Backend | `api/internal/modules/comments/` | Yes |
| Search Backend | `api/internal/modules/articles/` (search) | Yes |
| Dashboard Layout | `web/src/app/[locale]/dashboard/` | Optional |
| Landing Page | `web/src/app/[locale]/` | Optional |

---

## 4. Module → Requirement Traceability

| Module | Requirements |
|--------|--------------|
| MOD-BE-Auth | REQ-001 |
| MOD-BE-Tags | REQ-007 |
| MOD-FE-Articles | REQ-010, REQ-011, REQ-012, REQ-013 |
| MOD-FE-Login | REQ-001 |
| MOD-FE-News | REQ-002 |

---

## 5. For AI Agents

### When to Create a Module Spec

Create MOD-* when:
- Implementing a new backend module with 3+ files
- Creating a shared frontend component system
- The module will be referenced by multiple REQs

### Module Spec Template Location

See `docs/modules/MOD-TEMPLATE.md` (if exists) or use existing MOD-* as reference.

### Updating This Index

After creating a new module:
1. Add entry to Section 1 or 2 table
2. Add details subsection
3. Update Section 4 traceability
4. Update `docs/index.md` counts

---

**Last Updated**: 2025-11-29
