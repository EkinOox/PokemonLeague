/**
 * UseCase Factory - Centralise l'instanciation des use cases avec leurs dépendances
 * 
 * Ce factory crée les use cases en injectant automatiquement les services nécessaires.
 * Les pages UI utilisent ce factory au lieu d'instancier directement les use cases.
 */

import { BattleUseCase } from '@/application/usecases/BattleUseCase';
import { RewardsUseCase } from '@/application/usecases/RewardsUseCase';
import { GameInitializationUseCase } from '@/application/usecases/GameInitializationUseCase';
import { LeagueUseCase } from '@/application/usecases/LeagueUseCase';
import { UseItemUseCase } from '@/application/usecases/UseItemUseCase';
import { ServiceFactory } from './ServiceFactory';

/**
 * Factory pour créer les use cases avec injection de dépendances
 */
export class UseCaseFactory {
  /**
   * Crée une instance de BattleUseCase avec ses dépendances
   */
  static createBattleUseCase(): BattleUseCase {
    return new BattleUseCase(
      ServiceFactory.getRandomGenerator(),
      ServiceFactory.getMathService()
    );
  }

  /**
   * Crée une instance de RewardsUseCase avec ses dépendances
   */
  static createRewardsUseCase(): RewardsUseCase {
    return new RewardsUseCase(
      ServiceFactory.getRandomGenerator(),
      ServiceFactory.getMathService()
    );
  }

  /**
   * Crée une instance de GameInitializationUseCase avec ses dépendances
   */
  static createGameInitializationUseCase(): GameInitializationUseCase {
    return new GameInitializationUseCase(
      ServiceFactory.getRandomGenerator(),
      ServiceFactory.getDateProvider()
    );
  }

  /**
   * Crée une instance de LeagueUseCase avec ses dépendances
   */
  static createLeagueUseCase(): LeagueUseCase {
    return new LeagueUseCase(
      ServiceFactory.getRandomGenerator(),
      ServiceFactory.getMathService()
    );
  }

  /**
   * Crée une instance de UseItemUseCase avec ses dépendances
   */
  static createUseItemUseCase(): UseItemUseCase {
    return new UseItemUseCase(
      ServiceFactory.getMathService()
    );
  }
}
