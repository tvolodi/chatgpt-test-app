package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/ai-dala/api/internal/auth"
	"github.com/ai-dala/api/internal/database"
	"github.com/ai-dala/api/internal/http/server"
	"github.com/ai-dala/api/internal/modules/articles"
	"github.com/ai-dala/api/internal/modules/categories"
	"github.com/ai-dala/api/internal/modules/tags"
	"github.com/ai-dala/api/internal/modules/uploads"
	"github.com/jmoiron/sqlx"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	addr := ":" + fallback(os.Getenv("PORT"), "4000")
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL is required")
	}

	// Connect to Database
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatalf("failed to connect to db: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("failed to ping db: %v", err)
	}

	// Run database migrations
	log.Println("Running database migrations...")
	if err := database.RunMigrations(db); err != nil {
		log.Fatalf("failed to run migrations: %v", err)
	}
	log.Println("Database migrations completed successfully")

	// Initialize Auth Service
	authService := auth.NewJWTService("my-secret-key")

	// Initialize Tags Module
	tagsRepo := tags.NewRepository(db)
	tagsService := tags.NewService(tagsRepo)
	tagsHandler := tags.NewHandler(tagsService)

	// Initialize Categories Module
	dbx := sqlx.NewDb(db, "postgres")
	categoriesRepo := categories.NewRepository(dbx)
	categoriesService := categories.NewService(categoriesRepo)
	categoriesHandler := categories.NewHandler(categoriesService)

	// Initialize Articles Module
	articlesRepo := articles.NewRepository(dbx)
	articlesService := articles.NewService(articlesRepo)
	articlesHandler := articles.NewHandler(articlesService)

	// Initialize Uploads Module
	uploadsHandler := uploads.NewHandler("/uploads/images")

	// Initialize Server
	srv := server.NewServer(authService, tagsHandler, categoriesHandler, articlesHandler, uploadsHandler)

	mux := http.NewServeMux()
	srv.RegisterRoutes(mux)

	log.Printf("starting api server on %s", addr)
	// Wrap with CORS and logging middleware
	handler := server.CORSMiddleware(server.LoggingMiddleware(mux))
	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatalf("server stopped: %v", err)
	}
}

func fallback(value, def string) string {
	if value == "" {
		return def
	}
	return value
}
