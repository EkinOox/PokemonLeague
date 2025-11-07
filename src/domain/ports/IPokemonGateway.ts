import { Pokemon } from '@/domain/entities/Pokemon';

/**
 * Interface pour récupérer les informations sur les Pokémon
 * Port de sortie pour accéder aux données des Pokémon depuis une source externe
 */
export interface IPokemonGateway {
  /**
   * Récupère un Pokémon par son ID
   * @param id L'identifiant du Pokémon
   * @returns Le Pokémon trouvé ou null si non trouvé
   */
  getPokemon(id: string): Promise<Pokemon | null>;
}
