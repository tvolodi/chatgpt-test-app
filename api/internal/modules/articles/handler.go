package articles

import (
	"encoding/json"
	"net/http"
	"strconv"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

// RegisterRoutes registers all article routes
func (h *Handler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /api/articles", h.handleList)
	mux.HandleFunc("GET /api/articles/{id}", h.handleGet)
	mux.HandleFunc("POST /api/articles", h.handleCreate)
	mux.HandleFunc("PUT /api/articles/{id}", h.handleUpdate)
	mux.HandleFunc("POST /api/articles/{id}/publish", h.handlePublish)
	mux.HandleFunc("DELETE /api/articles/{id}", h.handleDelete)
	mux.HandleFunc("GET /api/articles/slug/{slug}", h.handleGetBySlug)
	mux.HandleFunc("POST /api/articles/{id}/tags", h.handleAddTags)
	mux.HandleFunc("DELETE /api/articles/{id}/tags", h.handleRemoveTags)
}

// handleList lists all articles with filters
func (h *Handler) handleList(w http.ResponseWriter, r *http.Request) {
	status := r.URL.Query().Get("status")
	categoryID := r.URL.Query().Get("category_id")
	authorID := r.URL.Query().Get("author_id")

	limitStr := r.URL.Query().Get("limit")
	limit := 20
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
		}
	}

	pageStr := r.URL.Query().Get("page")
	page := 1
	if pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
			page = p
		}
	}
	offset := (page - 1) * limit

	articles, total, err := h.service.FindAll(status, categoryID, authorID, limit, offset)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Get tags for each article
	type ArticleWithTags struct {
		Article
		Tags []string `json:"tags"`
	}

	articlesWithTags := make([]ArticleWithTags, len(articles))
	for i, article := range articles {
		tags, err := h.service.GetTags(article.ID)
		if err != nil {
			tags = []string{}
		}
		articlesWithTags[i] = ArticleWithTags{
			Article: article,
			Tags:    tags,
		}
	}

	response := map[string]interface{}{
		"articles": articlesWithTags,
		"total":    total,
		"page":     page,
		"limit":    limit,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// handleGet retrieves a single article
func (h *Handler) handleGet(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	article, err := h.service.FindByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if article == nil {
		http.Error(w, "article not found", http.StatusNotFound)
		return
	}

	// Get tags
	tags, err := h.service.GetTags(id)
	if err != nil {
		tags = []string{}
	}

	response := map[string]interface{}{
		"article": article,
		"tags":    tags,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// handleGetBySlug retrieves a single article by slug
func (h *Handler) handleGetBySlug(w http.ResponseWriter, r *http.Request) {
	slug := r.PathValue("slug")

	article, err := h.service.FindBySlug(slug)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if article == nil {
		http.Error(w, "article not found", http.StatusNotFound)
		return
	}

	// Get tags
	tags, err := h.service.GetTags(article.ID)
	if err != nil {
		tags = []string{}
	}

	response := map[string]interface{}{
		"article": article,
		"tags":    tags,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// handleCreate creates a new article
func (h *Handler) handleCreate(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Title      string   `json:"title"`
		Body       string   `json:"body"`
		CategoryID *string  `json:"category_id"`
		TagIDs     []string `json:"tag_ids"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	// TODO: Get author_id from auth context
	// For now, use a fixed UUID to satisfy DB constraints
	authorID := "00000000-0000-0000-0000-000000000001"

	article := &Article{
		Title:      req.Title,
		Body:       req.Body,
		CategoryID: req.CategoryID,
		AuthorID:   authorID,
		Status:     "DRAFT",
	}

	if err := h.service.Create(article); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Add tags if provided
	if len(req.TagIDs) > 0 {
		if err := h.service.AddTags(article.ID, req.TagIDs); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(article)
}

// handleUpdate updates an existing article
func (h *Handler) handleUpdate(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	var req struct {
		Title      string   `json:"title"`
		Body       string   `json:"body"`
		CategoryID *string  `json:"category_id"`
		Status     string   `json:"status"`
		TagIDs     []string `json:"tag_ids"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	article := &Article{
		Title:      req.Title,
		Body:       req.Body,
		CategoryID: req.CategoryID,
		Status:     req.Status,
	}

	if err := h.service.Update(id, article); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Update tags if provided
	if req.TagIDs != nil {
		// Remove all existing tags
		existingTags, _ := h.service.GetTags(id)
		if len(existingTags) > 0 {
			h.service.RemoveTags(id, existingTags)
		}
		// Add new tags
		if len(req.TagIDs) > 0 {
			if err := h.service.AddTags(id, req.TagIDs); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}
	}

	// Fetch updated article
	updated, err := h.service.FindByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(updated)
}

// handlePublish publishes an article
func (h *Handler) handlePublish(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	if err := h.service.Publish(id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	article, err := h.service.FindByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(article)
}

// handleDelete soft deletes an article
func (h *Handler) handleDelete(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	if err := h.service.Delete(id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// handleAddTags adds tags to an article
func (h *Handler) handleAddTags(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	var req struct {
		TagIDs []string `json:"tag_ids"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if err := h.service.AddTags(id, req.TagIDs); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// handleRemoveTags removes tags from an article
func (h *Handler) handleRemoveTags(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	var req struct {
		TagIDs []string `json:"tag_ids"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if err := h.service.RemoveTags(id, req.TagIDs); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
