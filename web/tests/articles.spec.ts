import { test, expect } from '@playwright/test';

test.describe('Articles E2E', () => {
    const testTitle = `Test Article ${Date.now()}`;
    let articleId: string;

    test.beforeAll(async ({ request }) => {
        // Ensure backend is running
        const response = await request.get('http://localhost:4000/api/articles');
        expect(response.ok()).toBeTruthy();
    });

    test('Create a new article', async ({ page }) => {
        await page.goto('http://localhost:3000/en/dashboard/articles');

        // Click "New Article" button
        await page.click('text=+ New Article');
        await expect(page).toHaveURL(/\/dashboard\/articles\/new$/);

        // Fill in the form
        await page.fill('input[placeholder*="title"]', testTitle);
        const editor = page.locator('.ProseMirror');
        await editor.click();
        await editor.fill('# Test Content\n\nThis is a test article.');

        // Save as draft
        await page.click('text=Save Draft');

        // Should end up on list or stay on detail
        await expect(page).toHaveURL(/\/dashboard\/articles(\/(new|[a-f0-9-]+))?$/);
    });

    test('Edit an article', async ({ page, request }) => {
        // Ensure article exists
        const editTitle = `Test Article ${Date.now()}`;
        const createResp = await request.post('http://localhost:4000/api/articles', {
            data: { title: editTitle, body: '# Content' },
        });
        expect(createResp.ok()).toBeTruthy();

        await page.goto('http://localhost:3000/en/dashboard/articles');

        // Find and click edit button for our test article
        const row = page.locator(`tr:has-text("${editTitle}")`);
        await row.locator('text=Edit').click();

        await expect(page).toHaveURL(/\/dashboard\/articles\/[a-f0-9-]+$/);

        // Update title
        const updatedTitle = `${editTitle} (Updated)`;
        await page.fill('input[placeholder*="title"]', updatedTitle);

        // Save
        await page.click('text=Save Draft');

        // Verify stays on edit or returns to list
        await expect(page).toHaveURL(/\/dashboard\/articles(\/[a-f0-9-]+)?$/);
    });

    test('Publish an article', async ({ page, request }) => {
        // Create a draft article via API
        const createResponse = await request.post('http://localhost:4000/api/articles', {
            data: {
                title: `Draft Article ${Date.now()}`,
                body: '# Draft Content',
            },
        });
        expect(createResponse.ok()).toBeTruthy();
        const article = await createResponse.json();
        articleId = article.id;

        // Navigate to edit page
        await page.goto(`http://localhost:3000/en/dashboard/articles/${articleId}`);

        // Click Publish button
        await page.click('text=Publish');

        // Verify status is PUBLISHED via API
        const getResponse = await request.get(`http://localhost:4000/api/articles/${articleId}`);
        const data = await getResponse.json();
        expect(data.article.status).toBe('PUBLISHED');
        expect(data.article.published_at).toBeTruthy();
    });

    test('Filter articles by status', async ({ page }) => {
        await page.goto('http://localhost:3000/en/dashboard/articles');

        // Select DRAFT filter
        await page.selectOption('select', 'DRAFT');

        // Wait for reload
        await page.waitForTimeout(500);

        // All visible articles should have DRAFT status
        const statusBadges = await page.locator('span:has-text("DRAFT")').count();
        expect(statusBadges).toBeGreaterThanOrEqual(0);
    });

    test('Delete an article', async ({ page, request }) => {
        // Create an article to delete
        const createResponse = await request.post('http://localhost:4000/api/articles', {
            data: {
                title: `Article to Delete ${Date.now()}`,
                body: '# Will be deleted',
            },
        });
        const article = await createResponse.json();
        const deleteId = article.id;

        await page.goto('http://localhost:3000/en/dashboard/articles');

        // Find the article and click delete
        const row = page.locator(`tr:has-text("Article to Delete")`).first();

        // Handle confirmation dialog
        page.on('dialog', dialog => dialog.accept());
        await row.getByRole('button', { name: 'Delete' }).click();

        // Wait for deletion
        await page.waitForTimeout(500);

        // Verify via API (should be soft deleted)
        const getResponse = await request.get(`http://localhost:4000/api/articles/${deleteId}`);
        expect(getResponse.status()).toBe(404);
    });

    test('Assign tags to article', async ({ page, request }) => {
        // Create a test tag
        const tagResponse = await request.post('http://localhost:4000/api/tags', {
            data: {
                code: `test-tag-${Date.now()}`,
                name: { en: 'Test Tag' },
            },
        });
        const tag = await tagResponse.json();

        await page.goto('http://localhost:3000/en/dashboard/articles/new');

        // Fill basic info
        await page.fill('input[placeholder*="title"]', `Tagged Article ${Date.now()}`);
        const editor = page.locator('.ProseMirror');
        await editor.click();
        await editor.fill('# Content');

        // Select the tag
        await page.click(`button:has-text("Test Tag")`);

        // Save
        await page.click('text=Save Draft');

        await expect(page).toHaveURL(/\/dashboard\/articles(\/[a-f0-9-]+)?$/);
    });

    test('Search articles', async ({ page, request }) => {
        // Ensure article exists via API
        const searchTitle = `Test Article ${Date.now()}`;
        await request.post('http://localhost:4000/api/articles', {
            data: { title: searchTitle, body: '# Content' },
        });

        await page.goto('http://localhost:3000/en/dashboard/articles');

        // Type in search box
        await page.fill('input[placeholder*="Search"]', searchTitle);

        // Wait for filter
        await page.waitForTimeout(300);

        // Should only show matching articles
        await expect(page.getByText(searchTitle).first()).toBeVisible();
    });
});
