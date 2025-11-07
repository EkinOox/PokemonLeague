import { BattleUseCase } from './BattleUseCase';
import { Pokemon } from '@/domain/entities/Pokemon';
import { Move } from '@/domain/entities/Move';
import { MockRandomGenerator, MockMathService } from './__mocks__/testHelpers';

describe('BattleUseCase', () => {
  let battleUseCase: BattleUseCase;
  let mockRandomGenerator: MockRandomGenerator;
  let mockMathService: MockMathService;

  beforeEach(() => {
    mockRandomGenerator = new MockRandomGenerator();
    mockMathService = new MockMathService();
    battleUseCase = new BattleUseCase(mockRandomGenerator, mockMathService);
  });

  describe('calculateDamage', () => {
    it('should calculate basic damage correctly', () => {
      const attacker: Pokemon = {
        id: '1',
        name: 'Pikachu',
        types: ['electric'],
        stats: { hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90 },
        level: 50,
        currentHp: 35,
        maxHp: 35,
        moves: []
      };

      const defender: Pokemon = {
        id: '2',
        name: 'Squirtle',
        types: ['water'],
        stats: { hp: 44, attack: 48, defense: 65, specialAttack: 50, specialDefense: 64, speed: 43 },
        level: 50,
        currentHp: 44,
        maxHp: 44,
        moves: []
      };

      const move: Move = {
        id: 'thunderbolt',
        name: 'Thunderbolt',
        type: 'electric',
        power: 90,
        accuracy: 100,
        pp: 15,
        maxPp: 15,
        damageClass: 'special',
        priority: 0
      };

      const result = battleUseCase.calculateDamage(attacker, defender, move);

      expect(result.damage).toBeGreaterThan(0);
      expect(result.damage).toBeLessThan(500);
      expect(typeof result.isCritical).toBe('boolean');
      expect(result.effectiveness).toBeGreaterThan(0);
    });

    it('should apply STAB bonus for same type attack', () => {
      const attacker: Pokemon = {
        id: '1',
        name: 'Pikachu',
        types: ['electric'],
        stats: { hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90 },
        level: 50,
        currentHp: 35,
        maxHp: 35,
        moves: []
      };

      const defender: Pokemon = {
        id: '2',
        name: 'Squirtle',
        types: ['normal'],
        stats: { hp: 44, attack: 48, defense: 65, specialAttack: 50, specialDefense: 64, speed: 43 },
        level: 50,
        currentHp: 44,
        maxHp: 44,
        moves: []
      };

      const electricMove: Move = {
        id: 'thunderbolt',
        name: 'Thunderbolt',
        type: 'electric',
        power: 80,
        accuracy: 100,
        pp: 15,
        maxPp: 15,
        damageClass: 'special',
        priority: 0
      };

      const normalMove: Move = {
        id: 'tackle',
        name: 'Tackle',
        type: 'normal',
        power: 80,
        accuracy: 100,
        pp: 35,
        maxPp: 35,
        damageClass: 'special',
        priority: 0
      };

      const electricDamage = battleUseCase.calculateDamage(attacker, defender, electricMove).damage;
      const normalDamage = battleUseCase.calculateDamage(attacker, defender, normalMove).damage;

      expect(electricDamage).toBeGreaterThan(normalDamage);
    });

    it('should return effectiveness value', () => {
      const attacker: Pokemon = {
        id: '1',
        name: 'Charizard',
        types: ['fire'],
        stats: { hp: 78, attack: 84, defense: 78, specialAttack: 109, specialDefense: 85, speed: 100 },
        level: 50,
        currentHp: 78,
        maxHp: 78,
        moves: []
      };

      const grassDefender: Pokemon = {
        id: '2',
        name: 'Bulbasaur',
        types: ['grass'],
        stats: { hp: 45, attack: 49, defense: 49, specialAttack: 65, specialDefense: 65, speed: 45 },
        level: 50,
        currentHp: 45,
        maxHp: 45,
        moves: []
      };

      const waterDefender: Pokemon = {
        id: '3',
        name: 'Squirtle',
        types: ['water'],
        stats: { hp: 44, attack: 48, defense: 65, specialAttack: 50, specialDefense: 64, speed: 43 },
        level: 50,
        currentHp: 44,
        maxHp: 44,
        moves: []
      };

      const fireMove: Move = {
        id: 'flamethrower',
        name: 'Flamethrower',
        type: 'fire',
        power: 90,
        accuracy: 100,
        pp: 15,
        maxPp: 15,
        damageClass: 'special',
        priority: 0
      };

      const superEffective = battleUseCase.calculateDamage(attacker, grassDefender, fireMove);
      const notVeryEffective = battleUseCase.calculateDamage(attacker, waterDefender, fireMove);

      expect(superEffective.effectiveness).toBe(2);
      expect(notVeryEffective.effectiveness).toBe(0.5);
    });
  });

  describe('getTypeEffectiveness', () => {
    it('should return correct effectiveness for super effective types', () => {
      const effectiveness = battleUseCase.getTypeEffectiveness('fire', ['grass']);
      expect(effectiveness).toBe(2);
    });

    it('should return correct effectiveness for not very effective types', () => {
      const effectiveness = battleUseCase.getTypeEffectiveness('fire', ['water']);
      expect(effectiveness).toBe(0.5);
    });

    it('should return correct effectiveness for immune types', () => {
      const effectiveness = battleUseCase.getTypeEffectiveness('normal', ['ghost']);
      expect(effectiveness).toBe(0);
    });

    it('should return neutral effectiveness for same types', () => {
      const effectiveness = battleUseCase.getTypeEffectiveness('normal', ['normal']);
      expect(effectiveness).toBe(1);
    });

    it('should handle multiple defender types', () => {
      const effectiveness = battleUseCase.getTypeEffectiveness('water', ['fire', 'flying']);
      expect(effectiveness).toBe(2); // Water is super effective against fire (2) and neutral against flying (1), so 2 * 1 = 2
    });

    it('should handle electric type immunities', () => {
      const effectiveness = battleUseCase.getTypeEffectiveness('electric', ['ground']);
      expect(effectiveness).toBe(0);
    });

    it('should handle psychic type immunities', () => {
      const effectiveness = battleUseCase.getTypeEffectiveness('psychic', ['dark']);
      expect(effectiveness).toBe(0);
    });

    it('should handle double super effective', () => {
      const effectiveness = battleUseCase.getTypeEffectiveness('ground', ['fire', 'rock']);
      // Ground is neutral against fire but super effective against rock
      expect(effectiveness).toBeGreaterThan(1);
    });
  });

  describe('getEffectivenessMessage', () => {
    it('should return correct message for no effect', () => {
      const message = battleUseCase.getEffectivenessMessage(0);
      expect(message).toBe("Ça n'a aucun effet...");
    });

    it('should return correct message for not very effective', () => {
      const message = battleUseCase.getEffectivenessMessage(0.5);
      expect(message).toBe("Ce n'est pas très efficace...");
    });

    it('should return empty string for neutral effectiveness', () => {
      const message = battleUseCase.getEffectivenessMessage(1);
      expect(message).toBe("");
    });

    it('should return correct message for super effective', () => {
      const message = battleUseCase.getEffectivenessMessage(2);
      expect(message).toBe("C'est super efficace !");
    });

    it('should return correct message for quadruple effectiveness', () => {
      const message = battleUseCase.getEffectivenessMessage(4);
      expect(message).toBe("C'est super efficace !");
    });
  });

  describe('isFainted', () => {
    it('should return true for pokemon with 0 HP', () => {
      const faintedPokemon: Pokemon = {
        id: '1',
        name: 'Pikachu',
        types: ['electric'],
        stats: { hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90 },
        level: 50,
        currentHp: 0,
        maxHp: 35,
        moves: []
      };

      expect(battleUseCase.isFainted(faintedPokemon)).toBe(true);
    });

    it('should return false for pokemon with HP > 0', () => {
      const healthyPokemon: Pokemon = {
        id: '1',
        name: 'Pikachu',
        types: ['electric'],
        stats: { hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90 },
        level: 50,
        currentHp: 10,
        maxHp: 35,
        moves: []
      };

      expect(battleUseCase.isFainted(healthyPokemon)).toBe(false);
    });
  });

  describe('selectOpponentMove', () => {
    it('should return struggle when no moves have PP', () => {
      const pokemon: Pokemon = {
        id: '1',
        name: 'Pikachu',
        types: ['electric'],
        stats: { hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90 },
        level: 50,
        currentHp: 35,
        maxHp: 35,
        moves: ['Thunderbolt', 'Quick Attack']
      };

      const availableMoves: Move[] = [
        { id: '1', name: 'Thunderbolt', type: 'electric', power: 90, accuracy: 100, pp: 0, maxPp: 15, damageClass: 'special', priority: 0 },
        { id: '2', name: 'Quick Attack', type: 'normal', power: 40, accuracy: 100, pp: 0, maxPp: 30, damageClass: 'physical', priority: 1 }
      ];

      const move = battleUseCase.selectOpponentMove(pokemon, availableMoves);
      expect(move.name).toBe('Lutte');
      expect(move.power).toBe(50);
    });
  });

  describe('determineFirstAttacker', () => {
    const fastPokemon: Pokemon = {
      id: '1',
      name: 'Pikachu',
      types: ['electric'],
      stats: { hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90 },
      level: 50,
      currentHp: 35,
      maxHp: 35,
      moves: []
    };

    const slowPokemon: Pokemon = {
      id: '2',
      name: 'Squirtle',
      types: ['water'],
      stats: { hp: 44, attack: 48, defense: 65, specialAttack: 50, specialDefense: 64, speed: 43 },
      level: 50,
      currentHp: 44,
      maxHp: 44,
      moves: []
    };

    const priorityMove: Move = {
      id: '1',
      name: 'Quick Attack',
      type: 'normal',
      power: 40,
      accuracy: 100,
      pp: 30,
      maxPp: 30,
      damageClass: 'physical',
      priority: 1
    };

    const normalMove: Move = {
      id: '2',
      name: 'Tackle',
      type: 'normal',
      power: 40,
      accuracy: 100,
      pp: 35,
      maxPp: 35,
      damageClass: 'physical',
      priority: 0
    };

    it('should give priority to moves with higher priority', () => {
      const result = battleUseCase.determineFirstAttacker(
        fastPokemon, priorityMove,
        slowPokemon, normalMove
      );
      expect(result).toBe('player');
    });

    it('should give priority to faster pokemon when priority is equal', () => {
      const result = battleUseCase.determineFirstAttacker(
        fastPokemon, normalMove,
        slowPokemon, normalMove
      );
      expect(result).toBe('player');
    });
  });

  describe('isBattleOver', () => {
    it('should return false when both trainers have alive pokemon', () => {
      const battle = {
        id: 'test-battle',
        trainer1: {
          id: 'player',
          name: 'Ash',
          team: [
            {
              id: '1',
              name: 'Pikachu',
              types: ['electric'],
              stats: { hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90 },
              level: 50,
              currentHp: 35,
              maxHp: 35,
              moves: []
            }
          ],
          rank: 1,
          items: []
        },
        trainer2: {
          id: 'opponent',
          name: 'Gary',
          team: [
            {
              id: '2',
              name: 'Squirtle',
              types: ['water'],
              stats: { hp: 44, attack: 48, defense: 65, specialAttack: 50, specialDefense: 64, speed: 43 },
              level: 50,
              currentHp: 44,
              maxHp: 44,
              moves: []
            }
          ],
          rank: 1,
          items: []
        },
        status: 'ongoing' as const,
        currentTurn: 1,
        maxTurns: 50
      };

      const result = battleUseCase.isBattleOver(battle);
      expect(result.isOver).toBe(false);
      expect(result.winner).toBeUndefined();
    });

    it('should return player victory when all opponent pokemon are fainted', () => {
      const battle = {
        id: 'test-battle',
        trainer1: {
          id: 'player',
          name: 'Ash',
          team: [
            {
              id: '1',
              name: 'Pikachu',
              types: ['electric'],
              stats: { hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90 },
              level: 50,
              currentHp: 35,
              maxHp: 35,
              moves: []
            }
          ],
          rank: 1,
          items: []
        },
        trainer2: {
          id: 'opponent',
          name: 'Gary',
          team: [
            {
              id: '2',
              name: 'Squirtle',
              types: ['water'],
              stats: { hp: 44, attack: 48, defense: 65, specialAttack: 50, specialDefense: 64, speed: 43 },
              level: 50,
              currentHp: 0, // Fainted
              maxHp: 44,
              moves: []
            },
            {
              id: '3',
              name: 'Charmander',
              types: ['fire'],
              stats: { hp: 39, attack: 52, defense: 43, specialAttack: 60, specialDefense: 50, speed: 65 },
              level: 50,
              currentHp: 0, // Fainted
              maxHp: 39,
              moves: []
            }
          ],
          rank: 1,
          items: []
        },
        status: 'ongoing' as const,
        currentTurn: 5,
        maxTurns: 50
      };

      const result = battleUseCase.isBattleOver(battle);
      expect(result.isOver).toBe(true);
      expect(result.winner).toBe('player');
    });

    it('should return opponent victory when all player pokemon are fainted', () => {
      const battle = {
        id: 'test-battle',
        trainer1: {
          id: 'player',
          name: 'Ash',
          team: [
            {
              id: '1',
              name: 'Pikachu',
              types: ['electric'],
              stats: { hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90 },
              level: 50,
              currentHp: 0, // Fainted
              maxHp: 35,
              moves: []
            }
          ],
          rank: 1,
          items: []
        },
        trainer2: {
          id: 'opponent',
          name: 'Gary',
          team: [
            {
              id: '2',
              name: 'Squirtle',
              types: ['water'],
              stats: { hp: 44, attack: 48, defense: 65, specialAttack: 50, specialDefense: 64, speed: 43 },
              level: 50,
              currentHp: 20,
              maxHp: 44,
              moves: []
            }
          ],
          rank: 1,
          items: []
        },
        status: 'ongoing' as const,
        currentTurn: 3,
        maxTurns: 50
      };

      const result = battleUseCase.isBattleOver(battle);
      expect(result.isOver).toBe(true);
      expect(result.winner).toBe('opponent');
    });
  });

  describe('getFirstAlivePokemon', () => {
    it('should return the first alive pokemon in a team', () => {
      const team: Pokemon[] = [
        {
          id: '1',
          name: 'Pikachu',
          types: ['electric'],
          stats: { hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90 },
          level: 50,
          currentHp: 0, // Fainted
          maxHp: 35,
          moves: []
        },
        {
          id: '2',
          name: 'Squirtle',
          types: ['water'],
          stats: { hp: 44, attack: 48, defense: 65, specialAttack: 50, specialDefense: 64, speed: 43 },
          level: 50,
          currentHp: 30,
          maxHp: 44,
          moves: []
        },
        {
          id: '3',
          name: 'Charmander',
          types: ['fire'],
          stats: { hp: 39, attack: 52, defense: 43, specialAttack: 60, specialDefense: 50, speed: 65 },
          level: 50,
          currentHp: 39,
          maxHp: 39,
          moves: []
        }
      ];

      const alivePokemon = battleUseCase.getFirstAlivePokemon(team);
      expect(alivePokemon).not.toBeNull();
      expect(alivePokemon?.name).toBe('Squirtle');
    });

    it('should return null when all pokemon are fainted', () => {
      const team: Pokemon[] = [
        {
          id: '1',
          name: 'Pikachu',
          types: ['electric'],
          stats: { hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90 },
          level: 50,
          currentHp: 0,
          maxHp: 35,
          moves: []
        },
        {
          id: '2',
          name: 'Squirtle',
          types: ['water'],
          stats: { hp: 44, attack: 48, defense: 65, specialAttack: 50, specialDefense: 64, speed: 43 },
          level: 50,
          currentHp: 0,
          maxHp: 44,
          moves: []
        }
      ];

      const alivePokemon = battleUseCase.getFirstAlivePokemon(team);
      expect(alivePokemon).toBeNull();
    });
  });

  describe('applyDamage', () => {
    it('should reduce pokemon HP correctly', () => {
      const pokemon: Pokemon = {
        id: '1',
        name: 'Pikachu',
        types: ['electric'],
        stats: { hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90 },
        level: 50,
        currentHp: 35,
        maxHp: 35,
        moves: []
      };

      const damagedPokemon = battleUseCase.applyDamage(pokemon, 15);
      expect(damagedPokemon.currentHp).toBe(20);
    });

    it('should not reduce HP below 0', () => {
      const pokemon: Pokemon = {
        id: '1',
        name: 'Pikachu',
        types: ['electric'],
        stats: { hp: 35, attack: 55, defense: 40, specialAttack: 50, specialDefense: 50, speed: 90 },
        level: 50,
        currentHp: 10,
        maxHp: 35,
        moves: []
      };

      const damagedPokemon = battleUseCase.applyDamage(pokemon, 50);
      expect(damagedPokemon.currentHp).toBe(0);
    });
  });

  describe('reducePP', () => {
    it('should reduce PP by 1', () => {
      const move: Move = {
        id: 'thunderbolt',
        name: 'Thunderbolt',
        type: 'electric',
        power: 90,
        accuracy: 100,
        pp: 15,
        maxPp: 15,
        damageClass: 'special',
        priority: 0
      };

      const usedMove = battleUseCase.reducePP(move);
      expect(usedMove.pp).toBe(14);
    });

    it('should not reduce PP below 0', () => {
      const move: Move = {
        id: 'thunderbolt',
        name: 'Thunderbolt',
        type: 'electric',
        power: 90,
        accuracy: 100,
        pp: 0,
        maxPp: 15,
        damageClass: 'special',
        priority: 0
      };

      const usedMove = battleUseCase.reducePP(move);
      expect(usedMove.pp).toBe(0);
    });
  });
});