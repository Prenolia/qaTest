/**
 * Simulation Controller
 * Handles HTTP requests for API simulation scenarios
 * Test Endpoints as per documentation
 * All endpoints return real user data from /api/users
 */

import { Elysia, t } from 'elysia';
import {
  simulateLatencyService,
  simulateErrorService,
  simulateRateLimitService,
  simulateFlakyService,
  getUsersService,
} from '../services';
import { parseIntWithDefault } from '../utils/helpers';

export const simulationController = new Elysia({ prefix: '/api' })
  /**
   * Random 2-5 second delay
   * GET /api/slow
   * Returns user data after random delay
   */
  .get('/slow', async () => {
    const randomMs = Math.floor(Math.random() * 3000) + 2000; // 2000-5000ms
    await simulateLatencyService.execute({ ms: randomMs });

    const users = getUsersService.execute();

    return {
      success: true,
      delayMs: randomMs,
      data: users,
    };
  })

  /**
   * 50% chance of error
   * GET /api/unreliable
   * Returns user data on success, error on failure
   */
  .get('/unreliable', ({ set }) => {
    const result = simulateFlakyService.execute();

    if (!result.success) {
      set.status = 500;
      return {
        success: false,
        error: result.error,
        code: 'UNRELIABLE_ERROR',
      };
    }

    const users = getUsersService.execute();

    return {
      success: true,
      data: users,
    };
  })

  /**
   * Always returns error
   * GET /api/error
   * Returns 500 error with error details
   */
  .get('/error', ({ set }) => {
    set.status = 500;
    const result = simulateErrorService.execute({ code: 500 });

    return {
      success: false,
      error: result.error,
      code: result.errorCode,
      timestamp: result.timestamp,
    };
  })

  /**
   * Configurable delay
   * GET /api/delay?ms=<time>
   * Returns user data after specified delay
   */
  .get(
    '/delay',
    async ({ query }) => {
      const ms = parseIntWithDefault(query.ms, 1000);
      await simulateLatencyService.execute({ ms });

      const users = getUsersService.execute();

      return {
        success: true,
        delayMs: ms,
        data: users,
      };
    },
    {
      query: t.Object({
        ms: t.Optional(t.String()),
      }),
    }
  );
