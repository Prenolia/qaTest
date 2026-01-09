/**
 * Simulation Controller
 * Handles HTTP requests for API simulation scenarios
 * Test Endpoints as per documentation
 */

import { Elysia, t } from 'elysia';
import {
  simulateLatencyService,
  simulateErrorService,
  simulateRateLimitService,
  simulateFlakyService,
} from '../services';
import { parseIntWithDefault } from '../utils/helpers';

export const simulationController = new Elysia({ prefix: '/api' })
  /**
   * Random 2-5 second delay
   * GET /api/slow
   */
  .get('/slow', async () => {
    const randomMs = Math.floor(Math.random() * 3000) + 2000; // 2000-5000ms
    const result = await simulateLatencyService.execute({ ms: randomMs });

    return {
      success: true,
      ...result,
    };
  })

  /**
   * 50% chance of error
   * GET /api/unreliable
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

    return {
      success: true,
      message: result.message,
    };
  })

  /**
   * Always returns error
   * GET /api/error
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
   */
  .get(
    '/delay',
    async ({ query }) => {
      const ms = parseIntWithDefault(query.ms, 1000);
      const result = await simulateLatencyService.execute({ ms });

      return {
        success: true,
        ...result,
      };
    },
    {
      query: t.Object({
        ms: t.Optional(t.String()),
      }),
    }
  );
