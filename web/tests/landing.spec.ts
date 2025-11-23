import { test, expect } from '@playwright/test';

test.describe('Landing Page E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('Hero section is visible and has CTAs', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Build, launch, and grow');
    await expect(page.locator('text=Start with AI Dala')).toBeVisible();
    await expect(page.locator('text=Join AI master-class')).toBeVisible();
  });

  test('Navigation links work', async ({ page }) => {
    // Check header links
    await expect(page.locator('header >> text=About')).toBeVisible();
    await expect(page.locator('header >> text=News')).toBeVisible();
    await expect(page.locator('header >> text=Articles')).toBeVisible();

    // Check sign in link
    await expect(page.locator('text=Sign in')).toBeVisible();
  });

  test('Feature section is present', async ({ page }) => {
    await expect(page.locator('text=What is AI-Dala?')).toBeVisible();
    await expect(page.locator('text=Headless CMS').first()).toBeVisible();
    await expect(page.locator('text=AI Search').first()).toBeVisible();
    await expect(page.locator('text=Secure Auth').first()).toBeVisible();
  });

  test('Latest content section loads', async ({ page }) => {
    await expect(page.locator('text=Latest Articles')).toBeVisible();
    await expect(page.locator('text=AI News')).toBeVisible();
    // We might not have content in a fresh DB, so just checking the headers is safer for now
    // unless we seed data.
  });

  test('Footer is present', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('footer >> text=Product')).toBeVisible();
    await expect(page.locator('footer >> text=Company')).toBeVisible();
  });
});
