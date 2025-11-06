import { Pokemon } from './Pokemon';

describe('Pokemon', () => {
  it('should create a pokemon with required properties', () => {
    const pokemon = new Pokemon();
    pokemon.id = '1';
    pokemon.name = 'Pikachu';
    pokemon.types = ['electric'];
    pokemon.stats = { hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90 };
    pokemon.level = 5;
    pokemon.currentHp = 35;
    pokemon.maxHp = 35;
    pokemon.moves = ['thunderbolt'];

    expect(pokemon.id).toBe('1');
    expect(pokemon.name).toBe('Pikachu');
    expect(pokemon.types).toEqual(['electric']);
    expect(pokemon.level).toBe(5);
  });

  it('should handle multiple types', () => {
    const pokemon = new Pokemon();
    pokemon.types = ['fire', 'flying'];
    expect(pokemon.types.length).toBe(2);
  });
});