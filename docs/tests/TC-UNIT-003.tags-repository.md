# TC-UNIT-003: Tag Repository Tests

## Description
Verify the functionality of the PostgreSQL repository implementation for the Tag entity, ensuring correct SQL query execution and data mapping.

## Test Cases

### 1. FindAll
- **Objective**: Verify retrieval of all tags.
- **Input**: None.
- **Mock Setup**:
  - Mock `SELECT id, code, name FROM tags ORDER BY code ASC`.
  - Return 2 rows: `tag1`, `tag2`.
- **Expected Output**:
  - Returns a slice of 2 `Tag` structs.
  - No error.
  - Data matches mocked rows.

### 2. FindByCode
- **Objective**: Verify retrieval of a single tag by its unique code.
- **Input**: `code = "tag1"`
- **Mock Setup**:
  - Mock `SELECT id, code, name FROM tags WHERE code = $1`.
  - Return 1 row: `tag1`.
- **Expected Output**:
  - Returns a pointer to `Tag` struct.
  - No error.
  - Data matches mocked row.

## Dependencies
- `github.com/DATA-DOG/go-sqlmock`
- `github.com/ai-dala/api/internal/modules/tags`
