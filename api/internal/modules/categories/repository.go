package categories

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
)

type Category struct {
	ID        string          `db:"id" json:"id"`
	Code      string          `db:"code" json:"code"`
	Name      json.RawMessage `db:"name" json:"name"`
	ParentID  *string         `db:"parent_id" json:"parent_id"`
	CreatedAt time.Time       `db:"created_at" json:"created_at"`
	UpdatedAt time.Time       `db:"updated_at" json:"updated_at"`
	DeletedAt *time.Time      `db:"deleted_at" json:"deleted_at,omitempty"`
}

type Repository struct {
	db *sqlx.DB
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) Create(ctx context.Context, c *Category) error {
	query := `
		INSERT INTO categories (code, name, parent_id)
		VALUES ($1, $2, $3)
		RETURNING id, created_at, updated_at
	`
	return r.db.QueryRowContext(ctx, query, c.Code, c.Name, c.ParentID).Scan(&c.ID, &c.CreatedAt, &c.UpdatedAt)
}

func (r *Repository) Update(ctx context.Context, c *Category) error {
	query := `
		UPDATE categories
		SET code = $1, name = $2, parent_id = $3, updated_at = CURRENT_TIMESTAMP
		WHERE id = $4 AND deleted_at IS NULL
		RETURNING updated_at
	`
	return r.db.QueryRowContext(ctx, query, c.Code, c.Name, c.ParentID, c.ID).Scan(&c.UpdatedAt)
}

func (r *Repository) Delete(ctx context.Context, id string) error {
	// Check for active children first
	hasChildren, err := r.HasActiveChildren(ctx, id)
	if err != nil {
		return err
	}
	if hasChildren {
		return errors.New("cannot delete category with active children")
	}

	query := `
		UPDATE categories
		SET deleted_at = CURRENT_TIMESTAMP
		WHERE id = $1 AND deleted_at IS NULL
	`
	result, err := r.db.ExecContext(ctx, query, id)
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

func (r *Repository) FindAll(ctx context.Context) ([]Category, error) {
	query := `
		SELECT id, code, name, parent_id, created_at, updated_at
		FROM categories
		WHERE deleted_at IS NULL
		ORDER BY created_at DESC
	`
	var categories []Category
	err := r.db.SelectContext(ctx, &categories, query)
	return categories, err
}

func (r *Repository) FindByID(ctx context.Context, id string) (*Category, error) {
	query := `
		SELECT id, code, name, parent_id, created_at, updated_at
		FROM categories
		WHERE id = $1 AND deleted_at IS NULL
	`
	var c Category
	err := r.db.GetContext(ctx, &c, query, id)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return &c, err
}

func (r *Repository) HasActiveChildren(ctx context.Context, parentID string) (bool, error) {
	query := `SELECT EXISTS(SELECT 1 FROM categories WHERE parent_id = $1 AND deleted_at IS NULL)`
	var exists bool
	err := r.db.QueryRowContext(ctx, query, parentID).Scan(&exists)
	return exists, err
}

// IsUniqueCode checks if a code is unique, ignoring the given ID (for updates)
func (r *Repository) IsUniqueCode(ctx context.Context, code string, excludeID string) (bool, error) {
	query := `SELECT COUNT(*) FROM categories WHERE code = $1 AND id != $2 AND deleted_at IS NULL`
	var count int
	// Handle empty excludeID for create operations
	if excludeID == "" {
		// Use a UUID that won't match any real ID, e.g., nil UUID
		excludeID = "00000000-0000-0000-0000-000000000000"
	}
	err := r.db.GetContext(ctx, &count, query, code, excludeID)
	return count == 0, err
}

// Helper to check for unique constraint violation
func IsUniqueViolation(err error) bool {
	if pqErr, ok := err.(*pq.Error); ok {
		return pqErr.Code == "23505" // unique_violation
	}
	return false
}
