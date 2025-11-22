# Development Guide: Feature Implementation Standard

This guide outlines the standard workflow for implementing new features in the AI-Dala project, based on the successful implementation of the Tag Management system.

## Core Principles

1.  **Real Integration Testing**: We prioritize full E2E tests with real backend/database over mocked tests.
2.  **Modern UI/UX**: We use Tailwind CSS for consistent, modern, and responsive design.
3.  **Type Safety**: Full TypeScript support across the stack.

---

## 1. Backend Implementation (Go)

### 1.1. Repository Layer
Implement data access with `sqlx` and `squirrel` (if needed).

**Key Requirement**: Use **Test Containers** for integration testing.

*   **File**: `internal/modules/[module]/repository.go`
*   **Test File**: `internal/modules/[module]/repository_integration_test.go`

**Integration Test Pattern:**
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

### 1.2. Service & Handler Layers
Implement business logic and HTTP handlers.
*   Register routes in `internal/http/server/server.go`.
*   Unit tests (optional for simple CRUD, required for complex logic).

---

## 2. Frontend Implementation (Next.js + Tailwind)

### 2.1. Component Design
Use **Tailwind CSS** for styling. Avoid custom CSS files.

**Standard Data Table Pattern (`TagList.tsx` example):**
*   **Container**: `bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden`
*   **Header**: `bg-gray-50 text-xs font-medium text-gray-500 uppercase`
*   **Rows**: `hover:bg-gray-50 transition-colors duration-150`
*   **Badges**: `inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800`
*   **Action Buttons**:
    *   Edit: `text-indigo-600 hover:text-indigo-900` (or outlined button)
    *   Delete: `text-red-600 hover:text-red-900` (or outlined button)

**Standard Form Pattern (`TagForm.tsx` example):**
*   **Layout**: Grid-based or Stacked.
*   **Container**: `bg-white rounded-lg shadow-sm border border-gray-200`
*   **Inputs**: `block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`
*   **Actions**: Footer with "Cancel" (secondary) and "Save" (primary) buttons.

### 2.2. Page Implementation
*   Use `fetch` for API calls to the Go backend (`http://localhost:4000/api/...`).
*   Handle loading and error states.
*   Use `next/navigation` for routing (`useRouter`).

---

## 3. End-to-End Testing (Playwright)

**Philosophy**: Test the **Real System**. Do not mock the API or Database.

### 3.1. Test Setup
Ensure all services are running before testing:
1.  **Database**: `docker compose up -d db`
2.  **Backend**: `go run main.go`
3.  **Frontend**: `npm run dev`

### 3.2. Test Structure (`tests/[feature].spec.ts`)

**Pattern:**
1.  **Unique Test Data**: Generate unique IDs/codes (e.g., `test-item-${Date.now()}`) to avoid collisions.
2.  **Real API Calls**: Use `fetch` in `test.beforeAll` or inside tests to setup/verify state directly in the backend.
3.  **Cleanup**: Delete created data in `test.afterEach` or `test.afterAll`.

**Example:**
```typescript
test.describe('Feature E2E', () => {
    const testCode = `e2e-${Date.now()}`;

    test('Create Item', async ({ page }) => {
        await page.goto('/dashboard/items/create');
        await page.fill('input[name="code"]', testCode);
        await page.click('button[type="submit"]');
        
        // Verify UI redirect
        await expect(page).toHaveURL(/\/dashboard\/items$/);
        
        // Verify Item exists in list
        await expect(page.getByText(testCode)).toBeVisible();
    });

    test('Delete Item', async ({ page }) => {
        // 1. Create item via API first
        await fetch('http://localhost:4000/api/items', {
            method: 'POST',
            body: JSON.stringify({ code: testCode, ... })
        });

        // 2. Delete via UI
        await page.goto('/dashboard/items');
        await page.click(`button[data-delete="${testCode}"]`);

        // 3. Verify UI update
        await expect(page.getByText(testCode)).not.toBeVisible();

        // 4. Verify Backend deletion (Double Check)
        const res = await fetch(`http://localhost:4000/api/items/${testCode}`);
        expect(res.status).toBe(404);
    });
});
```

---

## 4. Workflow Summary

1.  **Plan**: Define requirements and data model.
    *   Analyze requirements for fullness, logical correctness, and readiness for development. Propose recommendation options if any.
    *   Analyze data model. Make audit and propose recommendation options if appropriate.
    *   **Define API Interface**: List endpoints, request/response JSON examples, and error codes to align Backend and Frontend.
2.  **Backend**:
    *   Create Migration.
    *   Implement Repository + Integration Tests (Test Containers).
    *   Implement Service & Handler.
    *   Run tests for backend and correct issues.
    *   **Commit Backend**: Create a checkpoint commit (e.g., `feat(backend): implement [feature] core logic`).
3.  **Frontend**:
    *   Create Components (Table, Form) using Tailwind.
    *   Implement Pages (List, Create, Edit).
4.  **Verify**:
    *   Write E2E tests (Real API + DB).
    *   Run `npm run test:e2e`. Correct any issues.
    *   **Commit Full Feature**: Final commit with UI and tests (e.g., `feat: complete [feature] with UI and E2E tests`).
5.  **Documents**:
    *   Update requirement detail specification with implementation information.
