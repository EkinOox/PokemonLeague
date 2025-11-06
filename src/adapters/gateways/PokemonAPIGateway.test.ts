import { PokemonAPIGateway } from './PokemonAPIGateway';

describe('PokemonAPIGateway', () => {
  let gateway: PokemonAPIGateway;

  beforeEach(() => {
    gateway = new PokemonAPIGateway();
  });

  it('should fetch pokemon data from API', async () => {
    const pokemon = await gateway.getPokemon('pikachu');
    expect(pokemon).toBeDefined();
    expect(pokemon.name).toBe('pikachu');
    expect(pokemon.types).toBeDefined();
    expect(pokemon.stats).toBeDefined();
  });

  it('should return null for non-existent pokemon', async () => {
    const pokemon = await gateway.getPokemon('nonexistent');
    expect(pokemon).toBeNull();
  });

  it('should handle API errors', async () => {
    // Mock API failure
    const pokemon = await gateway.getPokemon('error');
    expect(pokemon).toBeNull();
  });
});