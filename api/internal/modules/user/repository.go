package user

import (
	"database/sql"
	"time"

	"github.com/jmoiron/sqlx"
)

type UserActivity struct {
	Likes    []UserLikeActivity    `json:"likes"`
	Comments []UserCommentActivity `json:"comments"`
}

type UserLikeActivity struct {
	ArticleID    string    `json:"article_id"`
	ArticleTitle string    `json:"article_title"`
	IsLike       bool      `json:"is_like"`
	CreatedAt    time.Time `json:"created_at"`
}

type UserCommentActivity struct {
	ID           string    `json:"id"`
	ArticleID    string    `json:"article_id"`
	ArticleTitle string    `json:"article_title"`
	Body         string    `json:"body"`
	CreatedAt    time.Time `json:"created_at"`
}

type Repository struct {
	db *sqlx.DB
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{db: db}
}

// GetUserActivity retrieves user's recent likes and comments (last 30 days, max 10 each)
func (r *Repository) GetUserActivity(userID string) (*UserActivity, error) {
	activity := &UserActivity{}

	// Get recent likes (last 30 days, max 10)
	likesQuery := `
		SELECT al.article_id, a.title as article_title, al.is_like, al.created_at
		FROM article_likes al
		JOIN articles a ON al.article_id = a.id
		WHERE al.user_id = $1
			AND al.created_at >= NOW() - INTERVAL '30 days'
			AND a.deleted_at IS NULL
		ORDER BY al.created_at DESC
		LIMIT 10
	`

	likes := []UserLikeActivity{}
	err := r.db.Select(&likes, likesQuery, userID)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	activity.Likes = likes

	// Get recent comments (last 30 days, max 10)
	commentsQuery := `
		SELECT c.id, c.article_id, a.title as article_title, c.body, c.created_at
		FROM comments c
		JOIN articles a ON c.article_id = a.id
		WHERE c.user_id = $1
			AND c.created_at >= NOW() - INTERVAL '30 days'
			AND a.deleted_at IS NULL
		ORDER BY c.created_at DESC
		LIMIT 10
	`

	comments := []UserCommentActivity{}
	err = r.db.Select(&comments, commentsQuery, userID)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	activity.Comments = comments

	return activity, nil
}
