import { test, expect } from '@playwright/test';
import * as path from 'path';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';
const NEW_ARTICLE_URL = `${BASE_URL}/en/dashboard/articles/new`;
const API_BASE_URL = process.env.E2E_API_BASE_URL || 'http://localhost:4000/api';

test.describe('REQ-011 Article Import & Paste E2E', () => {
    test('Upload image via Tiptap toolbar', async ({ page }) => {
        await page.goto(NEW_ARTICLE_URL);
        page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
        page.on('pageerror', err => console.log('BROWSER ERROR:', err));

        // Create a test image file path
        const testImagePath = path.join(__dirname, '../public/test-image.png');

        // Click upload image button in Tiptap toolbar
        // Note: We need to handle the file chooser that opens
        const fileChooserPromise = page.waitForEvent('filechooser');
        await page.click('button[title="Upload Image"]');
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(testImagePath);

        // Wait for upload and insertion
        await page.waitForTimeout(1000);

        // Verify image is inserted in Tiptap
        const editor = page.locator('.ProseMirror');
        const content = await editor.innerHTML();
        expect(content).toContain('<img');
        expect(content).toContain('src="http://localhost:4000/uploads/images/');
    });

    test('Paste HTML content renders correctly in Tiptap', async ({ page }) => {
        await page.goto(NEW_ARTICLE_URL);

        const editor = page.locator('.ProseMirror');

        // Simulate paste event with HTML content
        const htmlContent = '<h1>Test Heading</h1><p>This is a <strong>bold</strong> paragraph.</p>';

        await editor.focus();
        await page.evaluate((html) => {
            const editor = document.querySelector('.ProseMirror');
            if (editor) {
                const event = new ClipboardEvent('paste', {
                    clipboardData: new DataTransfer(),
                    bubbles: true,
                    cancelable: true,
                });
                event.clipboardData?.setData('text/html', html);
                editor.dispatchEvent(event);
            }
        }, htmlContent);

        // Wait for Tiptap to process
        await page.waitForTimeout(500);

        // Verify HTML structure in Tiptap
        const content = await editor.innerHTML();
        expect(content).toContain('<h1>Test Heading</h1>');
        expect(content).toContain('<strong>bold</strong>');
    });

    test('Paste inline base64 image is uploaded and converted to URL', async ({ page }) => {
        await page.goto(NEW_ARTICLE_URL);
        const editor = page.locator('.ProseMirror');

        const base64Png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        const htmlContent = `<p>Image below</p><img src="${base64Png}" />`;

        await editor.focus();
        await page.evaluate((html) => {
            const editorEl = document.querySelector('.ProseMirror');
            if (editorEl) {
                const event = new ClipboardEvent('paste', {
                    clipboardData: new DataTransfer(),
                    bubbles: true,
                    cancelable: true,
                });
                event.clipboardData?.setData('text/html', html);
                editorEl.dispatchEvent(event);
            }
        }, htmlContent);

        await page.waitForTimeout(1000);

        const content = await editor.innerHTML();
        expect(content).toContain('Image below');
        expect(content).not.toContain('data:image/png;base64');
        expect(content).toContain('src=\"http://localhost:4000/uploads/images/');
    });

    test('Paste from Word sanitizes garbage HTML in Tiptap', async ({ page }) => {
        await page.goto(NEW_ARTICLE_URL);

        const editor = page.locator('.ProseMirror');

        // Simulate paste event with Word-like HTML content
        const wordHtml = `
            <!-- /* Font Definitions */ @font-face {font-family:"Cambria Math"; panose-1:2 4 5 3 5 4 6 3 2 4;} -->
            <style>
                p.MsoNormal, li.MsoNormal, div.MsoNormal {margin:0in; font-size:12.0pt; font-family:"Calibri",sans-serif;}
            </style>
            <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
            <p class=MsoNormal>
                <span style='font-size:11.0pt;font-family:"Calibri",sans-serif'>Normal Text</span>
                <o:p></o:p>
            </p>
            <h1>Title</h1>
        `;

        await editor.focus();
        await page.evaluate((html) => {
            const editor = document.querySelector('.ProseMirror');
            if (editor) {
                const event = new ClipboardEvent('paste', {
                    clipboardData: new DataTransfer(),
                    bubbles: true,
                    cancelable: true,
                });
                event.clipboardData?.setData('text/html', html);
                editor.dispatchEvent(event);
            }
        }, wordHtml);

        // Wait for Tiptap to process
        await page.waitForTimeout(500);

        // Verify content is sanitized
        const content = await editor.innerHTML();

        // Should contain the text (Tiptap might normalize p tags)
        expect(content).toContain('Normal Text');
        expect(content).toContain('<h1>Title</h1>');

        // Should NOT contain garbage
        expect(content).not.toContain('Font Definitions');
        expect(content).not.toContain('<style>');
        expect(content).not.toContain('<?xml');
        expect(content).not.toContain('<o:p>');
    });

    test('Image upload endpoint validation', async ({ request }) => {
        // Test valid image upload
        const validImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

        const formData = new FormData();
        const blob = new Blob([validImageBuffer], { type: 'image/png' });
        formData.append('images', blob, 'test.png');

        const response = await request.post(`${API_BASE_URL}/uploads/images`, {
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

        const response = await request.post(`${API_BASE_URL}/uploads/images`, {
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

        const uploadResponse = await request.post(`${API_BASE_URL}/uploads/images`, {
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
