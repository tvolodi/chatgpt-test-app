import { test, expect } from '@playwright/test';
import * as path from 'path';

test.describe('Article Import & Paste E2E', () => {
    test('Upload image via button', async ({ page }) => {
        await page.goto('http://localhost:3000/en/dashboard/articles/new');

        // Create a test image file path
        const testImagePath = path.join(__dirname, '../public/test-image.png');

        // Click upload image button
        await page.click('text=📷 Upload Image');

        // Upload file (this triggers the file input)
        const fileInput = page.locator('input[type="file"][accept="image/*"]');
        await fileInput.setInputFiles(testImagePath);

        // Wait for upload to complete and markdown to be inserted
        await page.waitForTimeout(1000);

        // Verify markdown syntax was inserted
        const textarea = page.locator('textarea[placeholder*="Markdown"]');
        const content = await textarea.inputValue();
        expect(content).toContain('![');
        expect(content).toContain('](http://localhost:4000/uploads/images/');
    });

    test('Paste HTML content converts to Markdown', async ({ page }) => {
        await page.goto('http://localhost:3000/en/dashboard/articles/new');

        const textarea = page.locator('textarea[placeholder*="Markdown"]');

        // Simulate paste event with HTML content
        const htmlContent = '<h1>Test Heading</h1><p>This is a <strong>bold</strong> paragraph.</p>';

        await textarea.focus();
        await page.evaluate((html) => {
            const textarea = document.querySelector('textarea[placeholder*="Markdown"]') as HTMLTextAreaElement;
            if (textarea) {
                const event = new ClipboardEvent('paste', {
                    clipboardData: new DataTransfer(),
                });
                event.clipboardData?.setData('text/html', html);
                textarea.dispatchEvent(event);
            }
        }, htmlContent);

        // Wait for conversion
        await page.waitForTimeout(500);

        // Verify Markdown was inserted
        const content = await textarea.inputValue();
        expect(content).toContain('# Test Heading');
        expect(content).toContain('**bold**');
    });

    test('Image upload endpoint validation', async ({ request }) => {
        // Test valid image upload
        const validImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

        const formData = new FormData();
        const blob = new Blob([validImageBuffer], { type: 'image/png' });
        formData.append('images', blob, 'test.png');

        const response = await request.post('http://localhost:4000/api/uploads/images', {
            multipart: {
                images: {
                    name: 'test.png',
                    mimeType: 'image/png',
                    buffer: validImageBuffer,
                },
            },
        });

        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(data.urls).toBeDefined();
        expect(data.urls.length).toBeGreaterThan(0);
        expect(data.urls[0]).toContain('/uploads/images/');
    });

    test('Image upload rejects invalid files', async ({ request }) => {
        // Test with non-image file
        const textBuffer = Buffer.from('This is not an image');

        const response = await request.post('http://localhost:4000/api/uploads/images', {
            multipart: {
                images: {
                    name: 'test.txt',
                    mimeType: 'text/plain',
                    buffer: textBuffer,
                },
            },
        });

        expect(response.ok()).toBeFalsy();
    });

    test('Uploaded image is accessible', async ({ request }) => {
        // Upload an image first
        const imageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

        const uploadResponse = await request.post('http://localhost:4000/api/uploads/images', {
            multipart: {
                images: {
                    name: 'accessible-test.png',
                    mimeType: 'image/png',
                    buffer: imageBuffer,
                },
            },
        });

        const uploadData = await uploadResponse.json();
        const imageUrl = uploadData.urls[0];

        // Try to access the uploaded image
        const getResponse = await request.get(imageUrl);
        expect(getResponse.ok()).toBeTruthy();
        expect(getResponse.headers()['content-type']).toContain('image');
    });
});
