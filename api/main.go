package main

import (
	"log"
	"net/http"
	"os"

	"github.com/ai-dala/api/internal/auth"
	"github.com/ai-dala/api/internal/http/server"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	addr := ":" + fallback(os.Getenv("PORT"), "4000")

	// Initialize Auth Service
	// In production, the secret should come from env vars
	authService := auth.NewJWTService("my-secret-key")

	// Initialize Server
	srv := server.NewServer(authService)

	mux := http.NewServeMux()
	srv.RegisterRoutes(mux)

	log.Printf("starting api server on %s", addr)
	if err := http.ListenAndServe(addr, server.LoggingMiddleware(mux)); err != nil {
		log.Fatalf("server stopped: %v", err)
	}
}

func fallback(value, def string) string {
	if value == "" {
		return def
	}
	return value
}
