import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

test('REQ-011: Unsaved changes warning on Sidebar Navigation', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard/articles/new`);

    // Type some text to make it dirty
    await page.fill('input[placeholder="Enter article title..."]', 'Unsaved Article');

    // Verify visual indicator appears
    await expect(page.locator('text=Unsaved changes')).toBeVisible();

    // Setup dialog handler for dismissal
    let dialogMessage = '';
    page.once('dialog', async dialog => {
        dialogMessage = dialog.message();
        await dialog.dismiss();
    });

    // Click "Home" link in Sidebar
    await page.click('a[href="/dashboard"]');

    // Wait a bit for dialog handling
    await page.waitForTimeout(500);

    // Verify dialog appeared
    expect(dialogMessage).toContain('You have unsaved changes');

    // Verify we are still on the page
    expect(page.url()).toContain('/dashboard/articles/new');

    // Now try again and accept
    page.once('dialog', async dialog => {
        await dialog.accept();
    });

    await page.click('a[href="/dashboard"]');

    // Verify navigation happened
    await page.waitForURL(/\/dashboard$/);
});
