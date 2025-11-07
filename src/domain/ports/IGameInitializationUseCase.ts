import { Pokemon } from '@/domain/entities/Pokemon';
import { Trainer } from '@/domain/entities/Trainer';

export interface PokemonSet {
  pokemons: Pokemon[];
  theme: string;
}

/**
 * Interface pour l'initialisation du jeu
 * Définit les opérations de création des sets de démarrage et du dresseur joueur
 */
export interface IGameInitializationUseCase {
  /**
   * Génère plusieurs sets de Pokémon de départ
   * @param availablePokemons La liste des Pokémon disponibles
   * @param count Le nombre de sets à générer
   * @returns Les sets de Pokémon générés
   */
  generateStarterSets(availablePokemons: Pokemon[], count?: number): PokemonSet[];

  /**
   * Crée le dresseur joueur avec le set sélectionné
   * @param name Le nom du dresseur
   * @param selectedSet Le set de Pokémon choisi
   * @returns Le dresseur créé
   */
  createStarterTrainer(name: string, selectedSet: PokemonSet): Trainer;

  /**
   * Valide la sélection d'un set
   * @param sets Les sets disponibles
   * @param selectedIndex L'index du set sélectionné
   * @returns true si la sélection est valide
   */
  validateSetSelection(sets: PokemonSet[], selectedIndex: number): boolean;
}
