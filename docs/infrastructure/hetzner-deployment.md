# DOCUMENT_TYPE: INFRA_DEPLOYMENT
# TARGET: Hetzner VPS
# VERSION: 1.0

## 1. Topology

- Nginx front proxy (TLS, gzip/brotli, routing): / -> Next.js, /api -> Go API, auth subdomain -> Keycloak.
- Services: nextjs, go-api, keycloak, postgres, vector-store (pgvector/Qdrant), redis (optional), workers.

## 2. Packaging

- Docker images per service; docker-compose or Nomad to orchestrate.

## 3. Deployment Steps

- Pull images, run migrations, reload services; verify health endpoints.
- Zero-downtime via compose rolling or drain/replace.

## 4. Networking & TLS

- Use Hetzner firewall rules; LetsEncrypt via certbot or companion container.

## 5. Backups & Recovery

- Postgres dumps + Keycloak realm export; document restore steps.

## 6. Notes for AI AGENTS

- Keep image tags and env files documented; avoid snowflake hosts.
