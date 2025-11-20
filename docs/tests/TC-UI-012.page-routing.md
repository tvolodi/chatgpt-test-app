# TC-UI-012: Dashboard Page Routing and Rendering

## 1. Test Information
- **Test ID**: TC-UI-012
- **Test Name**: Dashboard Page Routing and Rendering
- **Requirement**: REQ-005 (Dashboard Sidebar Navigation)
- **Type**: UI Test
- **Priority**: High
- **Status**: Draft

## 2. Test Objective
Verify that clicking each sidebar navigation item correctly routes to the corresponding page and displays the expected content.

## 3. Test Steps

### Home Page
1. Navigate to `/dashboard` (authenticated)
2. Verify URL is `/dashboard`
3. Verify "Welcome back" message is displayed
4. Verify stat cards are visible

### News Page
5. Click "News" in sidebar
6. Verify URL changes to `/dashboard/news`
7. Verify page header displays "News"
8. Verify subtitle displays "Manage news articles"
9. Verify empty state icon 📰 is displayed
10. Verify "No News Articles Yet" heading
11. Verify "Coming Soon" info box

### Articles Page
12. Click "Articles" in sidebar
13. Verify URL changes to `/dashboard/articles`
14. Verify page header displays "Articles"
15. Verify subtitle displays "Manage articles and blog posts"
16. Verify empty state icon 📝 is displayed
17. Verify "No Articles Yet" heading
18. Verify "Coming Soon" info box

### Categories Page
19. Click "Categories" in sidebar
20. Verify URL changes to `/dashboard/categories`
21. Verify page header displays "Categories"
22. Verify subtitle displays "Manage content categories"
23. Verify empty state icon 📁 is displayed
24. Verify "No Categories Yet" heading
25. Verify "Coming Soon" info box

### Tags Page
26. Click "Tags" in sidebar
27. Verify URL changes to `/dashboard/tags`
28. Verify page header displays "Tags"
29. Verify subtitle displays "Manage content tags"
30. Verify empty state icon 🏷️ is displayed
31. Verify "No Tags Yet" heading
32. Verify "Coming Soon" info box

### Settings Page
33. Click "Settings" in sidebar
34. Verify URL changes to `/dashboard/settings`
35. Verify page header displays "Settings"
36. Verify subtitle displays "Manage your account and preferences"
37. Verify empty state icon ⚙️ is displayed
38. Verify "Settings" heading
39. Verify "Coming Soon" info box

### Design Consistency
40. Verify all pages use Deep Navy (#0A1929) for headings
41. Verify all pages have modern card shadows
42. Verify all info boxes use Electric Blue (#0066FF) border
43. Verify all pages follow design system spacing

## 4. Expected Result
- All navigation items route to correct URLs
- Each page displays correct header, subtitle, and icon
- Empty states are properly styled
- All pages follow design system guidelines
- Navigation is instant (client-side routing)

## 5. Test Data
- Authenticated user session required

## 6. Pass/Fail Criteria
- **Pass**: All pages route correctly, display expected content, and follow design system
- **Fail**: Incorrect routing, missing content, broken styling, slow navigation

---

**Created**: 2025-11-21  
**Last Updated**: 2025-11-21
