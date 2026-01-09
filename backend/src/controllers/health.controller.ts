/**
 * Health Controller
 * Handles health check and meta endpoints
 */

import { Elysia } from 'elysia';
import { config } from '../config';
import { getCurrentTimestamp } from '../utils/helpers';

export const healthController = new Elysia({ prefix: '/api' })
  /**
   * Health check endpoint
   * GET /api/health
   */
  .get('/health', () => ({
    ok: true,
    ts: getCurrentTimestamp(),
    version: config.api.version,
  }));
