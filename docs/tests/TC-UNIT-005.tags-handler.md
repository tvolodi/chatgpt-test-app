# TC-UNIT-005: Tag Handler Tests

## Description
Verify the HTTP handler for Tag endpoints, ensuring correct request processing, service delegation, and JSON response formatting.

## Test Cases

### 1. ListTags
- **Objective**: Verify `GET /api/tags` returns a list of tags.
- **Request**: `GET /api/tags`
- **Mock Setup**:
  - Mock Service `ListTags` returns a list of tags.
- **Expected Output**:
  - Status Code: `200 OK`
  - Body: JSON array of tags.
  - Header: `Content-Type: application/json`

### 2. GetTagByCode (Found)
- **Objective**: Verify `GET /api/tags/{code}` returns a tag when found.
- **Request**: `GET /api/tags/tag1`
- **Mock Setup**:
  - Mock Service `GetTagByCode("tag1")` returns a tag.
- **Expected Output**:
  - Status Code: `200 OK`
  - Body: JSON object of the tag.

### 3. GetTagByCode (Not Found)
- **Objective**: Verify `GET /api/tags/{code}` returns 404 when not found.
- **Request**: `GET /api/tags/missing`
- **Mock Setup**:
  - Mock Service `GetTagByCode("missing")` returns `nil`.
- **Expected Output**:
  - Status Code: `404 Not Found`
  - Body: Error message "tag not found".

### 4. Error Propagation
- **Objective**: Verify 500 status on service errors.
- **Mock Setup**:
  - Mock Service methods return an error.
- **Expected Output**:
  - Status Code: `500 Internal Server Error`

## Dependencies
- `net/http/httptest`
- `github.com/ai-dala/api/internal/modules/tags`
