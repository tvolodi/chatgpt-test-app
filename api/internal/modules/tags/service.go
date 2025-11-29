package tags

type PaginatedTagsResponse struct {
	Tags    []Tag `json:"tags"`
	Total   int   `json:"total"`
	Limit   int   `json:"limit"`
	Offset  int   `json:"offset"`
	HasMore bool  `json:"has_more"`
}

type Service interface {
	ListTags() ([]Tag, error)
	ListTagsWithPagination(limit, offset int, search string) (*PaginatedTagsResponse, error)
	GetTagByCode(code string) (*Tag, error)
	CreateTag(code string, name map[string]interface{}) (*Tag, error)
	UpdateTag(oldCode, newCode string, name map[string]interface{}) (*Tag, error)
	DeleteTag(code string) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) ListTags() ([]Tag, error) {
	return s.repo.FindAll()
}

func (s *service) ListTagsWithPagination(limit, offset int, search string) (*PaginatedTagsResponse, error) {
	// Set default limit if not provided
	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		limit = 100 // Max limit
	}

	tags, total, err := s.repo.FindAllWithPagination(limit, offset, search)
	if err != nil {
		return nil, err
	}

	hasMore := offset+limit < total

	return &PaginatedTagsResponse{
		Tags:    tags,
		Total:   total,
		Limit:   limit,
		Offset:  offset,
		HasMore: hasMore,
	}, nil
}

func (s *service) GetTagByCode(code string) (*Tag, error) {
	return s.repo.FindByCode(code)
}

func (s *service) CreateTag(code string, name map[string]interface{}) (*Tag, error) {
	return s.repo.Create(code, name)
}

func (s *service) UpdateTag(oldCode, newCode string, name map[string]interface{}) (*Tag, error) {
	return s.repo.Update(oldCode, newCode, name)
}

func (s *service) DeleteTag(code string) error {
	return s.repo.Delete(code)
}
