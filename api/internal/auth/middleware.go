package auth

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/coreos/go-oidc/v3/oidc"
)

// Middleware validates JWT tokens using Keycloak OIDC provider
func Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header missing", http.StatusUnauthorized)
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, "Invalid authorization header format", http.StatusUnauthorized)
			return
		}

		tokenString := parts[1]
		ctx := context.Background()

		provider, err := oidc.NewProvider(ctx, os.Getenv("KEYCLOAK_ISSUER"))
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to get provider: %v", err), http.StatusInternalServerError)
			return
		}

		verifier := provider.Verifier(&oidc.Config{
			ClientID: os.Getenv("KEYCLOAK_CLIENT_ID"),
		})

		idToken, err := verifier.Verify(ctx, tokenString)
		if err != nil {
			http.Error(w, fmt.Sprintf("Invalid token: %v", err), http.StatusUnauthorized)
			return
		}

		// Token is valid, proceed
		claims := struct {
			Sub string `json:"sub"`
		}{}
		if err := idToken.Claims(&claims); err != nil {
			http.Error(w, fmt.Sprintf("Invalid claims: %v", err), http.StatusUnauthorized)
			return
		}

		ctx = context.WithValue(r.Context(), UserIDKey, claims.Sub)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

type contextKey string

const UserIDKey contextKey = "user_id"

// GetUserIDFromContext retrieves the user ID from the context
func GetUserIDFromContext(ctx context.Context) (string, error) {
	userID, ok := ctx.Value(UserIDKey).(string)
	if !ok {
		return "", fmt.Errorf("user id not found in context")
	}
	return userID, nil
}
