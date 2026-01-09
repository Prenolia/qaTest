/**
 * User Controller
 * Handles HTTP requests for User CRUD operations
 * Validation is performed at this layer using Elysia's type system
 */

import { Elysia, t } from 'elysia';
import {
  getUsersService,
  getUserByIdService,
  createUserService,
  updateUserService,
  deleteUserService,
  resetUsersService,
} from '../services';
import { parseIntWithDefault } from '../utils/helpers';

// Validation schemas
const UserRoleSchema = t.Union([
  t.Literal('User'),
  t.Literal('Manager'),
  t.Literal('Admin'),
]);

const UserStatusSchema = t.Union([
  t.Literal('active'),
  t.Literal('inactive'),
  t.Literal('pending'),
]);

const CreateUserSchema = t.Object({
  name: t.String({ minLength: 2, error: 'Name must be at least 2 characters' }),
  email: t.String({ format: 'email', error: 'Invalid email format' }),
  role: t.Optional(UserRoleSchema),
  status: t.Optional(UserStatusSchema),
});

const UpdateUserSchema = t.Object({
  name: t.Optional(t.String({ minLength: 2 })),
  email: t.Optional(t.String({ format: 'email' })),
  role: t.Optional(UserRoleSchema),
  status: t.Optional(UserStatusSchema),
});

export const userController = new Elysia({ prefix: '/api' })
  /**
   * List all users with pagination, filtering, and sorting
   * GET /api/users
   */
  .get(
    '/users',
    ({ query }) => {
      const result = getUsersService.execute({
        page: parseIntWithDefault(query.page, 1),
        pageSize: parseIntWithDefault(query.pageSize, 10),
        search: query.search,
        sortBy: query.sortBy as 'name' | 'email' | 'updatedAt' | undefined,
        sortDir: query.sortDir as 'asc' | 'desc' | undefined,
        status: query.status as 'active' | 'inactive' | 'pending' | undefined,
        role: query.role as 'User' | 'Manager' | 'Admin' | undefined,
      });

      return result;
    },
    {
      query: t.Object({
        page: t.Optional(t.String()),
        pageSize: t.Optional(t.String()),
        search: t.Optional(t.String()),
        sortBy: t.Optional(t.String()),
        sortDir: t.Optional(t.String()),
        status: t.Optional(t.String()),
        role: t.Optional(t.String()),
      }),
    }
  )

  /**
   * Get single user by ID
   * GET /api/users/:id
   */
  .get(
    '/users/:id',
    ({ params, set }) => {
      const result = getUserByIdService.execute(params.id);

      if (!result.found) {
        set.status = 404;
        return {
          success: false,
          error: 'User not found',
        };
      }

      return {
        success: true,
        data: result.user,
      };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  /**
   * Create new user
   * POST /api/users
   */
  .post(
    '/users',
    ({ body, set }) => {
      const result = createUserService.execute({
        name: body.name,
        email: body.email,
        role: body.role,
        status: body.status,
      });

      if (!result.success) {
        set.status = 400;
        return {
          success: false,
          error: result.error,
        };
      }

      set.status = 201;
      return {
        success: true,
        data: result.user,
      };
    },
    {
      body: CreateUserSchema,
    }
  )

  /**
   * Update existing user
   * PUT /api/users/:id
   */
  .put(
    '/users/:id',
    ({ params, body, set }) => {
      const result = updateUserService.execute({
        id: params.id,
        name: body.name,
        email: body.email,
        role: body.role,
        status: body.status,
      });

      if (!result.found) {
        set.status = 404;
        return {
          success: false,
          error: 'User not found',
        };
      }

      return {
        success: true,
        data: result.user,
      };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: UpdateUserSchema,
    }
  )

  /**
   * Delete user
   * DELETE /api/users/:id
   */
  .delete(
    '/users/:id',
    ({ params, set }) => {
      const result = deleteUserService.execute(params.id);

      if (!result.deleted) {
        set.status = 404;
        return {
          success: false,
          error: 'User not found',
        };
      }

      return {
        success: true,
        message: 'User deleted successfully',
      };
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  )

  /**
   * Reset all data to initial state
   * POST /api/reset
   */
  .post('/reset', () => {
    const result = resetUsersService.execute();

    return {
      success: true,
      message: 'Data reset to initial state',
      userCount: result.userCount,
    };
  });
