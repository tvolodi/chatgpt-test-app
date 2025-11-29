# Testing Strategy

## Overview

We use **real integration tests** instead of mocked tests to ensure the entire system works correctly.

## Test Types

### 1. Backend Integration Tests (Go)
**Location**: `api/internal/modules/tags/repository_integration_test.go`

**Uses**: Real PostgreSQL database via Test Containers

**Tests**:
- All CRUD operations with real database
- JSONB data integrity
- Edge cases (duplicates, not found, etc.)

**Run**:
```bash
cd api
go test -v ./internal/modules/tags -run Integration
```

**Benefits**:
- ✅ Tests actual SQL queries
- ✅ Catches database-specific issues
- ✅ Verifies JSONB handling
- ✅ Automatic container cleanup

### 2. Full E2E Tests (Playwright)
**Location**: `web/tests/*.spec.ts`

**Uses**: Real API server + Real database

**Tests**:
- Complete user workflows
- Frontend + Backend integration
- Actual API calls
- Real database operations

**Prerequisites**:
```bash
# Terminal 1: Start database
docker compose up -d db

# Terminal 2: Start API
cd api && go run main.go

# Terminal 3: Start frontend
cd web && npm run dev

# Terminal 4: Run tests
cd web && npm run test:e2e
```

**Benefits**:
- ✅ Tests entire stack
- ✅ No mocks to maintain
- ✅ Catches real integration issues
- ✅ True confidence in system

## ⛔ MOCKS ARE FORBIDDEN

**This project does NOT use mocks.** See `AI-Agent-Rules.md` Section 1.3.

| ❌ FORBIDDEN | ✅ USE INSTEAD |
|--------------|---------------|
| `page.route()` / `route.fulfill()` | Real API calls |
| `jest.mock()` / `vi.mock()` | Real database (TestContainers) |
| Mock authentication | Real Keycloak test user |
| Fake API responses | Create real test data via API |

## Why No Mocks?

**Problems with mocks**:
- ❌ Mocks diverge from real API over time
- ❌ Double work (maintain mocks AND fix real issues)
- ❌ False confidence (tests pass, production breaks)
- ❌ Hide frontend-backend integration bugs
- ❌ Maintenance burden grows with codebase

**Real example from this project**:
- Mock used `id` for delete
- Real API uses `code` for delete
- Tests passed, but app failed!

## Test Execution

### Quick Feedback (Development)
```bash
# Backend integration tests (~30s)
cd api && go test -v ./internal/modules/tags -run Integration
```

### Full Validation (Before Commit)
```bash
# Start all services
docker compose up -d db
cd api && go run main.go &
cd web && npm run dev &

# Run E2E tests
cd web && npm run test:e2e

# Cleanup
docker compose down
```

### CI/CD Pipeline
```yaml
# .github/workflows/test.yml
- name: Start services
  run: docker compose up -d
  
- name: Run backend integration tests
  run: cd api && go test -v ./...
  
- name: Run E2E tests
  run: cd web && npm run test:e2e
  
- name: Cleanup
  run: docker compose down
```

## Coverage Goals

| Test Type | Coverage Target |
|-----------|----------------|
| **Backend Integration** | 100% of CRUD operations |
| **E2E Tests** | All REQ acceptance criteria |
| **API Verification** | Double-check UI actions via API |

## Best Practices

### DO ✅
- Test against real database
- Test complete user workflows  
- Clean up test data after tests
- Use unique test data (`Date.now()`, UUIDs)
- Verify state via API after UI actions
- Start services before running tests
- Use `request` fixture for API calls in Playwright

### DON'T ❌
- ~~Mock API calls~~ → **FORBIDDEN**: `page.route()`, `route.fulfill()`
- ~~Mock database~~ → **FORBIDDEN**: Use TestContainers instead
- ~~Mock authentication~~ → **FORBIDDEN**: Use real Keycloak
- Leave test data in database
- Share test data between tests
- Use hardcoded IDs (use generated unique IDs)

## Troubleshooting

### E2E Tests Fail

**Check**:
1. Is API running? `curl http://localhost:4000/api/tags`
2. Is database running? `docker ps | grep postgres`
3. Is frontend running? `curl http://localhost:3000`

**Fix**:
```bash
docker compose up -d db
cd api && go run main.go
cd web && npm run dev
```

### Integration Tests Fail

**Check**:
1. Is Docker running?
2. Can Docker pull images?

**Fix**:
```bash
docker pull postgres:15-alpine
```

## Migration from Mocked Tests

> **See**: `docs/MOCK-REFACTORING-AUDIT.md` for list of files requiring refactoring.

**Old approach** (❌ FORBIDDEN):
```typescript
// ❌ FORBIDDEN - Never intercept API calls
await page.route('http://localhost:4000/api/tags', async (route) => {
    await route.fulfill({ json: mockData }); // ❌ NO!
});
```

**New approach** (✅ REQUIRED):
```typescript
// ✅ CORRECT - Use real API with Playwright request fixture
test('create tag', async ({ page, request }) => {
    // Create real test data
    const res = await request.post('http://localhost:4000/api/tags', {
        data: { code: `tag-${Date.now()}`, name: { en: 'Test' } }
    });
    expect(res.ok()).toBeTruthy();
    
    // Verify in UI
    await page.goto('/dashboard/tags');
    await expect(page.getByText('Test')).toBeVisible();
});
```

## Summary

**Philosophy**: Test the real system, not mocks.

**Result**: Higher confidence, less maintenance, fewer surprises.
