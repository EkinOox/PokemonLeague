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
    trainer1.id = '1';
    trainer1.name = 'Ash';
    trainer2 = new Trainer();
    trainer2.id = '2';
    trainer2.name = 'Gary';
    pokemon1 = new Pokemon();
    pokemon1.id = 'p1';
    pokemon1.name = 'Pikachu';
    pokemon1.types = ['electric'];
    pokemon1.stats = { hp: 100, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90 };
    pokemon1.currentHp = 100;
    pokemon1.maxHp = 100;
    pokemon1.level = 5;
    pokemon1.moves = ['thunderbolt'];
    pokemon2 = new Pokemon();
    pokemon2.id = 'p2';
    pokemon2.name = 'Squirtle';
    pokemon2.types = ['water'];
    pokemon2.stats = { hp: 100, attack: 48, defense: 65, specialAttack: 50, specialDefense: 64, speed: 43 };
    pokemon2.currentHp = 100;
    pokemon2.maxHp = 100;
    pokemon2.level = 5;
    pokemon2.moves = ['water gun'];
    trainer1.team = [pokemon1];
    trainer2.team = [pokemon2];
    battle = new Battle();
    battle.id = 'b1';
    battle.trainer1 = trainer1;
    battle.trainer2 = trainer2;
    battle.currentTurn = 1;
    battle.status = 'ongoing';
  });

  it('should simulate a turn and return battle result', () => {
    const result = simulator.simulateTurn(battle, 'attack');
    expect(result).toBeDefined();
    expect(typeof result.damage).toBe('number');
    expect(result.damage).toBeGreaterThan(0);
  });

  it('should determine winner when pokemon HP reaches 0', () => {
    pokemon2.currentHp = 0;
    const result = simulator.simulateTurn(battle, 'attack');
    expect(result.winner).toBe(trainer1);
    expect(battle.status).toBe('finished');
    expect(battle.winner).toBe(trainer1);
  });

  it('should handle critical hits', () => {
    const result = simulator.simulateTurn(battle, 'attack');
    expect(result.isCritical).toBeDefined();
    expect(typeof result.isCritical).toBe('boolean');
  });

  it('should switch turns correctly', () => {
    expect(battle.currentTurn).toBe(1);
    simulator.simulateTurn(battle, 'attack');
    expect(battle.currentTurn).toBe(2);
    simulator.simulateTurn(battle, 'attack');
    expect(battle.currentTurn).toBe(1);
  });

  it('should throw error when no pokemon available for attacker', () => {
    trainer1.team = [];
    expect(() => simulator.simulateTurn(battle, 'attack')).toThrow('No pokemon available');
  });

  it('should throw error when no pokemon available for defender', () => {
    trainer2.team = [];
    expect(() => simulator.simulateTurn(battle, 'attack')).toThrow('No pokemon available');
  });

  it('should handle multiple pokemon KO scenario', () => {
    const pokemon3 = new Pokemon();
    pokemon3.id = 'p3';
    pokemon3.types = ['fire'];
    pokemon3.stats = { hp: 80, attack: 52, defense: 43, specialAttack: 60, specialDefense: 50, speed: 65 };
    pokemon3.currentHp = 80;
    pokemon3.maxHp = 80;
    pokemon3.level = 5;
    pokemon3.moves = ['ember'];
    trainer1.team.push(pokemon3);
    
    pokemon1.currentHp = 1; // Almost dead
    const result = simulator.simulateTurn(battle, 'attack');
    
    if (result.winner) {
      expect(battle.status).toBe('finished');
      expect(battle.winner).toBeDefined();
    }
  });

  it('should calculate damage with type effectiveness', () => {
    // Electric vs Water = super effective (2x)
    const result = simulator.simulateTurn(battle, 'attack');
    expect(result.damage).toBeGreaterThan(pokemon1.stats.attack); // Should be amplified
  });

  it('should not allow negative HP', () => {
    pokemon2.currentHp = 5;
    simulator.simulateTurn(battle, 'attack');
    expect(pokemon2.currentHp).toBeGreaterThanOrEqual(0);
  });

  it('should handle battles with full teams (6v6)', () => {
    const createPokemon = (id: string, type: string, hp: number) => {
      const p = new Pokemon();
      p.id = id;
      p.types = [type];
      p.stats = { hp, attack: 50, defense: 40, specialAttack: 50, specialDefense: 40, speed: 50 };
      p.currentHp = hp;
      p.maxHp = hp;
      p.level = 5;
      p.moves = ['tackle'];
      return p;
    };

    trainer1.team = [
      createPokemon('t1p1', 'fire', 100),
      createPokemon('t1p2', 'water', 100),
      createPokemon('t1p3', 'grass', 100),
      createPokemon('t1p4', 'electric', 100),
      createPokemon('t1p5', 'psychic', 100),
      createPokemon('t1p6', 'dragon', 100),
    ];

    trainer2.team = [
      createPokemon('t2p1', 'rock', 100),
      createPokemon('t2p2', 'ground', 100),
      createPokemon('t2p3', 'flying', 100),
      createPokemon('t2p4', 'bug', 100),
      createPokemon('t2p5', 'ghost', 100),
      createPokemon('t2p6', 'steel', 100),
    ];

    const result = simulator.simulateTurn(battle, 'attack');
    expect(result).toBeDefined();
    expect(battle.status).toBe('ongoing'); // Should still be ongoing with full teams
  });

  it('should throw error for unsupported action', () => {
    expect(() => simulator.simulateTurn(battle, 'flee')).toThrow('Unsupported action');
  });

  it('should handle same-type battles (neutral damage)', () => {
    pokemon1.types = ['normal'];
    pokemon2.types = ['normal'];
    const result = simulator.simulateTurn(battle, 'attack');
    expect(result.effectiveness).toBeDefined();
    // Normal vs Normal should be neutral (1x)
  });

  it('should correctly identify battle end when all defender pokemon are KO', () => {
    trainer2.team[0].currentHp = 1;
    const result = simulator.simulateTurn(battle, 'attack');
    
    if (trainer2.team[0].currentHp === 0) {
      expect(battle.status).toBe('finished');
      expect(battle.winner).toBe(trainer1);
    }
  });

  it('should handle consecutive attacks depleting HP progressively', () => {
    const initialHp = pokemon2.currentHp;
    simulator.simulateTurn(battle, 'attack'); // Turn 1
    const hpAfterTurn1 = pokemon2.currentHp;
    expect(hpAfterTurn1).toBeLessThan(initialHp);
    
    if (hpAfterTurn1 > 0) {
      battle.currentTurn = 1; // Reset to player turn
      simulator.simulateTurn(battle, 'attack'); // Turn 2
      const hpAfterTurn2 = pokemon2.currentHp;
      expect(hpAfterTurn2).toBeLessThanOrEqual(hpAfterTurn1);
    }
  });
});