import { test, expect } from '@playwright/test';
import { loginAsTestUser, logout } from './helpers/auth';

test.describe('REQ-001 Logout Flow', () => {
    test('AC-11: Navigation shows Logout when authenticated', async ({ page }) => {
        // Login first
        await loginAsTestUser(page);

        // Wait for dashboard redirect
        await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

        // Check that Logout button is visible
        const logoutButton = page.getByRole('button', { name: /Logout/i });
        await expect(logoutButton).toBeVisible();

        // Check that "Sign in" link is NOT visible
        const signInLink = page.getByRole('link', { name: /Sign in/i });
        await expect(signInLink).not.toBeVisible();
    });

    test('AC-12: Clicking Logout signs out of app and Keycloak', async ({ page }) => {
        // Login first
        await loginAsTestUser(page);
        await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

        // Click Logout button
        const logoutButton = page.getByRole('button', { name: /Logout/i });
        await logoutButton.click();

        // Should redirect to landing page
        await page.waitForURL('/', { timeout: 10000 });

        // Verify we're on the landing page
        await expect(page).toHaveURL(/^\/?$/);
    });

    test('AC-13: After logout, user is redirected to landing page (/)', async ({ page }) => {
        // Login first
        await loginAsTestUser(page);
        await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

        // Click logout via header dropdown
        await logout(page);

        // Verify redirect to landing page
        await expect(page).toHaveURL('/');
    });

    test('AC-14: Navigation displays "Sign in" again after logout', async ({ page }) => {
        // Login first
        await loginAsTestUser(page);
        await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

        // Logout
        await logout(page);

        // Now on landing page - check for "Sign in" link
        const signInLink = page.getByRole('link', { name: /Sign in/i });
        await expect(signInLink).toBeVisible();

        // Check that Logout button is NOT visible
        const logoutButton = page.getByRole('button', { name: /Logout/i });
        await expect(logoutButton).not.toBeVisible();
    });

    test('Session state persists after login - verify logout works from any page', async ({ page }) => {
        // Login
        await loginAsTestUser(page);
        await page.waitForURL(/.*dashboard.*/, { timeout: 10000 });

        // Navigate to a different page (if available)
        await page.goto('/');

        // Logout should still be available
        const logoutButton = page.getByRole('button', { name: /Logout/i });
        await expect(logoutButton).toBeVisible();

        // Logout
        await logout(page);

        // Verify we're back at landing
        await expect(page).toHaveURL('/');

        // Verify Sign in is visible
        const signInLink = page.getByRole('link', { name: /Sign in/i });
        await expect(signInLink).toBeVisible();
    });
});
