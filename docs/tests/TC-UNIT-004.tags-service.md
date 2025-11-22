# TC-UNIT-004: Tag Service Tests

## Description
Verify the business logic of the Tag service, ensuring it correctly delegates to the repository.

## Test Cases

### 1. ListTags
- **Objective**: Verify service calls repository's `FindAll`.
- **Mock Setup**:
  - Mock Repository `FindAll` returns a list of tags.
- **Expected Output**:
  - Returns the list of tags from repository.
  - No error.

### 2. GetTagByCode
- **Objective**: Verify service calls repository's `FindByCode`.
- **Input**: `code = "tag1"`
- **Mock Setup**:
  - Mock Repository `FindByCode("tag1")` returns a tag.
- **Expected Output**:
  - Returns the tag from repository.
  - No error.

## Dependencies
- `github.com/stretchr/testify/mock` (or custom mock implementation)
- `github.com/ai-dala/api/internal/modules/tags`
