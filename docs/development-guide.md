# AI Agent Development Directives & Guide

**Version**: 2.0
**Status**: Active
**Purpose**: This is the **Single Source of Truth** for AI Agents (and humans) working on the AI-Dala project. It consolidates development standards, workflows, and role-specific instructions.

---

## 1. Core Directives & Principles

### 1.1. The "AI Agent" Mindset
You are an expert full-stack developer and QA engineer. You own the feature from **Requirement Analysis** to **Production-Ready Code**.
*   **Traceability-First**: Every line of code and every test must trace back to a Requirement (`REQ-*`) and a Module Specification (`MOD-*`).
*   **Contract-First**: Never write backend code without a defined API contract (`openapi.yaml` or Module Spec). Never write frontend code without a backend contract.
*   **Documentation-Driven**: Code is transient; Documentation is the source of truth. Update docs *before* or *alongside* code, never after.

### 1.2. Technical Principles
1.  **Real Integration Testing**: Prioritize full E2E tests (Playwright) and Integration tests (Test Containers) over mocks. Test the **Real System**.
2.  **Modern UI/UX**: Use **Tailwind CSS** exclusively. No custom CSS files. Follow the "Master-Detail" and "Clean Card" aesthetic.
3.  **Type Safety**: Strict TypeScript in Frontend. Strong typing in Go.
4.  **Observability**: Every feature must emit structured logs and metrics.

---

## 2. Standard Development Workflow

Follow this cycle for every feature request:

### Phase 1: Planning & Analysis
*   **Input**: Read `docs/requirements/REQ-*`.
*   **Action**:
    *   Analyze requirements for completeness and ambiguity.
    *   **Update Docs First**: Create/Update Module Specs (`docs/modules/`) and API Contracts.
    *   Define the **API Interface** (Endpoints, Request/Response models).
    *   Plan the **Data Model** changes.

### Phase 2: Backend Implementation (Go)
*   **Database**:
    *   Create SQL migrations in `api/internal/database/migrations`.
    *   Use `sqlx` for data access.
*   **Repository Layer**:
    *   Implement `internal/modules/[module]/repository.go`.
    *   **MANDATORY**: Write Integration Tests in `internal/modules/[module]/repository_integration_test.go` using **Test Containers**.
*   **Service & Handler**:
    *   Implement business logic and HTTP handlers.
    *   Register routes in `internal/http/server/server.go`.
*   **Checkpoint Commit**:
    *   `feat(backend): implement [feature] core logic`

### Phase 3: Frontend Implementation (Next.js + Tailwind)
*   **Design**:
    *   Use Tailwind CSS utility classes.
    *   **Pattern**: Container (`bg-white shadow-sm`), Header (`bg-gray-50`), Interactive Rows (`hover:bg-gray-50`).
*   **Components**:
    *   Create reusable components in `src/app/components/[module]/`.
    *   Use `fetch` for API calls. Handle `loading` and `error` states explicitly.
*   **Pages**:
    *   Implement pages in `src/app/[locale]/dashboard/[module]/page.tsx`.

### Phase 4: Verification (E2E Testing)
*   **Tool**: Playwright (`web/tests/`).
*   **Philosophy**: **No Mocks**. Run against the real Go Backend and Postgres Database.
*   **Workflow**:
    1.  Ensure `docker compose up db`, `go run main.go`, and `npm run dev` are running.
    2.  Write `tests/[feature].spec.ts`.
    3.  **Pattern**:
        *   Generate unique test data (e.g., `const code = 'test-' + Date.now()`).
        *   Perform Actions (UI or API).
        *   Verify State (UI visibility AND Backend API checks).
        *   Clean up resources (if necessary, though unique IDs mitigate this).

### Phase 5: Documentation & Handoff
*   **Integrity Check**:
    *   Update `REQ-*` status to `implemented`.
    *   Link new Tests and Code files in the `REQ-*` Traceability section.
    *   Update `task.md` and `implementation_plan.md`.
*   **Final Commit**:
    *   `feat: complete [feature] with UI and E2E tests`

---

## 3. Implementation Details & Snippets

### 3.1. Backend Integration Test Pattern
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

### 3.2. Frontend Data Table Pattern
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

### 3.3. E2E Test Pattern
```typescript
test('Feature Flow', async ({ page }) => {
    const uniqueId = `item-${Date.now()}`;
    
    // 1. Create via UI
    await page.goto('/dashboard/items/new');
    await page.fill('input[name="code"]', uniqueId);
    await page.click('button[type="submit"]');

    // 2. Verify via API (Double Check)
    const res = await fetch(`http://localhost:4000/api/items/${uniqueId}`);
    expect(res.ok).toBeTruthy();
});
```

---

## 4. Role-Specific Checklists

### 4.1. For "Developer" Mode
*   [ ] Did you read the REQ and Module Spec?
*   [ ] Did you update the API Contract (`openapi.yaml`) before coding?
*   [ ] Did you write a Repository Integration Test (Test Containers)?
*   [ ] Did you use Tailwind for all styling?
*   [ ] Did you handle Loading and Error states in the UI?

### 4.2. For "QA/Tester" Mode
*   [ ] Did you map the test to a REQ ID?
*   [ ] Are you testing against the REAL backend (no mocks)?
*   [ ] Did you cover Happy Path, Edge Cases, and Error States?
*   [ ] Is the test deterministic (uses unique data)?

### 4.3. For "Product Owner/BA" Mode
*   [ ] Does the REQ have Acceptance Criteria?
*   [ ] Is the REQ linked to a Module and Test?
*   [ ] Are NFRs (Performance, Security) defined?

---

## 5. Directory Structure Reference
*   `docs/requirements/`: Feature Requirements (`REQ-*`).
*   `docs/modules/`: Technical Specs (`MOD-*`).
*   `docs/contracts/`: API Contracts (`openapi.yaml`).
*   `api/internal/modules/`: Backend Code.
*   `web/src/app/`: Frontend Code.
*   `web/tests/`: E2E Tests.
