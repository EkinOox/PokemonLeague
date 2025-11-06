import { Battle } from './Battle';
import { Trainer } from './Trainer';

describe('Battle', () => {
  it('should create a battle between two trainers', () => {
    const trainer1 = new Trainer();
    const trainer2 = new Trainer();
    const battle = new Battle();
    battle.id = '1';
    battle.trainer1 = trainer1;
    battle.trainer2 = trainer2;
    battle.currentTurn = 1;
    battle.status = 'ongoing';

    expect(battle.trainer1).toBe(trainer1);
    expect(battle.status).toBe('ongoing');
  });

  it('should set winner when battle is finished', () => {
    const battle = new Battle();
    const winner = new Trainer();
    battle.status = 'finished';
    battle.winner = winner;
    expect(battle.winner).toBe(winner);
  });
});