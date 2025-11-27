# AI-Dala Project Audit Report & Junior AI Agent Guidelines

**Version**: 1.0  
**Date**: 2025-01-XX  
**Purpose**: Comprehensive audit of AI-Dala project for low-capability AI agents (e.g., Grok Code Fast) to act as junior developers

---

## 1. EXECUTIVE SUMMARY

### 1.1 Project Overview
AI-Dala is a **multilingual CMS platform** for publishing articles and aggregating AI news. Target users include:
- **Anonymous visitors**: Read articles, view news
- **Registered users**: Comment on articles, like/dislike content
- **Admins/Content Managers**: Create/edit articles, manage tags/categories

### 1.2 Tech Stack
| Layer | Technology | Key Files |
|-------|-----------|-----------|
| **Backend** | Go 1.21+, `sqlx`, PostgreSQL 15 | `api/internal/modules/*/` |
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS | `web/src/app/` |
| **Auth** | Keycloak OIDC with PKCE | `keycloak/realm-export.json` |
| **i18n** | 3 languages (en, ru, kk) | `web/messages/*.json` |
| **Testing** | Playwright E2E, Go integration tests | `web/tests/`, `api/internal/*/` |

---

## 2. CRITICAL AUDIT FINDINGS

### 2.1 🚨 DOCUMENTATION GAPS (HIGH PRIORITY)

| Issue | Location | Action Required |
|-------|----------|-----------------|
| **Empty product brief** | `docs/product/brief.md` | Fill with project vision, goals, target audience |
| **Incomplete requirements index** | `docs/requirements/index.md` | Add REQ-007 through REQ-013 |
| **Incomplete test index** | `docs/tests/index.md` | Add 15+ missing test case mappings |
| **No OpenAPI for articles** | `docs/contracts/openapi.yaml` | Add `/api/articles/*` endpoints |
| **Missing comments/likes requirements** | N/A | Create REQ-014 for user interactions |

### 2.2 🔧 CODE INCONSISTENCIES (MEDIUM PRIORITY)

| Issue | Location | Fix |
|-------|----------|-----|
| **Hardcoded author ID** | `api/internal/modules/articles/handler.go:210` | Extract from auth context |
| **Console.log in production** | `web/src/app/components/articles/TiptapEditor.tsx:43` | Remove debug logging |
| **Mixed locale handling** | `web/src/app/[locale]/articles/page.tsx` | Use consistent `router.push` with locale |
| **No API error typing** | Frontend `fetch()` calls | Create typed error responses |

### 2.3 📝 INCOMPLETE FEATURES (MEDIUM PRIORITY)

| Feature | REQ | Status | Missing |
|---------|-----|--------|---------|
| Search/Filter tags | REQ-008 | Partial | FR-3 not implemented |
| Pagination (server-side) | REQ-008 | Missing | FR-2 shows all tags |
| Soft delete tags | REQ-008 | Missing | Hard delete implemented |
| User profile menu | REQ-004 | Partial | No avatar, no dropdown |

---

## 3. REQUIREMENTS MATRIX (CURRENT STATE)

### 3.1 Complete Requirements (Ready for Implementation)

| REQ ID | Title | Status | E2E Test File |
|--------|-------|--------|---------------|
| REQ-001 | Keycloak Login/Auth | ✅ Implemented | `login.spec.ts`, `req-001-token-refresh.spec.ts` |
| REQ-003 | Landing Page | ✅ Implemented | `landing.spec.ts` |
| REQ-004 | Dashboard Layout | ✅ Implemented | `dashboard.spec.ts` |
| REQ-005 | Sidebar Navigation | ✅ Implemented | `sidebar-navigation.spec.ts` |
| REQ-007 | Tag Entity (Backend) | ✅ Implemented | Backend integration tests |
| REQ-008 | Tag Management UI | ✅ Implemented | `tags.spec.ts` |
| REQ-009 | Categories | ✅ Implemented | `categories.spec.ts` |
| REQ-010 | Articles CRUD | ✅ Implemented | `articles.spec.ts` |
| REQ-011 | Rich Text Editor | ✅ Implemented | `req-011-*.spec.ts` (6 files) |

### 3.2 Partial Requirements (Need Work)

| REQ ID | Title | Status | Missing Work |
|--------|-------|--------|--------------|
| REQ-002 | News Page | 🟡 Partial | News content source not defined |
| REQ-006 | Multilanguage | 🟡 Partial | Some translations incomplete |
| REQ-012 | Public Article List | 🟡 Draft | AC section empty, needs detailing |
| REQ-013 | Article View/Interactions | 🟡 Draft | Backend done, frontend partial |

