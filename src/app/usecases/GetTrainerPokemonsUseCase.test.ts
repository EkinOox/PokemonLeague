import { GetTrainerPokemonsUseCase } from './GetTrainerPokemonsUseCase';
import { Trainer } from '../../domain/entities/Trainer';
import { Pokemon } from '../../domain/entities/Pokemon';
import { ITrainerRepository } from '../../domain/ports/ITrainerRepository';

describe('GetTrainerPokemonsUseCase', () => {
  let useCase: GetTrainerPokemonsUseCase;
  let mockTrainerRepository: jest.Mocked<ITrainerRepository>;
  let trainer: Trainer;

  beforeEach(() => {
    mockTrainerRepository = {
      findById: jest.fn(),
    };
    useCase = new GetTrainerPokemonsUseCase(mockTrainerRepository);
    trainer = new Trainer();
    trainer.team = [new Pokemon(), new Pokemon()];
  });

  it('should return trainer pokemon team', async () => {
    mockTrainerRepository.findById.mockResolvedValue(trainer);
    const pokemons = await useCase.execute(trainer.id);
    expect(pokemons).toEqual(trainer.team);
    expect(pokemons.length).toBe(2);
  });

  it('should return empty array if trainer has no pokemon', async () => {
    trainer.team = [];
    mockTrainerRepository.findById.mockResolvedValue(trainer);
    const pokemons = await useCase.execute(trainer.id);
    expect(pokemons).toEqual([]);
  });

  it('should return sorted team by level', async () => {
    trainer.team[0].level = 5;
    trainer.team[1].level = 10;
    mockTrainerRepository.findById.mockResolvedValue(trainer);
    const pokemons = await useCase.execute(trainer.id);
    expect(pokemons[0].level).toBe(10);
    expect(pokemons[1].level).toBe(5);
  });
});