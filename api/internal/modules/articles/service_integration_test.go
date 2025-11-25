package articles

import (
	"testing"

	"github.com/ai-dala/api/internal/testutil"
	"github.com/jmoiron/sqlx"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestService_Create_DuplicateSlug(t *testing.T) {
	// Setup real database
	testDB := testutil.SetupTestDatabase(t)
	db := sqlx.NewDb(testDB.DB, "postgres")

	repo := NewRepository(db)
	service := NewService(repo)

	// Create first article
	article1 := &Article{
		Title:    "Duplicate Title",
		Body:     "Content 1",
		AuthorID: "00000000-0000-0000-0000-000000000001",
		Status:   "DRAFT",
	}
	err := service.Create(article1)
	require.NoError(t, err)
	assert.Equal(t, "duplicate-title", article1.Slug)

	// Create second article with SAME title
	article2 := &Article{
		Title:    "Duplicate Title",
		Body:     "Content 2",
		AuthorID: "00000000-0000-0000-0000-000000000001",
		Status:   "DRAFT",
	}
	err = service.Create(article2)
	require.NoError(t, err)

	// Should have a suffix
	assert.Equal(t, "duplicate-title-1", article2.Slug)

	// Create third article
	article3 := &Article{
		Title:    "Duplicate Title",
		Body:     "Content 3",
		AuthorID: "00000000-0000-0000-0000-000000000001",
		Status:   "DRAFT",
	}
	err = service.Create(article3)
	require.NoError(t, err)

	// Should have incremented suffix
	assert.Equal(t, "duplicate-title-2", article3.Slug)
}

func TestService_Update_DuplicateSlug(t *testing.T) {
	// Setup real database
	testDB := testutil.SetupTestDatabase(t)
	db := sqlx.NewDb(testDB.DB, "postgres")

	repo := NewRepository(db)
	service := NewService(repo)

	// Create first article
	article1 := &Article{
		Title:    "Original Title",
		Body:     "Content 1",
		AuthorID: "00000000-0000-0000-0000-000000000001",
		Status:   "DRAFT",
	}
	err := service.Create(article1)
	require.NoError(t, err)
	assert.Equal(t, "original-title", article1.Slug)

	// Create second article
	article2 := &Article{
		Title:    "Other Title",
		Body:     "Content 2",
		AuthorID: "00000000-0000-0000-0000-000000000001",
		Status:   "DRAFT",
	}
	err = service.Create(article2)
	require.NoError(t, err)
	assert.Equal(t, "other-title", article2.Slug)

	// Update second article to have same title as first
	article2.Title = "Original Title"
	article2.Slug = "" // Force regeneration
	err = service.Update(article2.ID, article2)
	require.NoError(t, err)

	// Should have suffix
	updatedArticle2, err := service.FindByID(article2.ID)
	require.NoError(t, err)
	assert.Equal(t, "original-title-1", updatedArticle2.Slug)

	// Update first article with SAME title (no change)
	article1.Slug = "" // Force regeneration check
	err = service.Update(article1.ID, article1)
	require.NoError(t, err)

	// Should keep original slug (no suffix added to itself)
	updatedArticle1, err := service.FindByID(article1.ID)
	require.NoError(t, err)
	assert.Equal(t, "original-title", updatedArticle1.Slug)
}
