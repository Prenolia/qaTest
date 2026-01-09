/**
 * Simulate Rate Limit Service
 * Generates simulated 429 Too Many Requests response
 */

import { config } from '../../config';

export interface SimulateRateLimitResult {
  error: string;
  retryAfter: number;
}

export class SimulateRateLimitService {
  private readonly retryAfter = config.simulation.rateLimitRetryAfter;

  execute(): SimulateRateLimitResult {
    return {
      error: 'Too many requests. Please try again later.',
      retryAfter: this.retryAfter,
    };
  }

  getRetryAfter(): number {
    return this.retryAfter;
  }
}

export const simulateRateLimitService = new SimulateRateLimitService();
