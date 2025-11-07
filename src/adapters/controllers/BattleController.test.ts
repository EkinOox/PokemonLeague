import { BattleController } from './BattleController';
import { StartBattleUseCase } from '../../app/usecases/StartBattleUseCase';
import { AttackUseCase } from '../../app/usecases/AttackUseCase';
import { ITrainerRepository } from '../../domain/ports/ITrainerRepository';
import { IBattleRepository } from '../../domain/ports/IBattleRepository';
import { IPokemonRepository } from '../../domain/ports/IPokemonRepository';
import { Trainer } from '../../domain/entities/Trainer';
import { Battle } from '../../domain/entities/Battle';
import { Pokemon } from '../../domain/entities/Pokemon';

describe('BattleController', () => {
  let controller: BattleController;
  let mockStartBattleUseCase: jest.Mocked<StartBattleUseCase>;
  let mockAttackUseCase: jest.Mocked<AttackUseCase>;
  let mockTrainerRepository: jest.Mocked<ITrainerRepository>;
  let mockBattleRepository: jest.Mocked<IBattleRepository>;
  let mockPokemonRepository: jest.Mocked<IPokemonRepository>;

  beforeEach(() => {
    mockStartBattleUseCase = {
      execute: jest.fn(),
    } as any;
    mockAttackUseCase = {
      execute: jest.fn(),
    } as any;
    mockTrainerRepository = {
      findById: jest.fn(),
    };
    mockBattleRepository = {
      findById: jest.fn(),
      save: jest.fn(),
    };
    mockPokemonRepository = {
      findById: jest.fn(),
      save: jest.fn(),
    };
    controller = new BattleController(
      mockStartBattleUseCase,
      mockAttackUseCase,
      mockTrainerRepository,
      mockBattleRepository,
      mockPokemonRepository
    );
  });

  it('should handle start battle request', async () => {
    const trainer1 = new Trainer();
    const trainer2 = new Trainer();
    const battle = new Battle();
    mockTrainerRepository.findById.mockResolvedValueOnce(trainer1).mockResolvedValueOnce(trainer2);
    mockStartBattleUseCase.execute.mockReturnValue(battle);
    const req = { body: { trainer1Id: '1', trainer2Id: '2' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await controller.startBattle(req as any, res as any);
    expect(res.json).toHaveBeenCalledWith(battle);
  });

  it('should handle attack request', async () => {
    const battle = new Battle();
    const attacker = new Pokemon();
    const defender = new Pokemon();
    const result = { damage: 50, isCritical: false, effectiveness: 1 };
    mockBattleRepository.findById.mockResolvedValue(battle);
    mockPokemonRepository.findById.mockResolvedValueOnce(attacker).mockResolvedValueOnce(defender);
    mockAttackUseCase.execute.mockReturnValue(result);
    const req = { body: { battleId: '1', attackerId: '1', defenderId: '2' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await controller.attack(req as any, res as any);
    expect(res.json).toHaveBeenCalledWith(result);
  });

  it('should return 400 for invalid battle id', async () => {
    mockBattleRepository.findById.mockResolvedValue(null);
    const req = { body: { battleId: 'invalid', attackerId: '1', defenderId: '2' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await controller.attack(req as any, res as any);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});