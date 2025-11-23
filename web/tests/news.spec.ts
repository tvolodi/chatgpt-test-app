import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';
const API_BASE_URL = process.env.E2E_API_BASE_URL || 'http://localhost:4000/api';

test.describe('AI News Page E2E', () => {
  test('Create, Publish, and View Article', async ({ page, request }) => {
    const timestamp = Date.now();
    const title = `News Test Article ${timestamp}`;

    // Create via API
    const createResp = await request.post(`${API_BASE_URL}/articles`, {
      data: { title, body: '# Hello World\n\nThis is a test article body.' },
    });
    expect(createResp.ok()).toBeTruthy();
    const created = await createResp.json();

    // Publish via API
    const publishResp = await request.post(`${API_BASE_URL}/articles/${created.id}/publish`);
    expect(publishResp.ok()).toBeTruthy();

    // Verify on news list
    await page.goto(`${BASE_URL}/en/news`);
    await expect(page.getByText(title, { exact: true })).toBeVisible();

    // Navigate to detail
    await page.getByText(title, { exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/news/${created.slug || created.id}`));
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  });

  test('Draft articles do not appear in news list', async ({ page, request }) => {
    const timestamp = Date.now();
    const title = `Draft Test Article ${timestamp}`;

    // Create draft via API
    const createResp = await request.post(`${API_BASE_URL}/articles`, {
      data: { title, body: 'Draft content' },
    });
    expect(createResp.ok()).toBeTruthy();

    // Ensure not published
    await page.goto(`${BASE_URL}/en/news`);
    await expect(page.getByText(title, { exact: true })).not.toBeVisible();
  });
});
