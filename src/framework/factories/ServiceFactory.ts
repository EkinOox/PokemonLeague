/**
 * Service Factory - Centralise l'instanciation des services avec injection de dépendances
 * 
 * Ce factory suit le pattern Dependency Injection Container.
 * Les pages UI n'instancient jamais directement les services, elles passent par ce factory.
 */

import { IRandomGenerator } from '@/domain/ports/IRandomGenerator';
import { IMathService } from '@/domain/ports/IMathService';
import { IDateProvider } from '@/domain/ports/IDateProvider';
import { RandomGenerator } from '@/adapters/services/RandomGenerator';
import { MathService } from '@/adapters/services/MathService';
import { DateProvider } from '@/adapters/services/DateProvider';

/**
 * Factory pour créer les services de base
 */
export class ServiceFactory {
  private static randomGeneratorInstance: IRandomGenerator | null = null;
  private static mathServiceInstance: IMathService | null = null;
  private static dateProviderInstance: IDateProvider | null = null;

  /**
   * Retourne une instance singleton du générateur aléatoire
   */
  static getRandomGenerator(): IRandomGenerator {
    if (!this.randomGeneratorInstance) {
      this.randomGeneratorInstance = new RandomGenerator();
    }
    return this.randomGeneratorInstance;
  }

  /**
   * Retourne une instance singleton du service mathématique
   */
  static getMathService(): IMathService {
    if (!this.mathServiceInstance) {
      this.mathServiceInstance = new MathService();
    }
    return this.mathServiceInstance;
  }

  /**
   * Retourne une instance singleton du fournisseur de dates
   */
  static getDateProvider(): IDateProvider {
    if (!this.dateProviderInstance) {
      this.dateProviderInstance = new DateProvider();
    }
    return this.dateProviderInstance;
  }

  /**
   * Réinitialise toutes les instances (utile pour les tests)
   */
  static reset(): void {
    this.randomGeneratorInstance = null;
    this.mathServiceInstance = null;
    this.dateProviderInstance = null;
  }

  /**
   * Permet d'injecter des mocks pour les tests
   */
  static setRandomGenerator(mock: IRandomGenerator): void {
    this.randomGeneratorInstance = mock;
  }

  static setMathService(mock: IMathService): void {
    this.mathServiceInstance = mock;
  }

  static setDateProvider(mock: IDateProvider): void {
    this.dateProviderInstance = mock;
  }
}
