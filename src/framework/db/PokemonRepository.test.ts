import { PokemonRepository } from './PokemonRepository';
import { Pokemon } from '../../domain/entities/Pokemon';

describe('PokemonRepository', () => {
  let repository: PokemonRepository;

  beforeEach(() => {
    repository = new PokemonRepository();
  });

  it('should save pokemon', async () => {
    const pokemon = new Pokemon();
    pokemon.id = '1';
    pokemon.name = 'Pikachu';
    await repository.save(pokemon);
    const retrieved = await repository.findById('1');
    expect(retrieved).toEqual(pokemon);
  });

  it('should find pokemon by id', async () => {
    const pokemon = new Pokemon();
    pokemon.id = '1';
    pokemon.name = 'Pikachu';
    await repository.save(pokemon);
    const found = await repository.findById('1');
    expect(found).toBeDefined();
    expect(found?.name).toBe('Pikachu');
  });

  it('should return null for non-existent pokemon', async () => {
    const found = await repository.findById('nonexistent');
    expect(found).toBeNull();
  });

  it('should update existing pokemon', async () => {
    const pokemon = new Pokemon();
    pokemon.id = '1';
    pokemon.currentHp = 50;
    await repository.save(pokemon);
    pokemon.currentHp = 30;
    await repository.save(pokemon);
    const retrieved = await repository.findById('1');
    expect(retrieved?.currentHp).toBe(30);
  });

  it('should find all pokemon', async () => {
    const pokemon1 = new Pokemon();
    pokemon1.id = '1';
    const pokemon2 = new Pokemon();
    pokemon2.id = '2';
    await repository.save(pokemon1);
    await repository.save(pokemon2);
    const all = await repository.findAll();
    expect(all.length).toBe(2);
  });
});