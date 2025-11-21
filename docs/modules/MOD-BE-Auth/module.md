# DOCUMENT_TYPE: MODULE_SPEC
# MODULE_ID: MOD-BE-Auth
# VERSION: 2.0

## 1. Summary

- Title: Authentication Module
- Description: Validates JWT tokens issued by Keycloak.
- Tech Stack: Go, jwt-go/v5, jwks-rsa.

## 2. Responsibilities

- Verify JWT signature using Keycloak's JWKS (JSON Web Key Set).
- Validate token claims (issuer, audience, expiration).
- Extract user identity from token.

## 3. Dependencies

- Internal: `internal/auth` package.
- External: Keycloak (for public keys).

## 4. Interface (Public API)

- Middleware: Protects routes requiring authentication.
- No public login endpoint (handled by Keycloak).

## 5. Data Models

- `UserContext`: Extracted from JWT (ID, Email, Roles).

## 6. Traceability

- Implements: REQ-001 (Login), REQ-011 (Security).
- Related Tests: `TC-FUNC-001`.
