package articles

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/jmoiron/sqlx"
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

type Repository struct {
	db *sqlx.DB
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{db: db}
}

// Create inserts a new article
func (r *Repository) Create(article *Article) error {
	query := `
		INSERT INTO articles (title, slug, body, category_id, author_id, status)
		VALUES ($1, $2, $3, $4, $5, $6)
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
func (r *Repository) FindAll(status, categoryID, authorID string, limit, offset int) ([]Article, error) {
	query := `
		SELECT id, title, slug, body, category_id, author_id, status, published_at, created_at, updated_at
		FROM articles
		WHERE deleted_at IS NULL
	`
	args := []interface{}{}
	argPos := 1

	if status != "" {
		query += fmt.Sprintf(` AND status = $%d`, argPos)
		args = append(args, status)
		argPos++
	}
	if categoryID != "" {
		query += fmt.Sprintf(` AND category_id = $%d`, argPos)
		args = append(args, categoryID)
		argPos++
	}
	if authorID != "" {
		query += fmt.Sprintf(` AND author_id = $%d`, argPos)
		args = append(args, authorID)
		argPos++
	}

	query += fmt.Sprintf(` ORDER BY created_at DESC LIMIT $%d OFFSET $%d`, argPos, argPos+1)
	args = append(args, limit, offset)

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
	_, err := r.db.Exec(query, articleID, tagIDs)
	return err
}

// GetTags retrieves all tag IDs for an article
func (r *Repository) GetTags(articleID string) ([]string, error) {
	var tagIDs []string
	query := `SELECT tag_id FROM article_tags WHERE article_id = $1`
	err := r.db.Select(&tagIDs, query, articleID)
	return tagIDs, err
}

// Count returns total number of articles matching filters
func (r *Repository) Count(status, categoryID, authorID string) (int, error) {
	query := `SELECT COUNT(*) FROM articles WHERE deleted_at IS NULL`
	args := []interface{}{}
	argPos := 1

	if status != "" {
		query += fmt.Sprintf(` AND status = $%d`, argPos)
		args = append(args, status)
		argPos++
	}
	if categoryID != "" {
		query += fmt.Sprintf(` AND category_id = $%d`, argPos)
		args = append(args, categoryID)
		argPos++
	}
	if authorID != "" {
		query += fmt.Sprintf(` AND author_id = $%d`, argPos)
		args = append(args, authorID)
	}

	var count int
	err := r.db.Get(&count, query, args...)
	return count, err
}
