import { Pokemon } from '@/domain/entities/Pokemon';
import { Item } from '@/domain/entities/Item';

/**
 * Interface pour l'utilisation des objets
 * Définit les opérations d'utilisation d'objets sur les Pokémon
 */
export interface IUseItemUseCase {
  /**
   * Utilise un objet sur un Pokémon
   * @param pokemon Le Pokémon cible
   * @param item L'objet à utiliser
   * @returns Le résultat de l'utilisation avec succès, message et Pokémon éventuellement modifié
   */
  execute(pokemon: Pokemon, item: Item): { success: boolean; message: string; pokemon?: Pokemon };
}
