# AI-Dala Design System Specification (DSS)

> **Purpose**: Provide AI agents and developers with a complete, unambiguous specification of the UI system.

## Overview

The Design System is organized into 4 layers, with Layer 3 and 4 **split by requirement** for smaller context:

```
┌─────────────────────────────────────────────────────────┐
│  Layer 4: UI-MANIFEST.json (index)                      │
│  → UI-REQ-*.json (per-route component trees)            │
├─────────────────────────────────────────────────────────┤
│  Layer 3: PAGE-LAYOUTS.json (index)                     │
│  → LAYOUT-*.json (per-feature templates)                │
├─────────────────────────────────────────────────────────┤
│  Layer 2: COMPONENT-REGISTRY.json                       │
│  (Component specs - props, variants, behaviors)         │
├─────────────────────────────────────────────────────────┤
│  Layer 1: DESIGN-TOKENS.json                            │
│  (Primitives - colors, spacing, typography, shadows)    │
└─────────────────────────────────────────────────────────┘
```

## File Structure

```
docs/design/
├── DESIGN-SYSTEM-SPEC.md           # This file (overview)
├── tokens/
│   └── DESIGN-TOKENS.json          # Color, spacing, typography (~200 lines)
├── components/
│   └── COMPONENT-REGISTRY.json     # All component specs (~400 lines)
├── layouts/
│   ├── PAGE-LAYOUTS.json           # Index file
│   ├── LAYOUT-core.json            # PublicLayout, DashboardLayout (~80 lines)
│   ├── LAYOUT-grids.json           # Grid helpers (~50 lines)
│   ├── LAYOUT-REQ-001-auth.json    # Auth pages layout (~30 lines)
│   ├── LAYOUT-REQ-003-landing.json # Landing page layout (~40 lines)
│   └── LAYOUT-REQ-012-articles.json # Articles layout (~50 lines)
└── pages/
    ├── UI-MANIFEST.json            # Index file
    ├── UI-REQ-001-auth.json        # Login/register (~50 lines)
    ├── UI-REQ-003-landing.json     # Landing page (~60 lines)
    ├── UI-REQ-004-dashboard.json   # Dashboard home (~50 lines)
    ├── UI-REQ-007-tags.json        # Tags management (~40 lines)
    ├── UI-REQ-009-categories.json  # Categories (~40 lines)
    ├── UI-REQ-010-articles-mgmt.json # Article CRUD (~100 lines)
    └── UI-REQ-012-articles.json    # Public articles (~80 lines)
```

## How AI Agents Should Use This

### Step 1: Identify What You Need
| Task | Files to Load |
|------|---------------|
| Style a component | `DESIGN-TOKENS.json` |
| Build/modify component | `COMPONENT-REGISTRY.json` |
| Work on landing page | `LAYOUT-REQ-003-landing.json` + `UI-REQ-003-landing.json` |
| Work on articles page | `LAYOUT-REQ-012-articles.json` + `UI-REQ-012-articles.json` |
| Work on dashboard | `LAYOUT-core.json` + `UI-REQ-004-dashboard.json` |
| Work on article editor | `LAYOUT-core.json` + `UI-REQ-010-articles-mgmt.json` |

### Step 2: Load Only What's Needed
```
# Bad: Load everything (~800 lines)
Read: PAGE-LAYOUTS.json, UI-MANIFEST.json, COMPONENT-REGISTRY.json, DESIGN-TOKENS.json

# Good: Load only relevant files (~150 lines)
Working on /articles?
→ Read: LAYOUT-REQ-012-articles.json, UI-REQ-012-articles.json
```

### Step 3: Cross-Reference
1. **UI file** tells you WHAT components are on the page
2. **Layout file** tells you WHERE components go
3. **Component registry** tells you HOW to build components
4. **Tokens** tell you WHAT VALUES to use

## Quick Reference

| Question | Look In |
|----------|---------|
| "What color should this button be?" | `DESIGN-TOKENS.json` → colors |
| "What props does Button accept?" | `COMPONENT-REGISTRY.json` → Button |
| "Where does the sidebar go?" | `LAYOUT-core.json` → DashboardLayout |
| "What's on the /articles page?" | `UI-REQ-012-articles.json` |
| "What's on /dashboard/articles?" | `UI-REQ-010-articles-mgmt.json` |

## Style Application Rule

**CRITICAL**: Every visible element MUST use tokens from `DESIGN-TOKENS.json`. 
Never use raw hex colors, pixel values, or font names directly in components.

```tsx
// ❌ WRONG - raw values
<button className="bg-[#8B6914] text-[14px] p-[12px]">

// ✅ CORRECT - design tokens via Tailwind
<button className="bg-walnut-600 text-sm p-3 font-retro-sans">
```

## Theme: Walnut Retro

The current theme is **Walnut Retro** - a warm, vintage aesthetic with:
- Warm brown color palette (walnut)
- Serif headings (Playfair Display)
- Sans-serif body (Source Sans 3)
- Sharp corners with offset shadows
- Cream/paper backgrounds
