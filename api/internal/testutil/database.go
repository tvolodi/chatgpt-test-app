package testutil

import (
	"context"
	"database/sql"
	"testing"
	"time"

	"github.com/ai-dala/api/internal/database" // Import the database package
	_ "github.com/lib/pq"
	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/modules/postgres"
	"github.com/testcontainers/testcontainers-go/wait"
)

// TestDatabase represents a test database with container
type TestDatabase struct {
	Container *postgres.PostgresContainer
	DB        *sql.DB
}

// SetupTestDatabase creates a PostgreSQL container and runs migrations
func SetupTestDatabase(t *testing.T) *TestDatabase {
	ctx := context.Background()

	// Start PostgreSQL container
	pgContainer, err := postgres.RunContainer(ctx,
		testcontainers.WithImage("postgres:15-alpine"),
		postgres.WithDatabase("testdb"),
		postgres.WithUsername("test"),
		postgres.WithPassword("test"),
		testcontainers.WithWaitStrategy(
			wait.ForLog("database system is ready to accept connections").
				WithOccurrence(2).
				WithStartupTimeout(30*time.Second)),
	)
	if err != nil {
		t.Fatalf("failed to start container: %s", err)
	}

	// Get connection string
	connStr, err := pgContainer.ConnectionString(ctx, "sslmode=disable")
	if err != nil {
		t.Fatalf("failed to get connection string: %s", err)
	}

	// Connect to database
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		t.Fatalf("failed to connect to database: %s", err)
	}

	// Wait for database to be ready
	if err := db.Ping(); err != nil {
		t.Fatalf("failed to ping database: %s", err)
	}

	// Run migrations from the database package
	if err := database.RunMigrations(db); err != nil {
		t.Fatalf("failed to run migrations: %s", err)
	}

	// Cleanup on test completion
	t.Cleanup(func() {
		db.Close()
		if err := pgContainer.Terminate(ctx); err != nil {
			t.Logf("failed to terminate container: %s", err)
		}
	})

	return &TestDatabase{
		Container: pgContainer,
		DB:        db,
	}
}