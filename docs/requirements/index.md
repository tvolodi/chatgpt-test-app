# DOCUMENT_TYPE: REQUIREMENTS_INDEX
# VERSION: 1.3

> Overview of all requirements, pointing to individual files.

## 1. Requirements List

| REQ_ID   | Title                        | Type           | Priority | Status      | File                           |
|----------|------------------------------|----------------|----------|-------------|--------------------------------|
| REQ-001  | User login via Keycloak      | functional     | high     | implemented | REQ-001.login.md               |
| REQ-002  | AI News page                 | functional     | medium   | partial     | REQ-002.AI-news-page.md        |
| REQ-003  | Site landing page (public)   | functional     | high     | implemented | REQ-003.site-landing-page.md   |
| REQ-004  | User Dashboard Layout        | functional     | high     | implemented | REQ-004.dashboard.md           |
| REQ-005  | Dashboard Sidebar Navigation | functional     | high     | implemented | REQ-005.dashboard-sidebar.md   |
| REQ-006  | Multilanguage Support (i18n) | functional     | high     | partial     | REQ-006.multilanguage.md       |
| REQ-007  | Tag Entity (Backend)         | functional     | medium   | implemented | REQ-007.tag.entity.md          |
| REQ-008  | Tag Management UI            | functional     | medium   | implemented | REQ-008.Tags.UI.md             |
| REQ-009  | Categories Management        | functional     | high     | implemented | REQ-009.Categories.md          |
| REQ-010  | Articles CRUD                | functional     | high     | implemented | REQ-010.Articles.md            |
| REQ-011  | Article Rich Text Editor     | functional     | high     | implemented | REQ-011.Article-Import-Paste.md|
| REQ-012  | Public Article List          | functional     | high     | draft       | REQ-012.Articles.List.md       |
| REQ-013  | Article View & Interactions  | functional     | high     | draft       | REQ-013.Articles.View.md       |

## 2. Status Legend

| Status      | Meaning |
|-------------|---------|
| draft       | Requirements defined but not yet implemented |
| partial     | Some acceptance criteria implemented |
| implemented | All acceptance criteria implemented and tested |
| approved    | Legacy status - treat as implemented |

## 3. Missing Requirements (Planned)

| Suggested ID | Feature | Priority | Notes |
|--------------|---------|----------|-------|
| REQ-014      | User Comments System | high | Backend exists, needs REQ spec |
| REQ-015      | User Likes/Dislikes | high | Backend exists, needs REQ spec |
| REQ-016      | User Profile/Settings | medium | Mentioned in REQ-004 notes |
| REQ-017      | Content Search | medium | Not yet specified |
| REQ-018      | SEO Optimization | low | Mentioned in ADRs |
