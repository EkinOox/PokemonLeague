import { IMathService } from '../../domain/ports/IMathService';

/**
 * Implémentation de IMathService utilisant Math natif
 */
export class MathService implements IMathService {
  floor(value: number): number {
    return Math.floor(value);
  }

  ceil(value: number): number {
    return Math.ceil(value);
  }

  round(value: number): number {
    return Math.round(value);
  }

  abs(value: number): number {
    return Math.abs(value);
  }

  min(...values: number[]): number {
    return Math.min(...values);
  }

  max(...values: number[]): number {
    return Math.max(...values);
  }
}
