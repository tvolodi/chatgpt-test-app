# DOCUMENT_TYPE: SEO_ARCHITECTURE
# VERSION: 1.0

## 1. Goals

Ensure Google/AI crawlers see fast, complete HTML with correct metadata.

## 2. Rendering Strategy

- Use SSG/ISR for marketing/docs/catalog pages.
- Use SSR only when data freshness or personalization requires it.
- Avoid client-only rendering for public pages.

## 3. Metadata & Feeds

- Titles, meta descriptions, Open Graph, Twitter cards rendered server-side.
- schema.org JSON-LD for key types (Article/Product/WebSite/BreadcrumbList).
- Automatic sitemap.xml and robots.txt; include hreflang if multilingual.
- Canonical URLs on all indexable pages.

## 4. Crawlability

- Pagination with real links; avoid infinite scroll without links.
- Prevent private/authenticated paths from being indexed.
- Serve compressed HTML (gzip/brotli) and HTTP/2.

## 5. Content Invalidation

- ISR revalidation intervals per page type.
- Manual revalidation triggers on content changes.

## 6. Notes for AI AGENTS

- Document page-type rendering choices in module specs.
- Keep schema types consistent across pages.
