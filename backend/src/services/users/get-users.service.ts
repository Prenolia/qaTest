/**
 * Get Users Service
 * Retrieves paginated list of users with filtering and sorting
 */

import { userRepository } from '../../repositories/user.repository';
import type { User, UserQueryParams, UserStatus, UserRole } from '../../models/user.model';
import type { PaginatedResponse } from '../../types/common.types';

export interface GetUsersInput {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: 'name' | 'email' | 'updatedAt';
  sortDir?: 'asc' | 'desc';
  status?: UserStatus;
  role?: UserRole;
}

export class GetUsersService {
  execute(input: GetUsersInput = {}): PaginatedResponse<User> {
    const params: UserQueryParams = {
      page: input.page || 1,
      pageSize: input.pageSize || 10,
      search: input.search || '',
      sortBy: input.sortBy || 'updatedAt',
      sortDir: input.sortDir || 'desc',
      status: input.status,
      role: input.role,
    };

    return userRepository.findAll(params);
  }
}

export const getUsersService = new GetUsersService();
