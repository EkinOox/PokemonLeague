import { Trainer } from './Trainer';
import { Pokemon } from './Pokemon';
import { Item } from './Item';

describe('Trainer', () => {
  it('should create a trainer with team and items', () => {
    const trainer = new Trainer();
    trainer.id = '1';
    trainer.name = 'Ash';
    trainer.rank = 5;
    trainer.team = [new Pokemon()];
    trainer.items = [new Item()];

    expect(trainer.name).toBe('Ash');
    expect(trainer.rank).toBe(5);
    expect(trainer.team.length).toBe(1);
    expect(trainer.items.length).toBe(1);
  });

  it('should handle empty team', () => {
    const trainer = new Trainer();
    trainer.team = [];
    expect(trainer.team.length).toBe(0);
  });
});