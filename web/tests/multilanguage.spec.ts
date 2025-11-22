import { test, expect } from '@playwright/test';

test.describe('Multilanguage Support (REQ-006)', () => {
    test('should maintain language when navigating to login page', async ({ page }) => {
        // Start on Russian homepage
        await page.goto('http://localhost:3000/ru');
        await page.waitForLoadState('networkidle');

        // Verify we're on Russian
        const localeTest = page.locator('[data-testid="locale-identifier"]');
        await expect(localeTest).toContainText('LOCALE-TEST-RU');

        // Navigate to login page
        await page.getByRole('link', { name: /Войти/i }).click();
        await page.waitForLoadState('networkidle');

        // Verify URL is /ru/login
        expect(page.url()).toContain('/ru/login');

        // Verify login page is in Russian
        await expect(page.locator('h1')).toContainText('Добро пожаловать в AI-Dala');
    });

    test('should support direct URL navigation with locale prefix', async ({ page }) => {
        // Navigate directly to Kazakh login page
        await page.goto('http://localhost:3000/kk/login');
        await page.waitForLoadState('networkidle');

        // Verify Kazakh content
        await expect(page.locator('h1')).toContainText('AI-Dala-ға қош келдіңіз');

        // Navigate directly to Russian homepage
        await page.goto('http://localhost:3000/ru');
        await page.waitForLoadState('networkidle');

        // Verify Russian test identifier
        const localeTest = page.locator('[data-testid="locale-identifier"]');
        await expect(localeTest).toContainText('LOCALE-TEST-RU');
    });

    test('should display language switcher with correct flags and labels', async ({ page }) => {
        await page.goto('http://localhost:3000');
        await page.waitForLoadState('networkidle');

        // Open language switcher
        const languageSwitcher = page.getByTestId('language-switcher-trigger');
        await languageSwitcher.click();

        // Verify all 3 languages are shown
        const dropdown = page.getByTestId('language-switcher-dropdown');
        await dropdown.waitFor({ state: 'visible' });
        await expect(dropdown).toBeVisible();

        const englishLink = dropdown.getByRole('link', { name: /English/i });
        await expect(englishLink).toBeVisible();
        await expect(dropdown.getByRole('button', { name: /Русский/i })).toBeVisible();
        await expect(dropdown.getByRole('button', { name: /Қазақ/i })).toBeVisible();

        // Verify flags are present (emojis)
        await expect(dropdown).toContainText('🇬🇧');
        await expect(dropdown).toContainText('🇷🇺');
        await expect(dropdown).toContainText('🇰🇿');
    });
});
