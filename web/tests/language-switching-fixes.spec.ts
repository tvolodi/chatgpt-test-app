import { test, expect } from '@playwright/test';

test.describe('Language Switching Fixes (REQ-006)', () => {
    test('TC-E2E-006.5: should switch to English from Russian', async ({ page }) => {
        // Navigate to Russian page
        await page.goto('http://localhost:3000/ru');
        await page.waitForLoadState('networkidle');

        // Verify we're on Russian page
        const localeTest = page.locator('[data-testid="locale-identifier"]');
        await expect(localeTest).toContainText('LOCALE-TEST-RU');
        await expect(page.locator('h1')).toContainText('Создавайте, запускайте и развивайтесь');

        // Open language switcher
        const languageSwitcher = page.locator('button').filter({ hasText: 'RU' });
        await languageSwitcher.click();

        // Click English option (should be an anchor tag)
        await page.getByRole('link', { name: /English/i }).click();
        await page.waitForLoadState('networkidle');

        // Verify URL changed to / (no locale prefix for English)
        expect(page.url()).toBe('http://localhost:3000/');
        expect(page.url()).not.toContain('/ru');
        expect(page.url()).not.toContain('/en');

        // Verify English content is displayed
        await expect(localeTest).toContainText('LOCALE-TEST-EN');
        await expect(page.locator('h1')).toContainText('Build, launch, and grow');
    });

    test('TC-E2E-006.6: should switch to English from Kazakh', async ({ page }) => {
        // Navigate to Kazakh page
        await page.goto('http://localhost:3000/kk');
        await page.waitForLoadState('networkidle');

        // Verify we're on Kazakh page
        const localeTest = page.locator('[data-testid="locale-identifier"]');
        await expect(localeTest).toContainText('LOCALE-TEST-KK');
        await expect(page.locator('h1')).toContainText('жасаңыз, іске қосыңыз және дамытыңыз');

        // Open language switcher
        const languageSwitcher = page.locator('button').filter({ hasText: 'KK' });
        await languageSwitcher.click();

        // Click English option (should be an anchor tag)
        await page.getByRole('link', { name: /English/i }).click();
        await page.waitForLoadState('networkidle');

        // Verify URL changed to / (no locale prefix for English)
        expect(page.url()).toBe('http://localhost:3000/');
        expect(page.url()).not.toContain('/kk');
        expect(page.url()).not.toContain('/en');

        // Verify English content is displayed
        await expect(localeTest).toContainText('LOCALE-TEST-EN');
        await expect(page.locator('h1')).toContainText('Build, launch, and grow');
    });

    test('TC-E2E-006.7: should support all bidirectional language switches', async ({ page }) => {
        const localeTest = page.locator('[data-testid="locale-identifier"]');

        // Test 1: EN → RU → EN
        await page.goto('http://localhost:3000');
        await page.waitForLoadState('networkidle');
        await expect(localeTest).toContainText('LOCALE-TEST-EN');

        // EN → RU
        await page.locator('button').filter({ hasText: 'EN' }).click();
        await page.getByRole('button', { name: /Русский/i }).click();
        await page.waitForLoadState('networkidle');
        await expect(localeTest).toContainText('LOCALE-TEST-RU');
        expect(page.url()).toContain('/ru');

        // RU → EN
        await page.locator('button').filter({ hasText: 'RU' }).click();
        await page.getByRole('link', { name: /English/i }).click();
        await page.waitForLoadState('networkidle');
        await expect(localeTest).toContainText('LOCALE-TEST-EN');
        expect(page.url()).toBe('http://localhost:3000/');

        // Test 2: EN → KK → EN
        await page.locator('button').filter({ hasText: 'EN' }).click();
        await page.getByRole('button', { name: /Қазақ/i }).click();
        await page.waitForLoadState('networkidle');
        await expect(localeTest).toContainText('LOCALE-TEST-KK');
        expect(page.url()).toContain('/kk');

        // KK → EN
        await page.locator('button').filter({ hasText: 'KK' }).click();
        await page.getByRole('link', { name: /English/i }).click();
        await page.waitForLoadState('networkidle');
        await expect(localeTest).toContainText('LOCALE-TEST-EN');
        expect(page.url()).toBe('http://localhost:3000/');

        // Test 3: RU ↔ KK
        await page.goto('http://localhost:3000/ru');
        await page.waitForLoadState('networkidle');
        await expect(localeTest).toContainText('LOCALE-TEST-RU');

        // RU → KK
        await page.locator('button').filter({ hasText: 'RU' }).click();
        await page.getByRole('button', { name: /Қазақ/i }).click();
        await page.waitForLoadState('networkidle');
        await expect(localeTest).toContainText('LOCALE-TEST-KK');
        expect(page.url()).toContain('/kk');

        // KK → RU
        await page.locator('button').filter({ hasText: 'KK' }).click();
        await page.getByRole('button', { name: /Русский/i }).click();
        await page.waitForLoadState('networkidle');
        await expect(localeTest).toContainText('LOCALE-TEST-RU');
        expect(page.url()).toContain('/ru');
    });

    test('TC-E2E-006.8: should not have hydration mismatches', async ({ page }) => {
        // Listen for console errors
        const consoleErrors: string[] = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });

        // Navigate to Russian page
        await page.goto('http://localhost:3000/ru');
        await page.waitForLoadState('networkidle');

        // Wait a bit for any hydration errors to appear
        await page.waitForTimeout(2000);

        // Verify no hydration errors
        const hydrationErrors = consoleErrors.filter(err =>
            err.includes('Hydration') ||
            err.includes('hydration') ||
            err.includes('did not match')
        );
        expect(hydrationErrors).toHaveLength(0);

        // Verify Russian content is displayed correctly
        const localeTest = page.locator('[data-testid="locale-identifier"]');
        await expect(localeTest).toContainText('LOCALE-TEST-RU');
        await expect(page.locator('h1')).toContainText('Создавайте, запускайте и развивайтесь');

        // Switch to Kazakh and check again
        await page.locator('button').filter({ hasText: 'RU' }).click();
        await page.getByRole('button', { name: /Қазақ/i }).click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Verify no new hydration errors
        const newHydrationErrors = consoleErrors.filter(err =>
            err.includes('Hydration') ||
            err.includes('hydration') ||
            err.includes('did not match')
        );
        expect(newHydrationErrors).toHaveLength(0);

        // Verify Kazakh content is displayed correctly
        await expect(localeTest).toContainText('LOCALE-TEST-KK');
        await expect(page.locator('h1')).toContainText('жасаңыз, іске қосыңыз және дамытыңыз');
    });
});
