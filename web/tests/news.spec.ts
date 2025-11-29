import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';
const API_BASE_URL = process.env.E2E_API_BASE_URL || 'http://localhost:4000/api';

test.describe('AI News Page E2E', () => {
  test('News list displays seeded news items', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/news`);

    // Wait for content to load
    await page.waitForSelector('h1:has-text("AI News & Updates")');

    // Check that news items are displayed
    const newsItems = page.locator('article');
    await expect(newsItems).toHaveCount(10); // Default page size

    // Check first item has expected structure
    const firstItem = newsItems.first();
    await expect(firstItem.locator('h2')).toBeVisible();
    await expect(firstItem.locator('time')).toBeVisible();
    await expect(firstItem.locator('text=Read more')).toBeVisible();
  });

  test('News list pagination works', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/news`);

    // Wait for initial load
    await page.waitForSelector('h1:has-text("AI News & Updates")');

    // Check Load More button exists
    const loadMoreButton = page.getByRole('button', { name: 'Load More' });
    await expect(loadMoreButton).toBeVisible();

    // Click Load More
    await loadMoreButton.click();

    // Wait for more items to load
    await page.waitForTimeout(1000); // Allow time for loading

    // Should now have more than 10 items
    const newsItems = page.locator('article');
    const count = await newsItems.count();
    expect(count).toBeGreaterThan(10);
  });

  test('Category filtering works', async ({ page }) => {
    await page.goto(`${BASE_URL}/en/news`);

    // Wait for content to load
    await page.waitForSelector('h1:has-text("AI News & Updates")');

    // Get initial count
    const initialItems = page.locator('article');
    const initialCount = await initialItems.count();

    // Click on Tools category filter
    await page.getByRole('button', { name: 'Tools' }).click();

    // Wait for filtering
    await page.waitForTimeout(500);

    // Check that we have fewer or equal items
    const filteredItems = page.locator('article');
    const filteredCount = await filteredItems.count();

    // Should have some items (at least 8 based on seeding pattern)
    expect(filteredCount).toBeGreaterThan(0);
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test('News detail page displays correctly', async ({ page }) => {
    // First get a news item slug from the list
    await page.goto(`${BASE_URL}/en/news`);
    await page.waitForSelector('h1:has-text("AI News & Updates")');

    // Click on the first news item
    const firstNewsLink = page.locator('article').first().locator('a').first();
    const href = await firstNewsLink.getAttribute('href');
    expect(href).toMatch(/^\/news\//);

    await firstNewsLink.click();

    // Should navigate to detail page
    await expect(page).toHaveURL(new RegExp(`${BASE_URL}/news/.*`));

    // Check detail page structure
    await expect(page.locator('h1.text-4xl')).toBeVisible(); // Main title with large text
    await expect(page.getByText('AI-Dala Team')).toBeVisible();
    // Check that we have some content (the article body)
    await expect(page.locator('.prose')).toBeVisible();
  });

  test('News detail page shows 404 for invalid slug', async ({ page }) => {
    await page.goto(`${BASE_URL}/news/non-existent-slug`);

    // Should show error message
    await expect(page.getByText('Article Not Found')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Back to News' })).toBeVisible();
  });
});
