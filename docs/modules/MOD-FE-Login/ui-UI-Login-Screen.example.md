# DOCUMENT_TYPE: UI_SPEC
# MODULE_ID: MOD-FE-Login
# UI_ID: UI-Login-Screen
# VERSION: 1.0

## 1. Summary

- Name: Login Screen
- Status: in_progress
- Related Requirements:
  - REQ-001

## 2. Layout

- Sections:
  - Header: logo + project name
  - Body: email field, password field, "Remember me", "Forgot password?"
  - Footer: login button, link to registration

## 3. Elements

| Element_ID      | Type   | Label    | Validation Rules                     | Error Messages                       |
|----------------|--------|----------|--------------------------------------|--------------------------------------|
| input-email    | input  | Email    | required, valid email format         | "Email is required", "Invalid email" |
| input-password | input  | Password | required, min length 8               | "Password is required", "Too short"  |
| btn-login      | button | Log In   | disabled unless the form is valid    |                                      |

## 4. Interaction & State

- Initial State:
  - Fields empty, `btn-login` disabled.
- On input change:
  - Validate field, show error messages.
- On submit:
  - Call backend endpoint `POST /api/auth/login`.
  - On success: navigate to `/dashboard`.
  - On error 401: show "Invalid email or password".
  - On error 500: show generic error.

## 5. Data Flows

- Sends:
  - `{ "email": string, "password": string }`
- Receives:
  - Success: `{ "token": string, "user": { ... } }`
  - Error: `{ "error_code": "string", "message": "string" }`

## 6. Accessibility

- Keyboard navigation:
- ARIA attributes:

## 7. Implementation Status

- Implementation Status: in_progress
- Test Coverage Status: partial

## 8. Notes for AI AGENTS

- Implement this UI as a single screen/component following the layout, elements, and interactions described here.
