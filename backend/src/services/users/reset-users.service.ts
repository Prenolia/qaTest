/**
 * Reset Users Service
 * Resets all users to initial seed data
 */

import { userRepository } from '../../repositories/user.repository';

export interface ResetUsersResult {
  userCount: number;
}

export class ResetUsersService {
  execute(): ResetUsersResult {
    const userCount = userRepository.reset();

    return { userCount };
  }
}

export const resetUsersService = new ResetUsersService();
