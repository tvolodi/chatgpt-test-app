import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

test('REQ-011: Toolbar buttons show active state', async ({ page }) => {
    page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`));
    await page.goto(`${BASE_URL}/dashboard/articles/new`);

    // Type some text
    await page.click('.ProseMirror');
    await page.keyboard.type('Bold Text');

    // Select the text
    await page.keyboard.press('Control+A');

    // Click Bold button
    await page.click('button[title="Bold"]');

    // Check if Bold button has active class (text-black)
    const boldBtn = page.locator('button[title="Bold"]');
    await expect(boldBtn).toHaveClass(/text-black/);

    // Click Bold button again to toggle OFF
    await page.click('button[title="Bold"]');

    // Check if Bold button is NOT active (should be text-gray-600)
    await expect(boldBtn).toHaveClass(/text-gray-600/);

    // Click Bold button again to toggle ON
    await page.click('button[title="Bold"]');

    // Check if Bold button is active again
    await expect(boldBtn).toHaveClass(/text-black/);
});
