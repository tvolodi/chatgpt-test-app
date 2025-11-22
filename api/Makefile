.PHONY: lint test run migrate-create help test-unit test-integration test-coverage

help: ## Show available commands
	@echo "Available commands:"
	@echo "  make lint              - Run linter"
	@echo "  make test              - Run all tests"
	@echo "  make test-unit         - Run unit tests only (fast)"
	@echo "  make test-integration  - Run integration tests only"
	@echo "  make test-coverage     - Run tests with coverage report"
	@echo "  make run               - Run the application"
	@echo "  make migrate-create NAME=<name> - Create new migration files"

lint:
	golangci-lint run ./...

test: ## Run all tests
	go test -v ./...

test-unit: ## Run unit tests only (skip integration tests)
	go test -short -v ./...

test-integration: ## Run integration tests only
	go test -v ./... -run Integration

test-coverage: ## Run tests with coverage
	go test -cover -coverprofile=coverage.out ./...
	go tool cover -html=coverage.out -o coverage.html
	@echo "Coverage report generated: coverage.html"

run:
	go run ./...

migrate-create: ## Create a new migration (usage: make migrate-create NAME=create_users_table)
	@if [ -z "$(NAME)" ]; then \
		echo "Error: NAME is required. Usage: make migrate-create NAME=create_users_table"; \
		exit 1; \
	fi
	@echo "Creating migration: $(NAME)"
	@TIMESTAMP=$$(date +%s); \
	UP_FILE="migrations/$${TIMESTAMP}_$(NAME).up.sql"; \
	DOWN_FILE="migrations/$${TIMESTAMP}_$(NAME).down.sql"; \
	echo "-- Migration: $(NAME)" > $$UP_FILE; \
	echo "-- Add your UP migration SQL here" >> $$UP_FILE; \
	echo "" >> $$UP_FILE; \
	echo "-- Migration: $(NAME)" > $$DOWN_FILE; \
	echo "-- Add your DOWN migration SQL here" >> $$DOWN_FILE; \
	echo "" >> $$DOWN_FILE; \
	echo "Created: $$UP_FILE"; \
	echo "Created: $$DOWN_FILE"; \
	cp $$UP_FILE internal/database/migrations/; \
	cp $$DOWN_FILE internal/database/migrations/
