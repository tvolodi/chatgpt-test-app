package categories

import (
	"context"
	"errors"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) CreateCategory(ctx context.Context, c *Category) error {
	// Validate unique code
	unique, err := s.repo.IsUniqueCode(ctx, c.Code, "")
	if err != nil {
		return err
	}
	if !unique {
		return errors.New("category code already exists")
	}

	return s.repo.Create(ctx, c)
}

func (s *Service) UpdateCategory(ctx context.Context, c *Category) error {
	// Validate unique code (excluding self)
	unique, err := s.repo.IsUniqueCode(ctx, c.Code, c.ID)
	if err != nil {
		return err
	}
	if !unique {
		return errors.New("category code already exists")
	}

	return s.repo.Update(ctx, c)
}

func (s *Service) DeleteCategory(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}

func (s *Service) ListCategories(ctx context.Context) ([]Category, error) {
	return s.repo.FindAll(ctx)
}

func (s *Service) GetCategory(ctx context.Context, id string) (*Category, error) {
	return s.repo.FindByID(ctx, id)
}
