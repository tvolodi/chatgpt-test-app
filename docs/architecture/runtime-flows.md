# DOCUMENT_TYPE: ARCHITECTURE_RUNTIME_FLOWS
# VERSION: 1.0

## 1. Public Page (SEO)

1. Request hits Nginx -> Next.js route.
2. Next.js serves SSG/ISR HTML (or SSR if required) with full meta/schema.
3. Responses cached per TTL; assets served via CDN headers.

## 2. Authenticated Flow (Login)

1. User loads /login (SSR/SSG) -> posts to Go API /api/auth/login.
2. Go validates via Keycloak/OIDC or internal user store, issues session/JWT.
3. Next.js sets session (HTTP-only cookie) and redirects to /dashboard.

## 3. API Call (Authenticated)

1. Client sends request with bearer token/cookie -> Nginx -> Go API.
2. Go middleware validates token (issuer, audience, exp) and enforces roles/claims.
3. Response with structured JSON; metrics/logs emitted.

## 4. Indexing Job

1. Worker fetches content (DB/CMS) -> generates embeddings -> writes to vector store + search index.
2. Emits metrics/logs; retries with backoff.

## 5. Notes for AI AGENTS

- Keep flows in sync with contracts and Keycloak config.
- Update when rendering or auth strategies change.
