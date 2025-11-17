# DOCUMENT_TYPE: TEST_CASE
# TC_ID: TC-FUNC-001
# VERSION: 1.0

## 1. Summary

- Type: functional
- Title: Login API success
- Status: implemented
- Related Requirements:
  - REQ-001
  - REQ-010
  - REQ-011
- Related Modules:
  - MOD-BE-Auth

## 2. Pre-Conditions

- User with known email/password exists in the database.
- Authentication service is running.

## 3. Test Steps

1. Send POST `/api/auth/login` with valid email and password.
2. Inspect response.

## 4. Expected Result

- Response code is 200.
- Response body contains a non-empty `token`.
- Response body contains a `user` object with expected fields.

## 5. Automation

- File: `backend/tests/auth/login_success.test.ts`
- Framework: (e.g., Jest, Mocha, or similar)

## 6. Notes for AI AGENTS

- Use this spec to scaffold or verify functional tests for the login API.
