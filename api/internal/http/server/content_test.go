package server

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestNewsListHandler(t *testing.T) {
	// Content handlers don't use auth yet, so we can pass nil or a mock
	srv := NewServer(nil)
	mux := http.NewServeMux()
	srv.RegisterRoutes(mux)

	t.Run("Default query", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/api/content/news", nil)
		rr := httptest.NewRecorder()

		mux.ServeHTTP(rr, req)

		if rr.Code != http.StatusOK {
			t.Errorf("handler returned wrong status code: got %v want %v", rr.Code, http.StatusOK)
		}

		var resp newsListResponse
		if err := json.NewDecoder(rr.Body).Decode(&resp); err != nil {
			t.Fatalf("failed to decode response: %v", err)
		}

		if len(resp.Items) != 10 {
			t.Errorf("expected 10 items, got %d", len(resp.Items))
		}
		if resp.Page != 1 {
			t.Errorf("expected page 1, got %d", resp.Page)
		}
	})

	t.Run("Pagination", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/api/content/news?page=2&page_size=5", nil)
		rr := httptest.NewRecorder()

		mux.ServeHTTP(rr, req)

		if rr.Code != http.StatusOK {
			t.Errorf("handler returned wrong status code: got %v want %v", rr.Code, http.StatusOK)
		}

		var resp newsListResponse
		if err := json.NewDecoder(rr.Body).Decode(&resp); err != nil {
			t.Fatalf("failed to decode response: %v", err)
		}

		if len(resp.Items) != 5 {
			t.Errorf("expected 5 items, got %d", len(resp.Items))
		}
		if resp.Page != 2 {
			t.Errorf("expected page 2, got %d", resp.Page)
		}
	})

	t.Run("Filtering", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/api/content/news?category=Tools", nil)
		rr := httptest.NewRecorder()

		mux.ServeHTTP(rr, req)

		if rr.Code != http.StatusOK {
			t.Errorf("handler returned wrong status code: got %v want %v", rr.Code, http.StatusOK)
		}

		var resp newsListResponse
		if err := json.NewDecoder(rr.Body).Decode(&resp); err != nil {
			t.Fatalf("failed to decode response: %v", err)
		}

		for _, item := range resp.Items {
			found := false
			for _, tag := range item.Tags {
				if tag == "Tools" {
					found = true
					break
				}
			}
			if !found {
				t.Errorf("expected item to have tag 'Tools', got %v", item.Tags)
			}
		}
	})

	t.Run("Invalid Query", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/api/content/news?page=invalid", nil)
		rr := httptest.NewRecorder()

		mux.ServeHTTP(rr, req)

		if rr.Code != http.StatusBadRequest {
			t.Errorf("handler returned wrong status code: got %v want %v", rr.Code, http.StatusBadRequest)
		}
	})
}

func TestNewsDetailHandler(t *testing.T) {
	srv := NewServer(nil)
	mux := http.NewServeMux()
	srv.RegisterRoutes(mux)

	t.Run("Valid Slug", func(t *testing.T) {
		// We know "ai-dala-master-class-0" should exist from the seed
		slug := "ai-dala-master-class-0"
		req := httptest.NewRequest("GET", "/api/content/news/"+slug, nil)
		rr := httptest.NewRecorder()

		mux.ServeHTTP(rr, req)

		if rr.Code != http.StatusOK {
			t.Errorf("handler returned wrong status code: got %v want %v", rr.Code, http.StatusOK)
		}

		var item newsItem
		if err := json.NewDecoder(rr.Body).Decode(&item); err != nil {
			t.Fatalf("failed to decode response: %v", err)
		}

		if item.Slug != slug {
			t.Errorf("expected slug %s, got %s", slug, item.Slug)
		}
	})

	t.Run("Invalid Slug", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/api/content/news/non-existent-slug", nil)
		rr := httptest.NewRecorder()

		mux.ServeHTTP(rr, req)

		if rr.Code != http.StatusNotFound {
			t.Errorf("handler returned wrong status code: got %v want %v", rr.Code, http.StatusNotFound)
		}
	})
}
