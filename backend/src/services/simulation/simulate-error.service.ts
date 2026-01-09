/**
 * Simulate Error Service
 * Generates simulated HTTP error responses
 */

import { getCurrentTimestamp } from '../../utils/helpers';

export interface SimulateErrorInput {
  code: number;
}

export interface SimulateErrorResult {
  code: number;
  error: string;
  errorCode: string;
  timestamp: string;
}

export class SimulateErrorService {
  execute(input: SimulateErrorInput): SimulateErrorResult {
    const { code } = input;

    return {
      code,
      error: `Simulated ${code} error`,
      errorCode: `HTTP_${code}`,
      timestamp: getCurrentTimestamp(),
    };
  }
}

export const simulateErrorService = new SimulateErrorService();
