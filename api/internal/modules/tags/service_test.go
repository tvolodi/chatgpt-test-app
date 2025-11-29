package tags

import (
	"errors"
	"testing"
)

type mockRepo struct {
	tags []Tag
	err  error
}

func (m *mockRepo) FindAll() ([]Tag, error) {
	return m.tags, m.err
}

func (m *mockRepo) FindByCode(code string) (*Tag, error) {
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

func (m *mockRepo) Create(code string, name map[string]interface{}) (*Tag, error) {
	if m.err != nil {
		return nil, m.err
	}
	tag := Tag{ID: "new-id", Code: code, Name: []byte(`{}`)}
	m.tags = append(m.tags, tag)
	return &tag, nil
}

func (m *mockRepo) Update(oldCode, newCode string, name map[string]interface{}) (*Tag, error) {
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

func (m *mockRepo) FindAllWithPagination(limit, offset int, search string) ([]Tag, int, error) {
	if m.err != nil {
		return nil, 0, m.err
	}

	// Simple mock implementation - just return all tags
	return m.tags, len(m.tags), nil
}

func (m *mockRepo) Delete(code string) error {
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

func TestService_ListTags(t *testing.T) {
	repo := &mockRepo{tags: []Tag{{ID: "1", Code: "tag1", Name: []byte(`{"en":"Tag One"}`)}}}
	svc := NewService(repo)
	tags, err := svc.ListTags()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(tags) != 1 || tags[0].Code != "tag1" {
		t.Fatalf("unexpected tags returned: %+v", tags)
	}
}

func TestService_GetTagByCode_Found(t *testing.T) {
	repo := &mockRepo{tags: []Tag{{ID: "1", Code: "tag1", Name: []byte(`{"en":"Tag One"}`)}}}
	svc := NewService(repo)
	tag, err := svc.GetTagByCode("tag1")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if tag == nil || tag.Code != "tag1" {
		t.Fatalf("expected tag with code 'tag1', got %+v", tag)
	}
}

func TestService_GetTagByCode_NotFound(t *testing.T) {
	repo := &mockRepo{tags: []Tag{{ID: "1", Code: "tag1", Name: []byte(`{"en":"Tag One"}`)}}}
	svc := NewService(repo)
	tag, err := svc.GetTagByCode("missing")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if tag != nil {
		t.Fatalf("expected nil tag for missing code, got %+v", tag)
	}
}

func TestService_ErrorPropagation(t *testing.T) {
	repo := &mockRepo{err: errors.New("db error")}
	svc := NewService(repo)
	if _, err := svc.ListTags(); err == nil {
		t.Fatalf("expected error from ListTags")
	}
	if _, err := svc.GetTagByCode("any"); err == nil {
		t.Fatalf("expected error from GetTagByCode")
	}
}
