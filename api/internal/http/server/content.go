package server

import (
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"
)

type newsItem struct {
	ID          string   `json:"id"`
	Slug        string   `json:"slug"`
	Title       string   `json:"title"`
	Summary     string   `json:"summary"`
	Body        string   `json:"body"`
	URL         string   `json:"url"`
	Image       string   `json:"image"`
	PublishedAt string   `json:"published_at"`
	Tags        []string `json:"tags,omitempty"`
}

type newsListResponse struct {
	Items    []newsItem `json:"items"`
	Total    int        `json:"total"`
	Page     int        `json:"page"`
	PageSize int        `json:"page_size"`
}

func newsListHandler(w http.ResponseWriter, r *http.Request) {
	page, pageSize, category, err := parseNewsQuery(r.URL.Query())
	if err != nil {
		writeJSON(w, http.StatusBadRequest, errorResponse{ErrorCode: "INVALID_QUERY", Message: err.Error()})
		return
	}

	source := seedNews()
	filtered := filterNews(source, category)
	sorted := sortNews(filtered)
	total := len(sorted)

	start := (page - 1) * pageSize
	if start > total {
		start = total
	}
	end := start + pageSize
	if end > total {
		end = total
	}

	resp := newsListResponse{
		Items:    sorted[start:end],
		Total:    total,
		Page:     page,
		PageSize: pageSize,
	}

	writeJSON(w, http.StatusOK, resp)
}

func newsDetailHandler(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(strings.TrimPrefix(r.URL.Path, "/api/content/news/"), "/")
	if len(parts) == 0 || parts[0] == "" {
		writeJSON(w, http.StatusNotFound, errorResponse{ErrorCode: "NOT_FOUND", Message: "news not found"})
		return
	}
	slug := parts[0]
	for _, item := range seedNews() {
		if item.Slug == slug {
			writeJSON(w, http.StatusOK, item)
			return
		}
	}
	writeJSON(w, http.StatusNotFound, errorResponse{ErrorCode: "NOT_FOUND", Message: "news not found"})
}

func parseNewsQuery(q url.Values) (page int, pageSize int, category string, err error) {
	page = 1
	pageSize = 10
	if p := q.Get("page"); p != "" {
		if page, err = strconv.Atoi(p); err != nil || page < 1 {
			return 0, 0, "", err
		}
	}
	if ps := q.Get("page_size"); ps != "" {
		if pageSize, err = strconv.Atoi(ps); err != nil || pageSize < 1 || pageSize > 50 {
			return 0, 0, "", err
		}
	}
	category = q.Get("category")
	return
}

func filterNews(items []newsItem, category string) []newsItem {
	if category == "" {
		return items
	}
	out := make([]newsItem, 0, len(items))
	for _, item := range items {
		for _, tag := range item.Tags {
			if tag == category {
				out = append(out, item)
				break
			}
		}
	}
	return out
}

func sortNews(items []newsItem) []newsItem {
	sorted := make([]newsItem, len(items))
	copy(sorted, items)
	for i := 1; i < len(sorted); i++ {
		j := i
		for j > 0 && publishedAfter(sorted[j].PublishedAt, sorted[j-1].PublishedAt) {
			sorted[j], sorted[j-1] = sorted[j-1], sorted[j]
			j--
		}
	}
	return sorted
}

func publishedAfter(a, b string) bool {
	at, _ := time.Parse(time.RFC3339, a)
	bt, _ := time.Parse(time.RFC3339, b)
	return at.After(bt)
}

func seedNews() []newsItem {
	base := []newsItem{
		{
			ID:          "news-001",
			Slug:        "ai-dala-master-class",
			Title:       "AI-Dala launches master-class series",
			Summary:     "(API) New live sessions on building AI-first products with the AI-Dala stack.",
			Body:        "# AI-Dala launches master-class series\n\nJoin live sessions on building AI-first products.",
			URL:         "/news/ai-dala-master-class",
			Image:       "/AI-Dala-logo.png",
			PublishedAt: "2025-11-15T09:00:00Z",
			Tags:        []string{"AI-Dala updates"},
		},
		{
			ID:          "news-002",
			Slug:        "ai-search-milestone",
			Title:       "AI search pipeline reaches milestone",
			Summary:     "Hybrid search and embeddings now power content discovery across the platform.",
			Body:        "# AI search milestone\n\nHybrid search and embeddings drive discovery across AI-Dala.",
			URL:         "/news/ai-search-milestone",
			Image:       "/AI-Dala-logo.png",
			PublishedAt: "2025-11-10T12:00:00Z",
			Tags:        []string{"Tools"},
		},
		{
			ID:          "news-003",
			Slug:        "community-spotlight",
			Title:       "Community spotlight: creators from the Steppe",
			Summary:     "Entrepreneurs, developers, and students share their AI-Dala journeys.",
			Body:        "# Community spotlight\n\nStories from entrepreneurs, developers, and students.",
			URL:         "/news/community-spotlight",
			Image:       "/AI-Dala-logo.png",
			PublishedAt: "2025-11-05T08:30:00Z",
			Tags:        []string{"Market"},
		},
		{
			ID:          "news-004",
			Slug:        "openai-updates",
			Title:       "OpenAI updates and opportunities",
			Summary:     "Key OpenAI releases and how AI-Dala integrates them.",
			Body:        "# OpenAI updates\n\nKey releases and AI-Dala integrations.",
			URL:         "/news/openai-updates",
			Image:       "/AI-Dala-logo.png",
			PublishedAt: "2025-11-12T10:00:00Z",
			Tags:        []string{"OpenAI"},
		},
		{
			ID:          "news-005",
			Slug:        "tooling-roundup",
			Title:       "Tooling roundup for AI builders",
			Summary:     "Best tools and practices for AI-Dala developers.",
			Body:        "# Tooling roundup\n\nBest tools and practices for AI-Dala developers.",
			URL:         "/news/tooling-roundup",
			Image:       "/AI-Dala-logo.png",
			PublishedAt: "2025-11-08T14:30:00Z",
			Tags:        []string{"Tools"},
		},
	}

	items := make([]newsItem, 0, 32)
	now := time.Now()
	categories := []string{"OpenAI", "Tools", "Market", "AI-Dala updates"}
	for i := 0; i < 32; i++ {
		ref := base[i%len(base)]
		slug := strings.ToLower(ref.Slug + "-" + strconv.Itoa(i))
		published := now.Add(time.Duration(-i) * 24 * time.Hour).Format(time.RFC3339)
		items = append(items, newsItem{
			ID:          ref.ID + "-" + strconv.Itoa(i),
			Slug:        slug,
			Title:       ref.Title + " #" + strconv.Itoa(i+1),
			Summary:     ref.Summary,
			Body:        ref.Body,
			URL:         "/news/" + slug,
			Image:       ref.Image,
			PublishedAt: published,
			Tags:        []string{categories[i%len(categories)]},
		})
	}
	return items
}
