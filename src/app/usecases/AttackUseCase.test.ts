import { AttackUseCase } from './AttackUseCase';
import { Battle } from '../../domain/entities/Battle';
import { Trainer } from '../../domain/entities/Trainer';
import { Pokemon } from '../../domain/entities/Pokemon';

describe('AttackUseCase', () => {
  let useCase: AttackUseCase;
  let battle: Battle;
  let attacker: Pokemon;
  let defender: Pokemon;

  beforeEach(() => {
    useCase = new AttackUseCase();
    battle = new Battle();
    attacker = new Pokemon();
    defender = new Pokemon();
    attacker.stats = { hp: 100, attack: 50, defense: 40, specialAttack: 50, specialDefense: 40, speed: 50 };
    defender.stats = { hp: 100, attack: 40, defense: 50, specialAttack: 40, specialDefense: 50, speed: 40 };
    attacker.currentHp = 100;
    defender.currentHp = 100;
    attacker.types = ['fire'];
    defender.types = ['grass'];
  });

  it('should perform normal attack and reduce defender HP', () => {
    const result = useCase.execute(battle, attacker, defender);
    expect(defender.currentHp).toBeLessThan(100);
    expect(result.damage).toBeGreaterThan(0);
    expect(result.isCritical).toBeDefined();
  });

  it('should handle super effective damage', () => {
    const initialHp = defender.currentHp;
    const result = useCase.execute(battle, attacker, defender);
    expect(result.damage).toBeGreaterThan(50); // Base damage amplified
  });

  it('should not reduce HP below 0', () => {
    defender.currentHp = 10;
    const result = useCase.execute(battle, attacker, defender);
    expect(defender.currentHp).toBeGreaterThanOrEqual(0);
  });

  it('should return attack result with details', () => {
    const result = useCase.execute(battle, attacker, defender);
    expect(result).toHaveProperty('damage');
    expect(result).toHaveProperty('isCritical');
    expect(result).toHaveProperty('effectiveness');
  });
});