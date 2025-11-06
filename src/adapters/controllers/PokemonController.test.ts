import { PokemonController } from './PokemonController';

describe('PokemonController', () => {
  let controller: PokemonController;

  beforeEach(() => {
    controller = new PokemonController();
  });

  it('should handle get pokemon request', () => {
    const req = { params: { id: 'pikachu' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    controller.getPokemon(req as any, res as any);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'pikachu' }));
  });

  it('should handle get trainer pokemons request', () => {
    const req = { params: { trainerId: '1' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    controller.getTrainerPokemons(req as any, res as any);
    expect(res.json).toHaveBeenCalledWith(expect.any(Array));
  });

  it('should return 404 for non-existent pokemon', () => {
    const req = { params: { id: 'nonexistent' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    controller.getPokemon(req as any, res as any);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});