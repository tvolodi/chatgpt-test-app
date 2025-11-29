import { test, expect } from '@playwright/test';
import { loginAsTestUser } from './helpers/auth';

test.describe('Dashboard Sidebar Navigation (REQ-005)', () => {

    test('Sidebar displays all navigation items (TC-UI-011)', async ({ page }) => {
        // Login first
        await loginAsTestUser(page);
        await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

        // Verify all 6 navigation items are present
        await expect(page.getByRole('link', { name: /Home/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /News/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /Articles/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /Categories/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /Tags/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /Settings/i })).toBeVisible();
    });

    test('News page routes and renders correctly (TC-UI-012)', async ({ page }) => {
        // Login first
        await loginAsTestUser(page);
        await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

        // Navigate to News page
        await page.getByRole('link', { name: /News/i }).click();
        await expect(page).toHaveURL('/dashboard/news');

        // Verify page content
        await expect(page.getByRole('heading', { name: /News/i, level: 1 })).toBeVisible();
        await expect(page.getByText(/Manage news articles/i)).toBeVisible();
        await expect(page.getByText(/No News Articles Yet/i)).toBeVisible();
    });

    test('Articles page routes and renders correctly (TC-UI-012)', async ({ page }) => {
        // Login first
        await loginAsTestUser(page);
        await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

        // Navigate to Articles page
        await page.getByRole('link', { name: /Articles/i }).click();
        await expect(page).toHaveURL('/dashboard/articles');

        // Verify page content
        await expect(page.getByRole('heading', { name: /Articles/i, level: 1 })).toBeVisible();
    });

    test('Categories page routes and renders correctly (TC-UI-012)', async ({ page }) => {
        // Login first
        await loginAsTestUser(page);
        await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

        // Navigate to Categories page
        await page.getByRole('link', { name: /Categories/i }).click();
        await expect(page).toHaveURL('/dashboard/categories');

        // Verify page content
        await expect(page.getByRole('heading', { name: /Categories/i, level: 1 })).toBeVisible();
    });

    test('Tags page routes and renders correctly (TC-UI-012)', async ({ page }) => {
        // Login first
        await loginAsTestUser(page);
        await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

        // Navigate to Tags page
        await page.getByRole('link', { name: /Tags/i }).click();
        await expect(page).toHaveURL('/dashboard/tags');

        // Verify page content
        await expect(page.getByRole('heading', { name: /Tags/i, level: 1 })).toBeVisible();
    });

    test('Settings page routes and renders correctly (TC-UI-012)', async ({ page }) => {
        // Login first
        await loginAsTestUser(page);
        await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

        // Navigate to Settings page
        await page.getByRole('link', { name: /Settings/i }).click();
        await expect(page).toHaveURL('/dashboard/settings');

        // Verify page content
        await expect(page.getByRole('heading', { name: /Settings/i, level: 1 })).toBeVisible();
        await expect(page.getByText(/Manage your account and preferences/i)).toBeVisible();
    });

    test('Sidebar active state highlighting works (TC-UI-011)', async ({ page }) => {
        // Login first
        await loginAsTestUser(page);
        await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

        // Verify Home is active (should be on dashboard page)
        const homeLink = page.locator('a[href="/dashboard"]');
        await expect(homeLink).toHaveCSS('background-color', 'rgb(0, 102, 255)'); // #0066FF

        // Click News
        await page.getByRole('link', { name: /News/i }).click();
        await expect(page).toHaveURL('/dashboard/news');

        // Verify News is now active
        const newsLink = page.locator('a[href="/dashboard/news"]');
        await expect(newsLink).toHaveCSS('background-color', 'rgb(0, 102, 255)');

        // Verify Home is no longer active
        await expect(homeLink).not.toHaveCSS('background-color', 'rgb(0, 102, 255)');
    });

    test('Sidebar toggle functionality works (TC-UI-011)', async ({ page }) => {
        // Login first
        await loginAsTestUser(page);
        await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

        // Get sidebar element
        const sidebar = page.locator('aside');

        // Verify sidebar is expanded (240px)
        await expect(sidebar).toHaveCSS('width', '240px');

        // Click toggle button
        const toggleButton = page.getByRole('button', { name: /←/ });
        await toggleButton.click();

        // Verify sidebar is collapsed (72px)
        await expect(sidebar).toHaveCSS('width', '72px');

        // Click toggle again
        const toggleButtonCollapsed = page.getByRole('button', { name: /→/ });
        await toggleButtonCollapsed.click();

        // Verify sidebar is expanded again
        await expect(sidebar).toHaveCSS('width', '240px');
    });
});
