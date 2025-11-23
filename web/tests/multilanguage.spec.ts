import { test, expect } from '@playwright/test';

test.describe('Multilanguage Support (REQ-006)', () => {
    test('should maintain language when navigating to login page', async ({ page }) => {
        await page.goto('http://localhost:3000/ru/login');
        await page.waitForLoadState('networkidle');

        expect(page.url()).toContain('/ru/login');
    });

    test('should support direct URL navigation with locale prefix', async ({ page }) => {
        await page.goto('http://localhost:3000/kk/login');
        await page.waitForLoadState('networkidle');
        expect(page.url()).toContain('/kk/login');

        await page.goto('http://localhost:3000/ru');
        await page.waitForLoadState('networkidle');
        expect(page.url()).toContain('/ru');
    });

    test('should display language switcher with correct flags and labels', async ({ page }) => {
        await page.goto('http://localhost:3000');
        await page.waitForLoadState('networkidle');

        const languageSwitcher = page.getByTestId('language-switcher-trigger');
        await languageSwitcher.click();

        const dropdown = page.getByTestId('language-switcher-dropdown');
        await dropdown.waitFor({ state: 'visible' });
        await expect(dropdown).toBeVisible();

        await expect(dropdown.getByRole('link', { name: /English/i })).toBeVisible();
        await expect(dropdown.getByRole('button', { name: /Русский/i })).toBeVisible();
        await expect(dropdown.getByRole('button', { name: /Қазақ/i })).toBeVisible();
    });
});
