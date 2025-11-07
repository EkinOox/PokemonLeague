import { Pokemon } from '../../domain/entities/Pokemon';
import { Item } from '../../domain/entities/Item';

export class HealPokemonUseCase {
  execute(pokemon: Pokemon, item: Item): { success: boolean } {
    if (item.type !== 'healing') {
      throw new Error('Item is not a healing item');
    }

    const healAmount = item.effect;
    pokemon.currentHp = Math.min(pokemon.maxHp, pokemon.currentHp + healAmount);

    return { success: true };
  }
}