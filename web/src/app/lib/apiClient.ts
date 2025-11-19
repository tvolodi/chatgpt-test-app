import { randomUUID } from "crypto";

type FetchOptions = RequestInit & { skipLogging?: boolean };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api";

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
    const errorBody = await safeJson(response);
    console.error("api.error", { path, status: response.status, correlationId, errorBody });
    throw new Error(errorBody?.message || `API error ${response.status}`);
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
