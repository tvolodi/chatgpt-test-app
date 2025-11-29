package tags

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
)

type mockService struct {
	tags []Tag
	err  error
}

func (m *mockService) ListTags() ([]Tag, error) {
	return m.tags, m.err
}

func (m *mockService) GetTagByCode(code string) (*Tag, error) {
	if m.err != nil {
		return nil, m.err
	}
	for _, t := range m.tags {
		if t.Code == code {
			return &t, nil
		}
	}
	return nil, nil
}

func (m *mockService) CreateTag(code string, name map[string]interface{}) (*Tag, error) {
	if m.err != nil {
		return nil, m.err
	}
	tag := Tag{ID: "new-id", Code: code, Name: []byte(`{}`)}
	m.tags = append(m.tags, tag)
	return &tag, nil
}

func (m *mockService) UpdateTag(oldCode, newCode string, name map[string]interface{}) (*Tag, error) {
	if m.err != nil {
		return nil, m.err
	}
	for i, t := range m.tags {
		if t.Code == oldCode {
			m.tags[i].Code = newCode
			return &m.tags[i], nil
		}
	}
	return nil, nil
}

func (m *mockService) DeleteTag(code string) error {
	if m.err != nil {
		return m.err
	}
	for i, t := range m.tags {
		if t.Code == code {
			m.tags = append(m.tags[:i], m.tags[i+1:]...)
			return nil
		}
	}
	return errors.New("not found")
}

func (m *mockService) ListTagsWithPagination(limit, offset int, search string) (*PaginatedTagsResponse, error) {
	if m.err != nil {
		return nil, m.err
	}

	// Simple mock implementation - just return all tags with pagination info
	total := len(m.tags)
	hasMore := offset+limit < total

	return &PaginatedTagsResponse{
		Tags:    m.tags,
		Total:   total,
		HasMore: hasMore,
	}, nil
}

func TestHandler_ListTags(t *testing.T) {
	h := NewHandler(&mockService{tags: []Tag{{ID: "1", Code: "tag1", Name: []byte(`{"en":"Tag One"}`)}}})
	req := httptest.NewRequest(http.MethodGet, "/api/tags", nil)
	w := httptest.NewRecorder()
	h.ListTags(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", w.Code)
	}
	var resp []Tag
	if err := json.NewDecoder(w.Body).Decode(&resp); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}
	if len(resp) != 1 || resp[0].Code != "tag1" {
		t.Fatalf("unexpected response: %+v", resp)
	}
}

func TestHandler_GetTagByCode_Found(t *testing.T) {
	h := NewHandler(&mockService{tags: []Tag{{ID: "1", Code: "tag1", Name: []byte(`{"en":"Tag One"}`)}}})
	req := httptest.NewRequest(http.MethodGet, "/api/tags/tag1", nil)
	w := httptest.NewRecorder()
	h.GetTagByCode(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", w.Code)
	}
	var resp Tag
	if err := json.NewDecoder(w.Body).Decode(&resp); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}
	if resp.Code != "tag1" {
		t.Fatalf("unexpected tag code: %s", resp.Code)
	}
}

func TestHandler_GetTagByCode_NotFound(t *testing.T) {
	h := NewHandler(&mockService{tags: []Tag{{ID: "1", Code: "tag1", Name: []byte(`{"en":"Tag One"}`)}}})
	req := httptest.NewRequest(http.MethodGet, "/api/tags/missing", nil)
	w := httptest.NewRecorder()
	h.GetTagByCode(w, req)
	if w.Code != http.StatusNotFound {
		t.Fatalf("expected status 404, got %d", w.Code)
	}
}

func TestHandler_ErrorPropagation(t *testing.T) {
	h := NewHandler(&mockService{err: errors.New("service error")})
	// ListTags error
	req1 := httptest.NewRequest(http.MethodGet, "/api/tags", nil)
	w1 := httptest.NewRecorder()
	h.ListTags(w1, req1)
	if w1.Code != http.StatusInternalServerError {
		t.Fatalf("expected 500 for ListTags error, got %d", w1.Code)
	}
	// GetTagByCode error
	req2 := httptest.NewRequest(http.MethodGet, "/api/tags/any", nil)
	w2 := httptest.NewRecorder()
	h.GetTagByCode(w2, req2)
	if w2.Code != http.StatusInternalServerError {
		t.Fatalf("expected 500 for GetTagByCode error, got %d", w2.Code)
	}
}
