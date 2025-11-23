import { test, expect } from '@playwright/test';

test.describe('AI News Page E2E', () => {
  test('Create, Publish, and View Article', async ({ page }) => {
    // 1. Create a new article
    await page.goto('http://localhost:3000/en/dashboard/articles/new');

    const timestamp = Date.now();
    const title = `News Test Article ${timestamp}`;
    const slug = `news-test-article-${timestamp}`;

    await page.fill('input[placeholder="Enter article title"]', title);
    await page.fill('textarea[placeholder*="Markdown"]', '# Hello World\n\nThis is a test article body.');

    // Save as draft
    await page.click('text=Save Draft');
    await page.waitForTimeout(1000); // Wait for save

    // Publish
    await page.click('text=Publish');
    await page.waitForTimeout(1000); // Wait for publish

    // 2. Verify it appears on the public news list
    await page.goto('http://localhost:3000/en/news');
    await expect(page.locator(`text=${title}`)).toBeVisible();

    // 3. Navigate to detail page
    await page.click(`text=${title}`);

    // 4. Verify detail page content
    await expect(page).toHaveURL(new RegExp(`/news/${slug}`));
    await expect(page.locator('h1')).toHaveText(title);
    await expect(page.locator('h1')).toBeVisible();
    // Check rendered markdown
    await expect(page.locator('h1:has-text("Hello World")')).toBeVisible();
  });

  test('Draft articles do not appear in news list', async ({ page }) => {
    // 1. Create a draft article
    await page.goto('http://localhost:3000/en/dashboard/articles/new');

    const timestamp = Date.now();
    const title = `Draft Test Article ${timestamp}`;

    await page.fill('input[placeholder="Enter article title"]', title);
    await page.fill('textarea[placeholder*="Markdown"]', 'Draft content');

    // Save as draft
    await page.click('text=Save Draft');
    await page.waitForTimeout(1000);

    // 2. Check public news list
    await page.goto('http://localhost:3000/en/news');
    await expect(page.locator(`text=${title}`)).not.toBeVisible();
  });
});
