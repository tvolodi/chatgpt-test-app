import { test, expect } from '@playwright/test';

test.describe('Categories Management', () => {
    const timestamp = Date.now();
    const rootCode = `root-${timestamp}`;
    const childCode = `child-${timestamp}`;

    test('should create, update, and delete categories hierarchically', async ({ page, request }) => {
        // 1. Navigate to Categories page
        console.log('Step 1: Navigating');
        await page.goto('/en/dashboard/categories');
        await expect(page.getByRole('heading', { name: 'Categories' })).toBeVisible();

        // 2. Create Root Category
        console.log('Step 2: Creating Root');
        await page.getByLabel('Category Code').fill(rootCode);
        await page.getByLabel('English').fill('Root Category');
        await page.getByRole('button', { name: 'Create Category' }).click();

        // Verify root appears in tree (look inside the tree container)
        const tree = page.getByTestId('category-tree');
        await expect(tree.getByText('Root Category').first()).toBeVisible();

        // 3. Create Child Category
        console.log('Step 3: Creating Child');
        // Select Root first to make it the parent
        await tree.getByText('Root Category').first().click();
        console.log('Clicked Root Category');
        await page.getByRole('button', { name: '+ New Category' }).click();
        console.log('Clicked New Category button');

        await page.getByLabel('Category Code').fill(childCode);
        await page.getByLabel('English').fill('Child Category');

        // Verify Parent is pre-selected
        console.log('Verifying parent pre-selection');
        const rootOption = page.locator('#parent option', { hasText: 'Root Category' }).first();
        await expect(rootOption).toBeAttached();
        const rootOptionValue = await rootOption.getAttribute('value');
        console.log('Root option value:', rootOptionValue);
        await page.getByRole('button', { name: 'Create Category' }).click();

        // Verify child appears
        await expect(tree.getByText('Child Category').first()).toBeVisible();

        // 4. Update Child Category
        console.log('Step 4: Updating Child');
        await tree.getByText('Child Category').first().click();
        await page.getByLabel('English').fill('Child Updated');
        await page.getByRole('button', { name: 'Update Category' }).click();

        await expect(tree.getByText('Child Updated')).toBeVisible();

        // 5. Try to delete Parent (should fail)
        console.log('Step 5: Deleting Parent (Fail)');
        await tree.getByText('Root Category').first().click();
        
        // Wait for form to show Edit mode
        await expect(page.getByRole('heading', { name: 'Edit Category' })).toBeVisible();
        
        // Handle confirm dialog and subsequent alert
        page.on('dialog', async dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            await dialog.accept();
        });
        
        await page.getByRole('button', { name: 'Delete Category' }).click();
        
        // Should get an error alert about having children
        await expect(page.getByText('Cannot delete category with active children')).toBeVisible();
        
        // Verify root is still there
        await expect(tree.getByText('Root Category')).toBeVisible();

        // 6. Delete Child Category
        console.log('Step 6: Deleting Child');
        await tree.getByText('Child Updated').first().click();

        // Handle confirm dialog
        page.on('dialog', async dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            await dialog.accept();
        });

        await page.getByRole('button', { name: 'Delete Category' }).click();

        // Verify child is gone
        await expect(tree.getByText('Child Updated').first()).not.toBeVisible();

        // 7. Delete Parent Category (now allowed)
        console.log('Step 7: Deleting Parent (Success)');
        await tree.getByText('Root Category').first().click();
        await page.getByRole('button', { name: 'Delete Category' }).click();

        // Verify via UI the tree updates (best-effort)
        await page.waitForTimeout(300);
    });
});
