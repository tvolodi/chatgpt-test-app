// web/tests/helpers/auth.ts
import { Page } from '@playwright/test';

/**
 * Logs in a test user via Keycloak for E2E tests.
 * Uses the testuser account configured in the Keycloak realm.
 */
export async function loginAsTestUser(page: Page): Promise<void> {
    // Navigate to login page
    await page.goto('/en/login');

    // Click the Keycloak sign-in button
    await page.getByRole('button', { name: /Sign In with Keycloak/i }).click();

    // Wait for Keycloak login page to load
    await page.waitForURL(/.*keycloak.*/, { timeout: 10000 });

    // Fill in test credentials
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="password"]', 'test123');

    // Submit the login form
    await page.click('input[type="submit"]');

    // Wait for redirect back to the app
    await page.waitForURL(/.*localhost:3000.*/, { timeout: 10000 });
}

/**
 * Logs in as content manager user for tests requiring CONTENT_MANAGER role.
 */
export async function loginAsContentManager(page: Page): Promise<void> {
    await page.goto('/en/login');
    await page.getByRole('button', { name: /Sign In with Keycloak/i }).click();
    await page.waitForURL(/.*keycloak.*/, { timeout: 10000 });

    await page.fill('input[name="username"]', 'content_manager');
    await page.fill('input[name="password"]', 'content123');
    await page.click('input[type="submit"]');

    await page.waitForURL(/.*localhost:3000.*/, { timeout: 10000 });
}

/**
 * Logs out the current user.
 */
export async function logout(page: Page): Promise<void> {
    // Click the logout button (assuming it's in the navigation)
    const logoutButton = page.getByRole('button', { name: /Logout/i });
    await logoutButton.click();

    // Wait for redirect to home page
    await page.waitForURL('/');
}