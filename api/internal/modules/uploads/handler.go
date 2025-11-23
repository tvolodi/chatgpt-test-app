package uploads

import (
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

type Handler struct {
	uploadDir string
}

func NewHandler(uploadDir string) *Handler {
	// Create upload directory if it doesn't exist
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		panic(fmt.Sprintf("failed to create upload directory: %v", err))
	}
	return &Handler{uploadDir: uploadDir}
}

// RegisterRoutes registers upload routes
func (h *Handler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("POST /api/uploads/images", h.handleImageUpload)
	mux.HandleFunc("GET /uploads/images/{filename}", h.handleServeImage)
}

// handleImageUpload handles image file uploads
func (h *Handler) handleImageUpload(w http.ResponseWriter, r *http.Request) {
	// Parse multipart form (10MB max)
	if err := r.ParseMultipartForm(10 << 20); err != nil {
		http.Error(w, "file too large (max 10MB)", http.StatusBadRequest)
		return
	}

	files := r.MultipartForm.File["images"]
	if len(files) == 0 {
		http.Error(w, "no files uploaded", http.StatusBadRequest)
		return
	}

	var urls []string
	for _, fileHeader := range files {
		url, err := h.saveImage(fileHeader, r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		urls = append(urls, url)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, `{"urls":%q}`, urls)
}

// saveImage saves an uploaded image and returns its URL
func (h *Handler) saveImage(fileHeader *multipart.FileHeader, r *http.Request) (string, error) {
	// Validate file type
	if !isValidImageType(fileHeader.Filename) {
		return "", fmt.Errorf("invalid file type: %s (only jpg, jpeg, png, gif allowed)", fileHeader.Filename)
	}

	// Open uploaded file
	file, err := fileHeader.Open()
	if err != nil {
		return "", fmt.Errorf("failed to open file: %v", err)
	}
	defer file.Close()

	// Validate magic bytes
	buffer := make([]byte, 512)
	if _, err := file.Read(buffer); err != nil {
		return "", fmt.Errorf("failed to read file: %v", err)
	}
	if _, err := file.Seek(0, 0); err != nil {
		return "", fmt.Errorf("failed to seek file: %v", err)
	}

	contentType := http.DetectContentType(buffer)
	if !strings.HasPrefix(contentType, "image/") {
		return "", fmt.Errorf("invalid file content: not an image")
	}

	// Generate unique filename
	timestamp := time.Now().Unix()
	sanitizedName := sanitizeFilename(fileHeader.Filename)
	filename := fmt.Sprintf("%d_%s", timestamp, sanitizedName)
	filepath := filepath.Join(h.uploadDir, filename)

	// Create destination file
	dst, err := os.Create(filepath)
	if err != nil {
		return "", fmt.Errorf("failed to create file: %v", err)
	}
	defer dst.Close()

	// Copy file content
	if _, err := io.Copy(dst, file); err != nil {
		return "", fmt.Errorf("failed to save file: %v", err)
	}

	// Return URL
	scheme := "http"
	if r.TLS != nil {
		scheme = "https"
	}
	url := fmt.Sprintf("%s://%s/uploads/images/%s", scheme, r.Host, filename)
	return url, nil
}

// handleServeImage serves uploaded images
func (h *Handler) handleServeImage(w http.ResponseWriter, r *http.Request) {
	filename := r.PathValue("filename")

	// Sanitize filename to prevent directory traversal
	filename = filepath.Base(filename)

	filepath := filepath.Join(h.uploadDir, filename)

	// Check if file exists
	if _, err := os.Stat(filepath); os.IsNotExist(err) {
		http.Error(w, "file not found", http.StatusNotFound)
		return
	}

	http.ServeFile(w, r, filepath)
}

// isValidImageType checks if the filename has a valid image extension
func isValidImageType(filename string) bool {
	ext := strings.ToLower(filepath.Ext(filename))
	return ext == ".jpg" || ext == ".jpeg" || ext == ".png" || ext == ".gif"
}

// sanitizeFilename removes potentially dangerous characters from filename
func sanitizeFilename(filename string) string {
	// Keep only alphanumeric, dots, hyphens, and underscores
	var result strings.Builder
	for _, r := range filename {
		if (r >= 'a' && r <= 'z') || (r >= 'A' && r <= 'Z') || (r >= '0' && r <= '9') || r == '.' || r == '-' || r == '_' {
			result.WriteRune(r)
		} else {
			result.WriteRune('_')
		}
	}
	return result.String()
}
