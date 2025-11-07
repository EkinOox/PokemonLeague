import { StartBattleUseCase } from './StartBattleUseCase';
import { Trainer } from '../../domain/entities/Trainer';
import { Battle } from '../../domain/entities/Battle';
import { Pokemon } from '../../domain/entities/Pokemon';
import { MockDateProvider } from './__mocks__/testHelpers';

describe('StartBattleUseCase', () => {
  let useCase: StartBattleUseCase;
  let trainer1: Trainer;
  let trainer2: Trainer;
  let mockDateProvider: MockDateProvider;

  beforeEach(() => {
    mockDateProvider = new MockDateProvider();
    useCase = new StartBattleUseCase(mockDateProvider);
    trainer1 = new Trainer();
    trainer2 = new Trainer();
    trainer1.team = [new Pokemon()];
    trainer2.team = [new Pokemon()];
  });

  it('should create a new battle between two trainers', () => {
    const battle = useCase.execute(trainer1, trainer2);
    expect(battle).toBeInstanceOf(Battle);
    expect(battle.trainer1).toBe(trainer1);
    expect(battle.trainer2).toBe(trainer2);
    expect(battle.status).toBe('ongoing');
    expect(battle.currentTurn).toBe(1);
  });

  it('should throw error if trainer1 has no pokemon', () => {
    trainer1.team = [];
    expect(() => useCase.execute(trainer1, trainer2)).toThrow('Trainer must have at least one pokemon');
  });

  it('should throw error if trainer2 has no pokemon', () => {
    trainer2.team = [];
    expect(() => useCase.execute(trainer1, trainer2)).toThrow('Trainer must have at least one pokemon');
  });

  it('should initialize battle with correct pokemon', () => {
    const battle = useCase.execute(trainer1, trainer2);
    expect(battle.trainer1.team[0]).toBe(trainer1.team[0]);
  });
});