### 3.3 Missing Requirements (Need Creation)

| Suggested REQ | Feature | Priority |
|---------------|---------|----------|
| REQ-014 | User Comments | HIGH |
| REQ-015 | User Likes/Dislikes | HIGH |
| REQ-016 | User Profile/Settings | MEDIUM |
| REQ-017 | Content Search | MEDIUM |
| REQ-018 | SEO Optimization | LOW |

---

## 4. JUNIOR AI AGENT INSTRUCTIONS

### 4.1 BEFORE YOU CODE - MANDATORY CHECKLIST

```
□ 1. Read the relevant REQ-* file completely
□ 2. Check if MOD-* spec exists in docs/modules/
□ 3. Verify API contract in docs/contracts/openapi.yaml
□ 4. Look at existing similar code for patterns
□ 5. Check if E2E test file exists
□ 6. Ensure services are running (see section 4.2)
```

### 4.2 HOW TO START SERVICES

**Always run these before coding or testing:**

```powershell
# Terminal 1: Start database
cd c:\Users\tvolo\dev\ai-dala.com
docker compose up -d db

# Terminal 2: Start API (wait for DB to be ready)
cd api
go run main.go

# Terminal 3: Start frontend (wait for API)
cd web
npm run dev
```

### 4.3 CODING PATTERNS TO FOLLOW

#### Backend (Go) Pattern:
```go
// File: api/internal/modules/{feature}/handler.go
func (h *Handler) handleCreate(w http.ResponseWriter, r *http.Request) {
    // 1. Parse request
    var req CreateRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "invalid request body", http.StatusBadRequest)
        return
    }

    // 2. Call service
    result, err := h.service.Create(&req)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    // 3. Return JSON response
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(result)
}
```

#### Frontend (Next.js) Pattern:
```tsx
// File: web/src/app/[locale]/dashboard/{feature}/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function FeaturePage() {
    const t = useTranslations('Feature');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/feature');
                if (!res.ok) throw new Error('Failed to fetch');
                const json = await res.json();
                setData(json.items);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="animate-pulse">Loading...</div>;
    if (error) return <div className="text-red-600">Error: {error}</div>;

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
            {/* Content here */}
        </div>
    );
}
```

#### E2E Test Pattern:
```typescript
// File: web/tests/req-xxx-feature.spec.ts
import { test, expect } from '@playwright/test';

test.describe('REQ-XXX Feature Name', () => {
    const uniqueId = `test-${Date.now()}`;

    test('AC-1: Description of acceptance criteria', async ({ page }) => {
        // 1. Navigate
        await page.goto('http://localhost:3000/dashboard/feature');

        // 2. Perform action
        await page.fill('input[name="code"]', uniqueId);
        await page.click('button[type="submit"]');

        // 3. Verify UI
        await expect(page.getByText(uniqueId)).toBeVisible();

        // 4. Verify API (double-check)
        const res = await fetch(`http://localhost:4000/api/feature/${uniqueId}`);
        expect(res.ok).toBeTruthy();
    });
});
```

### 4.4 TAILWIND CSS RULES (MANDATORY)

**DO:**
```tsx
// Correct - using Tailwind utilities
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">Title</h2>
    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Action
    </button>
</div>
```

**DON'T:**
```tsx
// WRONG - custom CSS
<div style={{ backgroundColor: 'white', padding: '24px' }}>
// WRONG - CSS files
import './custom.css';
```

### 4.5 FILE NAMING CONVENTIONS

| Type | Pattern | Example |
|------|---------|---------|
| Backend handler | `handler.go` | `api/internal/modules/articles/handler.go` |
| Backend repo | `repository.go` | `api/internal/modules/articles/repository.go` |
| Frontend page | `page.tsx` | `web/src/app/[locale]/dashboard/articles/page.tsx` |
| Frontend component | `PascalCase.tsx` | `web/src/app/components/articles/ArticleCard.tsx` |
| E2E test | `req-xxx-feature.spec.ts` | `web/tests/req-011-article-paste.spec.ts` |
| Requirement | `REQ-XXX.feature.md` | `docs/requirements/REQ-011.Article-Import-Paste.md` |

---

## 5. TASK TEMPLATES FOR JUNIOR AGENTS

### 5.1 Template: Add New Feature

```markdown
## Task: Implement [Feature Name]

### Prerequisites
- [ ] REQ-XXX exists in docs/requirements/
- [ ] Services running (db, api, web)

