import { Pokemon } from '../../domain/entities/Pokemon';
import { Item } from '../../domain/entities/Item';

export class UseItemUseCase {
  execute(pokemon: Pokemon, item: Item): { success: boolean; message: string } {
    if (item.type === 'healing') {
      if (item.name.toLowerCase().includes('revive')) {
        // Revive only works on KO pokemon
        if (pokemon.currentHp > 0) {
          return { success: false, message: 'Pokemon is not knocked out' };
        }
        pokemon.currentHp = Math.floor(pokemon.maxHp / 2);
        return { success: true, message: 'Pokemon revived' };
      } else {
        // Healing items
        if (pokemon.currentHp === 0) {
          return { success: false, message: 'Cannot heal knocked out pokemon' };
        }
        if (pokemon.currentHp === pokemon.maxHp) {
          return { success: false, message: 'Pokemon is already at full HP' };
        }
        const healAmount = item.effect;
        pokemon.currentHp = Math.min(pokemon.maxHp, pokemon.currentHp + healAmount);
        return { success: true, message: `Pokemon healed for ${healAmount} HP` };
      }
    }

    if (item.type === 'boost') {
      // Boost items increase stats temporarily
      // This would need a "boost" property in Pokemon entity for full implementation
      // For now, we'll just return success
      return { success: true, message: `Applied ${item.name} boost` };
    }

    if (item.type === 'other') {
      // Shield or other special items
      if (item.name.toLowerCase().includes('shield')) {
        return { success: true, message: 'Shield activated' };
      }
    }

    return { success: false, message: 'Unknown item type' };
  }
}
