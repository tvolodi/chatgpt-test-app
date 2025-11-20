# TC-UI-011: Dashboard Sidebar Navigation Structure

## 1. Test Information
- **Test ID**: TC-UI-011
- **Test Name**: Dashboard Sidebar Navigation Structure
- **Requirement**: REQ-005 (Dashboard Sidebar Navigation)
- **Type**: UI Test
- **Priority**: High
- **Status**: Draft

## 2. Test Objective
Verify that the dashboard sidebar displays all navigation items correctly with proper styling, icons, and active state highlighting.

## 3. Test Steps

### Navigation Items Display
1. Navigate to `/dashboard` (authenticated)
2. Verify sidebar is visible
3. Verify the following navigation items are displayed in order:
   - 🏠 Home
   - 📰 News
   - 📝 Articles
   - 📁 Categories
   - 🏷️ Tags
   - ⚙️ Settings
4. Verify each item has an icon and label (when expanded)

### Active State Highlighting
5. Verify "Home" is highlighted (Electric Blue background #0066FF, white text)
6. Click "News" navigation item
7. Verify "News" is now highlighted with Electric Blue background
8. Verify "Home" is no longer highlighted
9. Click "Articles" navigation item
10. Verify "Articles" is highlighted
11. Click "Categories" navigation item
12. Verify "Categories" is highlighted
13. Click "Tags" navigation item
14. Verify "Tags" is highlighted
15. Click "Settings" navigation item
16. Verify "Settings" is highlighted

### Sidebar Toggle
17. Click sidebar toggle button
18. Verify sidebar collapses (shows icons only)
19. Verify icons are still visible
20. Verify labels are hidden
21. Click toggle button again
22. Verify sidebar expands (shows icons + labels)

### Visual Design
23. Verify toggle button color is Electric Blue (#0066FF)
24. Verify inactive items have gray text (#6B7280)
25. Verify active item has white text on Electric Blue background

## 4. Expected Result
- All 6 navigation items are displayed in correct order
- Icons and labels are visible when expanded
- Active state uses Electric Blue (#0066FF) background with white text
- Inactive state uses gray (#6B7280) text
- Sidebar toggle works correctly
- Only one item is highlighted at a time
- Visual design matches design system

## 5. Test Data
- Authenticated user session required

## 6. Pass/Fail Criteria
- **Pass**: All navigation items display correctly, active state highlighting works, toggle functions properly
- **Fail**: Missing navigation items, incorrect styling, active state not working, toggle broken

---

**Created**: 2025-11-21  
**Last Updated**: 2025-11-21
