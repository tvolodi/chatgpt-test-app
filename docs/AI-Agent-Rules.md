---
description: Requirement Development
---

//turbo

# AI Agent Development Directives & Guide

**Version**: 5.0
**Status**: Active
**Purpose**: This is the **Single Source of Truth** for AI Agents (and humans) working on the AI-Dala project. It consolidates development standards, workflows, and role-specific instructions.

---

## 0. WORKFLOW MODES (MANDATORY)

⚠️ **CRITICAL**: Every user request MUST start with a workflow prefix. Agent MUST identify the workflow before taking any action.

### 0.1. Workflow Quick Reference

| Prefix | Workflow | Approval Required | Auto-Commit |
|--------|----------|-------------------|-------------|
| `IDEA:` | Formalize Idea → New REQ | ✅ YES (Phase 1 → Phase 2) | After approval |
| `NEW:` | Implement Existing REQ | ✅ YES (Phase 1 → Phase 2) | After approval |
| `UPDATE:` | Modify Implemented REQ | ✅ YES (Phase 1 → Phase 2) | After approval |
| `TEST-ALL:` | Run All Tests & Fix Errors | ❌ NO | ✅ YES |
| `TEST:` | Test Specific REQ & Fix | ❌ NO | ✅ YES |
| `FIX:` | Bug Fix / Debug | ❌ NO | ✅ YES |
| `REFACTOR:` | Code Refactoring | ❌ NO | ✅ YES |
| `DOCS:` | Documentation Only | ❌ NO | ✅ YES |
| `CHAT:` | General Discussion | ❌ NO | ❌ NO (no code) |

### 0.2. Workflow Detection Rules

1. **If prefix is present** → Use that workflow
2. **If NO prefix** → Agent MUST ask: *"Which workflow? (IDEA/NEW/UPDATE/TEST-ALL/TEST/FIX/REFACTOR/DOCS/CHAT)"*
3. **Never assume** → When in doubt, ask

### 0.2.1. Requirement Workflow Selection Guide

```
┌─────────────────────────────────────────────────────────────────┐
│  Do you have a REQ-XXX file?                                    │
│  ├─ NO  → Do you have a vague idea?                            │
│  │        ├─ YES → Use IDEA:                                    │
│  │        └─ NO  → Use CHAT: to discuss first                   │
│  └─ YES → Is the REQ implemented (status: implemented)?         │
│           ├─ NO  → Use NEW: REQ-XXX                             │
│           └─ YES → Use UPDATE: REQ-XXX                          │
└─────────────────────────────────────────────────────────────────┘
```

---

### 0.3. `IDEA:` — Formalize Idea into New Requirement

**Trigger**: `IDEA: [vague idea description]`

**Purpose**: Transform a vague idea into a formal REQ document, then implement it.

**Precondition**: No REQ file exists. Agent will auto-assign next REQ number.

**Workflow**:
```
Phase 1 (BLOCKING - requires APPROVED):
  1. Agent scans docs/requirements/ to find next REQ number
  2. Agent creates REQ-XXX.md with initial structure
  3. Agent formalizes idea into user stories, acceptance criteria
  4. Agent asks clarifying questions
  5. Human reviews, adjusts, answers
  6. Agent updates REQ document
  7. Loop until Human says "APPROVED"
  
Phase 2 (ATOMIC - runs to completion):
  1. Backend: Code → Test → Fix → Commit
  2. Frontend: Code → Test → Fix → Commit
  3. Docs: Update REQ status → Commit
```

**REQ Auto-Assignment**: Agent scans `docs/requirements/REQ-*.md`, finds highest number, increments by 1.

**Example**:
```
Human: IDEA: I want users to be able to bookmark articles for later reading
Agent: [Creates REQ-018.Bookmarks.md, adds user stories, AC, asks questions]
        "Created REQ-018. Questions:
         1. Should bookmarks sync across devices?
         2. Maximum bookmarks per user?"
Human: 1. Yes, sync via account. 2. No limit.
Agent: [Updates REQ-018.md with answers]
        "REQ-018 updated. Ready for approval?"
Human: APPROVED
Agent: [Implements backend, frontend, tests, commits]
```

---

### 0.4. `NEW:` — Implement Existing Requirement

**Trigger**: `NEW: REQ-XXX`

**Purpose**: Implement an existing REQ document that has status `draft` or `approved`.

**Precondition**: REQ-XXX.md exists with status NOT `implemented`.

