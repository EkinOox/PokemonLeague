import { Trainer } from '@/domain/entities/Trainer';
import { Pokemon } from '@/domain/entities/Pokemon';

/**
 * Interface pour la gestion de la ligue Pokémon
 * Définit les opérations liées aux dresseurs et à la progression dans la ligue
 */
export interface ILeagueUseCase {
  /**
   * Génère les dresseurs de la ligue avec des niveaux croissants
   * @param playerLevel Le niveau du joueur comme référence
   * @returns La liste des dresseurs de la ligue
   */
  generateLeagueTrainers(playerLevel?: number): Promise<Trainer[]>;

  /**
   * Génère un dresseur avec une équipe de Pokémon
   * @param name Le nom du dresseur
   * @param level Le niveau des Pokémon du dresseur
   * @param teamSize Le nombre de Pokémon dans l'équipe
   * @returns Le dresseur généré
   */
  generateTrainer(
    name: string,
    level: number,
    teamSize?: number
  ): Promise<Trainer>;

  /**
   * Ajuste le niveau d'un Pokémon et recalcule ses stats
   * @param pokemon Le Pokémon à ajuster
   * @param level Le nouveau niveau
   * @returns Le Pokémon avec le niveau ajusté
   */
  adjustPokemonLevel(pokemon: Pokemon, level: number): Pokemon;

  /**
   * Calcule les points gagnés après une victoire
   * @param opponentLevel Le niveau de l'adversaire
   * @param playerLevel Le niveau du joueur
   * @param victorySpe Le type de victoire
   * @returns Le nombre de points gagnés
   */
  calculatePoints(
    opponentLevel: number,
    playerLevel: number,
    victorySpe: 'quick' | 'normal' | 'hard'
  ): number;

  /**
   * Détermine la prochaine récompense selon les points
   * @param currentPoints Les points actuels du joueur
   * @returns Le seuil et la récompense à débloquer
   */
  getNextRewardThreshold(currentPoints: number): { threshold: number; reward: string };

  /**
   * Vérifie si le joueur a assez de points pour un badge
   * @param points Les points du joueur
   * @param badgeLevel Le niveau du badge
   * @returns true si le badge peut être réclamé
   */
  canClaimBadge(points: number, badgeLevel: number): boolean;

  /**
   * Soigne complètement l'équipe du joueur
   * @param trainer Le dresseur dont l'équipe doit être soignée
   * @returns Le dresseur avec l'équipe soignée
   */
  healTeam(trainer: Trainer): Trainer;
}
