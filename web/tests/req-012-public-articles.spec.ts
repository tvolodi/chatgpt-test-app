import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

test.describe('REQ-012: Public Article List', () => {
    test('Main Page Widget displays latest articles', async ({ page }) => {
        await page.goto(BASE_URL);

        // Check for section title
        await expect(page.locator('h2', { hasText: 'Latest Articles' })).toBeVisible();

        // Check for "Show All" link
        const showAllLink = page.locator('a', { hasText: 'Show All' });
        await expect(showAllLink).toBeVisible();
        await expect(showAllLink).toHaveAttribute('href', '/articles');

        // Check for article cards (assuming there are some published articles)
        // If no articles, it shows "No articles published yet"
        const noArticles = await page.locator('text=No articles published yet').isVisible();
        if (!noArticles) {
            const cards = page.locator('.bg-white.rounded-lg.shadow-sm');
            const count = await cards.count();
            expect(count).toBeLessThanOrEqual(3);
            if (count > 0) {
                await expect(cards.first()).toBeVisible();
            }
        }
    });

    test('Navigation to Articles List Page', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.click('text=Show All');
        await page.waitForURL(/\/articles/);
        await expect(page.locator('header')).toBeVisible();
        await expect(page.locator('h1', { hasText: 'All Articles' })).toBeVisible();

        // Verify Header is present (assuming it has a nav element or specific logo/link)
        // Adjust selector based on actual Header implementation, usually 'header' or 'nav'
        await expect(page.locator('header')).toBeVisible();
    });

    test('Articles List Page Pagination', async ({ page }) => {
        await page.goto(`${BASE_URL}/articles`);

        // If there are enough articles for pagination
        const nextButton = page.locator('button', { hasText: 'Next' });
        if (await nextButton.isVisible() && await nextButton.isEnabled()) {
            await nextButton.click();
            await expect(page).toHaveURL(/page=2/);

            const prevButton = page.locator('button', { hasText: 'Previous' });
            await expect(prevButton).toBeEnabled();
            await prevButton.click();
            await expect(page).toHaveURL(/page=1/);
        }
    });

    test('Article Card Double Click Navigation', async ({ page }) => {
        // Create a published article first to ensure we have something to click
        // Login
        await page.goto(`${BASE_URL}/api/auth/signin`);
        // Assuming mock auth or existing session, skipping login steps for now as we are testing public pages
        // But we need data. Let's assume data exists or we mock the API.

        // Let's mock the API response for consistent testing
        await page.route('**/api/articles/public*', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    articles: [
                        {
                            id: 'test-article-id',
                            title: 'Test Article Title',
                            body: 'This is a preview of the article body...',
                            author_id: 'author-1',
                            published_at: new Date().toISOString(),
                            tags: ['test', 'playwright']
                        }
                    ],
                    total: 1,
                    page: 1,
                    limit: 10
                })
            });
        });

        await page.goto(`${BASE_URL}/articles`);
        const card = page.locator('text=Test Article Title').first();
        await expect(card).toBeVisible();

        // Double click
        await card.dblclick();
        // Expect navigation to dashboard OR login (if unauthenticated)
        await expect(page).toHaveURL(/\/dashboard\/articles\/test-article-id|signin|login/);
    });
});
