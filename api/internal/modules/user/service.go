package user

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

// GetUserActivity retrieves user's recent activity (likes and comments)
func (s *Service) GetUserActivity(userID string) (*UserActivity, error) {
	return s.repo.GetUserActivity(userID)
}
