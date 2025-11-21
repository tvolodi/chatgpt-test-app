# DOCUMENT_TYPE: TEST_CASE
# TC_ID: TC-FUNC-001
# VERSION: 2.0

## 1. Summary

- Type: functional
- Title: JWT Token Verification
- Status: proposed
- Related Requirements:
  - REQ-001
  - REQ-011
- Related Modules:
  - MOD-BE-Auth

## 2. Pre-Conditions

- Keycloak server is running (or mocked with JWKS).
- Valid JWT signed by Keycloak is available.

## 3. Test Steps

1. Send GET `/api/protected/resource` with `Authorization: Bearer <valid_jwt>`.
2. Send GET `/api/protected/resource` with `Authorization: Bearer <invalid_jwt>`.

## 4. Expected Result

- Valid JWT: Response code is 200.
- Invalid JWT: Response code is 401 Unauthorized.

## 5. Automation

- File: `api/internal/auth/middleware_test.go`
- Framework: Go Test + Testify