**Workflow**:
```
Phase 1 (BLOCKING - requires APPROVED):
  1. Agent reads existing REQ-XXX.md
  2. Agent enriches with missing details (AC, API contract, test plan)
  3. Agent asks clarifying questions if needed
  4. Human reviews and adjusts
  5. Loop until Human says "APPROVED"
  
Phase 2 (ATOMIC - runs to completion):
  1. Backend: Code → Test → Fix → Commit
  2. Frontend: Code → Test → Fix → Commit
  3. Docs: Update REQ status to "implemented" → Commit
```

**Example**:
```
Human: NEW: REQ-015
Agent: [Reads REQ-015.md, enriches missing AC, asks questions]
Human: APPROVED
Agent: [Implements backend, frontend, tests, commits]
```

---

### 0.5. `UPDATE:` — Modify Implemented Requirement

**Trigger**: `UPDATE: REQ-XXX [change description]`

**Purpose**: Modify an already implemented requirement (add feature, change behavior, remove functionality).

**Precondition**: REQ-XXX.md exists with status `implemented`.

**Workflow**:
```
Phase 1 (BLOCKING - requires APPROVED):
  1. Agent reads existing REQ-XXX.md and related code
  2. Agent adds "Change Log" section to REQ if not exists
  3. Agent documents proposed changes with:
     - What changes (add/modify/remove)
     - Affected acceptance criteria
     - Impact on existing tests
  4. Agent asks clarifying questions
  5. Human reviews and adjusts
  6. Loop until Human says "APPROVED"
  
Phase 2 (ATOMIC - runs to completion):
  1. Backend: Modify code → Update tests → Fix → Commit
  2. Frontend: Modify code → Update tests → Fix → Commit
  3. Docs: Update REQ with change log entry → Commit
```

**Change Log Format** (added to REQ document):
```markdown
## Change Log

| Date | Version | Description |
|------|---------|-------------|
| 2025-11-29 | 1.1 | Added bookmark sync across devices |
| 2025-11-15 | 1.0 | Initial implementation |
```

**Commit Pattern**: `feat(REQ-XXX): [change description]` or `fix(REQ-XXX): [change description]`

**Example**:
```
Human: UPDATE: REQ-010 Add bulk delete for articles
Agent: [Reads REQ-010.md, proposes changes]
        "Proposed changes to REQ-010:
         - Add AC-10.5: Bulk delete with checkbox selection
         - Add AC-10.6: Confirmation dialog for bulk delete
         - Modify API: Add DELETE /api/articles/bulk endpoint
         Questions:
         1. Maximum articles per bulk delete?
         2. Soft delete or hard delete?"
Human: 1. Max 50. 2. Soft delete.
Agent: [Updates REQ-010.md with change log]
Human: APPROVED
Agent: [Modifies backend, frontend, tests, commits]
```

---

### 0.6. `TEST-ALL:` — Run All Tests & Fix Errors

**Trigger**: `TEST-ALL:` or `TEST-ALL: [optional scope]`

**Purpose**: Run the full test suite, identify failures, fix them, auto-commit.

**Workflow**:
```
1. Start services (db, api, frontend)
2. Run backend tests: go test ./...
3. Run E2E tests: npx playwright test
4. Collect all failures
5. For each failure:
   a. Analyze root cause
   b. Fix code
   c. Re-run affected test
   d. Commit: fix([scope]): [description]
6. Report summary
```

**Commit Pattern**: `fix(backend): resolve [test name] failure` or `fix(e2e): fix [test name]`

**Example**:
```
Human: TEST-ALL:
Agent: [Starts services, runs all tests, fixes 3 failures, commits each fix]
Agent: "Fixed 3 test failures: TC-001, TC-015, TC-022. All tests passing."
```

---

### 0.7. `TEST:` — Test Specific REQ & Fix

**Trigger**: `TEST: REQ-XXX` or `TEST: [test file pattern]`

**Purpose**: Run tests for a specific requirement, fix any failures, auto-commit.

**Workflow**:
```
1. Start services if needed
2. Identify test files for REQ-XXX (from traceability section)
3. Run: npx playwright test req-xxx-*.spec.ts
4. Run: go test -run TestXXX ./...
5. Fix any failures
6. Re-run until green
7. Commit: fix(REQ-XXX): resolve test failures
```

