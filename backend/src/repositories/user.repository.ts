/**
 * User Repository
 * Data access layer for User entities
 * Handles in-memory storage and CRUD operations
 */

import type { User, UserQueryParams, CreateUserDTO, UpdateUserDTO } from '../models/user.model';
import { createUser, updateUser } from '../models/user.model';
import type { PaginatedResponse } from '../types/common.types';
import { generateId, getCurrentTimestamp, getDateOffset, deepClone } from '../utils/helpers';

// Initial seed data
const seedUsers: User[] = [
  {
    id: generateId(),
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'active',
    createdAt: getDateOffset(30),
    updatedAt: getDateOffset(2),
  },
  {
    id: generateId(),
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Manager',
    status: 'active',
    createdAt: getDateOffset(25),
    updatedAt: getDateOffset(1),
  },
  {
    id: generateId(),
    name: 'Bob Wilson',
    email: 'bob.wilson@example.com',
    role: 'User',
    status: 'active',
    createdAt: getDateOffset(20),
    updatedAt: getDateOffset(5),
  },
  {
    id: generateId(),
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    role: 'User',
    status: 'inactive',
    createdAt: getDateOffset(45),
    updatedAt: getDateOffset(30),
  },
  {
    id: generateId(),
    name: 'Charlie Davis',
    email: 'charlie.davis@example.com',
    role: 'Manager',
    status: 'active',
    createdAt: getDateOffset(15),
    updatedAt: getDateOffset(3),
  },
  {
    id: generateId(),
    name: 'Eva Martinez',
    email: 'eva.martinez@example.com',
    role: 'User',
    status: 'pending',
    createdAt: getDateOffset(5),
    updatedAt: getDateOffset(5),
  },
  {
    id: generateId(),
    name: 'Frank Johnson',
    email: 'frank.johnson@example.com',
    role: 'User',
    status: 'active',
    createdAt: getDateOffset(10),
    updatedAt: getDateOffset(7),
  },
  {
    id: generateId(),
    name: 'Grace Lee',
    email: 'grace.lee@example.com',
    role: 'Admin',
    status: 'active',
    createdAt: getDateOffset(60),
    updatedAt: getDateOffset(10),
  },
  {
    id: generateId(),
    name: 'Henry Taylor',
    email: 'henry.taylor@example.com',
    role: 'User',
    status: 'inactive',
    createdAt: getDateOffset(90),
    updatedAt: getDateOffset(60),
  },
  {
    id: generateId(),
    name: 'Ivy Chen',
    email: 'ivy.chen@example.com',
    role: 'Manager',
    status: 'active',
    createdAt: getDateOffset(8),
    updatedAt: getDateOffset(1),
  },
  {
    id: generateId(),
    name: 'Jack Robinson',
    email: 'jack.robinson@example.com',
    role: 'User',
    status: 'pending',
    createdAt: getDateOffset(2),
    updatedAt: getDateOffset(2),
  },
  {
    id: generateId(),
    name: 'Karen White',
    email: 'karen.white@example.com',
    role: 'User',
    status: 'active',
    createdAt: getDateOffset(12),
    updatedAt: getDateOffset(4),
  },
];

/**
 * User Repository Class
 * Implements repository pattern for User data access
 */
export class UserRepository {
  private users: User[];
  private readonly initialUsers: User[];

  constructor() {
    this.initialUsers = deepClone(seedUsers);
    this.users = deepClone(seedUsers);
  }

  /**
   * Find all users with filtering, sorting, and pagination
   */
  findAll(params: UserQueryParams = {}): PaginatedResponse<User> {
    const {
      page = 1,
      pageSize = 10,
      search = '',
      sortBy = 'updatedAt',
      sortDir = 'desc',
      status,
      role,
    } = params;

    let filtered = [...this.users];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (status && ['active', 'inactive', 'pending'].includes(status)) {
      filtered = filtered.filter((user) => user.status === status);
    }

    // Apply role filter
    if (role && ['User', 'Manager', 'Admin'].includes(role)) {
      filtered = filtered.filter((user) => user.role === role);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'email') {
        comparison = a.email.localeCompare(b.email);
      } else if (sortBy === 'updatedAt') {
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      }
      return sortDir === 'desc' ? -comparison : comparison;
    });

    // Apply pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedUsers = filtered.slice(start, end);

    return {
      items: paginatedUsers,
      page,
      pageSize,
      total,
      totalPages,
    };
  }

  /**
   * Find user by ID
   */
  findById(id: string): User | null {
    return this.users.find((user) => user.id === id) || null;
  }

  /**
   * Find user by email
   */
  findByEmail(email: string): User | null {
    return this.users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
  }

  /**
   * Create a new user
   */
  create(dto: CreateUserDTO): User {
    const id = generateId();
    const timestamp = getCurrentTimestamp();
    const newUser = createUser(id, dto, timestamp);
    this.users.push(newUser);
    return newUser;
  }

  /**
   * Update an existing user
   */
  update(id: string, dto: UpdateUserDTO): User | null {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return null;

    const timestamp = getCurrentTimestamp();
    this.users[index] = updateUser(this.users[index], dto, timestamp);
    return this.users[index];
  }

  /**
   * Delete a user by ID
   */
  delete(id: string): boolean {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return false;

    this.users.splice(index, 1);
    return true;
  }

  /**
   * Reset data to initial state
   */
  reset(): number {
    this.users = deepClone(this.initialUsers);
    return this.users.length;
  }

  /**
   * Get total count of users
   */
  count(): number {
    return this.users.length;
  }
}

// Singleton instance
export const userRepository = new UserRepository();
