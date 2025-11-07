import { PokemonAPIGateway } from './PokemonAPIGateway';

// Mock fetch
global.fetch = jest.fn();

describe('PokemonAPIGateway', () => {
  let gateway: PokemonAPIGateway;

  beforeEach(() => {
    gateway = new PokemonAPIGateway();
    (global.fetch as jest.Mock).mockClear();
  });

  it('should fetch pokemon data from API', async () => {
    const mockData = {
      pokedex_id: 25,
      name: { fr: 'Pikachu', en: 'Pikachu' },
      types: [{ name: 'Électrik' }],
      stats: { hp: 35, atk: 55, def: 40, spe_atk: 50, spe_def: 50, vit: 90 },
      talents: [{ name: 'Statik', tc: false }],
      sprites: { regular: 'https://example.com/pikachu.png' }
    };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const pokemon = await gateway.getPokemon('25');
    expect(pokemon).toBeDefined();
    expect(pokemon!.name).toBe('Pikachu');
    expect(pokemon!.types).toEqual(['Électrik']);
    expect(pokemon!.stats.hp).toBe(35);
    expect(pokemon!.moves).toHaveLength(4); // Should always have 4 moves
    expect(pokemon!.sprite).toBe('https://example.com/pikachu.png');
  });

  it('should convert talents to moves', async () => {
    const mockData = {
      pokedex_id: 1,
      name: { fr: 'Bulbizarre', en: 'Bulbasaur' },
      types: [{ name: 'Plante' }, { name: 'Poison' }],
      stats: { hp: 45, atk: 49, def: 49, spe_atk: 65, spe_def: 65, vit: 45 },
      talents: [
        { name: 'Engrais', tc: false },
        { name: 'Chlorophylle', tc: true }
      ],
      sprites: { regular: 'https://example.com/bulbasaur.png' }
    };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const pokemon = await gateway.getPokemon('1');
    expect(pokemon).toBeDefined();
    expect(pokemon!.moves).toHaveLength(4);
    // Should have moves based on types (Plante/Poison) or talents
    expect(pokemon!.moves.length).toBeGreaterThan(0);
    // Verify all moves are strings
    pokemon!.moves.forEach(move => {
      expect(typeof move).toBe('string');
    });
  });

  it('should fill missing moves with type-based moves', async () => {
    const mockData = {
      pokedex_id: 4,
      name: { fr: 'Salamèche', en: 'Charmander' },
      types: [{ name: 'Feu' }],
      stats: { hp: 39, atk: 52, def: 43, spe_atk: 60, spe_def: 50, vit: 65 },
      talents: [{ name: 'Brasier', tc: false }], // Only 1 talent
      sprites: { regular: 'https://example.com/charmander.png' }
    };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const pokemon = await gateway.getPokemon('4');
    expect(pokemon).toBeDefined();
    expect(pokemon!.moves).toHaveLength(4); // Should be filled to 4
    expect(pokemon!.moves).toContain('fire-blast'); // From "Brasier" talent
    // Other moves should be fire-type or normal-type moves
  });

  it('should generate random moves when no talents', async () => {
    const mockData = {
      pokedex_id: 100,
      name: { fr: 'Voltorbe', en: 'Voltorb' },
      types: [{ name: 'Électrik' }],
      stats: { hp: 40, atk: 30, def: 50, spe_atk: 55, spe_def: 55, vit: 100 },
      talents: [], // No talents
      sprites: { regular: 'https://example.com/voltorb.png' }
    };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const pokemon = await gateway.getPokemon('100');
    expect(pokemon).toBeDefined();
    expect(pokemon!.moves).toHaveLength(4);
    // All moves should be from type-based generation
  });

  it('should set emoji based on primary type', async () => {
    const mockData = {
      pokedex_id: 25,
      name: { fr: 'Pikachu', en: 'Pikachu' },
      types: [{ name: 'Électrik' }],
      stats: { hp: 35, atk: 55, def: 40, spe_atk: 50, spe_def: 50, vit: 90 },
      talents: [{ name: 'Statik', tc: false }],
      sprites: { regular: 'https://example.com/pikachu.png' }
    };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const pokemon = await gateway.getPokemon('25');
    expect(pokemon).toBeDefined();
    expect(pokemon!.emoji).toBe('⚡'); // Electric type emoji
  });

  it('should return null for non-existent pokemon', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    const pokemon = await gateway.getPokemon('nonexistent');
    expect(pokemon).toBeNull();
  });

  it('should handle API errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const pokemon = await gateway.getPokemon('error');
    expect(pokemon).toBeNull();
  });
});