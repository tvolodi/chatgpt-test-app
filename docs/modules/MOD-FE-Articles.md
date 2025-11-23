# Module: Article Editor Frontend
# ID: MOD-FE-Articles
# Status: Active

## 1. Overview
This module handles the frontend logic for creating and editing articles, featuring a rich text editor (Tiptap) with Markdown persistence.

## 2. Components

### 2.1. TiptapEditor
- **Path**: `web/src/app/components/articles/TiptapEditor.tsx`
- **Responsibility**: 
  - Render WYSIWYG editor.
  - Handle `onPaste` events (via Tiptap extensions).
  - Convert Markdown ↔ HTML.
  - Manage image uploads.
  - Sanitize pasted Word/Google Docs HTML (remove Office tags/comments) and upload base64 images to URLs before inserting content.

### 2.2. ArticleEditor (Container)
- **Path**: `web/src/app/components/articles/ArticleEditor.tsx`
- **Responsibility**:
  - Fetch article data.
  - Manage form state (title, category, tags).
  - Embed `TiptapEditor`.
  - Handle Save/Publish actions.

## 3. Data Flow
1. **Load**: API `GET /articles/{id}` → JSON (Markdown) → `marked.parse()` → Tiptap HTML.
2. **Edit**: User types/pastes → Tiptap State.
3. **Save**: Tiptap HTML → `turndown()` → Markdown → API `PUT /articles/{id}`.

## 4. Dependencies
- `@tiptap/react`
- `@tiptap/starter-kit`
- `@tiptap/extension-image`
- `turndown`
- `marked`

## 5. Styling
- Use Tailwind CSS via `@tailwindcss/typography` (`prose` class) for editor content.
- Custom toolbar with Tailwind styled buttons.
- Global styles import ProseMirror base CSS in `web/src/app/globals.css` and add placeholder/min-height rules for the editor surface.
