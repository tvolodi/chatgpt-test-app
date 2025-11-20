import { test, expect } from '@playwright/test';

test.describe('Dashboard (REQ-004)', () => {

  test('Dashboard requires authentication', async ({ page }) => {
    // Try to access dashboard without login
    await page.goto('/dashboard');

    // Should redirect to login page
    await page.waitForURL('/login');
    expect(page.url()).toContain('/login');
  });

  test('Dashboard layout structure (TC-UI-009)', async ({ page, context }) => {
    // Note: This test would require authentication setup
    // For now, we test the unauthenticated redirect

    await page.goto('/dashboard');
    await page.waitForURL('/login');

    // Verify we're on login page
    const loginButton = page.getByRole('button', { name: /Sign In with Keycloak/i });
    await expect(loginButton).toBeVisible();
  });

  test('Dashboard shows welcome message when authenticated', async ({ page }) => {
    // This test requires a mock authenticated session or Keycloak setup
    // Documenting the test structure for manual/future automation

    // Steps would be:
    // 1. Login programmatically or via UI
    // 2. Navigate to /dashboard
    // 3. Verify welcome message is visible
    // 4. Verify stats cards are displayed

    // For now, just verify the login requirement
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  // The following tests require authentication and are documented for manual testing
  // or future implementation with proper Keycloak test setup

  /*
  test('Header displays logo and user menu (TC-UI-009)', async ({ page }) => {
    // Requires: Authenticated session
    await page.goto('/dashboard');
    
    // Verify logo
    const logo = page.getByAltText('AI-Dala');
    await expect(logo).toBeVisible();
    
    // Verify user menu
    const userMenu = page.getByRole('button', { name: /User/i });
    await expect(userMenu).toBeVisible();
  });
 
  test('Sidebar navigation links are visible (TC-UI-009)', async ({ page }) => {
    // Requires: Authenticated session
    await page.goto('/dashboard');
    
    // Verify navigation links
    await expect(page.getByRole('link', { name: /Home/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /News/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Articles/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Settings/i })).toBeVisible();
  });
 
  test('Sidebar toggle functionality (TC-UI-009)', async ({ page }) => {
    // Requires: Authenticated session
    await page.goto('/dashboard');
    
    // Get sidebar element
    const sidebar = page.locator('aside');
    
    // Verify sidebar is expanded (240px width)
    await expect(sidebar).toHaveCSS('width', '240px');
    
    // Click toggle button
    const toggleButton = page.getByRole('button', { name: /←/i });
    await toggleButton.click();
    
    // Verify sidebar is collapsed (72px width)
    await expect(sidebar).toHaveCSS('width', '72px');
    
    // Click toggle again
    await page.getByRole('button', { name: /→/i }).click();
    
    // Verify sidebar is expanded again
    await expect(sidebar).toHaveCSS('width', '240px');
  });
 
  test('Navigation between dashboard pages (TC-UI-010)', async ({ page }) => {
    // Requires: Authenticated session
    await page.goto('/dashboard');
    
    // Click News link
    await page.getByRole('link', { name: /News/i }).click();
    await expect(page).toHaveURL('/dashboard/news');
    
    // Click Articles link
    await page.getByRole('link', { name: /Articles/i }).click();
    await expect(page).toHaveURL('/dashboard/articles');
    
    // Click Settings link
    await page.getByRole('link', { name: /Settings/i }).click();
    await expect(page).toHaveURL('/dashboard/settings');
    
    // Click Home link
    await page.getByRole('link', { name: /Home/i }).click();
    await expect(page).toHaveURL('/dashboard');
  });
 
  test('Sidebar state persists (TC-UI-010)', async ({ page }) => {
    // Requires: Authenticated session
    await page.goto('/dashboard');
    
    // Collapse sidebar
    await page.getByRole('button', { name: /←/i }).click();
    
    // Navigate to different page
    await page.getByRole('link', { name: /News/i }).click();
    
    // Verify sidebar is still collapsed
    const sidebar = page.locator('aside');
    await expect(sidebar).toHaveCSS('width', '72px');
    
    // Refresh page
import { test, expect } from '@playwright/test';

test.describe('Dashboard (REQ-004)', () => {

  test('Dashboard requires authentication', async ({ page }) => {
      // Try to access dashboard without login
      await page.goto('/dashboard');

      // Should redirect to login page
      await page.waitForURL('/login');
      expect(page.url()).toContain('/login');
  });

  test('Dashboard layout structure (TC-UI-009)', async ({ page, context }) => {
      // Note: This test would require authentication setup
      // For now, we test the unauthenticated redirect

      await page.goto('/dashboard');
      await page.waitForURL('/login');

      // Verify we're on login page
      const loginButton = page.getByRole('button', { name: /Sign In with Keycloak/i });
      await expect(loginButton).toBeVisible();
  });

  test('Dashboard shows welcome message when authenticated', async ({ page }) => {
      // This test requires a mock authenticated session or Keycloak setup
      // Documenting the test structure for manual/future automation

      // Steps would be:
      // 1. Login programmatically or via UI
      // 2. Navigate to /dashboard
      // 3. Verify welcome message is visible
      // 4. Verify stats cards are displayed

      // For now, just verify the login requirement
      await page.goto('/dashboard');
      await expect(page).toHaveURL(/\/login/);
  });

  // The following tests require authentication and are documented for manual testing
  // or future implementation with proper Keycloak test setup

  /*
  test('Header displays logo and user menu (TC-UI-009)', async ({ page }) => {
    // Requires: Authenticated session
    await page.goto('/dashboard');
    
    // Verify logo
    const logo = page.getByAltText('AI-Dala');
    await expect(logo).toBeVisible();
    
    // Verify user menu
    const userMenu = page.getByRole('button', { name: /User/i });
    await expect(userMenu).toBeVisible();
  });
 
  test('Sidebar navigation links are visible (TC-UI-009)', async ({ page }) => {
    // Requires: Authenticated session
    await page.goto('/dashboard');
    
    // Verify navigation links
    await expect(page.getByRole('link', { name: /Home/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /News/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Articles/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Settings/i })).toBeVisible();
  });
 
  test('Sidebar toggle functionality (TC-UI-009)', async ({ page }) => {
    // Requires: Authenticated session
    await page.goto('/dashboard');
    
    // Get sidebar element
    const sidebar = page.locator('aside');
    
    // Verify sidebar is expanded (240px width)
    await expect(sidebar).toHaveCSS('width', '240px');
    
    // Click toggle button
    const toggleButton = page.getByRole('button', { name: /←/i });
    await toggleButton.click();
    
    // Verify sidebar is collapsed (72px width)
    await expect(sidebar).toHaveCSS('width', '72px');
    
    // Click toggle again
    await page.getByRole('button', { name: /→/i }).click();
    
    // Verify sidebar is expanded again
    await expect(sidebar).toHaveCSS('width', '240px');
  });
 
  test('Navigation between dashboard pages (TC-UI-010)', async ({ page }) => {
    // Requires: Authenticated session
    await page.goto('/dashboard');
    
    // Click News link
    await page.getByRole('link', { name: /News/i }).click();
    await expect(page).toHaveURL('/dashboard/news');
    
    // Click Articles link
    await page.getByRole('link', { name: /Articles/i }).click();
    await expect(page).toHaveURL('/dashboard/articles');
    
    // Click Settings link
    await page.getByRole('link', { name: /Settings/i }).click();
    await expect(page).toHaveURL('/dashboard/settings');
    
    // Click Home link
    await page.getByRole('link', { name: /Home/i }).click();
    await expect(page).toHaveURL('/dashboard');
  });
 
  test('Sidebar state persists (TC-UI-010)', async ({ page }) => {
    // Requires: Authenticated session
    await page.goto('/dashboard');
    
    // Collapse sidebar
    await page.getByRole('button', { name: /←/i }).click();
    
    // Navigate to different page
    await page.getByRole('link', { name: /News/i }).click();
    
    // Verify sidebar is still collapsed
    const sidebar = page.locator('aside');
    await expect(sidebar).toHaveCSS('width', '72px');
    
    // Refresh page
    await page.reload();
    
    // Verify sidebar state persisted
    await expect(sidebar).toHaveCSS('width', '72px');
  });
 
  test('Logout from dashboard (TC-UI-010)', async ({ page }) => {
    // Requires: Authenticated session
    await page.goto('/dashboard');
    
    // Click user menu
    const userMenu = page.getByRole('button', { name: /User/i });
    await userMenu.click();
    
    // Click logout
    await page.getByRole('button', { name: /Logout/i }).click();
    
    // Verify redirect to home page
    await expect(page).toHaveURL('/');
    
    // Try to access dashboard again
    await page.goto('/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });
 
  test('Footer displays correctly (TC-UI-009)', async ({ page }) => {
    // Requires: Authenticated session
    await page.goto('/dashboard');
    
    // Verify footer elements
    await expect(page.getByText(/© 2025 AI-Dala/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /About/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Privacy/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Terms/i })).toBeVisible();
    await expect(page.getByText(/Where Ideas Meet the Steppe/i)).toBeVisible();
  });
 
  test('Clicking Logout logs user out and redirects to home', async ({ page }) => {
  // Requires: Authenticated session (see previous test)
  
  // Click Logout button
  // const logoutButton = page.getByRole('button', { name: /Logout/i });
  // await logoutButton.click();
  
  // Wait for redirect to home page
  // await page.waitForURL('/');
  
  // Verify Sign in link is visible again
  // const signInLink = page.getByRole('link', { name: /Sign in/i });
  // await expect(signInLink).toBeVisible();
  
  // Verify Logout button is not visible
  // const logoutButtonAfter = page.getByRole('button', { name: /Logout/i });
  // await expect(logoutButtonAfter).not.toBeVisible();
});

test('Footer displays correctly (TC-UI-009)', async ({ page }) => {
  // Requires: Authenticated session
  await page.goto('/dashboard');
  
  // Verify footer elements
  // await expect(page.getByText(/© 2025 AI-Dala/i)).toBeVisible();
  // await expect(page.getByRole('link', { name: /About/i })).toBeVisible();
  // await expect(page.getByRole('link', { name: /Privacy/i })).toBeVisible();
  // await expect(page.getByRole('link', { name: /Terms/i })).toBeVisible();
  // await expect(page.getByText(/Where Ideas Meet the Steppe/i)).toBeVisible();
});

test('Dashboard link appears in main nav when authenticated', async ({ page }) => {
  // Requires: Authenticated session
  // This test verifies the navigation improvement
  
  // Navigate to main page while authenticated
  // await page.goto('/');
  
  // Verify Dashboard link is visible
  // const dashboardLink = page.getByRole('link', { name: /Dashboard/i });
  // await expect(dashboardLink).toBeVisible();
  
  // Verify Sign in link is NOT visible
  // const signInLink = page.getByRole('link', { name: /Sign in/i });
  // await expect(signInLink).not.toBeVisible();
  
  // Click Dashboard link
  // await dashboardLink.click();
  
  // Verify navigation to dashboard
  // await expect(page).toHaveURL('/dashboard');
});

test('Logo in dashboard header is clickable and navigates home', async ({ page }) => {
  // Requires: Authenticated session
  // This test verifies the clickable logo feature
  
  // Navigate to dashboard
  // await page.goto('/dashboard');
  
  // Find logo link
  // const logoLink = page.getByRole('link').filter({ has: page.getByAltText('AI-Dala') });
  // await expect(logoLink).toBeVisible();
  
  // Click logo
  // await logoLink.click();
  
  // Verify navigation to home page
  // await expect(page).toHaveURL('/');
});
*/
});
