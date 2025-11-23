'use client';

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { useEffect, useMemo } from 'react';
import TurndownService from 'turndown';
import { marked } from 'marked';

interface TiptapEditorProps {
    value: string;
    onChange: (markdown: string) => void;
    onImageUpload: (file: File) => Promise<string>;
}

const MenuBar = ({ editor, onImageUpload }: { editor: Editor | null, onImageUpload: (file: File) => Promise<string> }) => {
    if (!editor) {
        return null;
    }

    const addImage = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                const url = await onImageUpload(file);
                if (url) {
                    editor.chain().focus().setImage({ src: url }).run();
                }
            }
        };
        input.click();
    };

    return (
        <div className="border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-2">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
                title="Bold"
            >
                <strong>B</strong>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
                title="Italic"
            >
                <em>I</em>
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
                title="Heading 1"
            >
                H1
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
                title="Heading 2"
            >
                H2
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
                title="Heading 3"
            >
                H3
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
                title="Bullet List"
            >
                • List
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
                title="Ordered List"
            >
                1. List
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
                title="Blockquote"
            >
                &quot;&quot;
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('codeBlock') ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
                title="Code Block"
            >
                &lt;/&gt;
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
            <button
                onClick={addImage}
                className="p-1.5 rounded hover:bg-gray-200 text-gray-600"
                title="Upload Image"
            >
                📷 Image
            </button>
        </div>
    );
};

export default function TiptapEditor({ value, onChange, onImageUpload }: TiptapEditorProps) {
    const turndownService = useMemo(() => new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced'
    }), []);

    const sanitizePastedHtml = async (rawHtml: string) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(rawHtml, 'text/html');

        // Remove comments
        const comments = doc.createTreeWalker(doc, NodeFilter.SHOW_COMMENT);
        const commentNodes: Comment[] = [];
        while (comments.nextNode()) {
            if (comments.currentNode instanceof Comment) {
                commentNodes.push(comments.currentNode);
            }
        }
        commentNodes.forEach(node => node.remove());

        const dropPrefixes = ['o:', 'w:', 'v:', 'm:'];
        const shouldDropElement = (el: Element) => {
            const tag = el.tagName.toLowerCase();
            return tag === 'meta' ||
                tag === 'style' ||
                tag === 'link' ||
                tag === 'script' ||
                dropPrefixes.some(prefix => tag.startsWith(prefix));
        };

        const cleanNode = (node: Element) => {
            // Remove unwanted elements entirely
            if (shouldDropElement(node)) {
                node.remove();
                return;
            }

            // Strip MSO/Office-specific attributes and inline styles
            Array.from(node.attributes).forEach(attr => {
                const name = attr.name.toLowerCase();
                const value = attr.value;
                if (name.startsWith('xmlns') || name.startsWith('class') && value.includes('Mso')) {
                    node.removeAttribute(attr.name);
                }
                if (name === 'style' && /mso-|tab-stops|page-break/i.test(value)) {
                    node.removeAttribute(attr.name);
                }
            });

            Array.from(node.children).forEach(child => cleanNode(child as Element));
        };

        cleanNode(doc.body);

        // Convert base64 images to URLs via upload
        const images = Array.from(doc.querySelectorAll('img'));
        await Promise.all(images.map(async (img, idx) => {
            const src = img.getAttribute('src') || '';
            if (src.startsWith('data:image')) {
                const file = dataUrlToFile(src, `pasted-image-${Date.now()}-${idx}.png`);
                const url = await onImageUpload(file);
                img.setAttribute('src', url);
            }
        }));

        return doc.body.innerHTML;
    };

    const dataUrlToFile = (dataUrl: string, filename: string) => {
        const [meta, data] = dataUrl.split(',');
        const mimeMatch = meta.match(/data:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
        const binary = atob(data);
        const len = binary.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return new File([bytes], filename, { type: mime });
    };

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Image.configure({
                inline: true,
                allowBase64: false,
            }),
        ],
        content: '', // Initial content is empty, we load it via useEffect
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[300px] p-4 max-w-none',
                'data-placeholder': 'Write your article content...',
            },
            handlePaste: (view, event) => {
                const items = Array.from(event.clipboardData?.items || []);
                const imageItems = items.filter(item => item.type.indexOf('image') === 0);

                if (imageItems.length > 0) {
                    event.preventDefault(); // Prevent default paste of image

                    imageItems.forEach(item => {
                        const file = item.getAsFile();
                        if (file) {
                            onImageUpload(file).then(url => {
                                if (url) {
                                    const { schema } = view.state;
                                    const node = schema.nodes.image.create({ src: url });
                                    const transaction = view.state.tr.replaceSelectionWith(node);
                                    view.dispatch(transaction);
                                }
                            });
                        }
                    });
                    return true; // Handled
                }

                const html = event.clipboardData?.getData('text/html');
                if (html) {
                    event.preventDefault();
                    void sanitizePastedHtml(html).then(sanitizedHtml => {
                        if (editor) {
                            editor.chain().focus().insertContent(sanitizedHtml).run();
                        }
                    });
                    return true;
                }

                return false; // Let Tiptap handle plain text
            }
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            const markdown = turndownService.turndown(html);
            onChange(markdown);
        },
    });

    // Sync value (Markdown) to Editor (HTML) when value changes externally (e.g. initial load)
    // We need to be careful not to create a loop.
    // Only update if editor is empty or content is significantly different? 
    // Actually, for a controlled component, we usually don't sync back on every keystroke.
    // We only sync on mount or if the ID changes.
    useEffect(() => {
        if (editor && value && editor.isEmpty) {
            // Convert Markdown to HTML
            // marked is async in newer versions? No, marked.parse is synchronous usually, but check version.
            // In package.json it is ^17.0.1.
            const html = marked.parse(value) as string;
            editor.commands.setContent(html);
        }
    }, [editor, value]);

    if (!editor) {
        return (
            <div className="border border-gray-300 rounded-md overflow-hidden bg-white shadow-sm">
                <div className="border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-2 animate-pulse h-10" />
                <div className="p-4 text-sm text-gray-500">Loading editor...</div>
            </div>
        );
    }

    return (
        <div className="border border-gray-300 rounded-md overflow-hidden bg-white shadow-sm">
            <MenuBar editor={editor} onImageUpload={onImageUpload} />
            <EditorContent editor={editor} className="min-h-[300px]" />
        </div>
    );
}
