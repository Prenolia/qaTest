/**
 * Simulate Flaky Service
 * Generates random success/failure responses
 */

import { config } from '../../config';

export interface SimulateFlakyResult {
  success: boolean;
  message?: string;
  error?: string;
}

export class SimulateFlakyService {
  private readonly failureRate = config.simulation.flakyFailureRate;

  execute(): SimulateFlakyResult {
    const shouldFail = Math.random() < this.failureRate;

    if (shouldFail) {
      return {
        success: false,
        error: 'Random failure occurred',
      };
    }

    const successRate = Math.round((1 - this.failureRate) * 100);
    return {
      success: true,
      message: `Request succeeded! (${successRate}% chance)`,
    };
  }
}

export const simulateFlakyService = new SimulateFlakyService();
