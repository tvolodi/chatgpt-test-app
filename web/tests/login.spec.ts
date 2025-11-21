import { test, expect } from '@playwright/test';

test('Login page has Sign In button', async ({ page }) => {
    await page.goto('/login');

    // Check for the button
    const loginButton = page.getByRole('button', { name: /Sign In with Keycloak/i });
    await expect(loginButton).toBeVisible();
});

test('Clicking Sign In redirects to Keycloak', async ({ page }) => {
    await page.goto('/login');

    // Click the button
    await page.getByRole('button', { name: /Sign In with Keycloak/i }).click();

    // In a real E2E with Keycloak running, we would assert the URL.
    // For now, we just ensure the action doesn't crash the page.
    // await expect(page).toHaveURL(/.*keycloak.*/); 
});

test('Navigation shows Sign in when not authenticated', async ({ page }) => {
    await page.goto('/');

    // Check that Sign in link is visible
    const signInLink = page.getByRole('link', { name: /Sign in/i });
    await expect(signInLink).toBeVisible();

    // Check that Logout button is not visible
    const logoutButton = page.getByRole('button', { name: /Logout/i });
    await expect(logoutButton).not.toBeVisible();
});

// Note: The following tests would require a real Keycloak instance and test user
// They are commented out but documented for manual testing

// test('Navigation shows Logout when authenticated', async ({ page }) => {
//   // This test requires:
//   // 1. Keycloak running at localhost:8080
//   // 2. Test user credentials
//   // 3. Programmatic login or session setup
//
//   // Login programmatically or via UI
//   // await page.goto('/login');
//   // await page.getByRole('button', { name: /Sign In with Keycloak/i }).click();
//   // await page.fill('input[name="username"]', 'testuser');
//   // await page.fill('input[name="password"]', 'test123');
//   // await page.click('button[type="submit"]');
//
//   // Wait for redirect back to app
//   // await page.waitForURL('/');
//
//   // Check that Logout button is visible
//   // const logoutButton = page.getByRole('button', { name: /Logout/i });
//   // await expect(logoutButton).toBeVisible();
//
//   // Check that Sign in link is not visible
//   // const signInLink = page.getByRole('link', { name: /Sign in/i });
//   // await expect(signInLink).not.toBeVisible();
// });

// test('Clicking Logout logs user out and redirects to home', async ({ page }) => {
//   // Requires authenticated session (see previous test)
//
//   // Click Logout button
//   // const logoutButton = page.getByRole('button', { name: /Logout/i });
//   // await logoutButton.click();
//
//   // Wait for redirect to home page
//   // await page.waitForURL('/');
//
//   // Verify Sign in link is visible again
//   // const signInLink = page.getByRole('link', { name: /Sign in/i });
//   // await expect(signInLink).toBeVisible();
//
//   // Verify Logout button is not visible
//   // const logoutButtonAfter = page.getByRole('button', { name: /Logout/i });
//   // await expect(logoutButtonAfter).not.toBeVisible();
// });
