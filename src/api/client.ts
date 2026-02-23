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

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function request<T>(
  fn: () => T | Promise<T>,
  options?: { delayMs?: number },
): Promise<T> {
  try {
    const result = await fn()
    if (options?.delayMs) {
      await delay(options.delayMs)
    }
    return result
  } catch (error) {
    throw normalizeError(error)
  }
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong.') {
  const normalized = normalizeError(error)
  return normalized.message || fallback
}
