# DOCUMENT_TYPE: TEST_CASE
# TC_ID: TC-UNIT-001
# VERSION: 1.0

## 1. Summary

- Type: unit
- Title: Login email validation
- Status: implemented
- Related Requirements:
  - REQ-001
- Related Modules:
  - MOD-FE-Login

## 2. Pre-Conditions

- Component `LoginForm` is available and compiled.

## 3. Test Steps

1. Render `LoginForm`.
2. Type an invalid email into `input-email`.
3. Blur the `input-email` field.

## 4. Expected Result

- Validation error message is shown for `input-email`.

## 5. Automation

- File: `frontend/src/components/LoginForm.test.tsx`
- Framework: Jest + React Testing Library

## 6. Notes for AI AGENTS

- Use this description as the source of truth when generating or updating the unit test.
