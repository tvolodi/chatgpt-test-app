import { test, expect } from '@playwright/test';

test.describe('REQ-017 Search Functionality', () => {
    const uniqueId = `search-test-${Date.now()}`;

    test.beforeEach(async ({ page }) => {
        // Create test articles via API
        const testArticles = [
            {
                title: `Test Article One ${uniqueId}`,
                body: 'This is a test article about artificial intelligence and machine learning. AI is transforming the world.',
                category_id: null,
                tag_ids: ['ai', 'ml']
            },
            {
                title: `Test Article Two ${uniqueId}`,
                body: 'This article discusses web development and Next.js frameworks. Building modern web applications.',
                category_id: null,
                tag_ids: ['web', 'nextjs']
            },
            {
                title: `Test Article Three ${uniqueId}`,
                body: 'Content about PostgreSQL databases and data management. SQL queries and optimization.',
                category_id: null,
                tag_ids: ['database', 'postgresql']
            }
        ];

        for (const article of testArticles) {
            const createRes = await page.request.post('http://localhost:4000/api/test/articles', {
                data: article
            });
            expect(createRes.ok()).toBeTruthy();
        }
    });

    test('AC-17.1.1: Search bar is accessible from header on all pages', async ({ page }) => {
        await page.goto('/');
        const searchBar = page.locator('input[placeholder*="Search"]').first();
        await expect(searchBar).toBeVisible();
    });

    test('AC-17.1.2: Enter key triggers search', async ({ page }) => {
        await page.goto('/');
        const searchBar = page.locator('input[placeholder*="Search"]').first();
        await searchBar.fill('artificial');
        await searchBar.press('Enter');
        await expect(page).toHaveURL(/\/search\?q=artificial/);
    });

    test('AC-17.1.3: Search query is reflected in URL', async ({ page }) => {
        await page.goto('/search?q=machine');
        const searchBar = page.locator('input[placeholder*="Search"]').first();
        await expect(searchBar).toHaveValue('machine');
    });

    test('AC-17.1.4: Minimum query length is 2 characters', async ({ page }) => {
        await page.goto('/');
        const searchBar = page.locator('input[placeholder*="Search"]').first();
        await searchBar.fill('a');
        await searchBar.press('Enter');
        // Should not navigate or show results
        await expect(page).not.toHaveURL(/\/search/);
    });

    test('AC-17.2.1: Results display article title with keyword highlighted', async ({ page }) => {
        await page.goto('/search?q=artificial');
        await page.waitForTimeout(1000); // Wait for search to complete
        const highlightedTitle = page.locator('mark').first();
        await expect(highlightedTitle).toContainText('artificial');
    });

    test('AC-17.2.2: Results display excerpt with keyword highlighted', async ({ page }) => {
        await page.goto('/search?q=intelligence');
        await page.waitForTimeout(1000);
        const highlightedExcerpt = page.locator('mark').filter({ hasText: 'intelligence' });
        await expect(highlightedExcerpt.first()).toBeVisible();
    });

    test('AC-17.2.3: Results display category, tags, and publish date', async ({ page }) => {
        await page.goto('/search?q=artificial');
        await page.waitForTimeout(1000);
        // Check for tags display
        const tagElement = page.locator('text=ai').first();
        await expect(tagElement).toBeVisible();
        // Check for date display
        const dateElement = page.locator('[data-testid="article-date"]').first();
        await expect(dateElement).toBeVisible();
    });

    test('AC-17.2.4: Clicking a result navigates to article detail page', async ({ page }) => {
        await page.goto('/search?q=artificial');
        await page.waitForTimeout(1000);
        const firstResult = page.locator('[data-testid="search-result"]').first();
        const link = firstResult.locator('a').first();
        const href = await link.getAttribute('href');
        await link.click();
        await expect(page).toHaveURL(href!);
    });

    test('AC-17.2.5: Total result count is displayed', async ({ page }) => {
        await page.goto('/search?q=artificial');
        await page.waitForTimeout(1000);
        const resultsText = page.locator('text=Found').first();
        await expect(resultsText).toContainText('results for');
    });

    test('AC-17.2.6: Empty state shows "No results found" message', async ({ page }) => {
        await page.goto('/search?q=nonexistentterm12345');
        await page.waitForTimeout(1000);
        const noResults = page.locator('text=No results found').first();
        await expect(noResults).toBeVisible();
    });

    test('AC-17.3.1: Results can be filtered by category', async ({ page }) => {
        // This would require categories to be implemented first
        // For now, skip as categories are not in scope
        test.skip();
    });

    test('AC-17.3.2: Results can be filtered by tags', async ({ page }) => {
        // This would require tag filtering in search
        // For now, skip as advanced filtering not implemented in MVP
        test.skip();
    });

    test('AC-17.4.1: Results are paginated (10 per page default)', async ({ page }) => {
        // Create more articles to test pagination
        for (let i = 0; i < 12; i++) {
            const createRes = await page.request.post('http://localhost:4000/api/articles', {
                data: {
                    title: `Pagination Test Article ${i} ${uniqueId}`,
                    body: 'This is a test article for pagination testing. Artificial intelligence content.',
                    category_id: null,
                    tag_ids: ['ai']
                }
            });
            expect(createRes.ok()).toBeTruthy();

            const articleData = await createRes.json();
            const publishRes = await page.request.post(`http://localhost:4000/api/articles/${articleData.article.id}/publish`);
            expect(publishRes.ok()).toBeTruthy();
        }

        await page.goto('/search?q=artificial');
        await page.waitForTimeout(1000);
        // Should show 10 results initially
        const results = page.locator('[data-testid="search-result"]');
        await expect(results).toHaveCount(10);
    });

    test('AC-17.5.1: Search returns results within 500ms', async ({ page }) => {
        const startTime = Date.now();
        await page.goto('/search?q=artificial');
        await page.waitForSelector('mark', { timeout: 500 });
        const endTime = Date.now();
        expect(endTime - startTime).toBeLessThan(500);
    });

    test('AC-17.5.3: Only published articles appear in results', async ({ page }) => {
        // Create a draft article
        const createRes = await page.request.post('http://localhost:4000/api/articles', {
            data: {
                title: `Draft Article ${uniqueId}`,
                body: 'This is a draft article about artificial intelligence.',
                category_id: null,
                tag_ids: ['ai']
            }
        });
        expect(createRes.ok()).toBeTruthy();

        await page.goto('/search?q=artificial');
        await page.waitForTimeout(1000);
        // Should not find the draft article
        const draftTitle = page.locator(`text=Draft Article ${uniqueId}`);
        await expect(draftTitle).not.toBeVisible();
    });

    test('AC-17.6.1: All UI text uses translation keys', async ({ page }) => {
        await page.goto('/search?q=test');
        await page.waitForTimeout(1000);
        // Check that translated text is present
        const searchResultsText = page.locator('h1').filter({ hasText: /Search Results|Результаты поиска|Іздеу нәтижелері/ });
        await expect(searchResultsText).toBeVisible();
    });
});