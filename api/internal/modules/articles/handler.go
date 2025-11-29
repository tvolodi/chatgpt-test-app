package articles

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/ai-dala/api/internal/auth"
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
	mux.HandleFunc("GET /api/articles/public", h.handlePublicList)
	mux.HandleFunc("GET /api/articles/{id}", h.handleGet)
	mux.Handle("POST /api/articles", auth.Middleware(http.HandlerFunc(h.handleCreate)))
	mux.Handle("PUT /api/articles/{id}", auth.Middleware(http.HandlerFunc(h.handleUpdate)))
	mux.Handle("POST /api/articles/{id}/publish", auth.Middleware(http.HandlerFunc(h.handlePublish)))
	mux.Handle("DELETE /api/articles/{id}", auth.Middleware(http.HandlerFunc(h.handleDelete)))
	mux.HandleFunc("GET /api/articles-by-slug/{slug}", h.handleGetBySlug)
	mux.Handle("POST /api/articles/{id}/tags", auth.Middleware(http.HandlerFunc(h.handleAddTags)))
	mux.Handle("DELETE /api/articles/{id}/tags", auth.Middleware(http.HandlerFunc(h.handleRemoveTags)))

	// Interaction routes
	mux.Handle("POST /api/articles/{id}/comments", auth.Middleware(http.HandlerFunc(h.handleAddComment)))
	mux.HandleFunc("GET /api/articles/{id}/comments", h.handleGetComments)
	mux.Handle("POST /api/articles/{id}/like", auth.Middleware(http.HandlerFunc(h.handleAddLike)))
	mux.Handle("DELETE /api/articles/{id}/like", auth.Middleware(http.HandlerFunc(h.handleRemoveLike)))
	mux.HandleFunc("GET /api/articles/{id}/interactions", h.handleGetInteractions)

// Search route
mux.HandleFunc("GET /api/articles/search", h.handleSearch)

// Test route for creating articles without auth (for E2E tests)
mux.HandleFunc("POST /api/test/articles", h.handleCreateTest)
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

	tags := r.URL.Query()["tags"]

	articles, total, err := h.service.FindAll(status, categoryID, authorID, tags, limit, offset)
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

// handlePublicList lists published articles for public view
func (h *Handler) handlePublicList(w http.ResponseWriter, r *http.Request) {
	limitStr := r.URL.Query().Get("limit")
	limit := 10
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

	categoryID := r.URL.Query().Get("category_id")
	tags := r.URL.Query()["tags"]

	articles, total, err := h.service.GetPublicArticles(categoryID, tags, limit, offset)
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

	authorID, err := auth.GetUserIDFromContext(r.Context())
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

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

	// Get tags for response
	tags, err := h.service.GetTags(article.ID)
	if err != nil {
		tags = []string{}
	}

	response := map[string]interface{}{
		"article": article,
		"tags":    tags,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
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

	// Get tags for response
	tags, err := h.service.GetTags(id)
	if err != nil {
		tags = []string{}
	}

	response := map[string]interface{}{
		"article": updated,
		"tags":    tags,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
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

	// Get tags for response
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

// handleAddComment adds a comment to an article
func (h *Handler) handleAddComment(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	userID, err := auth.GetUserIDFromContext(r.Context())
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	var req struct {
		Body string `json:"body"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	comment, err := h.service.AddComment(id, userID, req.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(comment)
}

// handleGetComments retrieves comments for an article
func (h *Handler) handleGetComments(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	comments, err := h.service.GetComments(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if comments == nil {
		comments = []Comment{}
	}

	response := map[string]interface{}{
		"comments": comments,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// handleAddLike adds a like/dislike
func (h *Handler) handleAddLike(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	userID, err := auth.GetUserIDFromContext(r.Context())
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	var req struct {
		IsLike bool `json:"is_like"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if err := h.service.AddLike(id, userID, req.IsLike); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// handleRemoveLike removes a like/dislike
func (h *Handler) handleRemoveLike(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	userID, err := auth.GetUserIDFromContext(r.Context())
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	if err := h.service.RemoveLike(id, userID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// handleGetInteractions retrieves interaction stats
func (h *Handler) handleGetInteractions(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	likes, dislikes, err := h.service.GetLikesCount(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"likes":    likes,
		"dislikes": dislikes,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// handleSearch performs full-text search on articles
func (h *Handler) handleSearch(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")
	if query == "" {
		http.Error(w, "query parameter 'q' is required", http.StatusBadRequest)
		return
	}

	categoryID := r.URL.Query().Get("category_id")
	tags := r.URL.Query()["tags"]

	limitStr := r.URL.Query().Get("limit")
	limit := 10
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 && l <= 50 {
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

	results, total, err := h.service.Search(query, categoryID, tags, limit, offset)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"articles": results,
		"total":    total,
		"page":     page,
		"limit":    limit,
		"query":    query,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// handleCreateTest creates a new article without auth (for E2E tests)
func (h *Handler) handleCreateTest(w http.ResponseWriter, r *http.Request) {
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

	// Use a test author ID
	authorID := "test-user-id"

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

	// Publish the article for testing
	if err := h.service.Publish(article.ID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Get tags for response
	tags, err := h.service.GetTags(article.ID)
	if err != nil {
		tags = []string{}
	}

	response := map[string]interface{}{
		"article": article,
		"tags":    tags,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}
