import { test, expect } from '@playwright/test';

test.describe('REQ-013 Authenticated Comment Posting', () => {
    test('authenticated user can post a comment', async ({ page }) => {
        // Mock session API to return authenticated state
        await page.route('**/api/auth/session', async route => {
            await route.fulfill({
                json: {
                    user: { email: 'test@example.com', name: 'Test User' },
                    accessToken: 'mock-token-123',
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                }
            });
        });

        // Mock API response for article detail
        await page.route('**/api/articles/test-article-id', async route => {
            await route.fulfill({
                json: {
                    article: {
                        id: 'test-article-id',
                        title: 'Test Article',
                        body: 'Test content',
                        author_id: 'author1',
                        published_at: new Date().toISOString(),
                        tags: ['test']
                    }
                }
            });
        });

        // Mock interactions
        await page.route('**/api/articles/test-article-id/interactions', async route => {
            await route.fulfill({ json: { likes: 0, dislikes: 0 } });
        });

        // Mock initial comments (empty)
        await page.route('**/api/articles/test-article-id/comments', async route => {
            if (route.request().method() === 'GET') {
                await route.fulfill({ json: { comments: [] } });
            } else if (route.request().method() === 'POST') {
                // Mock successful comment creation
                const body = await route.request().postDataJSON();
                await route.fulfill({
                    status: 201,
                    json: {
                        id: 'comment-123',
                        article_id: 'test-article-id',
                        user_id: 'user-123',
                        body: body.body,
                        created_at: new Date().toISOString()
                    }
                });
            }
        });

        // Navigate to article
        await page.goto('/articles?id=test-article-id');

        // Wait for page to load
        await expect(page.getByRole('heading', { name: 'Test Article', level: 1 })).toBeVisible();

        // Should NOT see login banner (user is authenticated)
        await expect(page.getByText('to leave comments and like this article.')).not.toBeVisible();

        // Fill in comment
        const commentTextarea = page.getByPlaceholder('Add a comment...');
        await commentTextarea.fill('This is my test comment');

        // Submit comment
        await page.getByRole('button', { name: 'Post Comment' }).click();

        // Wait for comment to appear
        await expect(page.getByText('This is my test comment')).toBeVisible();

        // Verify textarea is cleared
        await expect(commentTextarea).toHaveValue('');
    });
});
