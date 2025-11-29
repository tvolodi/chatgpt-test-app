import { test, expect } from '@playwright/test';
import { loginAsTestUser } from './helpers/auth';
import { cleanupTestData } from './helpers/test-factory';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

test('REQ-011: Unsaved changes warning', async ({ page }) => {
    // Login as test user first
    await loginAsTestUser(page);

    // Track created article ID for cleanup
    let createdArticleId: string | null = null;

    try {
        await page.goto(`${BASE_URL}/en/dashboard/articles/new`);

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

        // Wait for navigation to article detail (capture the actual article ID)
        await page.waitForURL(/\/dashboard\/articles\/[^\/]+/);
        const url = page.url();
        const match = url.match(/\/dashboard\/articles\/([^\/]+)/);
        if (match) {
            createdArticleId = match[1];
        }

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
    } finally {
        // Clean up the created article if we have its ID
        if (createdArticleId) {
            await cleanupTestData(page.request, { articles: [createdArticleId] });
        }
    }
});
