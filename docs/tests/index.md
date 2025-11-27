# DOCUMENT_TYPE: TEST_INDEX
# VERSION: 1.0

## 1. E2E Test Files (Playwright)

| Test File | REQ Coverage | Description |
|-----------|--------------|-------------|
| `login.spec.ts` | REQ-001 | Keycloak login flow |
| `req-001-token-refresh.spec.ts` | REQ-001 | Token refresh mechanism |
| `landing.spec.ts` | REQ-003 | Landing page structure |
| `dashboard.spec.ts` | REQ-004 | Dashboard layout |
| `sidebar-navigation.spec.ts` | REQ-005 | Sidebar navigation |
| `multilanguage.spec.ts` | REQ-006 | Language switching |
| `language-switching-fixes.spec.ts` | REQ-006 | Language persistence |
| `news.spec.ts` | REQ-002 | News page |
| `tags.spec.ts` | REQ-007, REQ-008 | Tag CRUD operations |
| `categories.spec.ts` | REQ-009 | Category management |
| `articles.spec.ts` | REQ-010 | Article CRUD operations |
| `req-011-article-paste.spec.ts` | REQ-011 | Rich text editor features |
| `req-011-active-state.spec.ts` | REQ-011 | Toolbar active states |
| `req-011-cancel-warning.spec.ts` | REQ-011 | Cancel with unsaved changes |
| `req-011-loading-errors.spec.ts` | REQ-011 | Loading and error states |
| `req-011-sidebar-navigation.spec.ts` | REQ-011 | Sidebar during edit |
| `req-011-unsaved-warning.spec.ts` | REQ-011 | Unsaved changes warning |
| `req-012-public-articles.spec.ts` | REQ-012 | Public article list |
| `req-013-article-view.spec.ts` | REQ-013 | Article detail view |
| `req-013-article-filters.spec.ts` | REQ-013 | Category/tag filtering |
| `req-013-authenticated-comments.spec.ts` | REQ-013 | Comment functionality |

## 2. Backend Integration Tests (Go)

| Test File | Module | Description |
|-----------|--------|-------------|
| `repository_integration_test.go` | tags | Tag CRUD |
| `repository_integration_test.go` | categories | Category CRUD |
| `repository_integration_test.go` | articles | Article CRUD |

## 3. Test Case Specifications

| TC_ID         | Type       | Scope / Title                          | Modules            | Requirements             | File                                          |
|---------------|------------|----------------------------------------|--------------------|--------------------------|-----------------------------------------------|
| TC-UI-001     | ui         | Landing page structure and nav         | MOD-FE-Landing     | REQ-003                  | TC-UI-001.landing-structure.md                |
| TC-UI-002     | ui         | Landing SEO and metadata               | MOD-FE-Landing     | REQ-003                  | TC-UI-002.landing-seo.md                      |
| TC-UI-003     | ui         | Landing news/articles fixtures         | MOD-FE-Landing     | REQ-003                  | TC-UI-003.landing-content-feeds.md            |
| TC-UI-004     | perf       | Landing performance and ISR freshness  | MOD-FE-Landing     | REQ-003                  | TC-UI-004.landing-performance.md              |
| TC-UI-005     | ui         | News list structure and ordering       | MOD-FE-News        | REQ-002                  | TC-UI-005.news-list-structure.md              |
| TC-UI-006     | ui         | News filters and load more             | MOD-FE-News        | REQ-002                  | TC-UI-006.news-filters-pagination.md          |
| TC-UI-007     | ui         | News list SEO and structured data      | MOD-FE-News        | REQ-002                  | TC-UI-007.news-seo.md                         |
| TC-UI-008     | ui         | News detail view and sharing           | MOD-FE-News        | REQ-002                  | TC-UI-008.news-detail-share.md                |
| TC-UI-009     | perf       | News performance and ISR freshness     | MOD-FE-News        | REQ-002                  | TC-UI-009.news-performance-isr.md             |
| TC-UNIT-002   | unit       | API Authentication (JWT/Bcrypt)        | MOD-BE-Auth        | REQ-001                  | TC-UNIT-002.api-auth.md                       |

## 4. Test Coverage Summary

| REQ ID | E2E Tests | Backend Tests | Coverage |
|--------|-----------|---------------|----------|
| REQ-001 | 2 | 1 | ✅ Good |
| REQ-002 | 1 | 0 | 🟡 Partial |
| REQ-003 | 1 | 0 | ✅ Good |
| REQ-004 | 1 | 0 | ✅ Good |
| REQ-005 | 1 | 0 | ✅ Good |
| REQ-006 | 2 | 0 | ✅ Good |
| REQ-007 | 1 | 1 | ✅ Good |
| REQ-008 | 1 | 0 | ✅ Good |
| REQ-009 | 1 | 1 | ✅ Good |
| REQ-010 | 1 | 1 | ✅ Good |
| REQ-011 | 6 | 0 | ✅ Excellent |
| REQ-012 | 1 | 0 | 🟡 Partial |
| REQ-013 | 3 | 0 | 🟡 Partial |