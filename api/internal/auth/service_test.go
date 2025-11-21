package auth

import (
	"testing"

	"github.com/golang-jwt/jwt/v5"
)

func TestLogin(t *testing.T) {
	secret := "test-secret"
	svc := NewJWTService(secret)

	t.Run("Success", func(t *testing.T) {
		token, user, err := svc.Login("test@example.com", "password123")
		if err != nil {
			t.Fatalf("expected no error, got %v", err)
		}
		if user.Email != "test@example.com" {
			t.Errorf("expected email test@example.com, got %s", user.Email)
		}
		if token == "" {
			t.Error("expected token, got empty string")
		}

		// Verify token
		parsed, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
			return []byte(secret), nil
		})
		if err != nil {
			t.Fatalf("failed to parse token: %v", err)
		}
		if !parsed.Valid {
			t.Error("token is invalid")
		}
	})

	t.Run("Invalid Password", func(t *testing.T) {
		_, _, err := svc.Login("test@example.com", "wrongpassword")
		if err != ErrInvalidCredentials {
			t.Errorf("expected ErrInvalidCredentials, got %v", err)
		}
	})

	t.Run("User Not Found", func(t *testing.T) {
		_, _, err := svc.Login("nonexistent@example.com", "password123")
		if err != ErrInvalidCredentials {
			t.Errorf("expected ErrInvalidCredentials, got %v", err)
		}
	})
}
