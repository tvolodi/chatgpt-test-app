package server

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/google/uuid"
)

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

func RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("POST /api/auth/login", loginHandler)
	mux.HandleFunc("GET /api/content/news", newsListHandler)
	mux.HandleFunc("GET /api/content/news/", newsDetailHandler)
	mux.HandleFunc("GET /api/content/news/{slug}", newsDetailHandler)
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type errorResponse struct {
	ErrorCode string `json:"error_code"`
	Message   string `json:"message"`
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	var req loginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, errorResponse{
			ErrorCode: "INVALID_PAYLOAD",
			Message:   "Invalid request body",
		})
		return
	}

	// TODO: Replace placeholder logic with real authentication and hashing.
	if req.Email == "" || req.Password == "" {
		writeJSON(w, http.StatusUnauthorized, errorResponse{
			ErrorCode: "INVALID_CREDENTIALS",
			Message:   "Invalid email or password.",
		})
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"token": "placeholder-token",
		"user": map[string]any{
			"id":    uuid.NewString(),
			"email": req.Email,
			"name":  "Example User",
		},
	})
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}
