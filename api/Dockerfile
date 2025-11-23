# syntax=docker/dockerfile:1
FROM golang:1.25-alpine AS builder
WORKDIR /app
COPY go.mod ./
COPY go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /bin/api .

FROM gcr.io/distroless/base-debian12
WORKDIR /
COPY --from=builder /bin/api /bin/api
EXPOSE 4000
USER nonroot:nonroot
ENTRYPOINT ["/bin/api"]