**Example**:
```
Human: TEST: REQ-015
Agent: [Runs req-015-*.spec.ts, finds 1 failure, fixes, commits]
Agent: "REQ-015 tests: 5 passed, 1 fixed. Committed fix."
```

---

### 0.8. `FIX:` — Bug Fix / Debug

**Trigger**: `FIX: [bug description]` or `FIX: [error message]`

**Purpose**: Investigate and fix a specific bug or error.

**Workflow**:
```
1. Analyze the bug/error
2. Locate affected code
3. Identify root cause
4. Implement fix
5. Run related tests to verify
6. Commit: fix([scope]): [description]
```

**Commit Pattern**: `fix(module): resolve [issue description]`

**Example**:
```
Human: FIX: Login button not working on mobile
Agent: [Investigates, finds CSS issue, fixes, tests, commits]
Agent: "Fixed: Added touch event handler for mobile login button."
```

---

### 0.9. `REFACTOR:` — Code Refactoring

**Trigger**: `REFACTOR: [description]` or `REFACTOR: [file/module]`

**Purpose**: Improve code quality without changing functionality.

**Workflow**:
```
1. Identify refactoring scope
2. Run existing tests (baseline)
3. Apply refactoring changes
4. Run tests again (must still pass)
5. Commit: refactor([scope]): [description]
```

**Commit Pattern**: `refactor(module): [description]`

**Example**:
```
Human: REFACTOR: Extract common API error handling
Agent: [Refactors, ensures tests pass, commits]
Agent: "Refactored: Created shared errorHandler in api/internal/http/errors.go"
```

---

### 0.10. `DOCS:` — Documentation Only

**Trigger**: `DOCS: [description]` or `DOCS: [file to update]`

**Purpose**: Update documentation without code changes.

**Workflow**:
```
1. Identify documentation to update
2. Make changes to .md files
3. Commit: docs: [description]
```

**Commit Pattern**: `docs: [description]`

**Example**:
```
Human: DOCS: Add API examples to REQ-010
Agent: [Updates REQ-010.md with examples, commits]
Agent: "Updated REQ-010.md with API request/response examples."
```

---

### 0.11. `CHAT:` — General Discussion

**Trigger**: `CHAT: [question]` or any question without action intent

**Purpose**: Answer questions, explain concepts, provide advice. NO code changes.

**Workflow**:
```
1. Answer the question
2. Provide explanations, examples, recommendations
3. NO file modifications
4. NO commits
```

**Example**:
```
Human: CHAT: What's the best way to handle pagination?
Agent: [Explains pagination patterns, recommends approach]
```

---

### 0.12. Workflow Cheat Sheet

