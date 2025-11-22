# MODULE: MOD-BE-Tags

## 1. Summary

- **Title**: Tags Management Module
- **Type**: Backend
- **Status**: Draft

## 2. Description

This module manages system-wide tags used for categorizing content (e.g., articles, products). It handles the creation, retrieval, and localization of tags.

## 3. Dependencies

- **Database**: `tags` table (PostgreSQL)
- **Auth**: Public read access; Admin write access (future)

## 4. Interface (API)

| Method | Endpoint | Operation ID | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/tags` | `listTags` | Retrieve a list of tags. |
| `GET` | `/tags/{code}` | `getTagByCode` | Retrieve a specific tag by its unique code. |

## 5. Localization

Follows **ADR-0002**. Tag names are stored as JSONB and returned either as a localized string (based on `Accept-Language` header or query param) or as the full JSON map if requested.

## 6. Traceability

- **REQ-007**: Tag Entity Definition
