package auth

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrInvalidCredentials = errors.New("invalid credentials")
)

// User represents an authenticated user.
type User struct {
	ID    string `json:"id"`
	Email string `json:"email"`
	Name  string `json:"name"`
}

// Service defines the authentication logic.
type Service interface {
	Login(email, password string) (string, *User, error)
}

// JWTService implements Service using JWTs and an in-memory user store.
type JWTService struct {
	secretKey []byte
	users     map[string]string // email -> hash
	userData  map[string]*User  // email -> user info
}

// NewJWTService creates a new auth service with a given secret and seeded users.
func NewJWTService(secret string) *JWTService {
	s := &JWTService{
		secretKey: []byte(secret),
		users:     make(map[string]string),
		userData:  make(map[string]*User),
	}
	// Seed a default user for testing
	// Password is "password123"
	hash, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	s.users["test@example.com"] = string(hash)
	s.userData["test@example.com"] = &User{
		ID:    "user-001",
		Email: "test@example.com",
		Name:  "Test User",
	}
	return s
}

func (s *JWTService) Login(email, password string) (string, *User, error) {
	hash, ok := s.users[email]
	if !ok {
		return "", nil, ErrInvalidCredentials
	}

	if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)); err != nil {
		return "", nil, ErrInvalidCredentials
	}

	user := s.userData[email]

	// Generate JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":   user.ID,
		"email": user.Email,
		"exp":   time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString(s.secretKey)
	if err != nil {
		return "", nil, err
	}

	return tokenString, user, nil
}
