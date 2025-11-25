import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

test('REQ-011: Unsaved changes warning', async ({ page }) => {
    // Mock the API save endpoint
    await page.route('**/api/articles', async route => {
        if (route.request().method() === 'POST') {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    article: {
                        id: 'mock-article-id',
                        title: 'Unsaved Article',
                        body: 'Some content',
                        status: 'DRAFT'
                    },
                    message: 'Article saved successfully'
                })
            });
        } else {
            await route.continue();
        }
    });

    await page.goto(`${BASE_URL}/dashboard/articles/new`);

    // Type some text in title
    await page.fill('input[placeholder="Enter article title..."]', 'Unsaved Article');

    // Try to reload page
    let dialogAppeared = false;
    page.on('dialog', async dialog => {
        dialogAppeared = true;
        console.log(`Dialog message: ${dialog.message()}`);
        await dialog.dismiss(); // Dismiss to stay on page
    });

    try {
        await page.reload({ timeout: 5000 });
    } catch (e) {
        console.log('Reload cancelled as expected');
    }

    // Verify dialog appeared
    expect(dialogAppeared).toBe(true);

    // Now save the article
    // We need to fill required fields first
    await page.click('.ProseMirror');
    await page.keyboard.type('Some content');

    // Click Save
    await page.click('button:has-text("Save Draft")');

    // Wait for navigation to article detail (UUID or mock ID)
    await page.waitForURL(/\/dashboard\/articles\/mock-article-id/);

    // Reset dialog flag
    dialogAppeared = false;

    // Wait for state to settle
    await page.waitForTimeout(1000);

    // Try to reload again
    try {
        await page.reload({ timeout: 5000 });
    } catch (e) {
        // If dialog appears, reload might fail or timeout if we dismiss it
    }

    // Verify dialog did NOT appear (because we saved)
    expect(dialogAppeared).toBe(false);
});
