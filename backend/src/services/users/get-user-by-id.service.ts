/**
 * Get User By ID Service
 * Retrieves a single user by their unique identifier
 */

import { userRepository } from '../../repositories/user.repository';
import type { User } from '../../models/user.model';

export interface GetUserByIdResult {
  found: boolean;
  user: User | null;
}

export class GetUserByIdService {
  execute(id: string): GetUserByIdResult {
    const user = userRepository.findById(id);

    return {
      found: user !== null,
      user,
    };
  }
}

export const getUserByIdService = new GetUserByIdService();
