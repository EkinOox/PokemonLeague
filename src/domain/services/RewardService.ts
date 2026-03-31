import { Pokemon } from '../entities/Pokemon';
import { Item } from '../entities/Item';

export class RewardService {
  generateItemRewards(count: number = 5): Item[] {
    const itemTemplates: Item[] = [
      { id: 'potion', name: 'Potion', type: 'healing', effect: 20 },
      { id: 'super-potion', name: 'Super Potion', type: 'healing', effect: 50 },
      { id: 'hyper-potion', name: 'Hyper Potion', type: 'healing', effect: 100 },
      { id: 'revive', name: 'Revive', type: 'healing', effect: 0 }, // Special: revives KO pokemon
      { id: 'x-attack', name: 'X Attack', type: 'boost', effect: 1.5 },
      { id: 'x-defense', name: 'X Defense', type: 'boost', effect: 1.5 },
      { id: 'x-speed', name: 'X Speed', type: 'boost', effect: 1.5 },
      { id: 'shield', name: 'Shield', type: 'other', effect: 1 }, // Blocks 1 attack
    ];

    const rewards: Item[] = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * itemTemplates.length);
      const item = { ...itemTemplates[randomIndex], id: `${itemTemplates[randomIndex].id}-${Date.now()}-${i}` };
      rewards.push(item);
    }
    return rewards;
  }

  shouldOfferPokemon(): boolean {
    // 30% chance to offer a new Pokemon
    return Math.random() < 0.3;
  }

  generatePokemonRewards(count: number = 3, availablePokemons: Pokemon[]): Pokemon[] {
    if (availablePokemons.length === 0) {
      return [];
    }

    const rewards: Pokemon[] = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * availablePokemons.length);
      rewards.push({ ...availablePokemons[randomIndex] });
    }
    return rewards;
  }
}
