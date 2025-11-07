import { Item } from '@/domain/entities/Item';
import { Pokemon } from '@/domain/entities/Pokemon';
import { Trainer } from '@/domain/entities/Trainer';

export interface ItemReward {
  item: Item;
  selected: boolean;
}

export interface PokemonReward {
  pokemon: Pokemon;
  selected: boolean;
}

export interface RewardOptions {
  points: number;
  itemOptions: ItemReward[];
  pokemonOptions: PokemonReward[];
  maxItemSelections: number;
  maxPokemonSelections: number;
}

/**
 * Interface pour la gestion des récompenses après combat
 * Définit les opérations de génération et de distribution de récompenses
 */
export interface IRewardsUseCase {
  /**
   * Génère les options de récompenses après une victoire
   * @param opponentLevel Le niveau de l'adversaire vaincu
   * @param victorySpe Le type de victoire (quick, normal, hard)
   * @param playerTeamSize La taille de l'équipe du joueur
   * @returns Les options de récompenses disponibles
   */
  generateRewardOptions(
    opponentLevel: number,
    victorySpe: 'quick' | 'normal' | 'hard',
    playerTeamSize: number
  ): Promise<RewardOptions>;

  /**
   * Détermine le message de félicitations selon les performances
   * @param victorySpe Le type de victoire
   * @param opponentName Le nom de l'adversaire
   * @returns Le message de victoire personnalisé
   */
  getVictoryMessage(victorySpe: 'quick' | 'normal' | 'hard', opponentName: string): string;

  /**
   * Remplace un Pokémon dans l'équipe du joueur
   * @param player Le dresseur joueur
   * @param pokemonToReplaceId L'ID du Pokémon à remplacer
   * @param newPokemon Le nouveau Pokémon à ajouter
   * @returns Le dresseur avec l'équipe mise à jour
   */
  replacePokemonInTeam(player: Trainer, pokemonToReplaceId: string, newPokemon: Pokemon): Trainer;
}
