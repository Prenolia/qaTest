/**
 * Application Configuration
 * Centralized configuration for the QA Testbed API
 */

export const config = {
  server: {
    port: parseInt(process.env.PORT || '3001'),
    host: process.env.HOST || 'localhost',
  },

  api: {
    basePath: '/api',
    version: '1.0.0',
  },

  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },

  simulation: {
    maxLatencyMs: 10000,
    defaultLatencyMs: 2000,
    flakyFailureRate: 0.5,
    rateLimitRetryAfter: 2,
  },

  validation: {
    minNameLength: 2,
    validRoles: ['User', 'Manager', 'Admin'] as const,
    validStatuses: ['active', 'inactive', 'pending'] as const,
  },

  scoring: {
    lessonWeight: 10,
    minuteWeight: 0.5,
    quizWeight: 25,
    tiers: {
      gold: 500,
      silver: 200,
    },
  },
} as const;

export type Config = typeof config;
