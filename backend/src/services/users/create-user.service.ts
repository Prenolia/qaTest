/**
 * Create User Service
 * Creates a new user in the repository
 */

import { userRepository } from '../../repositories/user.repository';
import type { User, CreateUserDTO, UserRole, UserStatus } from '../../models/user.model';

export interface CreateUserInput {
  name: string;
  email: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface CreateUserResult {
  success: boolean;
  user?: User;
  error?: string;
}

export class CreateUserService {
  execute(input: CreateUserInput): CreateUserResult {
    // Check if email already exists
    const existingUser = userRepository.findByEmail(input.email);
    if (existingUser) {
      return {
        success: false,
        error: 'Email already exists',
      };
    }

    const dto: CreateUserDTO = {
      name: input.name,
      email: input.email,
      role: input.role || 'User',
      status: input.status || 'active',
    };

    const user = userRepository.create(dto);

    return {
      success: true,
      user,
    };
  }
}

export const createUserService = new CreateUserService();
