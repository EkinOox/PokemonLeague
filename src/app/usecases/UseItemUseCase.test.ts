import { UseItemUseCase } from './UseItemUseCase';
import { Pokemon } from '../../domain/entities/Pokemon';
import { Item } from '../../domain/entities/Item';

describe('UseItemUseCase', () => {
  let useCase: UseItemUseCase;
  let pokemon: Pokemon;

  beforeEach(() => {
    useCase = new UseItemUseCase();
    pokemon = new Pokemon();
    pokemon.id = '1';
    pokemon.name = 'Pikachu';
    pokemon.types = ['electric'];
    pokemon.stats = { hp: 100, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90 };
    pokemon.currentHp = 50;
    pokemon.maxHp = 100;
    pokemon.level = 5;
    pokemon.moves = ['thunderbolt'];
  });

  describe('Healing items', () => {
    it('should heal pokemon with potion', () => {
      const potion: Item = { id: '1', name: 'Potion', type: 'healing', effect: 20 };
      const result = useCase.execute(pokemon, potion);
      expect(result.success).toBe(true);
      expect(pokemon.currentHp).toBe(70);
      expect(result.message).toContain('healed');
    });

    it('should heal pokemon with super potion', () => {
      const superPotion: Item = { id: '2', name: 'Super Potion', type: 'healing', effect: 50 };
      const result = useCase.execute(pokemon, superPotion);
      expect(result.success).toBe(true);
      expect(pokemon.currentHp).toBe(100);
    });

    it('should not exceed max HP when healing', () => {
      pokemon.currentHp = 90;
      const potion: Item = { id: '1', name: 'Potion', type: 'healing', effect: 20 };
      const result = useCase.execute(pokemon, potion);
      expect(pokemon.currentHp).toBe(100);
      expect(result.success).toBe(true);
    });

    it('should fail to heal pokemon at full HP', () => {
      pokemon.currentHp = 100;
      const potion: Item = { id: '1', name: 'Potion', type: 'healing', effect: 20 };
      const result = useCase.execute(pokemon, potion);
      expect(result.success).toBe(false);
      expect(result.message).toContain('already at full HP');
      expect(pokemon.currentHp).toBe(100);
    });

    it('should fail to heal knocked out pokemon with normal healing item', () => {
      pokemon.currentHp = 0;
      const potion: Item = { id: '1', name: 'Potion', type: 'healing', effect: 20 };
      const result = useCase.execute(pokemon, potion);
      expect(result.success).toBe(false);
      expect(result.message).toContain('knocked out');
      expect(pokemon.currentHp).toBe(0);
    });
  });

  describe('Revive items', () => {
    it('should revive knocked out pokemon', () => {
      pokemon.currentHp = 0;
      const revive: Item = { id: 'revive', name: 'Revive', type: 'healing', effect: 0 };
      const result = useCase.execute(pokemon, revive);
      expect(result.success).toBe(true);
      expect(pokemon.currentHp).toBe(50); // Half of max HP
      expect(result.message).toContain('revived');
    });

    it('should fail to revive pokemon that is not knocked out', () => {
      pokemon.currentHp = 50;
      const revive: Item = { id: 'revive', name: 'Revive', type: 'healing', effect: 0 };
      const result = useCase.execute(pokemon, revive);
      expect(result.success).toBe(false);
      expect(result.message).toContain('not knocked out');
      expect(pokemon.currentHp).toBe(50);
    });

    it('should revive pokemon with Max Revive', () => {
      pokemon.currentHp = 0;
      const maxRevive: Item = { id: 'max-revive', name: 'Max Revive', type: 'healing', effect: 0 };
      const result = useCase.execute(pokemon, maxRevive);
      expect(result.success).toBe(true);
      expect(pokemon.currentHp).toBe(50);
    });
  });

  describe('Boost items', () => {
    it('should apply X Attack boost', () => {
      const xAttack: Item = { id: 'x-attack', name: 'X Attack', type: 'boost', effect: 1.5 };
      const result = useCase.execute(pokemon, xAttack);
      expect(result.success).toBe(true);
      expect(result.message).toContain('boost');
    });

    it('should apply X Defense boost', () => {
      const xDefense: Item = { id: 'x-defense', name: 'X Defense', type: 'boost', effect: 1.5 };
      const result = useCase.execute(pokemon, xDefense);
      expect(result.success).toBe(true);
      expect(result.message).toContain('boost');
    });

    it('should apply X Speed boost', () => {
      const xSpeed: Item = { id: 'x-speed', name: 'X Speed', type: 'boost', effect: 1.5 };
      const result = useCase.execute(pokemon, xSpeed);
      expect(result.success).toBe(true);
      expect(result.message).toContain('boost');
    });
  });

  describe('Other items', () => {
    it('should activate shield', () => {
      const shield: Item = { id: 'shield', name: 'Shield', type: 'other', effect: 1 };
      const result = useCase.execute(pokemon, shield);
      expect(result.success).toBe(true);
      expect(result.message).toContain('Shield activated');
    });

    it('should fail for unknown item type', () => {
      const unknown: Item = { id: 'unknown', name: 'Unknown', type: 'ball', effect: 0 };
      const result = useCase.execute(pokemon, unknown);
      expect(result.success).toBe(false);
      expect(result.message).toContain('Unknown item type');
    });
  });

  describe('Edge cases', () => {
    it('should handle healing from 1 HP', () => {
      pokemon.currentHp = 1;
      const hyperPotion: Item = { id: '3', name: 'Hyper Potion', type: 'healing', effect: 100 };
      const result = useCase.execute(pokemon, hyperPotion);
      expect(result.success).toBe(true);
      expect(pokemon.currentHp).toBe(100);
    });

    it('should handle multiple item uses in sequence', () => {
      const potion: Item = { id: '1', name: 'Potion', type: 'healing', effect: 20 };
      
      useCase.execute(pokemon, potion);
      expect(pokemon.currentHp).toBe(70);
      
      useCase.execute(pokemon, potion);
      expect(pokemon.currentHp).toBe(90);
      
      const result = useCase.execute(pokemon, potion);
      expect(pokemon.currentHp).toBe(100);
      expect(result.success).toBe(true);
    });

    it('should handle revive followed by heal', () => {
      pokemon.currentHp = 0;
      const revive: Item = { id: 'revive', name: 'Revive', type: 'healing', effect: 0 };
      const potion: Item = { id: 'potion', name: 'Potion', type: 'healing', effect: 20 };
      
      useCase.execute(pokemon, revive);
      expect(pokemon.currentHp).toBe(50);
      
      const result = useCase.execute(pokemon, potion);
      expect(pokemon.currentHp).toBe(70);
      expect(result.success).toBe(true);
    });
  });
});
