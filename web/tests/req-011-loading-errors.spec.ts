import { test, expect } from '@playwright/test';

test.describe('Article Editor Loading and Error States (REQ-011)', () => {

    test('should display skeleton loader on initial load', async ({ page }) => {
        // Intercept network requests to delay response
        await page.route('**/api/categories', route => {
            setTimeout(() => route.continue(), 1000); // delay to ensure skeleton is visible
        });
        await page.route('**/api/tags', route => {
            setTimeout(() => route.continue(), 1000);
        });

        await page.goto('/en/dashboard/articles/new');

        // Check for skeleton UI
        await expect(page.locator('.animate-pulse')).toBeVisible();
    });

    test('should display category fetch error', async ({ page }) => {
        // Mock a failed categories API call
        await page.route('**/api/categories', route => {
            route.abort('connectionrefused');
        });

        await page.goto('/en/dashboard/articles/new');

        // Check for category-specific error message
        await expect(page.getByText('Failed to load categories.')).toBeVisible();
        // Check that other parts of the form are still rendered
        await expect(page.getByLabel('Title *')).toBeVisible();
    });

    test('should display tags fetch error', async ({ page }) => {
        // Mock a failed tags API call
        await page.route('**/api/tags', route => {
            route.abort('connectionrefused');
        });

        await page.goto('/en/dashboard/articles/new');

        // Check for tag-specific error message
        await expect(page.getByText('Failed to load tags.')).toBeVisible();
        // Check that other parts of the form are still rendered
        await expect(page.getByLabel('Title *')).toBeVisible();
    });

    test('should display article fetch error on edit page', async ({ page }) => {
        // Mock a failed article API call
        await page.route('**/api/articles/some-fake-id', route => {
            route.abort('connectionrefused');
        });

        await page.goto('/en/dashboard/articles/edit/some-fake-id');

        // Check for the main error boundary message
        await expect(page.getByTestId('error-message')).toBeVisible();
    });
});
