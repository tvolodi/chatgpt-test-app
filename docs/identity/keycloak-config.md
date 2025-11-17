# DOCUMENT_TYPE: IDENTITY_CONFIG
# IDP: Keycloak
# VERSION: 1.0

## 1. Realm & Clients

- Realm: <name>
- Public clients: webapp (PKCE) with allowed redirects <urls>.
- Confidential clients: backend workers if needed.

## 2. Auth Flow

- PKCE for browser logins; short-lived access tokens, longer refresh tokens.
- Logout: front-channel + session invalidation.

## 3. Tokens & Claims

- Access token TTL: <e.g., 15m>; Refresh TTL: <e.g., 8h>.
- Roles/claims mapping: realm roles -> app roles/permissions.
- Include custom claims for tenant/org if applicable.

## 4. Security

- Enforce HTTPS, rotate keys regularly, enable brute-force protections.
- Configure CORS and allowed origins for webapp.

## 5. Ops

- Realm export/import procedure.
- Backup schedule and restore steps.

## 6. Notes for AI AGENTS

- Keep client IDs/redirects in sync with Next.js config and .env.
- Update when token lifetimes or roles change.
