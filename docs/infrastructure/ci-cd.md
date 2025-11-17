# DOCUMENT_TYPE: CI_CD
# VERSION: 1.0

## 1. Pipelines

- Build & test: lint + unit + component + Go tests.
- Contracts: validate OpenAPI, generate TS SDK + Go stubs (checked in).
- Build images: Next.js, Go API, workers; push to registry.
- Deploy: pull images on VPS, run migrations, health check, smoke tests.

## 2. Checks

- Formatting (prettier/gofmt), lint (eslint/golangci-lint), type checks (tsc), contract tests.

## 3. Secrets

- Stored outside repo; injected at deploy time (env/secret manager).

## 4. Notes for AI AGENTS

- Keep codegen deterministic; avoid drift between contracts and implementations.
