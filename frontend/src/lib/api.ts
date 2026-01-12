import { logRequest } from '@/contexts/RequestHistoryContext'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export class ApiError extends Error {
  status: number
  body: string

  constructor(status: number, body: string) {
    super(`API Error: ${status}`)
    this.status = status
    this.body = body
    this.name = 'ApiError'
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const requestId = crypto.randomUUID()
  const method = options?.method || 'GET'
  const startTime = performance.now()
  const fullUrl = `${API_BASE_URL}${endpoint}`

  let requestBody: unknown = undefined
  if (options?.body) {
    try {
      requestBody = JSON.parse(options.body as string)
    } catch {
      requestBody = options.body
    }
  }

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': requestId,
        ...options?.headers,
      },
    })

    const duration = Math.round(performance.now() - startTime)
    const responseData = await response.json()

    // Log the request
    logRequest({
      method,
      endpoint,
      url: fullUrl,
      status: response.status,
      success: response.ok,
      duration,
      requestBody,
      responseBody: responseData,
      error: response.ok ? undefined : responseData?.error || `HTTP ${response.status}`,
    })

    if (!response.ok) {
      throw new ApiError(response.status, JSON.stringify(responseData))
    }

    return responseData as T
  } catch (error) {
    const duration = Math.round(performance.now() - startTime)

    // Only log if not already logged (ApiError is thrown after logging)
    if (!(error instanceof ApiError)) {
      logRequest({
        method,
        endpoint,
        url: fullUrl,
        success: false,
        duration,
        requestBody,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }

    throw error
  }
}

// User types
export type UserStatus = 'active' | 'inactive' | 'pending'
export type UserRole = 'User' | 'Manager' | 'Admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  createdAt: string
  updatedAt: string
}

export interface UsersResponse {
  items: User[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface UsersParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: 'name' | 'email' | 'updatedAt'
  sortDir?: 'asc' | 'desc'
  status?: UserStatus
  role?: UserRole
}

export interface CreateUserDTO {
  name: string
  email: string
  role?: UserRole
  status?: UserStatus
}

export interface UpdateUserDTO {
  name?: string
  email?: string
  role?: UserRole
  status?: UserStatus
}

// API functions
export const api = {
  // Health
  health: () => apiRequest<{ ok: boolean; ts: string; version: string }>('/api/health'),

  // Users CRUD
  getUsers: (params: UsersParams = {}) => {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set('page', params.page.toString())
    if (params.pageSize) searchParams.set('pageSize', params.pageSize.toString())
    if (params.search) searchParams.set('search', params.search)
    if (params.sortBy) searchParams.set('sortBy', params.sortBy)
    if (params.sortDir) searchParams.set('sortDir', params.sortDir)
    if (params.status) searchParams.set('status', params.status)
    if (params.role) searchParams.set('role', params.role)
    const query = searchParams.toString()
    return apiRequest<UsersResponse>(`/api/users${query ? `?${query}` : ''}`)
  },

  getUser: (id: string) =>
    apiRequest<{ success: boolean; data: User }>(`/api/users/${id}`),

  createUser: (data: CreateUserDTO) =>
    apiRequest<{ success: boolean; data: User }>('/api/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateUser: (id: string, data: UpdateUserDTO) =>
    apiRequest<{ success: boolean; data: User }>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteUser: (id: string) =>
    apiRequest<{ success: boolean; message: string }>(`/api/users/${id}`, {
      method: 'DELETE',
    }),

  resetData: () =>
    apiRequest<{ success: boolean; message: string; userCount: number }>('/api/reset', {
      method: 'POST',
    }),

  // Form validation
  validateForm: (data: { name: string; email: string; role: string }) =>
    apiRequest<{ success: boolean; message: string; data?: unknown; errors?: Record<string, string> }>('/api/validate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Simulation endpoints
  simulateSlow: () =>
    apiRequest<{ success: boolean; delayMs: number; message: string }>('/api/slow'),

  simulateUnreliable: () =>
    apiRequest<{ success: boolean; message?: string; error?: string }>('/api/unreliable'),

  simulateError: () =>
    apiRequest<{ success: boolean; error: string; code: string }>('/api/error'),

  simulateDelay: (ms: number) =>
    apiRequest<{ success: boolean; delayMs: number; message: string }>(`/api/delay?ms=${ms}`),
}

export function getApiBaseUrl() {
  return API_BASE_URL
}
