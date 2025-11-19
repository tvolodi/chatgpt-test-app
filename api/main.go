package main

import (
	"log"
	"net/http"
	"os"

	"github.com/ai-dala/api/internal/http/server"
)

func main() {
	addr := ":" + fallback(os.Getenv("PORT"), "4000")
	mux := http.NewServeMux()
	server.RegisterRoutes(mux)

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
