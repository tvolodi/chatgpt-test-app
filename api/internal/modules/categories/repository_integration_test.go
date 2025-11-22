package categories

import (
	"context"
	"encoding/json"
	"testing"

	"github.com/ai-dala/api/internal/testutil"

	"github.com/jmoiron/sqlx"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestRepository_Integration(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping integration test")
	}

	tdb := testutil.SetupTestDatabase(t)
	db := sqlx.NewDb(tdb.DB, "postgres")

	repo := NewRepository(db)
	ctx := context.Background()

	t.Run("Create and FindByID", func(t *testing.T) {
		name := json.RawMessage(`{"en": "Technology"}`)
		cat := &Category{
			Code: "tech",
			Name: name,
		}

		err := repo.Create(ctx, cat)
		require.NoError(t, err)
		assert.NotEmpty(t, cat.ID)
		assert.NotEmpty(t, cat.CreatedAt)

		fetched, err := repo.FindByID(ctx, cat.ID)
		require.NoError(t, err)
		assert.NotNil(t, fetched)
		assert.Equal(t, cat.Code, fetched.Code)
		assert.JSONEq(t, string(cat.Name), string(fetched.Name))
	})

	t.Run("Create Child Category", func(t *testing.T) {
		// Create Parent
		parent := &Category{Code: "parent", Name: json.RawMessage(`{}`)}
		require.NoError(t, repo.Create(ctx, parent))

		// Create Child
		child := &Category{
			Code:     "child",
			Name:     json.RawMessage(`{}`),
			ParentID: &parent.ID,
		}
		err := repo.Create(ctx, child)
		require.NoError(t, err)

		fetched, err := repo.FindByID(ctx, child.ID)
		require.NoError(t, err)
		assert.Equal(t, parent.ID, *fetched.ParentID)
	})

	t.Run("Update", func(t *testing.T) {
		cat := &Category{Code: "update-me", Name: json.RawMessage(`{}`)}
		require.NoError(t, repo.Create(ctx, cat))

		cat.Code = "updated-code"
		cat.Name = json.RawMessage(`{"en": "Updated"}`)
		err := repo.Update(ctx, cat)
		require.NoError(t, err)

		fetched, err := repo.FindByID(ctx, cat.ID)
		require.NoError(t, err)
		assert.Equal(t, "updated-code", fetched.Code)
		assert.JSONEq(t, `{"en": "Updated"}`, string(fetched.Name))
	})

	t.Run("Soft Delete", func(t *testing.T) {
		cat := &Category{Code: "delete-me", Name: json.RawMessage(`{}`)}
		require.NoError(t, repo.Create(ctx, cat))

		err := repo.Delete(ctx, cat.ID)
		require.NoError(t, err)

		// Should not find it anymore
		fetched, err := repo.FindByID(ctx, cat.ID)
		require.NoError(t, err)
		assert.Nil(t, fetched)

		// Verify it's still in DB but deleted_at is set (manual query)
		var deletedAt *string
		err = db.QueryRow("SELECT deleted_at FROM categories WHERE id = $1", cat.ID).Scan(&deletedAt)
		require.NoError(t, err)
		assert.NotNil(t, deletedAt)
	})

	t.Run("Prevent Delete with Active Children", func(t *testing.T) {
		parent := &Category{Code: "parent-protected", Name: json.RawMessage(`{}`)}
		require.NoError(t, repo.Create(ctx, parent))

		child := &Category{Code: "child-active", Name: json.RawMessage(`{}`), ParentID: &parent.ID}
		require.NoError(t, repo.Create(ctx, child))

		err := repo.Delete(ctx, parent.ID)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), "cannot delete category with active children")

		// Soft delete child
		err = repo.Delete(ctx, child.ID)
		require.NoError(t, err)

		// Now should be able to delete parent
		err = repo.Delete(ctx, parent.ID)
		require.NoError(t, err)
	})

	t.Run("FindAll Active Only", func(t *testing.T) {
		// Clean slate for this test might be hard with shared DB, but we can check existence
		active := &Category{Code: "active-one", Name: json.RawMessage(`{}`)}
		require.NoError(t, repo.Create(ctx, active))

		deleted := &Category{Code: "deleted-one", Name: json.RawMessage(`{}`)}
		require.NoError(t, repo.Create(ctx, deleted))
		require.NoError(t, repo.Delete(ctx, deleted.ID))

		all, err := repo.FindAll(ctx)
		require.NoError(t, err)

		foundActive := false
		foundDeleted := false
		for _, c := range all {
			if c.ID == active.ID {
				foundActive = true
			}
			if c.ID == deleted.ID {
				foundDeleted = true
			}
		}
		assert.True(t, foundActive, "should find active category")
		assert.False(t, foundDeleted, "should not find deleted category")
	})
}
