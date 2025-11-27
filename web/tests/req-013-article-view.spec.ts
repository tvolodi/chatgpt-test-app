import { test, expect } from '@playwright/test';

test.describe('REQ-013 Public Article View & Interactions', () => {
    test('should display article list and allow selection', async ({ page }) => {
        // Mock API response for list
        await page.route('**/api/articles/public*', async route => {
            const json = {
                articles: [
                    {
                        id: '1',
                        title: 'Test Article 1',
                        body: 'This is the body of test article 1.',
                        author_id: 'author1',
                        published_at: new Date().toISOString(),
                        tags: ['tag1']
                    },
                    {
                        id: '2',
                        title: 'Test Article 2',
                        body: 'This is the body of test article 2.',
                        author_id: 'author1',
                        published_at: new Date().toISOString(),
                        tags: ['tag2']
                    }
                ],
                total: 2
            };
            await route.fulfill({ json });
        });

        // Mock API response for detail
        await page.route('**/api/articles/1', async route => {
            const json = {
                article: {
                    id: '1',
                    title: 'Test Article 1',
                    body: 'This is the body of test article 1.',
                    author_id: 'author1',
                    published_at: new Date().toISOString(),
                    tags: ['tag1']
                }
            };
            await route.fulfill({ json });
        });

        // Mock interactions
        await page.route('**/api/articles/1/interactions', async route => {
            await route.fulfill({ json: { likes: 10, dislikes: 2 } });
        });

        await page.route('**/api/articles/1/comments', async route => {
            await route.fulfill({ json: { comments: [] } });
        });

        // Mock session API to return unauthenticated state
        await page.route('**/api/auth/session', async route => {
            await route.fulfill({ json: {} });
        });

        // Navigate to articles page
        await page.goto('/articles');

        // Check list is visible
        await expect(page.getByRole('heading', { name: 'Test Article 1' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Test Article 2' })).toBeVisible();

        // Click on first article
        await page.getByRole('heading', { name: 'Test Article 1' }).click();

        // Check URL
        await expect(page).toHaveURL(/.*id=1/);

        // Check detail view
        await expect(page.getByRole('heading', { name: 'Test Article 1', level: 1 })).toBeVisible();
        await expect(page.getByText('By Author author1')).toBeVisible();

        // Check interaction controls
        const likeButton = page.getByRole('button').filter({ hasText: '👍' });
        await expect(likeButton).toBeVisible();
        await expect(likeButton).toContainText('10');

        const dislikeButton = page.getByRole('button').filter({ hasText: '👎' });
        await expect(dislikeButton).toBeVisible();
        await expect(dislikeButton).toContainText('2');

        // Check comments section
        await expect(page.getByRole('heading', { name: 'Comments' })).toBeVisible();
        await expect(page.getByPlaceholder('Add a comment...')).toBeVisible();

        // Check persistent login banner is visible for unauthenticated users
        await expect(page.getByText('to leave comments and like this article.')).toBeVisible();
        await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
    });

    test('should navigate from home page to article detail', async ({ page }) => {
        // Mock API response for latest articles
        await page.route('**/api/articles/public?limit=3', async route => {
            const json = {
                articles: [
                    {
                        id: '1',
                        title: 'Latest Article 1',
                        body: 'Preview of latest article 1.',
                        author_id: 'author1',
                        published_at: new Date().toISOString(),
                        tags: ['tag1']
                    }
                ],
                total: 1
            };
            await route.fulfill({ json });
        });

        await page.goto('/');

        // Click on the article card
        await page.getByRole('heading', { name: 'Latest Article 1' }).click();

        // Check URL
        await expect(page).toHaveURL(/\/articles\?id=1/);
    });
});
