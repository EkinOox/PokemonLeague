import { PokemonController } from './PokemonController';
import { GetTrainerPokemonsUseCase } from '../../app/usecases/GetTrainerPokemonsUseCase';
import { ITrainerRepository } from '../../domain/ports/ITrainerRepository';

describe('PokemonController', () => {
  let controller: PokemonController;
  let mockGetTrainerPokemonsUseCase: jest.Mocked<GetTrainerPokemonsUseCase>;
  let mockTrainerRepository: jest.Mocked<ITrainerRepository>;

  beforeEach(() => {
    mockGetTrainerPokemonsUseCase = {
      execute: jest.fn(),
    } as any;
    mockTrainerRepository = {
      findById: jest.fn(),
    };
    controller = new PokemonController(mockGetTrainerPokemonsUseCase, mockTrainerRepository);
  });

  it('should handle get pokemon request', async () => {
    const req = { params: { id: 'pikachu' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await controller.getPokemon(req as any, res as any);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'pikachu' }));
  });

  it('should handle get trainer pokemons request', async () => {
    mockGetTrainerPokemonsUseCase.execute.mockResolvedValue([]);
    const req = { params: { trainerId: '1' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await controller.getTrainerPokemons(req as any, res as any);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it('should return 404 for non-existent pokemon', async () => {
    const req = { params: { id: 'nonexistent' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await controller.getPokemon(req as any, res as any);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});