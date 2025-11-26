package articles

import (
	"fmt"
	"testing"
	"time"

	"github.com/ai-dala/api/internal/testutil"
	"github.com/jmoiron/sqlx"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestRepository_Integration(t *testing.T) {
	testDB := testutil.SetupTestDatabase(t)

	// Wrap sql.DB with sqlx
	db := sqlx.NewDb(testDB.DB, "postgres")
	repo := NewRepository(db)

	t.Run("Create and FindByID", func(t *testing.T) {
		article := &Article{
			Title:    "Test Article",
			Slug:     fmt.Sprintf("test-article-%d", time.Now().UnixNano()),
			Body:     "# Test Content",
			AuthorID: "123e4567-e89b-12d3-a456-426614174000",
			Status:   "DRAFT",
		}

		err := repo.Create(article)
		require.NoError(t, err)
		assert.NotEmpty(t, article.ID)
		assert.False(t, article.CreatedAt.IsZero())

		found, err := repo.FindByID(article.ID)
		require.NoError(t, err)
		assert.Equal(t, article.Title, found.Title)
		assert.Equal(t, article.Body, found.Body)
		assert.Equal(t, "DRAFT", found.Status)
	})

	t.Run("FindAll with filters", func(t *testing.T) {
		// Create test articles
		article1 := &Article{Title: "Article 1", Slug: fmt.Sprintf("article-1-%d", time.Now().UnixNano()), Body: "Body 1", AuthorID: "123e4567-e89b-12d3-a456-426614174000", Status: "DRAFT"}
		time.Sleep(10 * time.Millisecond)
		now := time.Now()
		article2 := &Article{Title: "Article 2", Slug: fmt.Sprintf("article-2-%d", time.Now().UnixNano()), Body: "Body 2", AuthorID: "123e4567-e89b-12d3-a456-426614174000", Status: "PUBLISHED", PublishedAt: &now}

		require.NoError(t, repo.Create(article1))
		require.NoError(t, repo.Create(article2))

		// Test status filter
		drafts, err := repo.FindAll("DRAFT", "", "", 10, 0, "")
		require.NoError(t, err)
		assert.GreaterOrEqual(t, len(drafts), 1)

		// Test pagination
		all, err := repo.FindAll("", "", "", 1, 0, "")
		require.NoError(t, err)
		assert.Equal(t, 1, len(all))
	})

	t.Run("FindAll Sorting", func(t *testing.T) {
		// Create articles with different published dates
		now := time.Now()
		oldDate := now.Add(-24 * time.Hour)
		newDate := now

		article1 := &Article{
			Title:       "Old Article",
			Slug:        fmt.Sprintf("old-%d", time.Now().UnixNano()),
			Body:        "Body",
			AuthorID:    "123e4567-e89b-12d3-a456-426614174000",
			Status:      "PUBLISHED",
			PublishedAt: &oldDate,
		}
		article2 := &Article{
			Title:       "New Article",
			Slug:        fmt.Sprintf("new-%d", time.Now().UnixNano()),
			Body:        "Body",
			AuthorID:    "123e4567-e89b-12d3-a456-426614174000",
			Status:      "PUBLISHED",
			PublishedAt: &newDate,
		}

		require.NoError(t, repo.Create(article1))
		require.NoError(t, repo.Create(article2))

		// Sort by published_at DESC (default is created_at DESC)
		// Since we created them sequentially, created_at order is same as published_at order in this case if we don't manipulate created_at.
		// But let's verify explicit sort.
		articles, err := repo.FindAll("PUBLISHED", "", "", 10, 0, "published_at")
		require.NoError(t, err)
		assert.GreaterOrEqual(t, len(articles), 2)

		// Check that the first item is the newer one (or at least check the order logic)
		// Since we can't easily isolate just these two without clearing DB, we check if the list is sorted.
		// A better way is to check if the first returned item has a date >= the second returned item.
		if len(articles) >= 2 {
			require.NotNil(t, articles[0].PublishedAt, "Article 0 PublishedAt is nil")
			require.NotNil(t, articles[1].PublishedAt, "Article 1 PublishedAt is nil")
			// Check if first is newer or equal
			assert.True(t, articles[0].PublishedAt.After(*articles[1].PublishedAt) || articles[0].PublishedAt.Equal(*articles[1].PublishedAt))
		}
	})

	t.Run("Update", func(t *testing.T) {
		article := &Article{Title: "Original", Slug: fmt.Sprintf("original-%d", time.Now().UnixNano()), Body: "Body", AuthorID: "123e4567-e89b-12d3-a456-426614174000", Status: "DRAFT"}
		require.NoError(t, repo.Create(article))

		article.Title = "Updated"
		article.Slug = fmt.Sprintf("updated-%d", time.Now().UnixNano())
		article.Status = "PUBLISHED"
		now := time.Now()
		article.PublishedAt = &now

		err := repo.Update(article.ID, article)
		require.NoError(t, err)

		found, err := repo.FindByID(article.ID)
		require.NoError(t, err)
		assert.Equal(t, "Updated", found.Title)
		assert.Equal(t, "PUBLISHED", found.Status)
		assert.NotNil(t, found.PublishedAt)
	})

	t.Run("Soft Delete", func(t *testing.T) {
		article := &Article{Title: "To Delete", Slug: fmt.Sprintf("to-delete-%d", time.Now().UnixNano()), Body: "Body", AuthorID: "123e4567-e89b-12d3-a456-426614174000", Status: "DRAFT"}
		require.NoError(t, repo.Create(article))

		err := repo.Delete(article.ID)
		require.NoError(t, err)

		// Should not be found after soft delete
		found, err := repo.FindByID(article.ID)
		require.NoError(t, err)
		assert.Nil(t, found)
	})

	t.Run("Tag Management", func(t *testing.T) {
		// Create article
		article := &Article{Title: "Tagged Article", Slug: fmt.Sprintf("tagged-article-%d", time.Now().UnixNano()), Body: "Body", AuthorID: "123e4567-e89b-12d3-a456-426614174000", Status: "DRAFT"}
		require.NoError(t, repo.Create(article))

		// Create test tags with UUIDs
		tag1ID := "a1b2c3d4-e5f6-7788-9900-aabbccddeeff"
		tag2ID := "f0e1d2c3-b4a5-6677-8899-aabbccddeeff"
		_, err := testDB.DB.Exec(`INSERT INTO tags (id, code, name) VALUES ($1, $2, $3)`, tag1ID, "tag1", `{"en": "Tag 1"}`)
		require.NoError(t, err)
		_, err = testDB.DB.Exec(`INSERT INTO tags (id, code, name) VALUES ($1, $2, $3)`, tag2ID, "tag2", `{"en": "Tag 2"}`)
		require.NoError(t, err)

		// Add tags by ID
		err = repo.AddTags(article.ID, []string{tag1ID, tag2ID})
		require.NoError(t, err)

		// Get tags by ID
		tags, err := repo.GetTags(article.ID)
		require.NoError(t, err)
		assert.Len(t, tags, 2)
		assert.Contains(t, tags, tag1ID)
		assert.Contains(t, tags, tag2ID)

		// Remove one tag by ID
		err = repo.RemoveTags(article.ID, []string{tag1ID})
		require.NoError(t, err)

		tags, err = repo.GetTags(article.ID)
		require.NoError(t, err)
		assert.Len(t, tags, 1)
		assert.Contains(t, tags, tag2ID)
	})

	t.Run("Count", func(t *testing.T) {
		article := &Article{Title: "Count Test", Slug: fmt.Sprintf("count-test-%d", time.Now().UnixNano()), Body: "Body", AuthorID: "123e4567-e89b-12d3-a456-426614174000", Status: "DRAFT"}
		require.NoError(t, repo.Create(article))

		count, err := repo.Count("", "", "")
		require.NoError(t, err)
		assert.Greater(t, count, 0)

		countDrafts, err := repo.Count("DRAFT", "", "")
		require.NoError(t, err)
		assert.Greater(t, countDrafts, 0)
	})
}
