package server

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"

	"github.com/ai-dala/api/internal/auth"
	"github.com/ai-dala/api/internal/modules/articles"
	"github.com/ai-dala/api/internal/modules/categories"
	"github.com/ai-dala/api/internal/modules/tags"
	"github.com/ai-dala/api/internal/modules/uploads"
	"github.com/google/uuid"
)

type Server struct {
	auth              auth.Service
	tagsHandler       *tags.Handler
	categoriesHandler *categories.Handler
	articlesHandler   *articles.Handler
	uploadsHandler    *uploads.Handler
}

func NewServer(authService auth.Service, tagsHandler *tags.Handler, categoriesHandler *categories.Handler, articlesHandler *articles.Handler, uploadsHandler *uploads.Handler) *Server {
	return &Server{
		auth:              authService,
		tagsHandler:       tagsHandler,
		categoriesHandler: categoriesHandler,
		articlesHandler:   articlesHandler,
		uploadsHandler:    uploadsHandler,
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
	mux.HandleFunc("GET /api/content/articles", articlesListHandler)
	mux.HandleFunc("GET /api/content/articles/", articlesDetailHandler)
	mux.HandleFunc("GET /api/content/articles/{slug}", articlesDetailHandler)

	// Test auth endpoint (only in test environment)
	if os.Getenv("ENV") == "test" {
		mux.HandleFunc("POST /api/auth/test-token", s.testTokenHandler)
	}

	// Tag routes (optional)
	if s.tagsHandler != nil {
		mux.HandleFunc("GET /api/tags", s.tagsHandler.ListTags)
		mux.HandleFunc("GET /api/tags/{code}", s.tagsHandler.GetTagByCode)
		mux.HandleFunc("POST /api/tags", s.tagsHandler.CreateTag)
		mux.HandleFunc("PUT /api/tags/{code}", s.tagsHandler.UpdateTag)
		mux.HandleFunc("DELETE /api/tags/{code}", s.tagsHandler.DeleteTag)
	}

	// Categories routes
	if s.categoriesHandler != nil {
		mux.HandleFunc("GET /api/categories", s.categoriesHandler.ListCategories)
		mux.HandleFunc("POST /api/categories", s.categoriesHandler.CreateCategory)
		mux.HandleFunc("GET /api/categories/{id}", s.categoriesHandler.GetCategory)
		mux.HandleFunc("PUT /api/categories/{id}", s.categoriesHandler.UpdateCategory)
		mux.HandleFunc("DELETE /api/categories/{id}", s.categoriesHandler.DeleteCategory)
	}

	// Articles routes
	if s.articlesHandler != nil {
		s.articlesHandler.RegisterRoutes(mux)
	}

	// Uploads routes
	if s.uploadsHandler != nil {
		s.uploadsHandler.RegisterRoutes(mux)
	}

	// Protected routes
	mux.Handle("GET /api/protected/resource", auth.Middleware(http.HandlerFunc(s.protectedHandler)))
}

func (s *Server) protectedHandler(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"message": "You have accessed a protected resource!"})
}

// testTokenHandler provides test authentication for E2E tests (only available in test environment)
func (s *Server) testTokenHandler(w http.ResponseWriter, r *http.Request) {
	if os.Getenv("ENV") != "test" {
		writeJSON(w, http.StatusForbidden, errorResponse{
			ErrorCode: "FORBIDDEN",
			Message:   "Test endpoint only available in test environment",
		})
		return
	}

	var req struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, errorResponse{
			ErrorCode: "INVALID_REQUEST",
			Message:   "Invalid request body",
		})
		return
	}

	// Validate test credentials
	validUsers := map[string]string{
		"testuser":        "test123",
		"ai-admin":        "admin123",
		"content_manager": "content123",
	}

	password, exists := validUsers[req.Username]
	if !exists || password != req.Password {
		writeJSON(w, http.StatusUnauthorized, errorResponse{
			ErrorCode: "INVALID_CREDENTIALS",
			Message:   "Invalid test credentials",
		})
		return
	}

	// Get token from Keycloak programmatically
	token, err := s.getKeycloakToken(req.Username, req.Password)
	if err != nil {
		log.Printf("Failed to get Keycloak token for test user %s: %v", req.Username, err)
		writeJSON(w, http.StatusInternalServerError, errorResponse{
			ErrorCode: "TOKEN_ERROR",
			Message:   "Failed to obtain authentication token",
		})
		return
	}

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"token": token,
		"user": map[string]string{
			"username": req.Username,
		},
	})
}

// getKeycloakToken obtains an access token from Keycloak for test users
func (s *Server) getKeycloakToken(username, password string) (string, error) {
	issuer := os.Getenv("KEYCLOAK_ISSUER")
	clientID := os.Getenv("KEYCLOAK_CLIENT_ID")
	clientSecret := os.Getenv("KEYCLOAK_CLIENT_SECRET")

	if issuer == "" || clientID == "" {
		return "", fmt.Errorf("Keycloak configuration missing")
	}

	tokenURL := issuer + "/protocol/openid-connect/token"

	data := url.Values{}
	data.Set("grant_type", "password")
	data.Set("client_id", clientID)
	data.Set("username", username)
	data.Set("password", password)
	data.Set("scope", "openid profile email")

	if clientSecret != "" {
		data.Set("client_secret", clientSecret)
	}

	resp, err := http.PostForm(tokenURL, data)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("Keycloak returned status %d", resp.StatusCode)
	}

	var tokenResp struct {
		AccessToken string `json:"access_token"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&tokenResp); err != nil {
		return "", err
	}

	return tokenResp.AccessToken, nil
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
