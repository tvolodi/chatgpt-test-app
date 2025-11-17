# DOCUMENT_TYPE: ARCHITECTURE_CONTEXT
# VERSION: 1.0

## 1. Purpose

High-level context for the AI-driven Next.js (SSR/SSG/ISR) + Go API + Keycloak stack deployed on Hetzner.

## 2. Components

- Web: Next.js (React) with SSR/SSG/ISR for SEO-friendly HTML.
- API: Go services (stateless) exposed via REST/GraphQL.
- Auth: Keycloak (OIDC + PKCE) for identity and roles/claims.
- Data: Postgres (system of record), vector store (pgvector or Qdrant) for AI search.
- Edge/Proxy: Nginx/Hetzner load balancer for TLS, gzip/brotli, caching, routing.
- Background: Workers for indexing, notifications, cron jobs.
- Observability: Logging, metrics, tracing pipeline.

## 3. External Dependencies

- Email/SMS provider (if needed)
- Object storage/CDN for assets (optional)

## 4. Deployment Topology (Hetzner VPS)

- Dockerized services behind Nginx; Keycloak reachable at auth subdomain; API at /api; Next.js at root.
- Single VPS baseline with option to split services later.

## 5. Notes for AI AGENTS

- Keep public pages server-rendered for crawlability.
- Coordinate module specs with contracts under docs/contracts.
