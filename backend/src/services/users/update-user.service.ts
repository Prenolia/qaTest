/**
 * Update User Service
 * Updates an existing user in the repository
 */

import { userRepository } from '../../repositories/user.repository';
import type { User, UpdateUserDTO, UserRole, UserStatus } from '../../models/user.model';

export interface UpdateUserInput {
  id: string;
  name?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UpdateUserResult {
  found: boolean;
  user: User | null;
}

export class UpdateUserService {
  execute(input: UpdateUserInput): UpdateUserResult {
    const dto: UpdateUserDTO = {};

    if (input.name !== undefined) dto.name = input.name;
    if (input.email !== undefined) dto.email = input.email;
    if (input.role !== undefined) dto.role = input.role;
    if (input.status !== undefined) dto.status = input.status;

    const user = userRepository.update(input.id, dto);

    return {
      found: user !== null,
      user,
    };
  }
}

export const updateUserService = new UpdateUserService();