### Steps
1. **Backend** (if needed):
   - Create `api/internal/modules/{feature}/`
   - Add handler, service, repository
   - Register routes in `api/internal/http/server/server.go`
   - Write integration test

2. **Frontend**:
   - Create page in `web/src/app/[locale]/dashboard/{feature}/page.tsx`
   - Create components in `web/src/app/components/{feature}/`
   - Add translations to `web/messages/*.json`

3. **Testing**:
   - Create `web/tests/req-xxx-{feature}.spec.ts`
   - Run: `cd web && npx playwright test req-xxx`

4. **Documentation**:
   - Update REQ-XXX status to "implemented"
   - Add test file to REQ-XXX traceability section
```

### 5.2 Template: Fix Bug

```markdown
## Task: Fix [Bug Description]

### Steps
1. **Reproduce**:
   - Start services
   - Navigate to affected page
   - Confirm bug exists

2. **Investigate**:
   - Check browser console for errors
   - Check API logs (`api/` terminal)
   - Find the relevant file

3. **Fix**:
   - Make minimal change to fix bug
   - Don't refactor unrelated code

4. **Verify**:
   - Run existing E2E tests: `cd web && npx playwright test {file}`
   - Manual test the fix
```

### 5.3 Template: Add E2E Test

```markdown
## Task: Add E2E Test for REQ-XXX

### Steps
1. Read `docs/requirements/REQ-XXX.md` completely
2. List all Acceptance Criteria (AC-1, AC-2, ...)
3. Create `web/tests/req-xxx-feature.spec.ts`
4. Write one test per AC
5. Run: `cd web && npx playwright test req-xxx`
6. Record results in REQ-XXX document
```

---

## 6. COMMON ERRORS & SOLUTIONS

### 6.1 "Connection refused" on API calls
**Cause**: API server not running  
**Fix**: `cd api && go run main.go`

### 6.2 "relation does not exist" in Go
**Cause**: Database migrations not applied  
**Fix**: Migrations auto-apply on API start. Restart API.

### 6.3 "Module not found" in Next.js
**Cause**: Dependencies not installed  
**Fix**: `cd web && npm install`

### 6.4 Playwright tests timeout
**Cause**: Frontend not running or wrong URL  
**Fix**: Ensure `npm run dev` is running on port 3000

### 6.5 "Unauthorized" on protected routes
**Cause**: Not logged in or token expired  
**Fix**: Login through Keycloak first (test user: `testuser@example.com` / `test123`)

---

## 7. API QUICK REFERENCE

### 7.1 Articles
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/articles` | No | List articles |
| GET | `/api/articles/public` | No | List published articles |
| GET | `/api/articles/{id}` | No | Get article by ID |
| POST | `/api/articles` | Yes | Create article |
| PUT | `/api/articles/{id}` | Yes | Update article |
| DELETE | `/api/articles/{id}` | Yes | Delete article |
| POST | `/api/articles/{id}/publish` | Yes | Publish article |
| POST | `/api/articles/{id}/comments` | Yes | Add comment |
| POST | `/api/articles/{id}/like` | Yes | Like/dislike |

### 7.2 Tags
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/tags` | No | List tags |
| GET | `/api/tags/{code}` | No | Get tag by code |
| POST | `/api/tags` | Yes | Create tag |
| PUT | `/api/tags/{code}` | Yes | Update tag |
| DELETE | `/api/tags/{code}` | Yes | Delete tag |

### 7.3 Categories
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/categories` | No | List categories |
| GET | `/api/categories/{code}` | No | Get category |
| POST | `/api/categories` | Yes | Create category |
| PUT | `/api/categories/{code}` | Yes | Update category |
| DELETE | `/api/categories/{code}` | Yes | Delete category |

---

## 8. APPENDIX: FILES TO KNOW

### 8.1 Most Important Files
1. `docs/fr-development.md` - Development workflow guide
2. `docs/requirements/REQ-*.md` - Feature specifications
3. `api/internal/modules/articles/handler.go` - Article API handlers
4. `web/src/app/[locale]/dashboard/articles/page.tsx` - Article management UI
5. `web/src/app/components/articles/TiptapEditor.tsx` - Rich text editor

### 8.2 Configuration Files
- `docker-compose.yml` - Database and Keycloak containers
- `api/go.mod` - Go dependencies
- `web/package.json` - Node dependencies
- `web/tailwind.config.js` - Tailwind configuration
- `web/playwright.config.ts` - E2E test configuration

---

**END OF AUDIT REPORT**

*For questions or clarifications, refer to `docs/fr-development.md` first.*
