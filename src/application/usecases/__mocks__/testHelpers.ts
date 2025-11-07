import { IRandomGenerator } from '@/domain/ports/IRandomGenerator';
import { IMathService } from '@/domain/ports/IMathService';
import { IDateProvider } from '@/domain/ports/IDateProvider';
import { IPokemonGateway } from '@/domain/ports/IPokemonGateway';
import { Pokemon } from '@/domain/entities/Pokemon';

/**
 * Mock pour IRandomGenerator avec valeur contrôlable
 */
export class MockRandomGenerator implements IRandomGenerator {
  private mockValue: number = 0.5;
  private useRealRandom: boolean = false;
  
  /**
   * Définit une valeur fixe pour les tests déterministes
   */
  setMockValue(value: number) {
    this.mockValue = value;
    this.useRealRandom = false;
  }
  
  /**
   * Utilise Math.random() réel pour les tests qui nécessitent de la vraie aléatoire
   */
  useReal() {
    this.useRealRandom = true;
  }
  
  generate(): number {
    return this.useRealRandom ? Math.random() : this.mockValue;
  }
  
  generateInRange(min: number, max: number): number {
    const value = this.useRealRandom ? Math.random() : this.mockValue;
    return Math.floor(value * (max - min + 1)) + min;
  }
  
  selectRandom<T>(array: T[]): T {
    const value = this.useRealRandom ? Math.random() : this.mockValue;
    const index = Math.floor(value * array.length);
    return array[Math.min(index, array.length - 1)];
  }
  
  shuffle<T>(array: T[]): T[] {
    if (this.useRealRandom) {
      const result = [...array];
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    }
    return [...array];
  }
  
  chance(probability: number): boolean {
    const value = this.useRealRandom ? Math.random() : this.mockValue;
    return value < probability;
  }
}

/**
 * Mock pour IMathService
 */
export class MockMathService implements IMathService {
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

/**
 * Mock pour IDateProvider
 */
export class MockDateProvider implements IDateProvider {
  private mockTimestamp: number = Date.now();
  
  setMockTimestamp(timestamp: number) {
    this.mockTimestamp = timestamp;
  }
  
  now(): number {
    return this.mockTimestamp;
  }
  
  getCurrentDate(): Date {
    return new Date(this.mockTimestamp);
  }
  
  generateTimestamp(): string {
    return this.mockTimestamp.toString();
  }
}

/**
 * Mock pour IPokemonGateway
 */
export class MockPokemonGateway implements IPokemonGateway {
  private mockPokemon: Pokemon | null = null;
  
  setMockPokemon(pokemon: Pokemon | null) {
    this.mockPokemon = pokemon;
  }
  
  async getPokemon(id: string): Promise<Pokemon | null> {
    return this.mockPokemon;
  }
}
