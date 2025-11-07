import { Battle } from '@/domain/entities/Battle';

/**
 * Interface pour les opérations distantes liées aux combats
 * Permet de sauvegarder, charger et synchroniser les combats
 */
export interface IBattleGateway {
  /**
   * Sauvegarde un combat sur le serveur distant
   */
  saveBattle?(battle: Battle): Promise<void>;

  /**
   * Charge un combat depuis le serveur distant
   */
  loadBattle?(battleId: string): Promise<Battle | null>;

  /**
   * Synchronise l'état d'un combat
   */
  syncBattleState?(battle: Battle): Promise<void>;
}
