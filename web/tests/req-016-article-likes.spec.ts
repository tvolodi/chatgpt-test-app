import { test, expect } from '@playwright/test';

test.describe('REQ-016 Article Likes & Dislikes System', () => {
    const uniqueId = `test-article-${Date.now()}`;

    test.beforeEach(async ({ page }) => {
        // Create a test article via API
        const createRes = await page.request.post('http://localhost:4000/api/articles', {
            data: {
                title: `Test Article ${uniqueId}`,
                body: 'This is a test article for likes/dislikes testing.',
                category_id: null,
                tag_ids: []
            },
            headers: {
                'Authorization': 'Bearer test-token' // Will be replaced with real auth
            }
        });

        if (!createRes.ok()) {
            console.warn('Failed to create test article, tests may fail');
        }
    });

    test('AC-16.1.1: Like count is displayed next to the like button', async ({ page }) => {
        // Navigate to a published article
        await page.goto('/en/articles');
        await page.waitForSelector('[data-testid="article-card"]');

        const firstArticle = page.locator('[data-testid="article-card"]').first();
        await firstArticle.click();

        // Check that like button with count is visible
        const likeButton = page.locator('[aria-label*="Like"]').first();
        await expect(likeButton).toBeVisible();

        // Should contain a number (count)
        const likeText = await likeButton.textContent();
        expect(likeText).toMatch(/\d+/);
    });

    test('AC-16.1.2: Dislike count is displayed next to the dislike button', async ({ page }) => {
        // Navigate to a published article
        await page.goto('/en/articles');
        await page.waitForSelector('[data-testid="article-card"]');

        const firstArticle = page.locator('[data-testid="article-card"]').first();
        await firstArticle.click();

        // Check that dislike button with count is visible
        const dislikeButton = page.locator('[aria-label*="Dislike"]').first();
        await expect(dislikeButton).toBeVisible();

        // Should contain a number (count)
        const dislikeText = await dislikeButton.textContent();
        expect(dislikeText).toMatch(/\d+/);
    });

    test('AC-16.1.3: Counts update immediately after user action', async ({ page }) => {
        // This test requires authentication - skip for now
        test.skip();
    });

    test('AC-16.1.4: Zero counts display as "0" not hidden', async ({ page }) => {
        // Navigate to a published article
        await page.goto('/en/articles');
        await page.waitForSelector('[data-testid="article-card"]');

        // Select the second article which has zero interactions
        const articles = page.locator('[data-testid="article-card"]');
        const secondArticle = articles.nth(1);
        await secondArticle.click();

        // Check that buttons show "0" when no interactions
        const likeButton = page.locator('[aria-label*="Like"]').first();
        const dislikeButton = page.locator('[aria-label*="Dislike"]').first();

        await expect(likeButton).toContainText('0');
        await expect(dislikeButton).toContainText('0');
    });

    test('AC-16.2.1: Clicking like when not reacted adds a like', async ({ page }) => {
        // Skipped: Requires Keycloak authentication setup in test environment
        // Real E2E testing would need proper authentication flow
        test.skip();
    });

    test('AC-16.2.2: Clicking dislike when not reacted adds a dislike', async ({ page }) => {
        // Skipped: Requires Keycloak authentication setup in test environment
        test.skip();
    });

    test('AC-16.2.3: Clicking like when already liked removes the like', async ({ page }) => {
        // Skipped: Requires Keycloak authentication setup in test environment
        test.skip();
    });

    test('AC-16.2.4: Clicking dislike when already disliked removes the dislike', async ({ page }) => {
        // Skipped: Requires Keycloak authentication setup in test environment
        test.skip();
    });

    test('AC-16.2.5: Clicking like when disliked switches to like', async ({ page }) => {
        // Skipped: Requires Keycloak authentication setup in test environment
        test.skip();
    });

    test('AC-16.2.6: Clicking dislike when liked switches to dislike', async ({ page }) => {
        // Skipped: Requires Keycloak authentication setup in test environment
        test.skip();
    });

    test('AC-16.3.1: Unauthenticated users see buttons but clicking shows login prompt', async ({ page }) => {
        // Navigate to a published article
        await page.goto('/en/articles');
        await page.waitForSelector('[data-testid="article-card"]');

        const firstArticle = page.locator('[data-testid="article-card"]').first();
        await firstArticle.click();

        // Buttons should be visible
        const likeButton = page.locator('[aria-label*="Like"]').first();
        const dislikeButton = page.locator('[aria-label*="Dislike"]').first();

        await expect(likeButton).toBeVisible();
        await expect(dislikeButton).toBeVisible();

        // Clicking should show error message
        await likeButton.click();
        await expect(page.locator('text=Please sign in to interact')).toBeVisible();
    });

    test('AC-16.3.2: User\'s current reaction is visually indicated', async ({ page }) => {
        // Skipped: Requires Keycloak authentication setup in test environment
        test.skip();
    });

    test('AC-16.3.3: User\'s reaction persists across page reloads', async ({ page }) => {
        // Skipped: Requires Keycloak authentication setup in test environment
        test.skip();
    });

    test('AC-16.4.1: Buttons show loading state during API calls', async ({ page }) => {
        // Skipped: Requires Keycloak authentication setup in test environment
        test.skip();
    });

    test('AC-16.4.2: Icons change immediately on click (optimistic update)', async ({ page }) => {
        // Skipped: Requires Keycloak authentication setup in test environment
        test.skip();
    });

    test('AC-16.4.3: On API error, revert to previous state and show error', async ({ page }) => {
        // Skipped: Requires Keycloak authentication setup in test environment
        test.skip();
    });
});