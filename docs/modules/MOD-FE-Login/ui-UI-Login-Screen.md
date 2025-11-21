# DOCUMENT_TYPE: UI_SPEC
# UI_ID: UI-Login-Screen
# MODULE_ID: MOD-FE-Login
# VERSION: 2.0

## 1. Summary

- Title: Login Entry Point
- Route: `/login` (or handled via modal/redirect)
- Type: Page/Component

## 2. Layout

- Simple "Sign In" page or direct redirect.
- If a page:
  - Centered "Sign In with Keycloak" button.

## 3. Interactions

- On Click: Redirects browser to Keycloak Authorization URL.

## 4. File Structure

- Page: `web/src/app/login/page.tsx`

## 5. Traceability

- Implements: REQ-001.
