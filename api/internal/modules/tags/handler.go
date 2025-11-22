package tags

import (
	"encoding/json"
	"net/http"
	"strings"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) ListTags(w http.ResponseWriter, r *http.Request) {
	tags, err := h.service.ListTags()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tags)
}

func (h *Handler) GetTagByCode(w http.ResponseWriter, r *http.Request) {
	// Try router extraction first
	code := r.PathValue("code")
	// Fallback for direct handler calls in tests (no router)
	if code == "" {
		parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
		if len(parts) > 0 {
			code = parts[len(parts)-1]
		}
	}
	if code == "" {
		http.Error(w, "code is required", http.StatusBadRequest)
		return
	}

	tag, err := h.service.GetTagByCode(code)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if tag == nil {
		http.Error(w, "tag not found", http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tag)
}

func (h *Handler) CreateTag(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Code string                 `json:"code"`
		Name map[string]interface{} `json:"name"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if input.Code == "" {
		http.Error(w, "code is required", http.StatusBadRequest)
		return
	}

	tag, err := h.service.CreateTag(input.Code, input.Name)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(tag)
}

func (h *Handler) UpdateTag(w http.ResponseWriter, r *http.Request) {
	code := r.PathValue("code")
	if code == "" {
		http.Error(w, "code is required", http.StatusBadRequest)
		return
	}

	var input struct {
		Code string                 `json:"code"`
		Name map[string]interface{} `json:"name"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	tag, err := h.service.UpdateTag(code, input.Code, input.Name)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tag)
}

func (h *Handler) DeleteTag(w http.ResponseWriter, r *http.Request) {
	code := r.PathValue("code")
	if code == "" {
		http.Error(w, "code is required", http.StatusBadRequest)
		return
	}

	if err := h.service.DeleteTag(code); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
