package server

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/ai-dala/api/internal/auth"
	"github.com/google/uuid"
)

type Server struct {
	auth auth.Service
}

func NewServer(authService auth.Service) *Server {
	return &Server{
		auth: authService,
	}
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

	// Protected routes
	mux.Handle("GET /api/protected/resource", auth.Middleware(http.HandlerFunc(s.protectedHandler)))
}

func (s *Server) protectedHandler(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{
		"message": "You have accessed a protected resource!",
	})
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
