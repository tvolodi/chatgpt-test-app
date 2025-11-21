# DOCUMENT_TYPE: TEST_CASE
# TC_ID: TC-UI-009
# VERSION: 1.0

## 1. Summary

- Type: e2e
- Title: Dashboard layout structure and components
- Status: proposed
- Related Requirements:
  - REQ-004
- Related Modules:
  - MOD-FE-Dashboard

## 2. Pre-Conditions

- User is authenticated
- Dashboard is accessible at `/dashboard`

## 3. Test Steps

### Layout Structure
1. Navigate to `/dashboard` (after login)
2. Verify header is visible at top
3. Verify sidebar is visible on left
4. Verify main content area is visible
5. Verify footer is visible at bottom

### Header Component
6. Verify AI-Dala logo is displayed
7. Verify logo is clickable (wrapped in link)
8. Click logo
9. Verify navigation to main page (`/`)
10. Navigate back to dashboard
11. Verify user menu button is visible
12. Click user menu button
13. Verify dropdown menu appears
14. Verify "Logout" option is present in dropdown

### Sidebar Component
15. Verify sidebar shows navigation links (Home, News, Articles, Settings)
16. Verify current page has active state (Sky Blue background)
17. Click sidebar toggle button
18. Verify sidebar collapses (shows only icons)
19. Click toggle button again
20. Verify sidebar expands (shows icons + labels)

### Footer Component
21. Verify copyright text is displayed
22. Verify footer links are present (About, Privacy, Terms)
23. Verify AI-Dala tagline is displayed

## 4. Expected Result

- All layout components render correctly
- Header is sticky (stays at top on scroll)
- Sidebar toggle works and state persists
- Active navigation link is highlighted
- Footer displays all required information
- All components follow AI-Dala branding

## 5. Automation

- File: `web/tests/dashboard.spec.ts`
- Framework: Playwright
- Tests:
  - Dashboard requires authentication
  - Header displays logo and user menu
  - Sidebar navigation links are visible
  - Sidebar toggle functionality
  - Footer displays correctly
