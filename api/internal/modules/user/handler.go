package user

import (
	"encoding/json"
	"net/http"

	"github.com/ai-dala/api/internal/auth"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

// RegisterRoutes registers user routes
func (h *Handler) RegisterRoutes(mux *http.ServeMux) {
	mux.Handle("GET /api/user/activity", auth.Middleware(http.HandlerFunc(h.handleGetActivity)))
}

// handleGetActivity retrieves user's recent activity
func (h *Handler) handleGetActivity(w http.ResponseWriter, r *http.Request) {
	userID, err := auth.GetUserIDFromContext(r.Context())
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	activity, err := h.service.GetUserActivity(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(activity)
}
