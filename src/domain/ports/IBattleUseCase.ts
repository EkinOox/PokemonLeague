import { Battle } from '@/domain/entities/Battle';
import { Pokemon, StatusCondition, StatModifiers } from '@/domain/entities/Pokemon';
import { Move, StatusEffect, MoveEffect } from '@/domain/entities/Move';

/**
 * Interface pour les cas d'utilisation liés aux combats
 * Définit les opérations de combat disponibles
 */
export interface IBattleUseCase {
  /**
   * Calcule les dégâts d'une attaque en tenant compte des types
   */
  calculateDamage(
    attacker: Pokemon,
    defender: Pokemon,
    move: Move
  ): { damage: number; isCritical: boolean; effectiveness: number };

  /**
   * Détermine l'efficacité d'un type contre un ou plusieurs types défensifs
   */
  getTypeEffectiveness(attackType: string, defenseTypes: string[]): number;

  /**
   * Retourne le message d'efficacité pour l'UI
   */
  getEffectivenessMessage(effectiveness: number): string;

  /**
   * Détermine si un Pokémon est K.O.
   */
  isFainted(pokemon: Pokemon): boolean;

  /**
   * Vérifie si le combat est terminé
   */
  isBattleOver(battle: Battle): { isOver: boolean; winner?: 'player' | 'opponent' };

  /**
   * Sélectionne automatiquement la prochaine attaque de l'adversaire (IA basique)
   */
  selectOpponentMove(pokemon: Pokemon, availableMoves: Move[]): Move;

  /**
   * Trouve le premier Pokémon encore en vie dans l'équipe
   */
  getFirstAlivePokemon(team: Pokemon[]): Pokemon | null;

  /**
   * Applique les dégâts à un Pokémon
   */
  applyDamage(pokemon: Pokemon, damage: number): Pokemon;

  /**
   * Réduit les PP d'une attaque
   */
  reducePP(move: Move): Move;

  /**
   * Détermine qui attaque en premier (basé sur la vitesse et la priorité)
   */
  determineFirstAttacker(
    playerPokemon: Pokemon,
    playerMove: Move,
    opponentPokemon: Pokemon,
    opponentMove: Move
  ): 'player' | 'opponent';

  /**
   * Applique les dégâts de recul à l'attaquant
   */
  applyRecoilDamage(
    attacker: Pokemon,
    move: Move,
    damageDealt: number
  ): { pokemon: Pokemon; message?: string };

  /**
   * Applique un changement de statistique à un Pokémon
   */
  applyStatChange(
    pokemon: Pokemon,
    stat: 'attack' | 'defense' | 'specialAttack' | 'specialDefense' | 'speed',
    change: number
  ): { pokemon: Pokemon; message?: string };

  /**
   * Applique un statut à un Pokémon
   */
  applyStatus(pokemon: Pokemon, status: StatusCondition): { pokemon: Pokemon; success: boolean; message: string };

  /**
   * Vérifie si un Pokémon peut attaquer avec son statut
   */
  canAttackWithStatus(pokemon: Pokemon): { canAttack: boolean; message?: string; pokemon?: Pokemon };

  /**
   * Applique les dégâts de statut en fin de tour
   */
  applyStatusDamage(pokemon: Pokemon): { pokemon: Pokemon; message?: string };

  /**
   * Applique un effet d'attaque (chance d'appliquer un statut, etc.)
   */
  applyMoveEffect(
    attacker: Pokemon,
    defender: Pokemon,
    move: Move
  ): { defender: Pokemon; message?: string };

  /**
   * Modifie l'attaque/défense selon le statut
   */
  getModifiedStat(pokemon: Pokemon, stat: 'attack' | 'defense' | 'specialAttack' | 'specialDefense' | 'speed'): number;
}
