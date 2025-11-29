# AI-Dala AI Agent Guide

> **Purpose**: This document provides AI coding agents with everything needed to understand and modify the AI-Dala codebase correctly.

---

## 1. DESIGN SYSTEM SPECIFICATION (DSS)

The **Design System Specification** solves the problem of AI agents not knowing:
- What component goes where on a page
- What styles to apply to elements
- What props components accept
- How layouts are structured

### DSS Architecture (4 Layers)

```
┌─────────────────────────────────────────────────────────┐
│  Layer 4: UI-MANIFEST.json                              │
│  Complete component tree for each route                 │
│  → "What components are on /dashboard/articles?"        │
├─────────────────────────────────────────────────────────┤
│  Layer 3: PAGE-LAYOUTS.json                             │
│  Template definitions (grids, slots, responsive rules)  │
│  → "Where does the sidebar go?"                         │
├─────────────────────────────────────────────────────────┤
│  Layer 2: COMPONENT-REGISTRY.json                       │
│  Component specs (props, variants, classes)             │
│  → "What variants does Button have?"                    │
├─────────────────────────────────────────────────────────┤
│  Layer 1: DESIGN-TOKENS.json                            │
│  Primitives (colors, spacing, typography)               │
│  → "What's the hex code for walnut-500?"                │
└─────────────────────────────────────────────────────────┘
```

### File Locations
```
docs/design/
├── DESIGN-SYSTEM-SPEC.md              # Full documentation
├── tokens/DESIGN-TOKENS.json          # Colors, fonts, spacing
├── components/COMPONENT-REGISTRY.json # Component specs
├── layouts/
│   ├── PAGE-LAYOUTS.json              # Index (route→file mapping)
│   ├── LAYOUT-core.json               # PublicLayout, DashboardLayout
│   ├── LAYOUT-grids.json              # Grid helpers, containers
│   ├── LAYOUT-REQ-001-auth.json       # Auth pages layout
│   ├── LAYOUT-REQ-003-landing.json    # Landing page layout
│   └── LAYOUT-REQ-012-articles.json   # Articles page layout
└── pages/
    ├── UI-MANIFEST.json               # Index (route→file mapping)
    ├── UI-REQ-001-auth.json           # Login, register pages
    ├── UI-REQ-003-landing.json        # Landing page (/)
    ├── UI-REQ-004-dashboard.json      # Dashboard, profile
    ├── UI-REQ-007-tags.json           # Tags management
    ├── UI-REQ-009-categories.json     # Categories management
    ├── UI-REQ-010-articles-mgmt.json  # Article CRUD
    └── UI-REQ-012-articles.json       # Public articles list
```

### How to Find the Right Files

| Working on route | Load these files |
|------------------|------------------|
| `/` (landing) | `LAYOUT-REQ-003-landing.json`, `UI-REQ-003-landing.json` |
| `/articles` | `LAYOUT-REQ-012-articles.json`, `UI-REQ-012-articles.json` |
| `/login`, `/register` | `LAYOUT-REQ-001-auth.json`, `UI-REQ-001-auth.json` |
| `/dashboard` | `LAYOUT-core.json`, `UI-REQ-004-dashboard.json` |
| `/dashboard/articles/*` | `LAYOUT-core.json`, `UI-REQ-010-articles-mgmt.json` |
| `/dashboard/tags` | `LAYOUT-core.json`, `UI-REQ-007-tags.json` |
| `/dashboard/categories` | `LAYOUT-core.json`, `UI-REQ-009-categories.json` |

---

## 2. CODING INSTRUCTIONS

### 2.0 DESIGN SYSTEM SPECIFICATION (DSS) - MANDATORY

All UI work MUST reference the **Design System Specification** located in `docs/design/`:

```
docs/design/
├── DESIGN-SYSTEM-SPEC.md      # Overview and how to use
├── tokens/
│   └── DESIGN-TOKENS.json     # Colors, typography, spacing (Layer 1)
├── components/
│   └── COMPONENT-REGISTRY.json # Component specs, props, variants (Layer 2)
├── layouts/
│   └── PAGE-LAYOUTS.json      # Page templates, grid layouts (Layer 3)
└── pages/
    └── UI-MANIFEST.json       # Complete UI tree per route (Layer 4)
```

#### Quick Reference for AI Agents:

| Question | Look In |
|----------|---------|
| "What color/spacing/font should I use?" | `DESIGN-TOKENS.json` |
| "What props does Button/Card/Input accept?" | `COMPONENT-REGISTRY.json` |
| "Where does the sidebar/header go?" | `PAGE-LAYOUTS.json` |
| "What components are on this page?" | `UI-MANIFEST.json` |

#### CRITICAL RULE: Use Tokens, Not Raw Values
```tsx
// ❌ NEVER use raw values
<div style={{ backgroundColor: '#8B6914', padding: '16px' }}>
<button className="bg-[#d97706] text-[14px]">

// ✅ ALWAYS use design tokens via Tailwind
<div className="bg-walnut-500 p-4">
<button className="bg-retro-orange text-sm font-retro-sans">
```

### 2.0.1 WALNUT RETRO DESIGN SYSTEM (Current Theme)

All UI components MUST follow the **Walnut Retro** design system - a warm, vintage-inspired aesthetic with mid-century modern influences.

