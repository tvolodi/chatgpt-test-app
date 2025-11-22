package tags

import (
	"database/sql"
	"encoding/json"
	"fmt"
)

type Repository interface {
	FindAll() ([]Tag, error)
	FindByCode(code string) (*Tag, error)
	Create(code string, name map[string]interface{}) (*Tag, error)
	Update(oldCode, newCode string, name map[string]interface{}) (*Tag, error)
	Delete(code string) error
}

type postgresRepository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &postgresRepository{db: db}
}

func (r *postgresRepository) FindAll() ([]Tag, error) {
	query := `SELECT id, code, name FROM tags ORDER BY code ASC`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tags []Tag
	for rows.Next() {
		var t Tag
		// json.RawMessage is []byte, so Scan should work if driver returns []byte or string
		if err := rows.Scan(&t.ID, &t.Code, &t.Name); err != nil {
			return nil, err
		}
		tags = append(tags, t)
	}
	return tags, nil
}

func (r *postgresRepository) FindByCode(code string) (*Tag, error) {
	query := `SELECT id, code, name FROM tags WHERE code = $1`
	row := r.db.QueryRow(query, code)

	var t Tag
	if err := row.Scan(&t.ID, &t.Code, &t.Name); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &t, nil
}

func (r *postgresRepository) Create(code string, name map[string]interface{}) (*Tag, error) {
	query := `INSERT INTO tags (code, name) VALUES ($1, $2) RETURNING id, code, name`

	// Marshal map to JSON for JSONB column
	nameJSON, err := json.Marshal(name)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal name: %w", err)
	}

	var t Tag
	err = r.db.QueryRow(query, code, nameJSON).Scan(&t.ID, &t.Code, &t.Name)
	if err != nil {
		return nil, err
	}
	return &t, nil
}

func (r *postgresRepository) Update(oldCode, newCode string, name map[string]interface{}) (*Tag, error) {
	query := `UPDATE tags SET code = $1, name = $2 WHERE code = $3 RETURNING id, code, name`

	// Marshal map to JSON for JSONB column
	nameJSON, err := json.Marshal(name)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal name: %w", err)
	}

	var t Tag
	err = r.db.QueryRow(query, newCode, nameJSON, oldCode).Scan(&t.ID, &t.Code, &t.Name)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &t, nil
}

func (r *postgresRepository) Delete(code string) error {
	query := `DELETE FROM tags WHERE code = $1`
	result, err := r.db.Exec(query, code)
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
