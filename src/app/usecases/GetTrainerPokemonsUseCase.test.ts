import { GetTrainerPokemonsUseCase } from './GetTrainerPokemonsUseCase';
import { Trainer } from '../../domain/entities/Trainer';
import { Pokemon } from '../../domain/entities/Pokemon';

describe('GetTrainerPokemonsUseCase', () => {
  let useCase: GetTrainerPokemonsUseCase;
  let trainer: Trainer;

  beforeEach(() => {
    useCase = new GetTrainerPokemonsUseCase();
    trainer = new Trainer();
    trainer.team = [new Pokemon(), new Pokemon()];
  });

  it('should return trainer pokemon team', () => {
    const pokemons = useCase.execute(trainer.id);
    expect(pokemons).toEqual(trainer.team);
    expect(pokemons.length).toBe(2);
  });

  it('should return empty array if trainer has no pokemon', () => {
    trainer.team = [];
    const pokemons = useCase.execute(trainer.id);
    expect(pokemons).toEqual([]);
  });

  it('should return sorted team by level', () => {
    trainer.team[0].level = 5;
    trainer.team[1].level = 10;
    const pokemons = useCase.execute(trainer.id);
    expect(pokemons[0].level).toBe(10);
    expect(pokemons[1].level).toBe(5);
  });
});