export type ApiError = {
  message: string
  status?: number
  code?: string
  details?: unknown
}

export class ApiClientError extends Error implements ApiError {
  status?: number
  code?: string
  details?: unknown

  constructor(message: string, options?: Omit<ApiError, 'message'>) {
    super(message)
    this.name = 'ApiClientError'
    this.status = options?.status
    this.code = options?.code
    this.details = options?.details
  }
}

export function normalizeError(error: unknown): ApiClientError {
  if (error instanceof ApiClientError) return error
  if (error instanceof Error) {
    return new ApiClientError(error.message)
  }
  if (typeof error === 'string') {
    return new ApiClientError(error)
  }
  return new ApiClientError('Unexpected error. Please try again.')
}

export async function fetchJson<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  const body = await res.json().catch(() => null)
  if (!res.ok) {
    throw new ApiClientError(
      body?.message ?? `Request failed (${res.status})`,
      { status: res.status, code: body?.code, details: body?.details },
    )
  }
  return body as T
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong.') {
  const normalized = normalizeError(error)
  return normalized.message || fallback
}
