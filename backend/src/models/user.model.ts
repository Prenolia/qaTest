/**
 * User Model
 * Defines the User entity structure and related types
 */

export type UserStatus = 'active' | 'inactive' | 'pending';

export type UserRole = 'User' | 'Manager' | 'Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UserQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: 'name' | 'email' | 'updatedAt';
  sortDir?: 'asc' | 'desc';
  status?: UserStatus;
  role?: UserRole;
}

/**
 * Factory function to create a new User
 */
export function createUser(
  id: string,
  dto: CreateUserDTO,
  timestamp: string
): User {
  return {
    id,
    name: dto.name.trim(),
    email: dto.email.toLowerCase().trim(),
    role: dto.role || 'User',
    status: dto.status || 'active',
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

/**
 * Factory function to update a User
 */
export function updateUser(
  user: User,
  dto: UpdateUserDTO,
  timestamp: string
): User {
  return {
    ...user,
    ...(dto.name !== undefined && { name: dto.name.trim() }),
    ...(dto.email !== undefined && { email: dto.email.toLowerCase().trim() }),
    ...(dto.role !== undefined && { role: dto.role }),
    ...(dto.status !== undefined && { status: dto.status }),
    updatedAt: timestamp,
  };
}
