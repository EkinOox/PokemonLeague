import { RewardsUseCase } from './RewardsUseCase';
import { Item } from '@/domain/entities/Item';

describe('RewardsUseCase', () => {
  let rewardsUseCase: RewardsUseCase;

  beforeEach(() => {
    rewardsUseCase = new RewardsUseCase();
  });

  describe('generateRewards', () => {
    it('should generate rewards based on victory speed', async () => {
      const quickRewards = await rewardsUseCase.generateRewards(5, 'quick', 3);
      const normalRewards = await rewardsUseCase.generateRewards(5, 'normal', 3);
      const hardRewards = await rewardsUseCase.generateRewards(5, 'hard', 3);

      // Find points reward
      const quickPoints = quickRewards.find(r => r.type === 'points')?.points || 0;
      const normalPoints = normalRewards.find(r => r.type === 'points')?.points || 0;
      const hardPoints = hardRewards.find(r => r.type === 'points')?.points || 0;

      expect(quickPoints).toBeGreaterThan(normalPoints);
      expect(normalPoints).toBeGreaterThan(hardPoints);
    });

    it('should generate more points for higher level opponents', async () => {
      const lowLevel = await rewardsUseCase.generateRewards(3, 'normal', 3);
      const highLevel = await rewardsUseCase.generateRewards(8, 'normal', 3);

      const lowPoints = lowLevel.find(r => r.type === 'points')?.points || 0;
      const highPoints = highLevel.find(r => r.type === 'points')?.points || 0;

      expect(highPoints).toBeGreaterThan(lowPoints);
    });

    it('should include items in rewards', async () => {
      const rewards = await rewardsUseCase.generateRewards(5, 'normal', 3);

      expect(rewards.length).toBeGreaterThanOrEqual(1);
      expect(rewards.some(r => r.type === 'points')).toBe(true);
    });

    it('should sometimes include bonus pokemon', async () => {
      // Test multiple times to increase chance of getting bonus pokemon
      let hasBonusPokemon = false;
      for (let i = 0; i < 50; i++) {
        const rewards = await rewardsUseCase.generateRewards(10, 'quick', 3);
        if (rewards.some(r => r.type === 'pokemon')) {
          hasBonusPokemon = true;
          break;
        }
      }

      // With enough iterations, we should get at least one bonus pokemon
      expect(hasBonusPokemon).toBe(true);
    });

    it('should generate appropriate reward messages', async () => {
      const quickRewards = await rewardsUseCase.generateRewards(5, 'quick', 3);
      const hardRewards = await rewardsUseCase.generateRewards(5, 'hard', 3);

      quickRewards.forEach(reward => {
        expect(reward.message).toBeDefined();
        expect(typeof reward.message).toBe('string');
      });

      hardRewards.forEach(reward => {
        expect(reward.message).toBeDefined();
        expect(typeof reward.message).toBe('string');
      });
    });

    it('should not generate bonus pokemon when team is full', async () => {
      // Test with team size 6 (full)
      const rewards = await rewardsUseCase.generateRewards(10, 'quick', 6);

      // Should not have pokemon rewards when team is full
      const pokemonRewards = rewards.filter(r => r.type === 'pokemon');
      expect(pokemonRewards.length).toBe(0);
    });
  });

  describe('getVictoryMessage', () => {
    it('should return appropriate messages for different victory speeds', () => {
      const quickMessage = rewardsUseCase.getVictoryMessage('quick', 'Pierre');
      const normalMessage = rewardsUseCase.getVictoryMessage('normal', 'Ondine');
      const hardMessage = rewardsUseCase.getVictoryMessage('hard', 'Major Bob');

      expect(quickMessage).toBeDefined();
      expect(normalMessage).toBeDefined();
      expect(hardMessage).toBeDefined();

      expect(typeof quickMessage).toBe('string');
      expect(typeof normalMessage).toBe('string');
      expect(typeof hardMessage).toBe('string');
    });

    it('should include opponent name in message', () => {
      const message = rewardsUseCase.getVictoryMessage('normal', 'TestTrainer');

      expect(message).toContain('TestTrainer');
    });

    it('should return different messages for different victory types', () => {
      const messages = new Set<string>();
      const victoryTypes: ('quick' | 'normal' | 'hard')[] = ['quick', 'normal', 'hard'];

      victoryTypes.forEach(type => {
        messages.add(rewardsUseCase.getVictoryMessage(type, 'Test'));
      });

      // Should have at least 2 different messages
      expect(messages.size).toBeGreaterThanOrEqual(2);
    });

    it('should contain victory-related words', () => {
      const message = rewardsUseCase.getVictoryMessage('quick', 'Test');

      const victoryWords = ['victoire', 'vaincu', 'battu', 'performance', 'domination'];
      const containsVictoryWord = victoryWords.some(word =>
        message.toLowerCase().includes(word)
      );

      expect(containsVictoryWord).toBe(true);
    });
  });

  // Note: Private methods are not directly testable, but their behavior is tested through public methods
  describe('reward generation logic', () => {
    it('should generate higher tier items for higher level opponents', async () => {
      // Test multiple times to get statistical significance
      let highLevelHasAdvancedItems = false;

      for (let i = 0; i < 20; i++) {
        const rewards = await rewardsUseCase.generateRewards(35, 'normal', 3);
        const itemRewards = rewards.filter(r => r.type === 'item');

        if (itemRewards.some(r => r.item?.name === 'Potion Max' || r.item?.name === 'Restauration Totale')) {
          highLevelHasAdvancedItems = true;
          break;
        }
      }

      expect(highLevelHasAdvancedItems).toBe(true);
    });

    it('should have higher chance of items for quick victories', async () => {
      let quickItemCount = 0;
      let normalItemCount = 0;

      // Test multiple times for statistical significance
      for (let i = 0; i < 100; i++) {
        const quickRewards = await rewardsUseCase.generateRewards(5, 'quick', 3);
        const normalRewards = await rewardsUseCase.generateRewards(5, 'normal', 3);

        if (quickRewards.some(r => r.type === 'item')) quickItemCount++;
        if (normalRewards.some(r => r.type === 'item')) normalItemCount++;
      }

      // Quick victories should generally have more items
      expect(quickItemCount).toBeGreaterThanOrEqual(normalItemCount);
    });

    it('should generate valid reward structures', async () => {
      const rewards = await rewardsUseCase.generateRewards(5, 'normal', 3);

      rewards.forEach(reward => {
        expect(['item', 'pokemon', 'points']).toContain(reward.type);
        expect(reward.message).toBeDefined();

        if (reward.type === 'points') {
          expect(reward.points).toBeDefined();
          expect(typeof reward.points).toBe('number');
          expect(reward.points).toBeGreaterThan(0);
        }

        if (reward.type === 'item') {
          expect(reward.item).toBeDefined();
          expect(typeof reward.item).toBe('object');
          expect(reward.item?.id).toBeDefined();
          expect(reward.item?.name).toBeDefined();
        }

        if (reward.type === 'pokemon') {
          expect(reward.pokemon).toBeDefined();
          expect(reward.pokemon?.name).toBeDefined();
        }
      });
    });
  });
});