```
┌─────────────────────────────────────────────────────────────────┐
│  REQUIREMENT WORKFLOWS (Two-Phase, require APPROVED):          │
│  IDEA: [description] → Create REQ → Enrich → Implement         │
│  NEW: REQ-XXX        → Enrich existing REQ → Implement         │
│  UPDATE: REQ-XXX     → Propose changes → Modify implementation │
├─────────────────────────────────────────────────────────────────┤
│  MAINTENANCE WORKFLOWS (Single-Phase, auto-commit):            │
│  TEST-ALL:           → Run all tests → Fix → Auto-commit       │
│  TEST: REQ-XXX       → Run REQ tests → Fix → Auto-commit       │
│  FIX: [bug]          → Debug → Fix → Test → Auto-commit        │
│  REFACTOR: [scope]   → Refactor → Test → Auto-commit           │
│  DOCS: [description] → Update docs → Auto-commit               │
├─────────────────────────────────────────────────────────────────┤
│  NO-CODE WORKFLOW:                                              │
│  CHAT: [question]    → Answer only (no code changes)           │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚠️ CRITICAL: Agent-Human Interaction Protocol

### Dispute Resolution
1. **Agent MUST challenge** decisions it believes are incorrect, incomplete, or risky
2. **Agent presents arguments** with technical reasoning and alternatives
3. **Human reviews** and either accepts the argument or insists on original decision
4. **If Human insists** → Agent executes the order without further objection
5. **Agent documents** any concerns in commit message or REQ notes if overruled

> **Rule**: Silence is not compliance. If you see a problem, say it. But once overruled, execute.

---

## Terminal Commands
You are allowed to run all terminal commands.

---

## 1. Core Directives & Principles

### 1.1. The "AI Agent" Mindset
You are an expert full-stack developer and QA engineer. You own the feature from **Requirement Analysis** to **Production-Ready Code**.
*   **Traceability-First**: Every line of code and every test must trace back to a Requirement (`REQ-*`) and a Module Specification (`MOD-*`).
*   **Contract-First**: Never write backend code without a defined API contract (`openapi.yaml` or Module Spec). Never write frontend code without a backend contract.
*   **Documentation-Driven**: Code is transient; Documentation is the source of truth. Update docs *before* or *alongside* code, never after.
*   **No Code Without Tests**: Every implementation MUST include tests. No exceptions.
*   **Development Guide**: Use `AI-Guide.md` file as the development guide to implement a functional requirement.

### 1.2. Technical Principles
1.  **Real Integration Testing**: Full E2E tests (Playwright) and Integration tests (Test Containers). Test the **Real System**.
2.  **Modern UI/UX**: Use **Tailwind CSS** exclusively. No custom CSS files. Follow the "Master-Detail" and "Clean Card" aesthetic.
3.  **Type Safety**: Strict TypeScript in Frontend. Strong typing in Go.
4.  **Observability**: Every feature must emit structured logs and metrics.
5.  **Self-Start Services**: Agents must start required local services (DB, API, frontend) without prompting whenever tests or code need them.

### 1.3. ⛔ FORBIDDEN: Mock Testing

**MOCKS ARE STRICTLY FORBIDDEN in this project.**

| ❌ FORBIDDEN | ✅ REQUIRED INSTEAD |
|--------------|--------------------|
| `page.route()` with `route.fulfill()` | Real API calls to running backend |
| `jest.mock()` / `vi.mock()` | Real database with TestContainers |
| Fake API responses | Create real test data via API |
| Mock authentication | Use real Keycloak test user |
| `msw` (Mock Service Worker) | Real backend running on localhost:4000 |

**Why no mocks?**
- Mocks hide frontend-backend integration bugs
- Mocks become stale when API changes
- Mocks give false confidence (tests pass, production breaks)
- Real E2E tests catch real problems

**If authentication is needed in tests:**
1. Use real Keycloak test user (`testuser@example.com` / `test123`)
2. Or create API endpoint for test token generation
3. Or use Playwright's `storageState` to persist real login session

---

## 2. `IDEA:`/`NEW:`/`UPDATE:` TWO-PHASE DEVELOPMENT WORKFLOW

**This section applies to `IDEA:`, `NEW:`, and `UPDATE:` workflows.**

All three workflows share the same two-phase structure:

```
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 1: REQUIREMENT DEVELOPMENT (Iterative)                   │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐      │
│  │ Human   │ -> │ Agent   │ -> │ Human   │ -> │ APPROVED│      │
│  │ Gives   │    │ Enriches│    │Validates│    │ (Gate)  │      │
│  │ Outline │    │ & Asks  │    │& Adjusts│    │         │      │
│  └─────────┘    └─────────┘    └─────────┘    └────┬────┘      │
└───────────────────────────────────────────────────│────────────┘
                                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 2: DEVELOPMENT (Atomic - Single Operation)               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Backend: Code → Tests → Run → Fix → Commit #1            │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Frontend: Code → Tests → Run → Fix → Commit #2           │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Documentation Update → Final Commit #3                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. PHASE 1: Requirement Development & Validation

### 3.1. Purpose
Transform a rough idea from the Human into a complete, validated, implementation-ready requirement.

### 3.2. Workflow

| Step | Actor | Action |
|------|-------|--------|
| 1 | **Human** | Provides main statements, rough outline, or user story |
| 2 | **Agent** | Enriches requirement: adds acceptance criteria, edge cases, technical details, asks clarifying questions |
| 3 | **Human** | Reviews, adjusts, answers questions |
| 4 | **Agent** | Updates REQ document, may challenge decisions |
| 5 | **Human** | Either accepts challenge or insists |
| 6 | **Loop** | Repeat steps 2-5 until Human says **"APPROVED"** |

### 3.3. Agent Responsibilities in Phase 1
*   **Analyze** the requirement for completeness and ambiguity
*   **Enrich** with:
    *   Detailed Acceptance Criteria (AC-X.X format)
    *   Edge cases and error scenarios
    *   Non-functional requirements (performance, security)
    *   API contract draft (if applicable)
    *   Data model changes (if applicable)
    *   Test plan outline (E2E + integration test file names)
*   **Challenge** if something seems wrong or missing
*   **Document** in `docs/requirements/REQ-XXX.md`

