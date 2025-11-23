import { test, expect } from '@playwright/test';

test.describe('Language Switching Fixes (REQ-006)', () => {
    test('should switch to English from Russian', async ({ page }) => {
        await page.goto('/ru');
        await page.waitForLoadState('networkidle');

        const languageSwitcher = page.getByTestId('language-switcher-trigger');
        await languageSwitcher.click();

        const dropdown = page.getByTestId('language-switcher-dropdown');
        await dropdown.getByRole('link', { name: /English/i }).click();
        await page.waitForLoadState('networkidle');

        expect(page.url()).not.toContain('/ru');
        expect(page.url()).not.toContain('/kk');
    });

    test('should switch to English from Kazakh', async ({ page }) => {
        await page.goto('/kk');
        await page.waitForLoadState('networkidle');

        const languageSwitcher = page.getByTestId('language-switcher-trigger');
        await languageSwitcher.click();

        const dropdown = page.getByTestId('language-switcher-dropdown');
        await dropdown.getByRole('link', { name: /English/i }).click();
        await page.waitForLoadState('networkidle');

        expect(page.url()).not.toContain('/ru');
        expect(page.url()).not.toContain('/kk');
    });

    test('should support all bidirectional language switches', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Helper to switch language
        const switchLanguage = async (targetLang: string, expectedUrlPart: string, expectedH1: string) => {
            const languageSwitcher = page.getByTestId('language-switcher-trigger');
            await languageSwitcher.click();

            const dropdown = page.getByTestId('language-switcher-dropdown');
            if (targetLang === 'English') {
                await dropdown.getByRole('link', { name: /English/i }).click();
            } else {
                await dropdown.getByRole('button', { name: new RegExp(targetLang, 'i') }).click();
            }
            await page.waitForLoadState('networkidle');

            if (expectedUrlPart === '/') {
                expect(page.url()).not.toContain('/ru');
                expect(page.url()).not.toContain('/kk');
            } else {
                expect(page.url()).toContain(expectedUrlPart);
            }
        };

        // EN -> RU
        await switchLanguage('Русский', '/ru', '');

        // RU -> EN
        await switchLanguage('English', '/', '');

        // EN -> KK
        await switchLanguage('Қазақ', '/kk', '');

        // KK -> EN
        await switchLanguage('English', '/', '');

        // RU -> KK (Direct switch)
        await page.goto('/ru');
        await switchLanguage('Қазақ', '/kk', '');

        // KK -> RU (Direct switch)
        await switchLanguage('Русский', '/ru', '');
    });

    test('should not have hydration mismatches', async ({ page }) => {
        const errors: string[] = [];
        page.on('console', msg => {
            if (msg.type() === 'error') errors.push(msg.text());
        });

        await page.goto('/ru');
        await page.waitForLoadState('networkidle');

        // Check for hydration errors
        const hydrationErrors = errors.filter(e => e.includes('Hydration') || e.includes('React'));
        expect(hydrationErrors).toEqual([]);

        // Verify content matches server rendered (implicit by checking visibility immediately)
        await expect(page.locator('h1')).toBeVisible();
    });
});
