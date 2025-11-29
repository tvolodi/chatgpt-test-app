import { randomUUID } from "crypto";

type FetchOptions = RequestInit & { skipLogging?: boolean };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api";

// API Error Response Types
export class ApiError extends Error {
  public readonly code?: string;
  public readonly status: number;
  public readonly details?: Record<string, any>;

  constructor(message: string, status: number, code?: string, details?: Record<string, any>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static fromResponse(response: Response, body?: any): ApiError {
    const message = typeof body === 'string' ? body :
                   body?.message || `HTTP ${response.status}: ${response.statusText}`;
    const code = body?.code;
    const details = body?.details;

    return new ApiError(message, response.status, code, details);
  }
}

// HTTP Status Code Constants
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const correlationId = randomUUID();
  const { skipLogging, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      "X-Request-ID": correlationId,
      ...(headers || {})
    }
  });

  if (!skipLogging) {
    console.info("api.request", { path, status: response.status, correlationId });
  }

  if (!response.ok) {
    let errorBody: any = null;
    try {
      errorBody = await response.json();
    } catch {
      // If JSON parsing fails, try to get text
      try {
        errorBody = await response.text();
      } catch {
        errorBody = null;
      }
    }

    if (!skipLogging) {
      console.error("api.error", { path, status: response.status, correlationId, errorBody });
    }

    throw ApiError.fromResponse(response, errorBody);
  }

  return (await safeJson(response)) as T;
}

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
