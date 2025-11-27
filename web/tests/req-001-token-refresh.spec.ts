import { test, expect } from '@playwright/test';

test.describe('REQ-001 Token Refresh Flow', () => {
    test('should automatically refresh expired access token', async ({ page }) => {
        // This test verifies that the application automatically refreshes
        // the access token when it expires, without user interaction

        // Mock session API to simulate token refresh
        let tokenRefreshCount = 0;
        await page.route('**/api/auth/session', async route => {
            tokenRefreshCount++;

            if (tokenRefreshCount === 1) {
                // First call - return session with expired token
                await route.fulfill({
                    json: {
                        user: { email: 'test@example.com', name: 'Test User' },
                        accessToken: 'expired-token',
                        expires: new Date(Date.now() - 1000).toISOString() // Expired
                    }
                });
            } else {
                // Subsequent calls - return refreshed session
                await route.fulfill({
                    json: {
                        user: { email: 'test@example.com', name: 'Test User' },
                        accessToken: 'refreshed-token-123',
                        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                    }
                });
            }
        });

        // Navigate to a protected page
        await page.goto('/dashboard');

        // Verify user is authenticated
        await expect(page.getByText('test@example.com')).toBeVisible();

        // Verify token refresh happened automatically
        expect(tokenRefreshCount).toBeGreaterThan(1);
    });

    test('should redirect to login when refresh token is invalid', async ({ page }) => {
        // Mock session API to return error state
        await page.route('**/api/auth/session', async route => {
            await route.fulfill({
                json: {
                    error: 'RefreshAccessTokenError'
                }
            });
        });

        // Navigate to a protected page
        await page.goto('/dashboard');

        // Should redirect to login page
        await expect(page).toHaveURL(/\/login/);
    });

    test('should maintain session across page navigations', async ({ page }) => {
        // Mock authenticated session
        await page.route('**/api/auth/session', async route => {
            await route.fulfill({
                json: {
                    user: { email: 'test@example.com', name: 'Test User' },
                    accessToken: 'valid-token-123',
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                }
            });
        });

        // Navigate to dashboard
        await page.goto('/dashboard');
        await expect(page.getByText('test@example.com')).toBeVisible();

        // Navigate to another page
        await page.goto('/');

        // Session should still be active
        await expect(page.getByText('test@example.com')).toBeVisible();
    });
});
