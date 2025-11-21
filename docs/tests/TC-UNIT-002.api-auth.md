# DOCUMENT_TYPE: TEST_CASE
# TC_ID: TC-UNIT-002
# TEST_TYPE: UNIT
# SCOPE: API Authentication

## 1. Objective
Verify that the `internal/auth` package and `server` login handler correctly implement JWT issuance and Bcrypt password verification.

## 2. Pre-conditions
- Go environment installed.
- `go mod tidy` run.

## 3. Test Steps

### 3.1 Auth Service (`service_test.go`)
1. **Login Success**:
   - Input: Valid email/password (seeded).
   - Expected: Non-empty JWT token, correct User object.
   - Verify: Token parses and is valid.
2. **Invalid Password**:
   - Input: Valid email, wrong password.
   - Expected: `ErrInvalidCredentials`.
3. **User Not Found**:
   - Input: Non-existent email.
   - Expected: `ErrInvalidCredentials`.

### 3.2 Login Handler (`server_test.go`)
1. **Valid Request**:
   - Input: POST `/api/auth/login` with valid JSON credentials.
   - Mock: Auth service returns success.
   - Expected: 200 OK, JSON body with `token` and `user`.
2. **Invalid Payload**:
   - Input: Malformed JSON.
   - Expected: 400 Bad Request, `INVALID_PAYLOAD`.
3. **Auth Failure**:
   - Input: Valid JSON, invalid credentials.
   - Mock: Auth service returns error.
   - Expected: 401 Unauthorized, `INVALID_CREDENTIALS`.

## 4. Automated Execution
```bash
cd api
go test -v ./internal/auth ./internal/http/server
```

## 5. Pass/Fail Criteria
- All tests must pass with `PASS` status.
- No race conditions detected (run with `-race` if needed).
