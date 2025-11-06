import { HealPokemonUseCase } from './HealPokemonUseCase';
import { Pokemon } from '../../domain/entities/Pokemon';
import { Item } from '../../domain/entities/Item';

describe('HealPokemonUseCase', () => {
  let useCase: HealPokemonUseCase;
  let pokemon: Pokemon;
  let healingItem: Item;

  beforeEach(() => {
    useCase = new HealPokemonUseCase();
    pokemon = new Pokemon();
    pokemon.currentHp = 50;
    pokemon.maxHp = 100;
    healingItem = new Item();
    healingItem.type = 'healing';
    healingItem.effect = 30;
  });

  it('should heal pokemon and restore HP', () => {
    const result = useCase.execute(pokemon, healingItem);
    expect(pokemon.currentHp).toBe(80);
    expect(result.success).toBe(true);
  });

  it('should not exceed max HP', () => {
    pokemon.currentHp = 90;
    const result = useCase.execute(pokemon, healingItem);
    expect(pokemon.currentHp).toBe(100);
  });

  it('should handle full HP pokemon', () => {
    pokemon.currentHp = 100;
    const result = useCase.execute(pokemon, healingItem);
    expect(pokemon.currentHp).toBe(100);
    expect(result.success).toBe(true);
  });

  it('should throw error for non-healing item', () => {
    healingItem.type = 'boost';
    expect(() => useCase.execute(pokemon, healingItem)).toThrow('Item is not a healing item');
  });
});