#### Color Palette (Tailwind Classes)
```
WALNUT BROWNS (Primary):
- walnut-50:  #faf8f5  (Cream white - backgrounds)
- walnut-100: #f5f0e8  (Light cream - cards, sidebar)
- walnut-200: #e8dcc8  (Warm beige - table headers)
- walnut-300: #d4c4a8  (Sand - borders, dividers)
- walnut-400: #b8a07a  (Tan - muted text)
- walnut-500: #8b6914  (Walnut brown - PRIMARY, borders, accents)
- walnut-600: #6d5a3a  (Dark walnut - buttons, text)
- walnut-700: #5c4a2e  (Deep brown - hover states)
- walnut-800: #4a3b24  (Espresso - headings)
- walnut-900: #3d2f1c  (Dark espresso - strong text)

RETRO ACCENTS:
- retro-orange:  #d97706  (Burnt orange - highlights)
- retro-teal:    #0d9488  (Vintage teal - links)
- retro-rust:    #b45309  (Rust - errors, delete)
- retro-olive:   #65a30d  (Olive green - success/published)
- retro-mustard: #ca8a04  (Mustard yellow - warnings/draft)
- retro-cream:   #fffbeb  (Warm cream - hero backgrounds)
```

#### Typography
```tsx
// Headings: Serif font
<h1 className="font-retro text-walnut-800">Title</h1>

// Body/UI: Sans-serif font  
<p className="font-retro-sans text-walnut-600">Body text</p>

// Labels: Uppercase tracking
<label className="font-retro-sans uppercase tracking-wide text-walnut-700">
```

#### Button Styles
```tsx
// Primary Button (Walnut)
<button className="px-4 py-2 bg-walnut-600 text-walnut-50 rounded-retro 
    border-2 border-walnut-700 shadow-retro hover:shadow-retro-hover 
    hover:bg-walnut-700 font-retro-sans uppercase tracking-wide">
    Action
</button>

// Secondary Button (Outline)
<button className="px-4 py-2 bg-walnut-100 text-walnut-700 rounded-retro 
    border-2 border-walnut-500 shadow-retro hover:bg-walnut-200 
    font-retro-sans uppercase tracking-wide">
    Secondary
</button>

// Danger Button
<button className="text-retro-rust hover:text-retro-orange uppercase tracking-wide">
    Delete
</button>
```

#### Card/Panel Styles
```tsx
// Standard Card
<div className="bg-walnut-50 rounded-retro shadow-retro border-2 border-walnut-500 p-4">
    {/* Content */}
</div>

// Table Container
<div className="bg-walnut-50 rounded-retro shadow-retro border-2 border-walnut-500 overflow-hidden">
    <table className="min-w-full divide-y divide-walnut-300">
        <thead className="bg-walnut-200">
            {/* Headers */}
        </thead>
        <tbody className="bg-walnut-50 divide-y divide-walnut-200">
            {/* Rows */}
        </tbody>
    </table>
</div>
```

#### Status Badges
```tsx
// Published (Success)
<span className="bg-retro-olive/20 text-retro-olive border-retro-olive 
    border rounded-retro px-2.5 py-0.5 text-xs font-retro-sans uppercase">
    PUBLISHED
</span>

// Draft (Warning)
<span className="bg-retro-mustard/20 text-retro-rust border-retro-mustard 
    border rounded-retro px-2.5 py-0.5 text-xs font-retro-sans uppercase">
    DRAFT
</span>

// Archived (Neutral)
<span className="bg-walnut-200 text-walnut-600 border-walnut-400 
    border rounded-retro px-2.5 py-0.5 text-xs font-retro-sans uppercase">
    ARCHIVED
</span>
```

#### Form Inputs
```tsx
<input className="block w-full border-2 border-walnut-300 rounded-retro 
    shadow-sm focus:ring-walnut-500 focus:border-walnut-500 
    bg-walnut-50 font-retro-sans" />

<select className="block w-full border-2 border-walnut-300 rounded-retro 
    shadow-sm focus:ring-walnut-500 focus:border-walnut-500 
    bg-walnut-50 font-retro-sans">
```

#### Retro Decorative Elements
```tsx
// Divider with diamond
<div className="flex justify-center items-center gap-4">
    <div className="h-px w-16 bg-walnut-300"></div>
    <span className="text-walnut-400 text-2xl">✦</span>
    <div className="h-px w-16 bg-walnut-300"></div>
</div>

// Badge
<div className="inline-block px-4 py-1 bg-walnut-500 text-walnut-50 
    text-xs font-retro-sans uppercase tracking-widest rounded-retro shadow-retro">
    ✦ Est. 2024 ✦
</div>
```

#### Key Design Principles
1. **Sharp corners**: Use `rounded-retro` (2px) instead of rounded-md/lg
2. **Offset shadows**: Use `shadow-retro` (4px 4px offset) for depth
3. **Thick borders**: Always use `border-2` with `border-walnut-500`
4. **Uppercase labels**: Navigation and labels use `uppercase tracking-wide`
5. **Warm backgrounds**: Use `walnut-50` (cream) or `retro-cream` backgrounds
6. **Serif headings**: Titles use `font-retro` (Playfair Display)
7. **Sans-serif body**: UI text uses `font-retro-sans` (Source Sans Pro)

---

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

## 5. TASK TEMPLATES FOR AGENTS

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