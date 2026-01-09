/**
 * Common Type Definitions
 * Shared types used across the application
 */

// ============ Base Response Types ============

export interface SuccessResponse<T = unknown> {
  success: true;
  data?: T;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  errors?: Record<string, string>;
  timestamp?: string;
}

export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

// ============ Pagination Types ============

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// ============ Sort & Filter Types ============

export interface SortParams {
  sortBy: string;
  sortDir: 'asc' | 'desc';
}

// ============ User Types ============

export type UserStatus = 'active' | 'inactive' | 'pending';

export type UserRole = 'User' | 'Manager' | 'Admin';

// ============ Form Types ============

export interface FormSubmission {
  name: string;
  email: string;
  role: UserRole;
}

// ============ Simulation Types ============

export interface LatencyResult {
  delayMs: number;
  message: string;
}

export interface SimulatedError {
  error: string;
  errorCode: string;
  timestamp: string;
}
