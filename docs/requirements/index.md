# DOCUMENT_TYPE: REQUIREMENTS_INDEX
# VERSION: 1.5

> Registry of all requirements (REQ-*). **This is the authoritative source for REQ status and numbering.**

## 1. Requirements List

| REQ_ID   | Title                        | Type           | Priority | Status      | File                           |
|----------|------------------------------|----------------|----------|-------------|--------------------------------|
| REQ-001  | User login via Keycloak      | functional     | high     | implemented | REQ-001.login.md               |
| REQ-002  | AI News page                 | functional     | medium   | implemented | REQ-002.AI-news-page.md        |
| REQ-003  | Site landing page (public)   | functional     | high     | implemented | REQ-003.site-landing-page.md   |
| REQ-004  | User Dashboard Layout        | functional     | high     | implemented | REQ-004.dashboard.md           |
| REQ-005  | Dashboard Sidebar Navigation | functional     | high     | implemented | REQ-005.dashboard-sidebar.md   |
| REQ-006  | Multilanguage Support (i18n) | functional     | high     | implemented | REQ-006.multilanguage.md       |
| REQ-007  | Tag Entity (Backend)         | functional     | medium   | implemented | REQ-007.tag.entity.md          |
| REQ-008  | Tag Management UI            | functional     | medium   | implemented | REQ-008.Tags.UI.md             |
| REQ-009  | Categories Management        | functional     | high     | implemented | REQ-009.Categories.md          |
| REQ-010  | Articles CRUD                | functional     | high     | implemented | REQ-010.Articles.md            |
| REQ-011  | Article Rich Text Editor     | functional     | high     | implemented | REQ-011.Article-Import-Paste.md|
| REQ-012  | Public Article List          | functional     | high     | implemented | REQ-012.Articles.List.md       |
| REQ-013  | Article View & Interactions  | functional     | high     | implemented | REQ-013.Articles.View.md       |
| REQ-014  | User Profile & Settings      | functional     | medium   | approved    | REQ-014.User-Profile.md        |
| REQ-015  | Article Comments System      | functional     | high     | implemented | REQ-015.Comments.md            |
| REQ-016  | Article Likes & Dislikes     | functional     | high     | implemented | REQ-016.Likes.md               |
| REQ-017  | Content Search               | functional     | medium   | implemented | REQ-017.Search.md              |

**Next Available REQ Number**: REQ-018

## 2. Status Legend

| Status      | Meaning |
|-------------|---------|
| draft       | Requirements defined but not yet implemented |
| partial     | Some acceptance criteria implemented |
| implemented | All acceptance criteria implemented and tested |
| approved    | Legacy status - treat as implemented |

## 3. Roadmap (Planned)

| Suggested ID | Feature | Priority | Notes |
|--------------|---------|----------|-------|
| REQ-018      | Notifications System | low | User notification preferences |
| REQ-019      | SEO Optimization | low | Meta tags, sitemaps, structured data |
| REQ-020      | Admin User Management | low | Admin-only user administration |

---

## 4. For AI Agents

### Getting Next REQ Number

1. Check "Next Available REQ Number" above
2. Or scan files: `ls docs/requirements/REQ-*.md | sort`
3. Increment highest number by 1

### Creating New REQ

1. Create `REQ-XXX.[short-name].md` using template
2. **MUST** add entry to Section 1 table above
3. **MUST** update "Next Available REQ Number"
4. **MUST** update `docs/index.md` counts

### Updating REQ Status

When implementation complete:
1. Update status in REQ file itself
2. **MUST** update status in Section 1 table above
3. **MUST** add test files to `docs/tests/index.md`

### Status Consistency Rule

⚠️ **The status in this index is authoritative.** If REQ file status differs, update the REQ file to match this index.

