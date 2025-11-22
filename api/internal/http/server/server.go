package server

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/ai-dala/api/internal/auth"
	"github.com/ai-dala/api/internal/modules/tags"
	"github.com/google/uuid"
)

type Server struct {
	auth        auth.Service
	tagsHandler *tags.Handler
}

func NewServer(authService auth.Service, tagsHandler *tags.Handler) *Server {
	return &Server{
		auth:        authService,
		tagsHandler: tagsHandler,
	}
}

// CORSMiddleware adds CORS headers to allow cross-origin requests
func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Allow requests from localhost:3000 (Next.js dev server)
		origin := r.Header.Get("Origin")
		if origin == "http://localhost:3000" || origin == "http://localhost:4000" {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		}

		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		// Handle preflight requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// LoggingMiddleware logs method, path, and a basic correlation ID.
func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		corrID := r.Header.Get("X-Request-ID")
		if corrID == "" {
			corrID = uuid.NewString()
		}
		w.Header().Set("X-Request-ID", corrID)
		log.Printf("request_id=%s method=%s path=%s", corrID, r.Method, r.URL.Path)
		next.ServeHTTP(w, r)
	})
}

func (s *Server) RegisterRoutes(mux *http.ServeMux) {
	// Public routes
	mux.HandleFunc("GET /api/content/news", newsListHandler)
	mux.HandleFunc("GET /api/content/news/", newsDetailHandler)
	mux.HandleFunc("GET /api/content/news/{slug}", newsDetailHandler)

	// Tag routes (optional)
	if s.tagsHandler != nil {
		mux.HandleFunc("GET /api/tags", s.tagsHandler.ListTags)
		mux.HandleFunc("GET /api/tags/{code}", s.tagsHandler.GetTagByCode)
		mux.HandleFunc("POST /api/tags", s.tagsHandler.CreateTag)
		mux.HandleFunc("PUT /api/tags/{code}", s.tagsHandler.UpdateTag)
		mux.HandleFunc("DELETE /api/tags/{code}", s.tagsHandler.DeleteTag)
	}

	// Protected routes
	mux.Handle("GET /api/protected/resource", auth.Middleware(http.HandlerFunc(s.protectedHandler)))
}

func (s *Server) protectedHandler(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"message": "You have accessed a protected resource!"})
}

type errorResponse struct {
	ErrorCode string `json:"error_code"`
	Message   string `json:"message"`
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}
