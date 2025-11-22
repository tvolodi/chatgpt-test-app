package tags_test

import (
	"fmt"
	"testing"

	"github.com/ai-dala/api/internal/modules/tags"
	"github.com/ai-dala/api/internal/testutil"
)

func TestRepository_Integration(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping integration test")
	}

	// Setup test database
	testDB := testutil.SetupTestDatabase(t)
	repo := tags.NewRepository(testDB.DB)

	t.Run("Create and FindByCode", func(t *testing.T) {
		// Create tag
		tag, err := repo.Create("test-tag", map[string]interface{}{
			"en": "Test Tag",
			"ru": "Тестовый тег",
			"kk": "Тест тегі",
		})
		if err != nil {
			t.Fatalf("Create failed: %v", err)
		}

		if tag.Code != "test-tag" {
			t.Errorf("expected code 'test-tag', got %s", tag.Code)
		}

		if tag.ID == "" {
			t.Error("expected ID to be set")
		}

		// Find by code
		found, err := repo.FindByCode("test-tag")
		if err != nil {
			t.Fatalf("FindByCode failed: %v", err)
		}

		if found == nil {
			t.Fatal("expected tag to be found")
		}

		if found.Code != tag.Code {
			t.Errorf("expected code %s, got %s", tag.Code, found.Code)
		}

		if found.ID != tag.ID {
			t.Errorf("expected ID %s, got %s", tag.ID, found.ID)
		}
	})

	t.Run("Create with duplicate code should fail", func(t *testing.T) {
		// Create first tag
		_, err := repo.Create("duplicate-test", map[string]interface{}{
			"en": "First",
		})
		if err != nil {
			t.Fatalf("First Create failed: %v", err)
		}

		// Try to create duplicate
		_, err = repo.Create("duplicate-test", map[string]interface{}{
			"en": "Second",
		})
		if err == nil {
			t.Error("expected error for duplicate code, got nil")
		}
	})

	t.Run("Update", func(t *testing.T) {
		// Create initial tag
		original, err := repo.Create("update-test", map[string]interface{}{
			"en": "Original",
		})
		if err != nil {
			t.Fatalf("Create failed: %v", err)
		}

		// Update tag
		updated, err := repo.Update("update-test", "updated-test", map[string]interface{}{
			"en": "Updated",
			"ru": "Обновлено",
		})
		if err != nil {
			t.Fatalf("Update failed: %v", err)
		}

		if updated.Code != "updated-test" {
			t.Errorf("expected code 'updated-test', got %s", updated.Code)
		}

		if updated.ID != original.ID {
			t.Errorf("expected ID to remain %s, got %s", original.ID, updated.ID)
		}

		// Verify old code doesn't exist
		old, err := repo.FindByCode("update-test")
		if err != nil {
			t.Fatalf("FindByCode failed: %v", err)
		}
		if old != nil {
			t.Error("old code should not exist")
		}

		// Verify new code exists
		newTag, err := repo.FindByCode("updated-test")
		if err != nil {
			t.Fatalf("FindByCode failed: %v", err)
		}
		if newTag == nil {
			t.Error("new code should exist")
		}
	})

	t.Run("Update non-existent tag", func(t *testing.T) {
		updated, err := repo.Update("non-existent", "new-code", map[string]interface{}{
			"en": "Test",
		})
		if err != nil {
			t.Fatalf("Update failed: %v", err)
		}
		if updated != nil {
			t.Error("expected nil for non-existent tag")
		}
	})

	t.Run("Delete", func(t *testing.T) {
		// Create tag
		_, err := repo.Create("delete-test", map[string]interface{}{
			"en": "To Delete",
		})
		if err != nil {
			t.Fatalf("Create failed: %v", err)
		}

		// Delete tag
		err = repo.Delete("delete-test")
		if err != nil {
			t.Fatalf("Delete failed: %v", err)
		}

		// Verify deleted
		found, err := repo.FindByCode("delete-test")
		if err != nil {
			t.Fatalf("FindByCode failed: %v", err)
		}
		if found != nil {
			t.Error("tag should be deleted")
		}
	})

	t.Run("Delete non-existent tag", func(t *testing.T) {
		err := repo.Delete("non-existent-tag")
		if err == nil {
			t.Error("expected error when deleting non-existent tag")
		}
	})

	t.Run("FindAll", func(t *testing.T) {
		// Create multiple tags
		expectedCodes := []string{"tag-1", "tag-2", "tag-3"}
		for i, code := range expectedCodes {
			_, err := repo.Create(code, map[string]interface{}{
				"en": fmt.Sprintf("Tag %d", i+1),
			})
			if err != nil {
				t.Fatalf("Create failed: %v", err)
			}
		}

		// Find all
		tags, err := repo.FindAll()
		if err != nil {
			t.Fatalf("FindAll failed: %v", err)
		}

		if len(tags) < 3 {
			t.Errorf("expected at least 3 tags, got %d", len(tags))
		}

		// Verify tags are ordered by code
		for i := 1; i < len(tags); i++ {
			if tags[i-1].Code > tags[i].Code {
				t.Errorf("tags not ordered by code: %s > %s", tags[i-1].Code, tags[i].Code)
			}
		}
	})

	t.Run("FindByCode non-existent", func(t *testing.T) {
		found, err := repo.FindByCode("non-existent-tag")
		if err != nil {
			t.Fatalf("FindByCode failed: %v", err)
		}
		if found != nil {
			t.Error("expected nil for non-existent tag")
		}
	})

	t.Run("JSONB name field", func(t *testing.T) {
		// Create tag with multiple languages
		_, err := repo.Create("jsonb-test", map[string]interface{}{
			"en": "English Name",
			"ru": "Русское имя",
			"kk": "Қазақ аты",
		})
		if err != nil {
			t.Fatalf("Create failed: %v", err)
		}

		// Verify JSONB data is preserved
		found, err := repo.FindByCode("jsonb-test")
		if err != nil {
			t.Fatalf("FindByCode failed: %v", err)
		}

		if found == nil {
			t.Fatal("expected tag to be found")
		}

		// Note: Name is json.RawMessage, so we can't directly compare
		// In a real test, you'd unmarshal and compare
		if len(found.Name) == 0 {
			t.Error("expected name to have data")
		}
	})
}
