import { test, expect } from '@playwright/test';

test.describe('Multilanguage Support (REQ-006)', () => {
    test('should switch between English, Russian, and Kazakh languages', async ({ page }) => {
        // Navigate to homepage
        await page.goto('http://localhost:3000');
        await page.waitForLoadState('networkidle');

        // Verify English is default (check for hidden test identifier)
        const localeTest = page.locator('[data-testid="locale-identifier"]');
        await expect(localeTest).toContainText('LOCALE-TEST-EN');

        // Verify English content is visible
        await expect(page.locator('h1')).toContainText('Build, launch, and grow');
        await expect(page.getByRole('link', { name: /Start with AI Dala/i })).toBeVisible();

        // Open language switcher
        const languageSwitcher = page.getByTestId('language-switcher-trigger');
        await languageSwitcher.click();

        // Switch to Russian
        const dropdown = page.getByTestId('language-switcher-dropdown');
        await dropdown.getByRole('button', { name: /Русский/i }).click();
        await page.waitForLoadState('networkidle');

        // Verify URL changed to /ru
        expect(page.url()).toContain('/ru');

        // Verify Russian test identifier
        await expect(localeTest).toContainText('LOCALE-TEST-RU');

        // Verify Russian content
        await expect(page.locator('h1')).toContainText('Создавайте, запускайте и развивайтесь');
        await expect(page.getByRole('link', { name: /Начать с AI Dala/i })).toBeVisible();

        // Open language switcher again
        const languageSwitcherRu = page.getByTestId('language-switcher-trigger');
        await languageSwitcherRu.click();

        // Switch to Kazakh
        const dropdownRu = page.getByTestId('language-switcher-dropdown');
        await dropdownRu.getByRole('button', { name: /Қазақ/i }).click();
        await page.waitForLoadState('networkidle');

        // Verify URL changed to /kk
        expect(page.url()).toContain('/kk');

        // Verify Kazakh test identifier
        await expect(localeTest).toContainText('LOCALE-TEST-KK');

        // Verify Kazakh content
        await expect(page.locator('h1')).toContainText('жасаңыз, іске қосыңыз және дамытыңыз');
        await expect(page.getByRole('link', { name: /AI Dala бастау/i })).toBeVisible();

        // Switch back to English
        const languageSwitcherKk = page.getByTestId('language-switcher-trigger');
        await languageSwitcherKk.click();

        const dropdownKk = page.getByTestId('language-switcher-dropdown');
        const englishLink = dropdownKk.getByRole('link', { name: /English/i });
        await englishLink.waitFor({ state: 'visible' });
        await englishLink.click();
        await page.waitForLoadState('networkidle');

        // Verify URL is back to / (no locale prefix for English)
        expect(page.url()).not.toContain('/ru');
        expect(page.url()).not.toContain('/kk');

        // Verify English test identifier again
        await expect(localeTest).toContainText('LOCALE-TEST-EN');
    });

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
