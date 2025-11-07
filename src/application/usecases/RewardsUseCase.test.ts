import { RewardsUseCase } from './RewardsUseCase';
import { Item } from '@/domain/entities/Item';
import { MockRandomGenerator, MockMathService } from './__mocks__/testHelpers';

describe('RewardsUseCase', () => {
  let rewardsUseCase: RewardsUseCase;
  let mockRandomGenerator: MockRandomGenerator;
  let mockMathService: MockMathService;

  beforeEach(() => {
    mockRandomGenerator = new MockRandomGenerator();
    mockMathService = new MockMathService();
    
    // Use real random for reward variety
    mockRandomGenerator.useReal();
    
    rewardsUseCase = new RewardsUseCase(mockRandomGenerator, mockMathService);
  });

  describe('generateRewardOptions', () => {
    it('should generate more points for higher level opponents', async () => {
      const lowLevel = await rewardsUseCase.generateRewardOptions(3, 'normal', 3);
      const highLevel = await rewardsUseCase.generateRewardOptions(8, 'normal', 3);

      expect(highLevel.points).toBeGreaterThan(lowLevel.points);
    });

    it('should always include 3 pokemon options', async () => {
      const rewards = await rewardsUseCase.generateRewardOptions(5, 'normal', 3);
      expect(rewards.pokemonOptions).toHaveLength(3);
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
        const rewards = await rewardsUseCase.generateRewardOptions(35, 'normal', 3);
        const itemNames = rewards.itemOptions.map(io => io.item.name);

        if (itemNames.includes('Potion Max') || itemNames.includes('Restauration Totale')) {
          highLevelHasAdvancedItems = true;
          break;
        }
      }

      expect(highLevelHasAdvancedItems).toBe(true);
    });

    it('should generate valid reward structures', async () => {
      const rewards = await rewardsUseCase.generateRewardOptions(5, 'normal', 3);

      expect(typeof rewards.points).toBe('number');
      expect(rewards.points).toBeGreaterThan(0);
      expect(Array.isArray(rewards.itemOptions)).toBe(true);
      expect(rewards.itemOptions).toHaveLength(5);
      expect(Array.isArray(rewards.pokemonOptions)).toBe(true);
      expect(rewards.pokemonOptions).toHaveLength(3); // Always 3 pokemon options
      expect(rewards.maxItemSelections).toBe(2);
      expect(rewards.maxPokemonSelections).toBe(1);

      // Check item options structure
      rewards.itemOptions.forEach(itemOption => {
        expect(itemOption.item).toBeDefined();
        expect(itemOption.item.id).toBeDefined();
        expect(itemOption.item.name).toBeDefined();
        expect(itemOption.selected).toBe(false);
      });

      // Check pokemon options structure
      rewards.pokemonOptions.forEach(pokemonOption => {
        expect(pokemonOption.pokemon).toBeDefined();
        expect(pokemonOption.pokemon.name).toBeDefined();
        expect(pokemonOption.selected).toBe(false);
      });
    });
  });
});