# DOCUMENT_TYPE: MONITORING
# VERSION: 1.0

## 1. Metrics

- Web: Core Web Vitals, SSR/ISR generation latency.
- API: p95 latency per endpoint, error rates, rate-limit hits.
- Workers: job success/failure counts, duration, retries.

## 2. Logs

- Structured JSON logs; request IDs; avoid sensitive data.

## 3. Tracing

- Propagate trace/span IDs across Next.js -> Go API -> downstream.

## 4. Alerts (initial)

- Elevated 5xx/errors, latency p95 breach, job failure spikes.

## 5. Notes for AI AGENTS

- Document new metrics/alerts when adding features.
