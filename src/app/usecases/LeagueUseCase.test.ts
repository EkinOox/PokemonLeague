import { LeagueUseCase } from './LeagueUseCase';
import { Trainer } from '@/domain/entities/Trainer';
import { Item } from '@/domain/entities/Item';

describe('LeagueUseCase', () => {
  let leagueUseCase: LeagueUseCase;

  beforeEach(() => {
    leagueUseCase = new LeagueUseCase();
  });

  describe('generateLeagueTrainers', () => {
    it('should generate 12 trainers for the league', async () => {
      const trainers = await leagueUseCase.generateLeagueTrainers(1);

      expect(trainers).toHaveLength(12);
      expect(trainers.every(trainer => typeof trainer === 'object' && trainer !== null)).toBe(true);
    }, 30000); // 30 secondes de timeout pour les appels API

    it('should generate trainers with increasing difficulty', async () => {
      const trainers = await leagueUseCase.generateLeagueTrainers(1);

      // Check that trainers have increasing ranks
      for (let i = 0; i < trainers.length - 1; i++) {
        expect(trainers[i].rank).toBeLessThanOrEqual(trainers[i + 1].rank);
      }
    }, 30000);

    it('should generate trainers with appropriate team sizes', async () => {
      const trainers = await leagueUseCase.generateLeagueTrainers(1);

      trainers.forEach(trainer => {
        expect(trainer.team.length).toBeGreaterThanOrEqual(1);
        expect(trainer.team.length).toBeLessThanOrEqual(6);
      });
    }, 30000);

    it('should generate trainers with pokemon of appropriate levels', async () => {
      const trainers = await leagueUseCase.generateLeagueTrainers(1);

      trainers.forEach(trainer => {
        trainer.team.forEach(pokemon => {
          // Early trainers should have lower level pokemon
          if (trainer.rank <= 4) {
            expect(pokemon.level).toBeLessThanOrEqual(5);
          }
          // Later trainers should have higher level pokemon
          if (trainer.rank >= 8) {
            expect(pokemon.level).toBeGreaterThanOrEqual(8);
          }
        });
      });
    }, 30000);

    it('should generate unique trainer names', async () => {
      const trainers = await leagueUseCase.generateLeagueTrainers(1);
      const names = trainers.map(t => t.name);
      const uniqueNames = new Set(names);

      expect(uniqueNames.size).toBe(names.length);
    }, 30000);

    it('should generate trainers with diverse pokemon types', async () => {
      const trainers = await leagueUseCase.generateLeagueTrainers(1);

      const allTypes = new Set<string>();
      trainers.forEach(trainer => {
        trainer.team.forEach(pokemon => {
          pokemon.types.forEach(type => allTypes.add(type));
        });
      });

      // Should have at least several different types
      expect(allTypes.size).toBeGreaterThanOrEqual(5);
    }, 30000);
  });

  describe('generateTrainer', () => {
    it('should generate a trainer with specified name and level', async () => {
      const trainer = await leagueUseCase.generateTrainer('Test Trainer', 25, 3);

      expect(trainer.name).toBe('Test Trainer');
      expect(trainer.rank).toBe(25);
      expect(trainer.team.length).toBe(3);
    }, 30000);

    it('should generate pokemon with balanced stats', async () => {
      const trainer = await leagueUseCase.generateTrainer('Test', 50, 1);
      const pokemon = trainer.team[0];

      expect(pokemon.stats.hp).toBeGreaterThan(0);
      expect(pokemon.stats.attack).toBeGreaterThan(0);
      expect(pokemon.stats.defense).toBeGreaterThan(0);
      expect(pokemon.stats.specialAttack).toBeGreaterThan(0);
      expect(pokemon.stats.specialDefense).toBeGreaterThan(0);
      expect(pokemon.stats.speed).toBeGreaterThan(0);
    });

    it('should generate pokemon with current HP equal to max HP', async () => {
      const trainer = await leagueUseCase.generateTrainer('Test', 30, 2);

      trainer.team.forEach(pokemon => {
        expect(pokemon.currentHp).toBe(pokemon.maxHp);
        expect(pokemon.currentHp).toBeGreaterThan(0);
      });
    });
  });

  describe('adjustPokemonLevel', () => {
    it('should adjust pokemon level and stats', () => {
      const mockPokemon = {
        id: '1',
        name: 'TestPokemon',
        types: ['normal'],
        stats: {
          hp: 100,
          attack: 50,
          defense: 50,
          specialAttack: 50,
          specialDefense: 50,
          speed: 50,
        },
        level: 50,
        maxHp: 100,
        currentHp: 100,
        moves: ['tackle'],
      };

      const adjusted = leagueUseCase.adjustPokemonLevel(mockPokemon, 75);

      expect(adjusted.level).toBe(75);
      expect(adjusted.maxHp).toBeGreaterThan(mockPokemon.maxHp);
      expect(adjusted.currentHp).toBe(adjusted.maxHp);
      expect(adjusted.stats.hp).toBeGreaterThan(mockPokemon.stats.hp);
      expect(adjusted.stats.attack).toBeGreaterThan(mockPokemon.stats.attack);
    });

    it('should maintain pokemon identity', () => {
      const mockPokemon = {
        id: '25',
        name: 'Pikachu',
        types: ['electric'],
        stats: {
          hp: 35,
          attack: 55,
          defense: 40,
          specialAttack: 50,
          specialDefense: 50,
          speed: 90,
        },
        level: 5,
        maxHp: 35,
        currentHp: 35,
        moves: ['thunder-shock'],
      };

      const adjusted = leagueUseCase.adjustPokemonLevel(mockPokemon, 25);

      expect(adjusted.id).toBe(mockPokemon.id);
      expect(adjusted.name).toBe(mockPokemon.name);
      expect(adjusted.types).toEqual(mockPokemon.types);
      expect(adjusted.moves).toEqual(mockPokemon.moves);
    });
  });

  describe('calculatePoints', () => {
    it('should award points based on victory', () => {
      const points = leagueUseCase.calculatePoints(5, 1, 'normal');
      expect(points).toBeGreaterThan(0);
    });

    it('should award more points for higher ranked opponents', () => {
      const lowRankPoints = leagueUseCase.calculatePoints(3, 1, 'normal');
      const highRankPoints = leagueUseCase.calculatePoints(8, 1, 'normal');

      expect(highRankPoints).toBeGreaterThan(lowRankPoints);
    });

    it('should award bonus points for quick victories', () => {
      const normalVictory = leagueUseCase.calculatePoints(5, 1, 'normal');
      const quickVictory = leagueUseCase.calculatePoints(5, 1, 'quick');

      expect(quickVictory).toBeGreaterThan(normalVictory);
    });

    it('should penalize hard victories', () => {
      const normalVictory = leagueUseCase.calculatePoints(5, 1, 'normal');
      const hardVictory = leagueUseCase.calculatePoints(5, 1, 'hard');

      expect(hardVictory).toBeLessThan(normalVictory);
    });

    it('should award bonus for defeating stronger opponents', () => {
      const normalMatch = leagueUseCase.calculatePoints(5, 5, 'normal');
      const strongerOpponent = leagueUseCase.calculatePoints(8, 5, 'normal');

      expect(strongerOpponent).toBeGreaterThan(normalMatch);
    });
  });

  describe('getNextRewardThreshold', () => {
    it('should return appropriate reward thresholds', () => {
      expect(leagueUseCase.getNextRewardThreshold(500).threshold).toBe(1000);
      expect(leagueUseCase.getNextRewardThreshold(500).reward).toBe('Potion');

      expect(leagueUseCase.getNextRewardThreshold(2000).threshold).toBe(3000);
      expect(leagueUseCase.getNextRewardThreshold(2000).reward).toBe('Super Potion');

      expect(leagueUseCase.getNextRewardThreshold(35000).threshold).toBe(50000);
      expect(leagueUseCase.getNextRewardThreshold(35000).reward).toBe('Champion de la Ligue !');
    });

    it('should handle edge cases', () => {
      const maxReward = leagueUseCase.getNextRewardThreshold(60000);
      expect(maxReward.threshold).toBe(50000);
      expect(maxReward.reward).toBe('Champion de la Ligue !');
    });
  });

  describe('canClaimBadge', () => {
    it('should determine badge eligibility based on points', () => {
      expect(leagueUseCase.canClaimBadge(1500, 1)).toBe(false);
      expect(leagueUseCase.canClaimBadge(2500, 1)).toBe(true);

      expect(leagueUseCase.canClaimBadge(4500, 2)).toBe(false);
      expect(leagueUseCase.canClaimBadge(5500, 2)).toBe(true);
    });

    it('should handle all badge levels', () => {
      const thresholds = [2000, 5000, 10000, 15000, 20000, 30000, 40000, 50000];

      thresholds.forEach((threshold, index) => {
        expect(leagueUseCase.canClaimBadge(threshold - 1, index + 1)).toBe(false);
        expect(leagueUseCase.canClaimBadge(threshold, index + 1)).toBe(true);
      });
    });
  });

  describe('healTeam', () => {
    it('should restore all pokemon to full HP', () => {
      const mockTrainer: Trainer = {
        id: 'test-trainer',
        name: 'Test Trainer',
        rank: 5,
        team: [
          {
            id: '1',
            name: 'Pokemon1',
            types: ['normal'],
            stats: { hp: 100, attack: 50, defense: 50, specialAttack: 50, specialDefense: 50, speed: 50 },
            level: 25,
            maxHp: 100,
            currentHp: 20, // Damaged
            moves: ['tackle'],
          },
          {
            id: '2',
            name: 'Pokemon2',
            types: ['water'],
            stats: { hp: 80, attack: 40, defense: 60, specialAttack: 60, specialDefense: 40, speed: 40 },
            level: 25,
            maxHp: 80,
            currentHp: 0, // KO'd
            moves: ['water-gun'],
          },
        ],
        items: [],
      };

      const healedTrainer = leagueUseCase.healTeam(mockTrainer);

      expect(healedTrainer.team[0].currentHp).toBe(100);
      expect(healedTrainer.team[1].currentHp).toBe(80);
    });

    it('should not modify other trainer properties', () => {
      const mockTrainer: Trainer = {
        id: 'test-trainer',
        name: 'Test Trainer',
        rank: 5,
        team: [
          {
            id: '1',
            name: 'Pokemon1',
            types: ['normal'],
            stats: { hp: 100, attack: 50, defense: 50, specialAttack: 50, specialDefense: 50, speed: 50 },
            level: 25,
            maxHp: 100,
            currentHp: 50,
            moves: ['tackle'],
          },
        ],
        items: [{ id: 'potion', name: 'Potion', type: 'healing' as const, effect: 20, description: 'Restores 20 HP' }],
      };

      const healedTrainer = leagueUseCase.healTeam(mockTrainer);

      expect(healedTrainer.id).toBe(mockTrainer.id);
      expect(healedTrainer.name).toBe(mockTrainer.name);
      expect(healedTrainer.rank).toBe(mockTrainer.rank);
      expect(healedTrainer.items).toEqual(mockTrainer.items);
    });
  });
});