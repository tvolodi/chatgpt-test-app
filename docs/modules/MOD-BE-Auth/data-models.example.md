# DOCUMENT_TYPE: DATA_MODELS
# MODULE_ID: MOD-BE-Auth
# VERSION: 1.0

## 1. User Entity

- Table: `users`
- Fields:
  - `id` (uuid, pk)
  - `email` (string, unique, indexed)
  - `password_hash` (string)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)
  - `last_login` (timestamp)

## 2. Notes for AI AGENTS

- Use these fields consistently across endpoints and services.
