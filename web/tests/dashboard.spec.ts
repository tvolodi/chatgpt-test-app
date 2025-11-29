import { test, expect } from '@playwright/test';
import { loginAsTestUser } from './helpers/auth';

test.describe('Dashboard (REQ-004)', () => {

  test('Dashboard requires authentication', async ({ page }) => {
    // Try to access dashboard without login
    await page.goto('/dashboard');

    // Should redirect to login page
    await page.waitForURL('/login');
    expect(page.url()).toContain('/login');
  });

  test('Dashboard layout structure (TC-UI-009)', async ({ page }) => {
    // Login first
    await loginAsTestUser(page);
    await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

    // Verify header is present and sticky
    const header = page.locator('header');
    await expect(header).toBeVisible();
    await expect(header).toHaveCSS('position', 'sticky');

    // Verify sidebar is present
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();

    // Verify main content area
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Verify footer is present
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('Dashboard header displays logo and user menu (TC-UI-009)', async ({ page }) => {
    // Login first
    await loginAsTestUser(page);
    await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

    // Verify logo is visible
    const logo = page.getByAltText('AI-Dala');
    await expect(logo).toBeVisible();

    // Verify logo is clickable and navigates to home
    const logoLink = page.locator('a[href="/"]');
    await expect(logoLink).toBeVisible();
    await logoLink.click();
    await page.waitForURL('/');
    expect(page.url()).toBe('http://localhost:3000/');

    // Go back to dashboard
    await page.goto('/dashboard');

    // Verify user menu is visible
    const userMenu = page.getByRole('button').filter({ hasText: /User|Test/ });
    await expect(userMenu).toBeVisible();
  });

  test('Dashboard sidebar navigation links are visible (TC-UI-009)', async ({ page }) => {
    // Login first
    await loginAsTestUser(page);
    await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

    // Verify all navigation links are visible
    await expect(page.getByRole('link', { name: /Home/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /News/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Articles/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Categories/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Tags/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Settings/i })).toBeVisible();
  });

  test('Dashboard sidebar toggle functionality (TC-UI-009)', async ({ page }) => {
    // Login first
    await loginAsTestUser(page);
    await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

    // Get sidebar element
    const sidebar = page.locator('aside');

    // Verify sidebar is expanded (240px width)
    await expect(sidebar).toHaveCSS('width', '240px');

    // Click toggle button
    const toggleButton = page.getByRole('button', { name: /←/ });
    await toggleButton.click();

    // Verify sidebar is collapsed (72px width)
    await expect(sidebar).toHaveCSS('width', '72px');

    // Click toggle again
    const toggleButtonCollapsed = page.getByRole('button', { name: /→/ });
    await toggleButtonCollapsed.click();

    // Verify sidebar is expanded again
    await expect(sidebar).toHaveCSS('width', '240px');
  });

  test('Dashboard navigation between pages (TC-UI-010)', async ({ page }) => {
    // Login first
    await loginAsTestUser(page);
    await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

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

  test('Dashboard sidebar state persists (TC-UI-010)', async ({ page }) => {
    // Login first
    await loginAsTestUser(page);
    await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

    // Collapse sidebar
    const toggleButton = page.getByRole('button', { name: /←/ });
    await toggleButton.click();

    // Wait for sidebar to collapse
    await page.waitForTimeout(500);

    // Navigate to different page using direct URL navigation
    await page.goto('/dashboard/news');
    await expect(page).toHaveURL('/dashboard/news');

    // Verify sidebar is still collapsed
    const sidebar = page.locator('aside');
    await expect(sidebar).toHaveCSS('width', '72px');

    // Refresh page
    await page.reload();

    // Verify sidebar state persisted
    await expect(sidebar).toHaveCSS('width', '72px');
  });

  test('Dashboard logout functionality (TC-UI-010)', async ({ page }) => {
    // Login first
    await loginAsTestUser(page);
    await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

    // Click user menu
    const userMenu = page.getByRole('button').filter({ hasText: /User|Test/ });
    await userMenu.click();

    // Click logout
    const logoutButton = page.getByRole('button', { name: /Logout/i });
    await logoutButton.click();

    // Verify redirect to home page
    await expect(page).toHaveURL('/');
  });

  test('Dashboard footer displays correctly (TC-UI-009)', async ({ page }) => {
    // Login first
    await loginAsTestUser(page);
    await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

    // Verify footer elements
    await expect(page.getByText(/© 2025 AI-Dala/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /About/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Privacy/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Terms/i })).toBeVisible();
    await expect(page.getByText(/Where Ideas Meet the Steppe/i)).toBeVisible();
  });

  test('Dashboard welcome message displays for authenticated user', async ({ page }) => {
    // Login first
    await loginAsTestUser(page);
    await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

    // Verify welcome message is visible
    await expect(page.getByText(/Welcome.*Test/i)).toBeVisible();

    // Verify stats cards are displayed
    await expect(page.getByText(/News Articles/i)).toBeVisible();
    await expect(page.getByText(/Saved Articles/i)).toBeVisible();
    await expect(page.getByText(/Courses/i)).toBeVisible();
    await expect(page.getByText(/Achievements/i)).toBeVisible();
  });
});
