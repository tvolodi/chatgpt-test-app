package articles

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
)

type Article struct {
	ID          string     `db:"id" json:"id"`
	Title       string     `db:"title" json:"title"`
	Slug        string     `db:"slug" json:"slug"`
	Body        string     `db:"body" json:"body"`
	CategoryID  *string    `db:"category_id" json:"category_id"`
	AuthorID    string     `db:"author_id" json:"author_id"`
	Status      string     `db:"status" json:"status"`
	PublishedAt *time.Time `db:"published_at" json:"published_at,omitempty"`
	CreatedAt   time.Time  `db:"created_at" json:"created_at"`
	UpdatedAt   time.Time  `db:"updated_at" json:"updated_at"`
	DeletedAt   *time.Time `db:"deleted_at" json:"deleted_at,omitempty"`
}

type FilterOptions struct {
	Status     string
	CategoryID string
	AuthorID   string
	Tags       []string
	Limit      int
	Offset     int
	SortBy     string
}

type CategoryWithCount struct {
	ID           string `db:"id" json:"id"`
	Name         string `db:"name" json:"name"`
	Slug         string `db:"slug" json:"slug"`
	ArticleCount int    `db:"article_count" json:"article_count"`
}

type TagWithCount struct {
	Name         string `db:"name" json:"name"`
	ArticleCount int    `db:"article_count" json:"article_count"`
}

type Repository struct {
	db *sqlx.DB
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{db: db}
}

// Create inserts a new article
func (r *Repository) Create(article *Article) error {
	query := `
		INSERT INTO articles (title, slug, body, category_id, author_id, status, published_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, created_at, updated_at
	`
	return r.db.QueryRow(
		query,
		article.Title,
		article.Slug,
		article.Body,
		article.CategoryID,
		article.AuthorID,
		article.Status,
		article.PublishedAt,
	).Scan(&article.ID, &article.CreatedAt, &article.UpdatedAt)
}

// FindByID retrieves an article by ID (excluding soft-deleted)
func (r *Repository) FindByID(id string) (*Article, error) {
	var article Article
	query := `
		SELECT id, title, slug, body, category_id, author_id, status, published_at, created_at, updated_at, deleted_at
		FROM articles
		WHERE id = $1 AND deleted_at IS NULL
	`
	err := r.db.Get(&article, query, id)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return &article, err
}

// FindBySlug retrieves an article by slug (excluding soft-deleted)
func (r *Repository) FindBySlug(slug string) (*Article, error) {
	var article Article
	query := `
		SELECT id, title, slug, body, category_id, author_id, status, published_at, created_at, updated_at, deleted_at
		FROM articles
		WHERE slug = $1 AND deleted_at IS NULL
	`
	err := r.db.Get(&article, query, slug)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return &article, err
}

// FindAll retrieves all active articles with optional filters
func (r *Repository) FindAll(opts FilterOptions) ([]Article, error) {
	query := `
		SELECT DISTINCT a.id, a.title, a.slug, a.body, a.category_id, a.author_id, a.status, a.published_at, a.created_at, a.updated_at
		FROM articles a
	`

	if len(opts.Tags) > 0 {
		query += ` JOIN article_tags at ON a.id = at.article_id JOIN tags t ON at.tag_id = t.id`
	}

	query += ` WHERE a.deleted_at IS NULL`

	args := []interface{}{}
	argPos := 1

	if opts.Status != "" {
		query += fmt.Sprintf(` AND a.status = $%d`, argPos)
		args = append(args, opts.Status)
		argPos++
	}
	if opts.CategoryID != "" {
		query += fmt.Sprintf(` AND a.category_id = $%d`, argPos)
		args = append(args, opts.CategoryID)
		argPos++
	}
	if opts.AuthorID != "" {
		query += fmt.Sprintf(` AND a.author_id = $%d`, argPos)
		args = append(args, opts.AuthorID)
		argPos++
	}
	if len(opts.Tags) > 0 {
		query += fmt.Sprintf(` AND t.code = ANY($%d)`, argPos)
		args = append(args, pq.Array(opts.Tags))
		argPos++
	}

	orderBy := "a.created_at DESC"
	if opts.SortBy == "published_at" {
		orderBy = "a.published_at DESC"
	}

	query += fmt.Sprintf(` ORDER BY %s LIMIT $%d OFFSET $%d`, orderBy, argPos, argPos+1)
	args = append(args, opts.Limit, opts.Offset)

	var articles []Article
	err := r.db.Select(&articles, query, args...)
	return articles, err
}

