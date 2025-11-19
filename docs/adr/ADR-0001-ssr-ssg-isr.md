# ADR-0001: Page Rendering Strategy (SSR/SSG/ISR)
- Status: approved
- Date: 2025-11-17

## Context

We need SEO-friendly, fast pages and manageable freshness for content while using Next.js.

## Decision

- Use SSG/ISR for public marketing/docs/catalog pages with page-type-specific revalidation TTLs.
- Use SSR for pages requiring user context or near-real-time data.
- Avoid client-only rendering for SEO-facing routes.

## Consequences

- Better crawlability and performance for public routes.
- Must maintain revalidation triggers linked to content changes.
- Need clear mapping of routes to rendering mode in module specs.
