# DOCUMENT_TYPE: ENDPOINT_SPEC
# MODULE_ID: MOD-BE-Auth
# EP_ID: EP-Login
# VERSION: 1.0

## 1. Summary

- Method: POST
- Path: /api/auth/login
- Description: Authenticate user via email + password.
- Status: in_progress
- Related Requirements:
  - REQ-001
  - REQ-010
  - REQ-011

## 2. Request

```json
{
  "email": "user@example.com",
  "password": "string"
}
```

Validation rules:

- `email`: required, valid email.
- `password`: required, min length 8.

## 3. Responses

### 200 OK

```json
{
  "token": "JWT or session token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "string"
  }
}
```

### 401 Unauthorized

```json
{
  "error_code": "INVALID_CREDENTIALS",
  "message": "Invalid email or password."
}
```

### Other

- 429 Too Many Requests
- 500 Internal Server Error

## 4. Business Logic

- Steps:
  1. Fetch user by email.
  2. Verify password using secure hashing (see REQ-011).
  3. If valid, generate token.
  4. Update `last_login` timestamp.
  5. Return token + user payload.

## 5. Performance Expectations (REQ-010)

- Target response time: < 500ms p95 under normal load.
- Use index on `users.email`.

## 6. Security

- HTTPS only.
- Rate limit by IP + email.
- Lockout/backoff after repeated failures.

## 7. Implementation Status

- Code Status: in_progress
- Test Coverage:
  - Unit: TC-UNIT-010
  - Functional: TC-FUNC-001

## 8. Notes for AI AGENTS

- Implement this endpoint strictly according to this spec.
- Coordinate with the frontend contract defined in `MOD-FE-Login`.