// Update modifies an existing article
func (r *Repository) Update(id string, article *Article) error {
	query := `
		UPDATE articles
		SET title = $1, slug = $2, body = $3, category_id = $4, status = $5, published_at = $6, updated_at = NOW()
		WHERE id = $7 AND deleted_at IS NULL
		RETURNING updated_at
	`
	return r.db.QueryRow(
		query,
		article.Title,
		article.Slug,
		article.Body,
		article.CategoryID,
		article.Status,
		article.PublishedAt,
		id,
	).Scan(&article.UpdatedAt)
}

// Delete performs soft delete
func (r *Repository) Delete(id string) error {
	query := `UPDATE articles SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL`
	result, err := r.db.Exec(query, id)
	if err != nil {
		return err
	}
	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return sql.ErrNoRows
	}
	return nil
}

// AddTags associates tags with an article
func (r *Repository) AddTags(articleID string, tagIDs []string) error {
	if len(tagIDs) == 0 {
		return nil
	}

	query := `INSERT INTO article_tags (article_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`
	for _, tagID := range tagIDs {
		_, err := r.db.Exec(query, articleID, tagID)
		if err != nil {
			return err
		}
	}
	return nil
}

// RemoveTags removes tag associations
func (r *Repository) RemoveTags(articleID string, tagIDs []string) error {
	if len(tagIDs) == 0 {
		return nil
	}

	query := `DELETE FROM article_tags WHERE article_id = $1 AND tag_id = ANY($2)`
	_, err := r.db.Exec(query, articleID, pq.Array(tagIDs))
	return err
}

// GetTags retrieves all tag codes for an article
func (r *Repository) GetTags(articleID string) ([]string, error) {
	var tags []string
	query := `
		SELECT t.code 
		FROM article_tags at
		JOIN tags t ON at.tag_id = t.id
		WHERE at.article_id = $1
	`
	err := r.db.Select(&tags, query, articleID)
	return tags, err
}

