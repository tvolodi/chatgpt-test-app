# DOCUMENT_TYPE: TEST_CASE
# TC_ID: TC-UI-010
# VERSION: 1.0

## 1. Summary

- Type: e2e
- Title: Dashboard navigation and routing
- Status: proposed
- Related Requirements:
  - REQ-004
- Related Modules:
  - MOD-FE-Dashboard

## 2. Pre-Conditions

- User is authenticated
- Dashboard is accessible at `/dashboard`

## 3. Test Steps

### Navigation Flow
1. Navigate to `/dashboard`
2. Verify "Home" link is active (highlighted)
3. Click "News" link in sidebar
4. Verify URL changes to `/dashboard/news`
5. Verify "News" link is now active
6. Verify news page content is displayed
7. Click "Articles" link in sidebar
8. Verify URL changes to `/dashboard/articles`
9. Verify "Articles" link is now active
10. Click "Settings" link in sidebar
11. Verify URL changes to `/dashboard/settings`
12. Verify "Settings" link is now active

### Navigation Between Main Page and Dashboard
13. While authenticated, navigate to main page (`/`)
14. Verify "Dashboard" link is visible in main navigation
15. Verify "Sign in" link is NOT visible
16. Click "Dashboard" link
17. Verify navigation to `/dashboard`
18. Click AI-Dala logo in dashboard header
19. Verify navigation back to main page (`/`)

### Sidebar State Persistence
20. Navigate to `/dashboard`
21. Collapse sidebar using toggle button
22. Navigate to different page
23. Verify sidebar remains collapsed
24. Refresh page
25. Verify sidebar state persists (still collapsed)

### Logout Flow
26. Click user menu in header
27. Click "Logout" option
28. Verify redirect to landing page (`/`)
29. Attempt to navigate to `/dashboard` directly
30. Verify redirect to `/login` (authentication required)

## 4. Expected Result

- Navigation between dashboard pages works correctly
- Active link highlighting updates on navigation
- Sidebar state persists across page changes and refreshes
- Logout successfully terminates session
- Dashboard requires authentication (redirects to login if not authenticated)

## 5. Automation

- File: `web/tests/dashboard.spec.ts`
- Framework: Playwright
- Tests:
  - Navigation between dashboard pages
  - Active link highlighting
  - Sidebar state persistence
  - Logout functionality
  - Authentication requirement
