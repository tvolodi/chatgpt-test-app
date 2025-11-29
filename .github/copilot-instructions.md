# AI-Dala Copilot Instructions

> These instructions are automatically included in every GitHub Copilot conversation for this repository.

## 🚨 WORKFLOW PREFIXES (MANDATORY)

Every request MUST start with a workflow prefix. If missing, ASK which workflow to use.

| Prefix | Description | Approval Required |
|--------|-------------|-------------------|
| `IDEA:` | Create new REQ from vague idea | ✅ YES |
| `NEW:` | Implement existing REQ | ✅ YES |
| `UPDATE:` | Modify implemented REQ | ✅ YES |
| `TEST-ALL:` | Run all tests, fix errors | ❌ Auto-commit |
| `TEST:` | Test specific REQ | ❌ Auto-commit |
| `FIX:` | Bug fix | ❌ Auto-commit |
| `REFACTOR:` | Code improvement | ❌ Auto-commit |
| `DOCS:` | Documentation only | ❌ Auto-commit |
| `CHAT:` | Discussion (no code) | ❌ No changes |

## ⛔ FORBIDDEN: MOCKS

**NEVER use mocks in this project:**
- ❌ `page.route()` / `route.fulfill()`
- ❌ `jest.mock()` / `vi.mock()`
- ❌ `msw` (Mock Service Worker)
- ❌ Fake API responses

**ALWAYS use:**
- ✅ Real backend on `localhost:4000`
- ✅ Real database with TestContainers
- ✅ Real Keycloak auth (`testuser@example.com` / `test123`)

## 📋 TWO-PHASE WORKFLOW (IDEA/NEW/UPDATE)

```
PHASE 1: Requirement Development
  - Enrich REQ with acceptance criteria
  - Ask clarifying questions
  - WAIT for "APPROVED" before coding
  - ❌ NO code until approved

PHASE 2: Development (after APPROVED)
  - Backend → Tests → Commit
  - Frontend → Tests → Commit
  - Update indexes → Commit
```

## 📚 DOCUMENTATION DATABASE

Before creating REQ/MOD, check indexes:
- `docs/requirements/index.md` → Next REQ number, status
- `docs/modules/index.md` → Module registry
- `docs/tests/index.md` → Test coverage

**After implementation, UPDATE indexes!**

## 🔧 TECH STACK

- **Backend**: Go, `api/internal/modules/`
- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Tests**: Playwright (E2E), TestContainers (integration)
- **Auth**: Keycloak

## 📖 FULL DOCUMENTATION

For complete rules, patterns, and examples, read:
- `docs/AI-Agent-Rules.md` — Full agent instructions
- `docs/AI-Guide.md` — Development guide

## ⚠️ DISPUTE PROTOCOL

1. Agent MUST challenge decisions it believes are wrong
2. Present technical reasoning and alternatives
3. If Human insists → Execute without further objection
4. Document concerns in commit message if overruled
