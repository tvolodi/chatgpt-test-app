import { test, expect } from '@playwright/test';

/**
 * Full E2E Tests for Tag Management
 * 
 * These tests run against the REAL backend API and database.
 * Prerequisites:
 * - API server running on localhost:4000
 * - Database running and migrated
 * - Frontend dev server running on localhost:3000
 */

test.describe('Tag Management E2E (REQ-008)', () => {
    const testTagCode = `e2e-test-${Date.now()}`;

    test.beforeAll(async () => {
        // Ensure API is accessible
        const response = await fetch('http://localhost:4000/api/tags');
        if (!response.ok) {
            throw new Error('API server is not running on localhost:4000');
        }
    });

    test.afterEach(async () => {
        // Cleanup: Delete test tag if it exists
        try {
            await fetch(`http://localhost:4000/api/tags/${testTagCode}`, {
                method: 'DELETE'
            });
        } catch (e) {
            // Ignore errors - tag might not exist
        }
    });

    test('View Tag List', async ({ page }) => {
        await page.goto('/en/dashboard/tags');

        // Verify page loaded
        await expect(page.getByRole('heading', { name: 'Tags' })).toBeVisible();

        // Verify table structure
        await expect(page.locator('table')).toBeVisible();
        await expect(page.getByText('Name')).toBeVisible();
        await expect(page.getByText('Code')).toBeVisible();
        await expect(page.getByText('Actions')).toBeVisible();
    });

    test('Create New Tag', async ({ page }) => {
        await page.goto('/en/dashboard/tags');

        // Click Create Tag
        await page.getByRole('link', { name: 'Create Tag' }).click();
        await expect(page).toHaveURL(/\/dashboard\/tags\/create/);

        // Fill form
        await page.fill('input[name="code"]', testTagCode);
        await page.fill('input[name="name-en"]', 'E2E Test Tag EN');
        await page.fill('input[name="name-ru"]', 'E2E Тестовый тег RU');
        await page.fill('input[name="name-kk"]', 'E2E Тест тегі KK');

        // Submit
        await page.getByRole('button', { name: /submit|save/i }).click();

        // Verify redirect to list
        await expect(page).toHaveURL(/\/dashboard\/tags$/);

        // Verify tag appears in list
        await expect(page.getByText('E2E Test Tag EN')).toBeVisible();
        await expect(page.getByText(testTagCode)).toBeVisible();
    });

    test('Edit Tag', async ({ page }) => {
        // First, create a tag to edit
        const createResponse = await fetch('http://localhost:4000/api/tags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code: testTagCode,
                name: { en: 'Original Name', ru: 'Оригинальное имя', kk: 'Түпнұсқа аты' }
            })
        });
        expect(createResponse.ok).toBeTruthy();

        // Navigate to tags list
        await page.goto('/en/dashboard/tags');

        // Find the test tag row and click Edit
        const row = page.locator('tr', { hasText: testTagCode });
        await row.getByRole('link', { name: 'Edit' }).click();

        // Verify navigation to edit page
        await expect(page).toHaveURL(new RegExp(`/dashboard/tags/edit/${testTagCode}`));

        // Verify form is pre-populated
        await expect(page.locator('input[name="code"]')).toHaveValue(testTagCode);
        await expect(page.locator('input[name="name-en"]')).toHaveValue('Original Name');

        // Modify the name
        await page.fill('input[name="name-en"]', 'Edited Name');
        await page.fill('input[name="name-ru"]', 'Измененное имя');

        // Submit
        await page.getByRole('button', { name: /submit|save/i }).click();

        // Verify redirect back to list
        await expect(page).toHaveURL(/\/dashboard\/tags$/);

        // Verify edited tag appears
        await expect(page.getByText('Edited Name')).toBeVisible();
    });

    test('Delete Tag', async ({ page }) => {
        // First, create a tag to delete
        const createResponse = await fetch('http://localhost:4000/api/tags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code: testTagCode,
                name: { en: 'Tag to Delete', ru: 'Тег для удаления', kk: 'Жою үшін тег' }
            })
        });
        expect(createResponse.ok).toBeTruthy();

        // Navigate to tags list
        await page.goto('/en/dashboard/tags');

        // Verify tag exists
        await expect(page.getByText('Tag to Delete')).toBeVisible();

        // Setup dialog handler
        page.on('dialog', dialog => dialog.accept());

        // Find the test tag row and click Delete
        const row = page.locator('tr', { hasText: testTagCode });
        await row.getByRole('button', { name: 'Delete' }).click();

        // Wait a bit for deletion
        await page.waitForTimeout(500);

        // Verify tag is removed from list
        await expect(page.getByText('Tag to Delete')).not.toBeVisible();

        // Verify tag is actually deleted from database
        const verifyResponse = await fetch(`http://localhost:4000/api/tags/${testTagCode}`);
        expect(verifyResponse.status).toBe(404);
    });

    test('Create Tag with Duplicate Code Fails', async ({ page }) => {
        // First, create a tag
        const createResponse = await fetch('http://localhost:4000/api/tags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code: testTagCode,
                name: { en: 'First Tag', ru: 'Первый тег', kk: 'Бірінші тег' }
            })
        });
        expect(createResponse.ok).toBeTruthy();

        // Try to create another tag with same code
        await page.goto('/en/dashboard/tags/create');

        await page.fill('input[name="code"]', testTagCode);
        await page.fill('input[name="name-en"]', 'Duplicate Tag');

        await page.getByRole('button', { name: /submit|save/i }).click();

        // Should show error (either alert or stay on page)
        // The exact behavior depends on implementation
        await page.waitForTimeout(500);

        // Should not redirect to list (stays on create page or shows error)
        const currentUrl = page.url();
        expect(currentUrl).toMatch(/create/);
    });
});
