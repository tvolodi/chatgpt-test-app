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

### 3. Unit Tests (Minimal)
**Location**: `api/internal/modules/tags/*_test.go`

**Uses**: Mocks (only for isolated logic)

**When to use**:
- Complex business logic
- Pure functions
- Algorithm testing

**When NOT to use**:
- Simple CRUD operations
- Database queries
- API handlers

## Why No Mocked E2E Tests?

**Problems with mocks**:
- ❌ Mocks diverge from real API
- ❌ Double work (write mocks, then fix real issues)
- ❌ False confidence
- ❌ Maintenance burden

**Example issue we found**:
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

- **Backend Integration**: 100% of CRUD operations
- **E2E Tests**: All critical user workflows
- **Unit Tests**: Complex business logic only

## Best Practices

### DO ✅
- Test against real database
- Test complete user workflows
- Clean up test data
- Use unique test data (timestamps)
- Verify database state after operations

### DON'T ❌
- Mock API calls in E2E tests
- Mock database in integration tests
- Test simple getters/setters
- Leave test data in database
- Share test data between tests

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

**Old approach** (Mocked):
```typescript
// ❌ Mock API responses
await page.route('http://localhost:4000/api/tags', async (route) => {
    await route.fulfill({ json: mockData });
});
```

**New approach** (Real):
```typescript
// ✅ Use real API
await fetch('http://localhost:4000/api/tags', {
    method: 'POST',
    body: JSON.stringify(realData)
});
```

## Summary

**Philosophy**: Test the real system, not mocks.

**Result**: Higher confidence, less maintenance, fewer surprises.