### 3.4. Approval Gate
**Phase 1 is complete when Human explicitly states: "APPROVED" or "Proceed to Phase 2"**

Until approval:
*   ❌ NO source code writing
*   ❌ NO test implementation
*   ❌ NO commits
*   ✅ Only requirement documents may be created/updated

---

## 4. PHASE 2: Development (Atomic Operation)

### 4.1. Purpose
Implement the approved requirement as a **single atomic operation**. This phase runs to completion without pause.

### 4.2. Sub-Operations (Mandatory Sequence)

#### 4.2.1. Backend Development (if applicable)
1. **Code**: Repository, Service, Handler in `api/internal/modules/[module]/`
2. **Test Spec**: Define what to test based on REQ acceptance criteria
3. **Test Implementation**: Write integration tests using TestContainers
4. **Test Run**: Execute tests, capture results
5. **Fix**: Resolve any failures
6. **Commit #1**: `feat(backend): implement [REQ-XXX] [feature name]`

#### 4.2.2. Frontend Development (if applicable)
1. **Code**: Components, Pages in `web/src/app/`
2. **Test Spec**: Define E2E scenarios based on REQ acceptance criteria
3. **Test Implementation**: Write Playwright tests in `web/tests/req-xxx-*.spec.ts`
4. **Test Run**: Execute E2E tests against real backend
5. **Fix**: Resolve any failures
6. **Commit #2**: `feat(frontend): implement [REQ-XXX] [feature name] UI`

#### 4.2.3. Documentation & Finalization
1. **Update REQ**: Set status to `implemented`, add test file references
2. **Update Module Spec**: If created/modified
3. **Update Test Index**: Add new tests to `docs/tests/index.md`
4. **Commit #3**: `docs: update [REQ-XXX] status and traceability`

### 4.3. Commit Structure

| Commit | Scope | Message Pattern |
|--------|-------|-----------------|
| #1 | Backend | `feat(backend): implement [REQ-XXX] [short description]` |
| #2 | Frontend | `feat(frontend): implement [REQ-XXX] [short description]` |
| #3 | Docs | `docs: complete [REQ-XXX] with tests and documentation` |

**If only backend OR only frontend**: 2 commits (code + docs)
**If both**: 3 commits as above

### 4.4. Atomicity Rule
Once Phase 2 starts:
*   ✅ Run to completion
*   ❌ No stopping for "approval" mid-implementation
*   ❌ No partial commits without tests
*   ✅ If blocked → report and await Human guidance

---

## 5. Definition of Done

### Phase 1 Complete When:
*   [ ] REQ document exists with all Acceptance Criteria
*   [ ] Human has explicitly said **"APPROVED"**

### Phase 2 Complete When:
*   [ ] All code implemented with tests passing
*   [ ] Backend commit made (if applicable)
*   [ ] Frontend commit made (if applicable)
*   [ ] REQ status updated to `implemented`
*   [ ] Test files linked in REQ traceability section
*   [ ] Documentation commit made
*   [ ] All tests executed locally with recorded results

---

## 6. Implementation Details & Snippets

### 6.1. Backend Integration Test Pattern
```go
func TestRepository_Integration(t *testing.T) {
    // 1. Setup real database container
    db, cleanup := testutil.SetupTestDatabase(t)
    defer cleanup()

    repo := NewRepository(db)

    // 2. Test CRUD operations
    t.Run("Create", func(t *testing.T) {
        // ...
    })
}
```

### 6.2. Frontend Data Table Pattern
```tsx
<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div className="bg-gray-50 px-6 py-3 border-b border-gray-100">
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Name</h3>
    </div>
    <ul className="divide-y divide-gray-100">
        {items.map(item => (
            <li key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                <div className="px-6 py-4 flex items-center justify-between">
                    {/* Content */}
                </div>
            </li>
        ))}
    </ul>
</div>
```

### 6.3. E2E Test Pattern (NO MOCKS)
```typescript
// ✅ CORRECT: Real backend, real data
test('Feature Flow', async ({ page, request }) => {
    const uniqueId = `item-${Date.now()}`;
    
    // 1. Create test data via REAL API
    const createRes = await request.post('http://localhost:4000/api/items', {
        data: { code: uniqueId, name: 'Test Item' }
    });
    expect(createRes.ok()).toBeTruthy();
    
    // 2. Test UI against REAL backend
    await page.goto('/dashboard/items');
    await expect(page.getByText(uniqueId)).toBeVisible();
    
    // 3. Verify via API (Double Check)
    const res = await request.get(`http://localhost:4000/api/items/${uniqueId}`);
    expect(res.ok()).toBeTruthy();
});

