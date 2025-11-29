package articles

import (
	"errors"
	"fmt"
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
		baseSlug := generateSlug(article.Title)
		article.Slug = baseSlug

		// Ensure uniqueness
		for i := 0; ; i++ {
			existing, err := s.repo.FindBySlug(article.Slug)
			if err != nil {
				return err
			}
			if existing == nil {
				break
			}
			// Slug exists, append counter
			article.Slug = fmt.Sprintf("%s-%d", baseSlug, i+1)
		}
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
func (s *Service) FindAll(status, categoryID, authorID string, tags []string, limit, offset int) ([]Article, int, error) {
	opts := FilterOptions{
		Status:     status,
		CategoryID: categoryID,
		AuthorID:   authorID,
		Tags:       tags,
		Limit:      limit,
		Offset:     offset,
	}

	articles, err := s.repo.FindAll(opts)
	if err != nil {
		return nil, 0, err
	}

	count, err := s.repo.Count(opts)
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
		baseSlug := generateSlug(article.Title)
		article.Slug = baseSlug

		// Ensure uniqueness
		for i := 0; ; i++ {
			existing, err := s.repo.FindBySlug(article.Slug)
			if err != nil {
				return err
			}
			// If no existing article, or existing article is the one we are updating, it's safe
			if existing == nil || existing.ID == id {
				break
			}
			// Slug exists and belongs to another article, append counter
			article.Slug = fmt.Sprintf("%s-%d", baseSlug, i+1)
		}
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

// GetPublicArticles retrieves published articles for public display with text previews
func (s *Service) GetPublicArticles(categoryID string, tags []string, limit, offset int) ([]Article, int, error) {
	opts := FilterOptions{
		Status:     "PUBLISHED",
		CategoryID: categoryID,
		Tags:       tags,
		Limit:      limit,
		Offset:     offset,
		SortBy:     "published_at",
	}

	articles, err := s.repo.FindAll(opts)
	if err != nil {
		return nil, 0, err
	}

	count, err := s.repo.Count(opts)
	if err != nil {
		return nil, 0, err
	}

	// Generate previews
	for i := range articles {
		articles[i].Body = generatePreview(articles[i].Body)
	}

	return articles, count, nil
}

// GetCategoriesWithCounts retrieves all categories with their article counts
func (s *Service) GetCategoriesWithCounts() ([]CategoryWithCount, error) {
	return s.repo.GetCategoriesWithCounts()
}

// GetTagsWithCounts retrieves tags with their article counts
func (s *Service) GetTagsWithCounts(popular bool, limit int) ([]TagWithCount, error) {
	return s.repo.GetTagsWithCounts(popular, limit)
}

// AddComment adds a comment to an article
func (s *Service) AddComment(articleID, userID, body string) (*Comment, error) {
	if body == "" {
		return nil, errors.New("comment body cannot be empty")
	}
	comment := &Comment{
		ArticleID: articleID,
		UserID:    userID,
		Body:      body,
	}
	err := s.repo.AddComment(comment)
	return comment, err
}

// GetComments retrieves comments for an article
func (s *Service) GetComments(articleID string) ([]Comment, error) {
	return s.repo.GetComments(articleID)
}

// AddLike adds or updates a like/dislike
func (s *Service) AddLike(articleID, userID string, isLike bool) error {
	like := &ArticleLike{
		ArticleID: articleID,
		UserID:    userID,
		IsLike:    isLike,
	}
	return s.repo.AddLike(like)
}

// RemoveLike removes a like/dislike
func (s *Service) RemoveLike(articleID, userID string) error {
	return s.repo.RemoveLike(articleID, userID)
}

// GetLikesCount retrieves the count of likes and dislikes
func (s *Service) GetLikesCount(articleID string) (int, int, error) {
	return s.repo.GetLikesCount(articleID)
}

// GetUserLike retrieves the user's interaction status
func (s *Service) GetUserLike(articleID, userID string) (*bool, error) {
	return s.repo.GetUserLike(articleID, userID)
}

// Search performs full-text search on published articles
func (s *Service) Search(query string, categoryID string, tags []string, limit, offset int) ([]SearchResult, int, error) {
	if len(query) < 2 {
		return []SearchResult{}, 0, fmt.Errorf("query too short")
	}

	results, total, err := s.repo.Search(query, categoryID, tags, limit, offset)
	return results, total, err
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

// generatePreview creates a plain text preview from markdown
func generatePreview(markdown string) string {
	// Remove headers
	re := regexp.MustCompile(`(?m)^#{1,6}\s+`)
	text := re.ReplaceAllString(markdown, "")

	// Remove images
	re = regexp.MustCompile(`!\[.*?\]\(.*?\)`)
	text = re.ReplaceAllString(text, "")

	// Remove links
	re = regexp.MustCompile(`\[(.*?)\]\(.*?\)`)
	text = re.ReplaceAllString(text, "$1")

	// Remove code blocks
	re = regexp.MustCompile("```[\\s\\S]*?```")
	text = re.ReplaceAllString(text, "")

	// Remove inline code
	re = regexp.MustCompile("`.*?`")
	text = re.ReplaceAllString(text, "")

	// Remove bold/italic
	re = regexp.MustCompile(`(\*\*|__|\*|_)`)
	text = re.ReplaceAllString(text, "")

	// Normalize whitespace
	text = strings.TrimSpace(text)
	lines := strings.Split(text, "\n")

	// Take first 10 lines
	if len(lines) > 10 {
		lines = lines[:10]
		text = strings.Join(lines, "\n") + "..."
	} else {
		text = strings.Join(lines, "\n")
	}

	// Hard limit characters
	if len(text) > 300 {
		text = text[:300] + "..."
	}

	return text
}
