/**
 * Simulate Latency Service
 * Introduces artificial delay to simulate network latency
 */

import { config } from '../../config';
import { sleep, clamp } from '../../utils/helpers';

export interface SimulateLatencyInput {
  ms?: number;
}

export interface SimulateLatencyResult {
  delayMs: number;
  message: string;
}

export class SimulateLatencyService {
  private readonly maxLatency = config.simulation.maxLatencyMs;
  private readonly defaultLatency = config.simulation.defaultLatencyMs;

  async execute(input: SimulateLatencyInput = {}): Promise<SimulateLatencyResult> {
    const ms = clamp(input.ms || this.defaultLatency, 0, this.maxLatency);

    await sleep(ms);

    return {
      delayMs: ms,
      message: `Response delayed by ${ms}ms`,
    };
  }
}

export const simulateLatencyService = new SimulateLatencyService();
