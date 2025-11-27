# Mock Testing Refactoring Audit

**Date**: 2025-11-27  
**Status**: ACTION REQUIRED  
**Priority**: HIGH  

---

## Executive Summary

This audit identifies all E2E test files that use **forbidden mock patterns** (`page.route()` / `route.fulfill()`). These tests must be refactored to use real backend APIs.

---

## 🚨 Files Requiring Refactoring

| File | Mock Count | Priority | Complexity |
|------|-----------|----------|------------|
| `req-013-authenticated-comments.spec.ts` | 5 mocks | HIGH | Medium - needs real auth |
| `req-013-article-view.spec.ts` | 8 mocks | HIGH | Medium - needs real data setup |
| `req-012-public-articles.spec.ts` | 1 mock | MEDIUM | Low |
| `req-011-unsaved-warning.spec.ts` | 1 mock | MEDIUM | Low |
| `req-011-loading-errors.spec.ts` | 5 mocks | LOW | Medium - error testing |
| `req-001-token-refresh.spec.ts` | 4 mocks | HIGH | High - needs auth strategy |
| `articles.spec.ts` | 6 mocks | MEDIUM | Low - partial mocks |

**Total: 7 files, 30+ mock usages**

---

## Detailed Findings

### 1. `req-013-authenticated-comments.spec.ts` (5 mocks)

**Current Mocks:**
```typescript
// Mock session API
await page.route('**/api/auth/session', ...)
// Mock article detail
await page.route('**/api/articles/test-article-id', ...)
// Mock interactions
await page.route('**/api/articles/test-article-id/interactions', ...)
// Mock comments
await page.route('**/api/articles/test-article-id/comments', ...)
```

**Refactoring Strategy:**
1. Create real article via API before test
2. Use real Keycloak login or test auth endpoint
3. Post real comment and verify
4. Delete test data after test

---

### 2. `req-013-article-view.spec.ts` (8 mocks)

**Current Mocks:**
- Article list API
- Article detail API  
- Interactions API
- Comments API
- Auth session API

**Refactoring Strategy:**
1. Create 3+ test articles via API in `beforeAll`
2. Use real backend responses
3. Clean up articles in `afterAll`

---

### 3. `req-012-public-articles.spec.ts` (1 mock)

**Current Mock:**
```typescript
await page.route('**/api/articles/public*', async route => {
    await route.fulfill({ json: { articles: [], total: 0 }});
});
```

**Refactoring Strategy:**
- This is for "empty state" test
- Either delete all test articles first, OR
- Use a filter that returns no results

---

### 4. `req-011-unsaved-warning.spec.ts` (1 mock)

**Current Mock:**
```typescript
await page.route('**/api/articles', async route => {
    if (route.request().method() === 'POST') {
        await route.fulfill({ status: 201, json: { id: 'new-id' }});
    }
});
```

**Refactoring Strategy:**
- Let real API handle the save
- Test navigation behavior after real save

---

### 5. `req-011-loading-errors.spec.ts` (5 mocks)

**Current Mocks:**
- Categories loading delay
- Tags loading delay  
- 404 error simulation

**Refactoring Strategy:**
- Loading states: Remove loading tests OR add artificial delay in test
- 404 errors: Use non-existent UUID like `00000000-0000-0000-0000-000000000000`

---

### 6. `req-001-token-refresh.spec.ts` (4 mocks)

**Current Mocks:**
- Session API with expiring tokens
- Token refresh simulation

**Refactoring Strategy:**
- This is complex - needs real Keycloak token with short expiry
- Options:
  1. Configure test realm with 5-second token expiry
  2. Create `/api/auth/test-session` endpoint for testing
  3. Use Playwright's `storageState` with real session

---

### 7. `articles.spec.ts` (6 mocks)

**Current Mocks:**
- Error state simulation (500 responses)

**Refactoring Strategy:**
- Error tests are valid use case for mocks (simulating server errors)
- **EXCEPTION**: Keep error simulation mocks BUT clearly document them
- Move error tests to separate file: `articles-error-states.spec.ts`

---

## Recommended Refactoring Order

### Phase 1: Easy Wins (1-2 hours each)
1. `req-012-public-articles.spec.ts` - 1 mock, simple fix
2. `req-011-unsaved-warning.spec.ts` - 1 mock, simple fix

### Phase 2: Medium Complexity (2-4 hours each)
3. `req-013-article-view.spec.ts` - Need test data factory
4. `articles.spec.ts` - Separate error tests

### Phase 3: Auth-Related (4-8 hours)
5. `req-013-authenticated-comments.spec.ts` - Needs auth strategy
6. `req-001-token-refresh.spec.ts` - Needs Keycloak config

### Phase 4: Edge Cases
7. `req-011-loading-errors.spec.ts` - Decide on approach

---

## Helper Utilities Needed

### 1. Test Data Factory
```typescript
// web/tests/helpers/test-factory.ts
export async function createTestArticle(request: APIRequestContext): Promise<Article> {
    const res = await request.post('http://localhost:4000/api/articles', {
        data: {
            title: `Test Article ${Date.now()}`,
            body: '# Test Content',
            status: 'PUBLISHED'
        }
    });
    return res.json();
}

export async function deleteTestArticle(request: APIRequestContext, id: string): Promise<void> {
    await request.delete(`http://localhost:4000/api/articles/${id}`);
}
```

### 2. Auth Helper (Option A: Real Login)
```typescript
// web/tests/helpers/auth.ts
export async function loginAsTestUser(page: Page): Promise<void> {
    await page.goto('/api/auth/signin');
    // ... perform real Keycloak login
}
```

### 3. Auth Helper (Option B: Test Token Endpoint)
```go
// api/internal/auth/test_handler.go (dev only)
func handleTestToken(w http.ResponseWriter, r *http.Request) {
    if os.Getenv("ENV") != "test" {
        http.Error(w, "forbidden", 403)
        return
    }
    // Return valid test token
}
```

---

## Success Criteria

After refactoring:
- [ ] `grep -r "page.route" web/tests/` returns 0 results (except documented exceptions)
- [ ] `grep -r "route.fulfill" web/tests/` returns 0 results (except documented exceptions)
- [ ] All tests pass against real backend
- [ ] No `mock` word in test files (except error simulation docs)

---

## Exceptions (Allowed Mock Usage)

The ONLY acceptable use of `page.route()` is for **error simulation** that cannot be triggered otherwise:

```typescript
// ✅ ALLOWED: Simulating server errors for error handling tests
test('displays error when server returns 500', async ({ page }) => {
    // Document why mock is necessary
    await page.route('**/api/articles', route => {
        route.fulfill({ status: 500, body: 'Internal Server Error' });
    });
    // ... test error UI
});
```

These tests MUST:
1. Be in a separate `*-error-states.spec.ts` file
2. Include comment explaining why mock is necessary
3. Be minimal (only mock the specific error, not entire flow)

---

**END OF AUDIT**
