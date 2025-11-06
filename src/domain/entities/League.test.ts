import { League } from './League';
import { Trainer } from './Trainer';
import { Battle } from './Battle';

describe('League', () => {
  it('should create a league with trainers and battles', () => {
    const league = new League();
    league.id = '1';
    league.trainers = [new Trainer(), new Trainer()];
    league.battles = [new Battle()];

    expect(league.trainers.length).toBe(2);
    expect(league.battles.length).toBe(1);
  });

  it('should handle empty league', () => {
    const league = new League();
    league.trainers = [];
    league.battles = [];
    expect(league.trainers.length).toBe(0);
  });
});