import { IRandomGenerator } from '../../domain/ports/IRandomGenerator';

/**
 * Implémentation de IRandomGenerator utilisant Math.random()
 */
export class RandomGenerator implements IRandomGenerator {
  generate(): number {
    return Math.random();
  }

  generateInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  selectRandom<T>(array: T[]): T {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  shuffle<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
  }

  chance(probability: number): boolean {
    return Math.random() < probability;
  }
}
