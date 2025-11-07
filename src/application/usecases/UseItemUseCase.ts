import { Pokemon, StatusCondition } from '../../domain/entities/Pokemon';
import { Item } from '../../domain/entities/Item';
import { IMathService } from '@/domain/ports/IMathService';
import { IUseItemUseCase } from '@/domain/ports/IUseItemUseCase';

export class UseItemUseCase implements IUseItemUseCase {
  constructor(private mathService: IMathService) {}

  execute(pokemon: Pokemon, item: Item): { success: boolean; message: string; pokemon?: Pokemon } {
    if (item.type === 'healing') {
      if (item.name.toLowerCase().includes('revive')) {
        // Revive only works on KO pokemon
        if (pokemon.currentHp > 0) {
          return { success: false, message: 'Pokemon is not knocked out' };
        }
        const updatedPokemon = {
          ...pokemon,
          currentHp: this.mathService.floor(pokemon.maxHp / 2)
        };
        return { success: true, message: 'Pokemon revived', pokemon: updatedPokemon };
      } else {
        // Healing items
        if (pokemon.currentHp === 0) {
          return { success: false, message: 'Cannot heal knocked out pokemon' };
        }
        if (pokemon.currentHp === pokemon.maxHp) {
          return { success: false, message: 'Pokemon is already at full HP' };
        }
        const healAmount = item.effect;
        const newHp = this.mathService.min(pokemon.maxHp, pokemon.currentHp + healAmount);
        const updatedPokemon = {
          ...pokemon,
          currentHp: newHp
        };
        
        // Special case: full-restore also cures status
        if (item.name.toLowerCase().includes('restauration totale') || item.name.toLowerCase().includes('full-restore')) {
          const statusCured = pokemon.status;
          const fullRestorePokemon = {
            ...updatedPokemon,
            status: null as StatusCondition,
            statusTurns: undefined
          };
          
          const healMessage = `Pokemon healed for ${healAmount} HP`;
          if (statusCured) {
            const statusNames: Record<string, string> = {
              'burn': 'brûlure',
              'freeze': 'gel',
              'paralysis': 'paralysie',
              'poison': 'poison',
              'badly-poison': 'poison grave',
              'sleep': 'sommeil',
              'confusion': 'confusion'
            };
            return { 
              success: true, 
              message: `${healMessage} et n'est plus ${statusNames[statusCured]} !`,
              pokemon: fullRestorePokemon
            };
          }
          return { success: true, message: healMessage, pokemon: updatedPokemon };
        }
        
        return { success: true, message: `Pokemon healed for ${healAmount} HP`, pokemon: updatedPokemon };
      }
    }

    if (item.type === 'status-heal') {
      // Status healing items
      if (!pokemon.status || pokemon.status === null) {
        return { success: false, message: `${pokemon.name} n'a pas de statut !` };
      }

      // Determine which status this item cures based on item name
      const curedStatus = this.getCuredStatus(item.name);
      if (curedStatus !== null && !this.canCureStatus(pokemon.status, curedStatus)) {
        return { success: false, message: `${item.name} ne peut pas soigner ce statut !` };
      }

      // Cure the status
      const updatedPokemon = {
        ...pokemon,
        status: null as StatusCondition,
        statusTurns: undefined
      };

      const statusNames: Record<string, string> = {
        'burn': 'brûlure',
        'freeze': 'gel',
        'paralysis': 'paralysie',
        'poison': 'poison',
        'badly-poison': 'poison grave',
        'sleep': 'sommeil',
        'confusion': 'confusion'
      };

      return {
        success: true,
        message: `${pokemon.name} n'est plus ${statusNames[pokemon.status]} !`,
        pokemon: updatedPokemon
      };
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

  /**
   * Determine which status an item cures based on its name
   */
  private getCuredStatus(itemName: string): StatusCondition | null {
    const name = itemName.toLowerCase();

    if (name.includes('antidote') || name.includes('anti-poison')) {
      return 'poison';
    }
    if (name.includes('anti-para') || name.includes('antipara')) {
      return 'paralysis';
    }
    if (name.includes('anti-brûle') || name.includes('antibrule') || name.includes('anti-brule')) {
      return 'burn';
    }
    if (name.includes('antigel') || name.includes('anti-gel')) {
      return 'freeze';
    }
    if (name.includes('réveil') || name.includes('reveil') || name.includes('awakening')) {
      return 'sleep';
    }
    if (name.includes('guérison') || name.includes('guerison') || name.includes('full-heal') || name.includes('total soin')) {
      return null; // Cures all statuses
    }

    return null;
  }

  /**
   * Check if an item can cure the Pokemon's current status
   */
  private canCureStatus(currentStatus: StatusCondition, curedStatus: StatusCondition | null): boolean {
    if (curedStatus === null) {
      // Total heal cures all statuses
      return true;
    }
    return currentStatus === curedStatus;
  }
}
