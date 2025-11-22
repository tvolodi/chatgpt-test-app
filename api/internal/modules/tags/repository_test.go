package tags

import (
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/google/uuid"
)

func TestPostgresRepository_FindAll(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("unexpected error when opening a stub db connection: %s", err)
	}
	defer db.Close()

	rows := sqlmock.NewRows([]string{"id", "code", "name"}).
		AddRow(uuid.New().String(), "tag1", []byte(`{"en":"Tag One"}`)).
		AddRow(uuid.New().String(), "tag2", []byte(`{"en":"Tag Two"}`))
	mock.ExpectQuery("SELECT id, code, name FROM tags ORDER BY code ASC").WillReturnRows(rows)

	repo := NewRepository(db)
	tags, err := repo.FindAll()
	if err != nil {
		t.Fatalf("unexpected error: %s", err)
	}
	if len(tags) != 2 {
		t.Fatalf("expected 2 tags, got %d", len(tags))
	}
	if tags[0].Code != "tag1" || tags[1].Code != "tag2" {
		t.Fatalf("unexpected tag codes: %s, %s", tags[0].Code, tags[1].Code)
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatalf("unfulfilled expectations: %s", err)
	}
}

func TestPostgresRepository_FindByCode(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("unexpected error when opening a stub db connection: %s", err)
	}
	defer db.Close()

	row := sqlmock.NewRows([]string{"id", "code", "name"}).
		AddRow(uuid.New().String(), "tag1", []byte(`{"en":"Tag One"}`))
	mock.ExpectQuery(`SELECT id, code, name FROM tags WHERE code = \$1`).WithArgs("tag1").WillReturnRows(row)

	repo := NewRepository(db)
	tag, err := repo.FindByCode("tag1")
	if err != nil {
		t.Fatalf("unexpected error: %s", err)
	}
	if tag == nil {
		t.Fatalf("expected tag, got nil")
	}
	if tag.Code != "tag1" {
		t.Fatalf("expected code 'tag1', got %s", tag.Code)
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatalf("unfulfilled expectations: %s", err)
	}
}
