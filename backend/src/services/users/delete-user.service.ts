/**
 * Delete User Service
 * Removes a user from the repository
 */

import { userRepository } from '../../repositories/user.repository';

export interface DeleteUserResult {
  deleted: boolean;
}

export class DeleteUserService {
  execute(id: string): DeleteUserResult {
    const deleted = userRepository.delete(id);

    return { deleted };
  }
}

export const deleteUserService = new DeleteUserService();
