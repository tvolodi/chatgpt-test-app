import { test, expect } from '@playwright/test';

test.describe('REQ-013 Article Filtering', () => {
    test.beforeEach(async ({ page }) => {
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        // Navigate to articles page
        await page.goto('/articles');
    });

    test('should display filter components', async ({ page }) => {
        await expect(page.getByText('All', { exact: true })).toBeVisible();
        await expect(page.getByText('Tags')).toBeVisible();
    });

    test('should filter by category', async ({ page }) => {
        // Wait for categories to load
        await page.waitForSelector('button:has-text("(")');

        const categoryButton = page.locator('button').filter({ hasText: '(' }).first();
        const categoryName = (await categoryButton.textContent())?.split(' (')[0].trim();

        if (categoryName && categoryName !== 'All') {
            await categoryButton.click();
            await expect(page).toHaveURL(/category_id=/);
            await expect(page.getByText(`Category: ${categoryName}`)).toBeVisible();
        }
    });

    test('should filter by tag', async ({ page }) => {
        // Wait for tags to load
        await page.waitForSelector('button:has-text("(")');

        // Find a tag button (not the "All" category button)
        const tagSection = page.locator('div').filter({ hasText: 'Tags' }).last();
        const tagButton = tagSection.locator('button').first();
        const tagName = (await tagButton.textContent())?.split(' (')[0].trim();

        if (tagName) {
            await tagButton.click();
            await expect(page).toHaveURL(/tags=/);
            await expect(page.getByText(`Tag: ${tagName}`)).toBeVisible();
        }
    });

    test('should clear filters', async ({ page }) => {
        // Apply a category filter first
        await page.waitForSelector('button:has-text("(")');
        const categoryButton = page.locator('button').filter({ hasText: '(' }).first();
        await categoryButton.click();

        // Check active filter is shown
        await expect(page.getByText('Category:')).toBeVisible();

        // Clear all filters
        await page.getByText('Clear all').click();

        // Check URL is back to base
        await expect(page).toHaveURL(/\/articles$/);
        await expect(page.getByText('Category:')).not.toBeVisible();
    });
});
