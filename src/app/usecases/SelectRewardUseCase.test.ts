import { SelectRewardUseCase } from './SelectRewardUseCase';
import { Trainer } from '../../domain/entities/Trainer';
import { Pokemon } from '../../domain/entities/Pokemon';
import { Item } from '../../domain/entities/Item';

describe('SelectRewardUseCase', () => {
  let useCase: SelectRewardUseCase;
  let trainer: Trainer;
  let rewards: { pokemons: Pokemon[], items: Item[] };

  beforeEach(() => {
    useCase = new SelectRewardUseCase();
    trainer = new Trainer();
    trainer.team = [new Pokemon()];
    trainer.items = [];
    rewards = {
      pokemons: [new Pokemon(), new Pokemon(), new Pokemon()],
      items: [new Item(), new Item()]
    };
  });

  it('should add selected pokemon to trainer team', () => {
    const initialTeamSize = trainer.team.length;
    useCase.execute(trainer, rewards, { type: 'pokemon', index: 0 });
    expect(trainer.team.length).toBe(initialTeamSize + 1);
  });

  it('should replace pokemon if team is full', () => {
    const p1 = new Pokemon(); p1.id = '1';
    const p2 = new Pokemon(); p2.id = '2';
    const p3 = new Pokemon(); p3.id = '3';
    const p4 = new Pokemon(); p4.id = '4';
    const p5 = new Pokemon(); p5.id = '5';
    const p6 = new Pokemon(); p6.id = '6';
    trainer.team = [p1, p2, p3, p4, p5, p6]; // 6 pokemon
    const initialTeam = [...trainer.team];
    useCase.execute(trainer, rewards, { type: 'pokemon', index: 0 });
    expect(trainer.team.length).toBe(6);
    expect(trainer.team).not.toEqual(initialTeam);
  });

  it('should add selected item to trainer inventory', () => {
    const initialItemsSize = trainer.items.length;
    useCase.execute(trainer, rewards, { type: 'item', index: 0 });
    expect(trainer.items.length).toBe(initialItemsSize + 1);
  });

  it('should throw error for invalid selection', () => {
    expect(() => useCase.execute(trainer, rewards, { type: 'pokemon', index: 10 })).toThrow('Invalid selection');
  });
});