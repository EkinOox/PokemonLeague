import { RewardService } from './RewardService';
import { Pokemon } from '../entities/Pokemon';
import { Item } from '../entities/Item';

describe('RewardService', () => {
  let service: RewardService;

  beforeEach(() => {
    service = new RewardService();
  });

  describe('generateItemRewards', () => {
    it('should generate 5 random items by default', () => {
      const rewards = service.generateItemRewards();
      expect(rewards).toHaveLength(5);
      rewards.forEach(item => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('type');
        expect(item).toHaveProperty('effect');
      });
    });

    it('should generate custom number of items', () => {
      const rewards = service.generateItemRewards(3);
      expect(rewards).toHaveLength(3);
    });

    it('should generate different items (random)', () => {
      const rewards1 = service.generateItemRewards(5);
      const rewards2 = service.generateItemRewards(5);
      // Check that items can be different (at least some variation in names or types)
      const names1 = rewards1.map(r => r.name);
      const names2 = rewards2.map(r => r.name);
      const types1 = rewards1.map(r => r.type);
      const types2 = rewards2.map(r => r.type);

      // At least some items should be different due to randomness
      const hasDifferentNames = names1.some(name => !names2.includes(name)) || names2.some(name => !names1.includes(name));
      const hasDifferentTypes = types1.some(type => !types2.includes(type)) || types2.some(type => !types1.includes(type));

      expect(hasDifferentNames || hasDifferentTypes).toBe(true);
    });

    it('should include healing items', () => {
      const rewards = service.generateItemRewards(10);
      const healingItems = rewards.filter(item => item.type === 'healing');
      expect(healingItems.length).toBeGreaterThan(0);
    });

    it('should include boost items', () => {
      const rewards = service.generateItemRewards(10);
      const boostItems = rewards.filter(item => item.type === 'boost');
      expect(boostItems.length).toBeGreaterThan(0);
    });

    it('should have unique IDs for each generated item', () => {
      const rewards = service.generateItemRewards(5);
      const ids = rewards.map(r => r.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('shouldOfferPokemon', () => {
    it('should return boolean', () => {
      const result = service.shouldOfferPokemon();
      expect(typeof result).toBe('boolean');
    });

    it('should offer pokemon approximately 30% of the time', () => {
      const trials = 1000;
      let offeredCount = 0;
      for (let i = 0; i < trials; i++) {
        if (service.shouldOfferPokemon()) {
          offeredCount++;
        }
      }
      // Allow 20-40% range due to randomness
      expect(offeredCount).toBeGreaterThan(trials * 0.2);
      expect(offeredCount).toBeLessThan(trials * 0.4);
    });
  });

  describe('generatePokemonRewards', () => {
    it('should generate 3 pokemon rewards by default', () => {
      const availablePokemons: Pokemon[] = [
        { id: '1', name: 'Pikachu', types: ['electric'], stats: {} as any, level: 5, currentHp: 35, maxHp: 35, moves: [] },
        { id: '2', name: 'Charmander', types: ['fire'], stats: {} as any, level: 5, currentHp: 39, maxHp: 39, moves: [] },
        { id: '3', name: 'Squirtle', types: ['water'], stats: {} as any, level: 5, currentHp: 44, maxHp: 44, moves: [] },
        { id: '4', name: 'Bulbasaur', types: ['grass', 'poison'], stats: {} as any, level: 5, currentHp: 45, maxHp: 45, moves: [] },
      ];

      const rewards = service.generatePokemonRewards(3, availablePokemons);
      expect(rewards).toHaveLength(3);
    });

    it('should return empty array if no pokemons available', () => {
      const rewards = service.generatePokemonRewards(3, []);
      expect(rewards).toEqual([]);
    });

    it('should return pokemons from available pool', () => {
      const availablePokemons: Pokemon[] = [
        { id: '1', name: 'Pikachu', types: ['electric'], stats: {} as any, level: 5, currentHp: 35, maxHp: 35, moves: [] },
      ];

      const rewards = service.generatePokemonRewards(2, availablePokemons);
      expect(rewards).toHaveLength(2);
      rewards.forEach(pokemon => {
        expect(pokemon.name).toBe('Pikachu');
      });
    });

    it('should create copies of pokemons (not references)', () => {
      const original: Pokemon = { 
        id: '1', name: 'Pikachu', types: ['electric'], 
        stats: { hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90 }, 
        level: 5, currentHp: 35, maxHp: 35, moves: ['thunderbolt'] 
      };

      const rewards = service.generatePokemonRewards(1, [original]);
      rewards[0].currentHp = 10;
      expect(original.currentHp).toBe(35); // Original should not be modified
    });
  });
});
