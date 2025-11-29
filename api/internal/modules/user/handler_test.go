package user

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/ai-dala/api/internal/auth"
	"github.com/ai-dala/api/internal/testutil"
	"github.com/jmoiron/sqlx"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestHandler_GetUserActivity(t *testing.T) {
	// Setup test database
	testDB := testutil.SetupTestDatabase(t)
	db := sqlx.NewDb(testDB.DB, "postgres")

	// Create test user
	userID := "test-user-id"
	_, err := testDB.DB.Exec(`INSERT INTO users (id, email) VALUES ($1, $2)`, userID, "test@example.com")
	require.NoError(t, err)

	// Create test articles
	article1ID := "article-1"
	article2ID := "article-2"
	_, err = testDB.DB.Exec(`INSERT INTO articles (id, title, slug, body, author_id, status) VALUES ($1, $2, $3, $4, $5, $6)`,
		article1ID, "Test Article 1", "test-article-1", "Content 1", userID, "PUBLISHED")
	require.NoError(t, err)
	_, err = testDB.DB.Exec(`INSERT INTO articles (id, title, slug, body, author_id, status) VALUES ($1, $2, $3, $4, $5, $6)`,
		article2ID, "Test Article 2", "test-article-2", "Content 2", userID, "PUBLISHED")
	require.NoError(t, err)

	// Create test likes
	_, err = testDB.DB.Exec(`INSERT INTO article_likes (user_id, article_id, is_like, created_at) VALUES ($1, $2, $3, $4)`,
		userID, article1ID, true, time.Now().Add(-24*time.Hour))
	require.NoError(t, err)
	_, err = testDB.DB.Exec(`INSERT INTO article_likes (user_id, article_id, is_like, created_at) VALUES ($1, $2, $3, $4)`,
		userID, article2ID, true, time.Now().Add(-48*time.Hour))
	require.NoError(t, err)

	// Create test comments
	_, err = testDB.DB.Exec(`INSERT INTO comments (id, user_id, article_id, body, created_at) VALUES ($1, $2, $3, $4, $5)`,
		"comment-1", userID, article1ID, "Great article!", time.Now().Add(-12*time.Hour))
	require.NoError(t, err)
	_, err = testDB.DB.Exec(`INSERT INTO comments (id, user_id, article_id, body, created_at) VALUES ($1, $2, $3, $4, $5)`,
		"comment-2", userID, article2ID, "Interesting read", time.Now().Add(-36*time.Hour))
	require.NoError(t, err)

	// Setup service and handler
	repo := NewRepository(db)
	service := NewService(repo)
	handler := NewHandler(service)

	// Create request with authenticated context
	req := httptest.NewRequest("GET", "/api/user/activity", nil)
	ctx := context.WithValue(req.Context(), auth.UserIDKey, userID)
	req = req.WithContext(ctx)

	// Create response recorder
	w := httptest.NewRecorder()

	// Call handler
	handler.handleGetActivity(w, req)

	// Assert response
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, "application/json", w.Header().Get("Content-Type"))

	var activity UserActivity
	err = json.NewDecoder(w.Body).Decode(&activity)
	require.NoError(t, err)

	// Assert likes (should be 2)
	assert.Len(t, activity.Likes, 2)
	assert.Equal(t, article1ID, activity.Likes[0].ArticleID)
	assert.Equal(t, "Test Article 1", activity.Likes[0].ArticleTitle)
	assert.Equal(t, article2ID, activity.Likes[1].ArticleID)
	assert.Equal(t, "Test Article 2", activity.Likes[1].ArticleTitle)

	// Assert comments (should be 2)
	assert.Len(t, activity.Comments, 2)
	assert.Equal(t, article1ID, activity.Comments[0].ArticleID)
	assert.Equal(t, "Test Article 1", activity.Comments[0].ArticleTitle)
	assert.Equal(t, "Great article!", activity.Comments[0].Body)
	assert.Equal(t, article2ID, activity.Comments[1].ArticleID)
	assert.Equal(t, "Test Article 2", activity.Comments[1].ArticleTitle)
	assert.Equal(t, "Interesting read", activity.Comments[1].Body)
}

func TestHandler_GetUserActivity_Unauthorized(t *testing.T) {
	// Setup service and handler (no auth context)
	testDB := testutil.SetupTestDatabase(t)
	db := sqlx.NewDb(testDB.DB, "postgres")
	repo := NewRepository(db)
	service := NewService(repo)
	handler := NewHandler(service)

	// Create request without authenticated context
	req := httptest.NewRequest("GET", "/api/user/activity", nil)
	w := httptest.NewRecorder()

	// Call handler
	handler.handleGetActivity(w, req)

	// Assert unauthorized response
	assert.Equal(t, http.StatusUnauthorized, w.Code)
	assert.Contains(t, w.Body.String(), "unauthorized")
}

func TestHandler_GetUserActivity_NoActivity(t *testing.T) {
	// Setup test database
	testDB := testutil.SetupTestDatabase(t)
	db := sqlx.NewDb(testDB.DB, "postgres")

	// Create test user (no activity)
	userID := "test-user-id"
	_, err := testDB.DB.Exec(`INSERT INTO users (id, email) VALUES ($1, $2)`, userID, "test@example.com")
	require.NoError(t, err)

	// Setup service and handler
	repo := NewRepository(db)
	service := NewService(repo)
	handler := NewHandler(service)

	// Create request with authenticated context
	req := httptest.NewRequest("GET", "/api/user/activity", nil)
	ctx := context.WithValue(req.Context(), auth.UserIDKey, userID)
	req = req.WithContext(ctx)

	// Create response recorder
	w := httptest.NewRecorder()

	// Call handler
	handler.handleGetActivity(w, req)

	// Assert response
	assert.Equal(t, http.StatusOK, w.Code)

	var activity UserActivity
	err = json.NewDecoder(w.Body).Decode(&activity)
	require.NoError(t, err)

	// Assert empty activity
	assert.Len(t, activity.Likes, 0)
	assert.Len(t, activity.Comments, 0)
}
