package articles

import (
	"errors"
	"regexp"
	"strings"
	"time"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

// Create creates a new article
func (s *Service) Create(article *Article) error {
	// Set default status if not provided
	if article.Status == "" {
		article.Status = "DRAFT"
	}

	// Generate slug if empty
	if article.Slug == "" {
		article.Slug = generateSlug(article.Title)
	}

	// Validate status
	if article.Status != "DRAFT" && article.Status != "PUBLISHED" && article.Status != "ARCHIVED" {
		return errors.New("invalid status: must be DRAFT, PUBLISHED, or ARCHIVED")
	}

	return s.repo.Create(article)
}

// FindByID retrieves an article by ID
func (s *Service) FindByID(id string) (*Article, error) {
	return s.repo.FindByID(id)
}

// FindBySlug retrieves an article by slug
func (s *Service) FindBySlug(slug string) (*Article, error) {
	return s.repo.FindBySlug(slug)
}

// FindAll retrieves all articles with filters
func (s *Service) FindAll(status, categoryID, authorID string, limit, offset int) ([]Article, int, error) {
	articles, err := s.repo.FindAll(status, categoryID, authorID, limit, offset)
	if err != nil {
		return nil, 0, err
	}

	count, err := s.repo.Count(status, categoryID, authorID)
	if err != nil {
		return nil, 0, err
	}

	return articles, count, nil
}

// Update updates an existing article
func (s *Service) Update(id string, article *Article) error {
	// Validate status if provided
	if article.Status != "" && article.Status != "DRAFT" && article.Status != "PUBLISHED" && article.Status != "ARCHIVED" {
		return errors.New("invalid status: must be DRAFT, PUBLISHED, or ARCHIVED")
	}

	// Generate slug if empty and title is present
	if article.Slug == "" && article.Title != "" {
		article.Slug = generateSlug(article.Title)
	}

	return s.repo.Update(id, article)
}

// Publish publishes an article
func (s *Service) Publish(id string) error {
	article, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}
	if article == nil {
		return errors.New("article not found")
	}

	article.Status = "PUBLISHED"
	now := time.Now()
	article.PublishedAt = &now

	return s.repo.Update(id, article)
}

// Delete soft deletes an article
func (s *Service) Delete(id string) error {
	return s.repo.Delete(id)
}

// AddTags adds tags to an article
func (s *Service) AddTags(articleID string, tagIDs []string) error {
	return s.repo.AddTags(articleID, tagIDs)
}

// RemoveTags removes tags from an article
func (s *Service) RemoveTags(articleID string, tagIDs []string) error {
	return s.repo.RemoveTags(articleID, tagIDs)
}

// GetTags retrieves all tags for an article
func (s *Service) GetTags(articleID string) ([]string, error) {
	return s.repo.GetTags(articleID)
}

// generateSlug creates a URL-friendly slug from a string
func generateSlug(s string) string {
	s = strings.ToLower(s)
	// Remove invalid characters
	reg := regexp.MustCompile("[^a-z0-9]+")
	s = reg.ReplaceAllString(s, "-")
	// Trim dashes
	s = strings.Trim(s, "-")
	return s
}
