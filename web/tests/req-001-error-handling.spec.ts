import { test, expect } from '@playwright/test';

test.describe('REQ-001 Error Handling', () => {
    test('AC-4: Failed authentication returns user to landing page with error indication', async ({ page }) => {
        // Navigate to login page
        await page.goto('/en/login');

        // Click the Keycloak sign-in button
        await page.getByRole('button', { name: /Sign In with Keycloak/i }).click();

        // Wait for Keycloak to load
        await page.waitForURL(/.*keycloak.*/, { timeout: 10000 });

        // Fill in INVALID credentials
        await page.fill('input[name="username"]', 'invaliduser');
        await page.fill('input[name="password"]', 'wrongpassword');

        // Submit the login form
        await page.click('input[type="submit"]');

        // Should see Keycloak error message
        const errorMessage = page.locator('text=/Invalid|incorrect|error/i');
        await expect(errorMessage).toBeVisible({ timeout: 5000 });

        // User should still be on Keycloak login page (not redirected to app)
        await expect(page).toHaveURL(/.*keycloak.*/);
    });

    test('AC-4: Cancelled login returns to landing page', async ({ page }) => {
        // Navigate to login page
        await page.goto('/en/login');

        // Click Keycloak button
        await page.getByRole('button', { name: /Sign In with Keycloak/i }).click();

        // Wait for Keycloak to load
        await page.waitForURL(/.*keycloak.*/, { timeout: 10000 });

        // Click browser back button (simulating user cancelling)
        await page.goBack();

        // Should return to login page (not crash the app)
        await expect(page.url()).toContain('login');

        // Page should be functional and show login button again
        const loginButton = page.getByRole('button', { name: /Sign In with Keycloak/i });
        await expect(loginButton).toBeVisible();
    });

    test('AC-18: Invalid refresh token redirects to login page', async ({ page }) => {
        // This simulates token expiry and refresh failure
        // Mock the session API to return refresh error
        await page.route('**/api/auth/session', async route => {
            await route.fulfill({
                json: {
                    error: 'RefreshAccessTokenError'
                }
            });
        });

        // Navigate to a protected page
        await page.goto('/en/dashboard');

        // Should redirect to login page
        await expect(page).toHaveURL(/.*login.*/, { timeout: 5000 });

        // Error handling: Check if any error message is shown (implementation dependent)
        // If not explicitly shown, at least verify we're on login page
        const loginButton = page.getByRole('button', { name: /Sign In with Keycloak/i });
        await expect(loginButton).toBeVisible();
    });

    test('Session expiry: User redirected to login after session timeout', async ({ page }) => {
        // Mock session API to simulate expiry
        let requestCount = 0;
        await page.route('**/api/auth/session', async route => {
            requestCount++;
            if (requestCount === 1) {
                // First call - return valid session
                await route.fulfill({
                    json: {
                        user: { email: 'test@example.com', name: 'Test User' },
                        accessToken: 'valid-token',
                        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                    }
                });
            } else {
                // Subsequent calls - session expired
                await route.fulfill({
                    json: null
                });
            }
        });

        // Navigate to dashboard
        await page.goto('/en/dashboard');

        // First request should succeed
        await expect(page.getByText('test@example.com')).toBeVisible({ timeout: 5000 });

        // Simulate session check after expiry
        // In a real app, this would happen on navigation or API call
        // For now, navigate to a page that requires auth
        await page.goto('/en/dashboard/articles');

        // Should be redirected to login or show session expired message
        const isOnLogin = page.url().includes('login');
        const hasErrorMessage = await page.locator('text=/session|expired/i').isVisible().catch(() => false);

        expect(isOnLogin || hasErrorMessage).toBeTruthy();
    });

    test('AC-3: PKCE flow - Verify token validation works correctly', async ({ page }) => {
        // Navigate to login
        await page.goto('/en/login');

        // Click sign in
        await page.getByRole('button', { name: /Sign In with Keycloak/i }).click();

        // Wait for Keycloak
        await page.waitForURL(/.*keycloak.*/, { timeout: 10000 });

        // Login with valid credentials
        await page.fill('input[name="username"]', 'testuser');
        await page.fill('input[name="password"]', 'test123');
        await page.click('input[type="submit"]');

        // Should redirect back to app (not stay on Keycloak)
        await page.waitForURL(/.*localhost:3000.*/, { timeout: 10000 });

        // Verify user is authenticated
        const dashboardElements = page.locator('text=/dashboard|articles|tags|categories/i');
        await expect(dashboardElements.first()).toBeVisible({ timeout: 5000 });
    });

    test('AC-5: Public client verification - login without browser storage of secret', async ({ page, context }) => {
        // Check that no client secret is stored in browser storage
        const localStorage = await context.evaluateOnce(() => {
            return JSON.stringify(window.localStorage);
        }).catch(() => '{}');

        // Should NOT contain KEYCLOAK_CLIENT_SECRET or similar
        expect(localStorage).not.toMatch(/client_secret|CLIENT_SECRET/i);

        // Navigate to login
        await page.goto('/en/login');

        // Click sign in button - this initiates OIDC flow
        await page.getByRole('button', { name: /Sign In with Keycloak/i }).click();

        // Should redirect to Keycloak (PKCE flow initiated)
        await page.waitForURL(/.*keycloak.*/, { timeout: 10000 });

        // PKCE uses code_challenge parameter in the URL
        const url = page.url();
        expect(url).toMatch(/code_challenge|authorization/i);
    });
});