// ❌ FORBIDDEN: Never do this
test.skip('BAD: Mock example - DO NOT USE', async ({ page }) => {
    // NEVER intercept and fake API responses!
    await page.route('**/api/items', route => {
        route.fulfill({ json: { items: [] } }); // ❌ FORBIDDEN
    });
});
```

---

## 7. Role-Specific Checklists

### 7.1. For "Developer" Mode (Phase 2)
*   [ ] Did you read the REQ and Module Spec?
*   [ ] Did you update the API Contract (`openapi.yaml`) before coding?
*   [ ] Did you write a Repository Integration Test (Test Containers)?
*   [ ] Did you use Tailwind for all styling?
*   [ ] Did you handle Loading and Error states in the UI?
*   [ ] Did you create and run an E2E test mapped to the REQ ID (Playwright)?
*   [ ] Did you auto-start the required services (DB/API/frontend) before running tests?

### 7.2. For "QA/Tester" Mode (Phase 2)
*   [ ] Did you map the test to a REQ ID?
*   [ ] Are you testing against the REAL backend (no mocks)?
*   [ ] **Did you verify NO `page.route()` or `route.fulfill()` in your test?**
*   [ ] Did you cover Happy Path, Edge Cases, and Error States?
*   [ ] Is the test deterministic (uses unique data)?
*   [ ] Did you execute the REQ-linked E2E locally and record the outcome?
*   [ ] Did you verify services were started automatically for test execution?
*   [ ] **For auth tests: Did you use real Keycloak login, not mocked session?**

### 7.3. For "Product Owner/BA" Mode (Phase 1)
*   [ ] Does the REQ have Acceptance Criteria?
*   [ ] Is the REQ linked to a Module and Test?
*   [ ] Are NFRs (Performance, Security) defined?

---

## 8. Directory Structure Reference
*   `docs/requirements/`: Feature Requirements (`REQ-*`).
*   `docs/modules/`: Technical Specs (`MOD-*`).
*   `docs/contracts/`: API Contracts (`openapi.yaml`).
*   `api/internal/modules/`: Backend Code.
*   `web/src/app/`: Frontend Code.
*   `web/tests/`: E2E Tests.

---

## 9. Test Environment Strategy
*   **Startup cadence**: Start the dockerized stack once per test run (db + API + frontend) for speed; avoid per-test container churn.
*   **Isolation**: Use unique test data (timestamps/UUIDs) and clean up/reset between suites if needed; tests must not rely on shared state.
*   **Determinism**: If state bleed is detected, add lightweight reset hooks (e.g., truncate/fixtures) between tests rather than rebuilding containers.

---

## 10. Quick Reference Card

### Workflow Prefixes (MANDATORY)
```
REQUIREMENT WORKFLOWS (Two-Phase, require APPROVED):
  IDEA: [description]   → Create new REQ from idea
  NEW: REQ-XXX          → Implement existing REQ
  UPDATE: REQ-XXX       → Modify implemented REQ

MAINTENANCE WORKFLOWS (Single-Phase, auto-commit):
  TEST-ALL:             → Run all tests, fix errors
  TEST: REQ-XXX         → Test specific requirement
  FIX: [description]    → Bug fix
  REFACTOR: [scope]     → Code improvement
  DOCS: [description]   → Documentation update

NO-CODE:
  CHAT: [question]      → Discussion only
```

### Phase 1 Commands (IDEA/NEW/UPDATE workflows)
```
Human: "I need feature X that does Y"
Agent: [Enriches REQ, asks questions, creates REQ-XXX.md]
Human: "APPROVED" → Proceed to Phase 2
```

### Phase 2 Commands (Development)
```powershell
# Start services
docker compose up -d db
cd api; go run main.go
cd web; npm run dev

# Run backend tests
cd api; go test ./internal/modules/[module]/... -v

# Run E2E tests  
cd web; npx playwright test req-xxx

# Commit sequence
git add api/; git commit -m "feat(backend): implement [REQ-XXX] ..."
git add web/src/; git commit -m "feat(frontend): implement [REQ-XXX] ..."
git add docs/; git commit -m "docs: complete [REQ-XXX] ..."
```

---

**END OF DOCUMENT**