// Comment represents a user comment on an article
type Comment struct {
	ID        string    `json:"id" db:"id"`
	ArticleID string    `json:"article_id" db:"article_id"`
	UserID    string    `json:"user_id" db:"user_id"`
	Body      string    `json:"body" db:"body"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

// ArticleLike represents a user like/dislike on an article
type ArticleLike struct {
	ArticleID string    `json:"article_id" db:"article_id"`
	UserID    string    `json:"user_id" db:"user_id"`
	IsLike    bool      `json:"is_like" db:"is_like"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

// AddComment adds a new comment
func (r *Repository) AddComment(comment *Comment) error {
	query := `
		INSERT INTO comments (article_id, user_id, body)
		VALUES ($1, $2, $3)
		RETURNING id, created_at, updated_at
	`
	return r.db.QueryRow(
		query,
		comment.ArticleID,
		comment.UserID,
		comment.Body,
	).Scan(&comment.ID, &comment.CreatedAt, &comment.UpdatedAt)
}

// GetComments retrieves comments for an article
func (r *Repository) GetComments(articleID string) ([]Comment, error) {
	query := `
		SELECT id, article_id, user_id, body, created_at, updated_at
		FROM comments
		WHERE article_id = $1
		ORDER BY created_at DESC
	`
	var comments []Comment
	err := r.db.Select(&comments, query, articleID)
	return comments, err
}

// AddLike adds or updates a like/dislike
func (r *Repository) AddLike(like *ArticleLike) error {
	query := `
		INSERT INTO article_likes (article_id, user_id, is_like)
		VALUES ($1, $2, $3)
		ON CONFLICT (article_id, user_id)
		DO UPDATE SET is_like = EXCLUDED.is_like, created_at = NOW()
	`
	_, err := r.db.Exec(query, like.ArticleID, like.UserID, like.IsLike)
	return err
}

// RemoveLike removes a like/dislike
func (r *Repository) RemoveLike(articleID, userID string) error {
	query := `DELETE FROM article_likes WHERE article_id = $1 AND user_id = $2`
	_, err := r.db.Exec(query, articleID, userID)
	return err
}

// GetLikesCount retrieves the count of likes and dislikes for an article
func (r *Repository) GetLikesCount(articleID string) (int, int, error) {
	var likes int
	var dislikes int

	queryLikes := `SELECT COUNT(*) FROM article_likes WHERE article_id = $1 AND is_like = TRUE`
	if err := r.db.Get(&likes, queryLikes, articleID); err != nil {
		return 0, 0, err
	}

	queryDislikes := `SELECT COUNT(*) FROM article_likes WHERE article_id = $1 AND is_like = FALSE`
	if err := r.db.Get(&dislikes, queryDislikes, articleID); err != nil {
		return 0, 0, err
	}

	return likes, dislikes, nil
}

// GetUserLike checks if a user has liked/disliked an article
func (r *Repository) GetUserLike(articleID, userID string) (*bool, error) {
	var isLike bool
	query := `SELECT is_like FROM article_likes WHERE article_id = $1 AND user_id = $2`
	err := r.db.Get(&isLike, query, articleID, userID)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &isLike, nil
}

// Count returns total number of articles matching filters
func (r *Repository) Count(opts FilterOptions) (int, error) {
	query := `SELECT COUNT(DISTINCT a.id) FROM articles a`

	if len(opts.Tags) > 0 {
		query += ` JOIN article_tags at ON a.id = at.article_id JOIN tags t ON at.tag_id = t.id`
	}

	query += ` WHERE a.deleted_at IS NULL`

	args := []interface{}{}
	argPos := 1

	if opts.Status != "" {
		query += fmt.Sprintf(` AND a.status = $%d`, argPos)
		args = append(args, opts.Status)
		argPos++
	}
	if opts.CategoryID != "" {
		query += fmt.Sprintf(` AND a.category_id = $%d`, argPos)
		args = append(args, opts.CategoryID)
		argPos++
	}
	if opts.AuthorID != "" {
		query += fmt.Sprintf(` AND a.author_id = $%d`, argPos)
		args = append(args, opts.AuthorID)
		argPos++
	}
	if len(opts.Tags) > 0 {
		query += fmt.Sprintf(` AND t.code = ANY($%d)`, argPos)
		args = append(args, pq.Array(opts.Tags))
		argPos++
	}

	var count int
	err := r.db.Get(&count, query, args...)
	return count, err
}

// GetCategoriesWithCounts retrieves all categories with their article counts
func (r *Repository) GetCategoriesWithCounts() ([]CategoryWithCount, error) {
	query := `
		SELECT c.id, c.name, c.slug, COUNT(a.id) as article_count
		FROM categories c
		LEFT JOIN articles a ON c.id = a.category_id AND a.status = 'published' AND a.deleted_at IS NULL
		GROUP BY c.id, c.name, c.slug
		ORDER BY c.name
	`
	var categories []CategoryWithCount
	err := r.db.Select(&categories, query)
	return categories, err
}

// GetTagsWithCounts retrieves tags with their article counts
func (r *Repository) GetTagsWithCounts(popular bool, limit int) ([]TagWithCount, error) {
	query := `
		SELECT t.code as name, COUNT(DISTINCT a.id) as article_count
		FROM article_tags at
		JOIN tags t ON at.tag_id = t.id
		JOIN articles a ON at.article_id = a.id
		WHERE a.status = 'published' AND a.deleted_at IS NULL
		GROUP BY t.code
	`

	if popular {
		query += ` HAVING COUNT(DISTINCT a.id) >= 1` // Simplified for now, can be adjusted
	}

	query += ` ORDER BY article_count DESC, t.code`

	if limit > 0 {
		query += fmt.Sprintf(` LIMIT %d`, limit)
	}

	var tags []TagWithCount
	err := r.db.Select(&tags, query)
	return tags, err
}
