package tags

type Service interface {
	ListTags() ([]Tag, error)
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
