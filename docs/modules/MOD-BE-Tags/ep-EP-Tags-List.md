# ENDPOINT: GET /tags

## 1. Summary

- **Title**: List Tags
- **Operation ID**: `listTags`
- **Method**: `GET`
- **Path**: `/tags`
- **Auth**: Public

## 2. Request

### Query Parameters

None initially.

## 3. Response

### Success (200 OK)

Returns a JSON array of tags.

```json
[
  {
    "id": "uuid-string",
    "code": "technology",
    "name": {
      "en": "Technology",
      "ru": "Технологии"
    }
  }
]
```

### Error (500 Internal Server Error)

Standard error response.

## 4. Logic

1.  Retrieve all tags from the database.
2.  Return as JSON.

## 5. Traceability

- **Module**: MOD-BE-Tags
- **Contract**: `openapi.yaml` (`/tags`)
