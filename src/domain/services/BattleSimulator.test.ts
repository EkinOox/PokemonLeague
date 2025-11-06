import { BattleSimulator } from './BattleSimulator';
import { Battle } from '../entities/Battle';
import { Trainer } from '../entities/Trainer';
import { Pokemon } from '../entities/Pokemon';

describe('BattleSimulator', () => {
  let simulator: BattleSimulator;
  let battle: Battle;
  let trainer1: Trainer;
  let trainer2: Trainer;
  let pokemon1: Pokemon;
  let pokemon2: Pokemon;

  beforeEach(() => {
    simulator = new BattleSimulator();
    trainer1 = new Trainer();
    trainer2 = new Trainer();
    pokemon1 = new Pokemon();
    pokemon2 = new Pokemon();
    pokemon1.currentHp = 100;
    pokemon1.maxHp = 100;
    pokemon2.currentHp = 100;
    pokemon2.maxHp = 100;
    trainer1.team = [pokemon1];
    trainer2.team = [pokemon2];
    battle = new Battle();
    battle.trainer1 = trainer1;
    battle.trainer2 = trainer2;
    battle.currentTurn = 1;
    battle.status = 'ongoing';
  });

  it('should simulate a turn and return battle result', () => {
    const result = simulator.simulateTurn(battle, 'attack');
    expect(result).toBeDefined();
    expect(typeof result.damage).toBe('number');
  });

  it('should determine winner when pokemon HP reaches 0', () => {
    pokemon2.currentHp = 0;
    const result = simulator.simulateTurn(battle, 'attack');
    expect(result.winner).toBe(trainer1);
    expect(battle.status).toBe('finished');
  });

  it('should handle critical hits', () => {
    const result = simulator.simulateTurn(battle, 'attack');
    expect(result.isCritical).toBeDefined();
  });

  it('should switch turns', () => {
    const initialTurn = battle.currentTurn;
    simulator.simulateTurn(battle, 'attack');
    expect(battle.currentTurn).not.toBe(initialTurn);
  });
});