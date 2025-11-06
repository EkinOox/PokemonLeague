import { BattleRepository } from './BattleRepository';
import { Battle } from '../../../domain/entities/Battle';

describe('BattleRepository', () => {
  let repository: BattleRepository;

  beforeEach(() => {
    repository = new BattleRepository();
  });

  it('should save battle', async () => {
    const battle = new Battle();
    battle.id = '1';
    battle.status = 'ongoing';
    await repository.save(battle);
    const retrieved = await repository.findById('1');
    expect(retrieved).toEqual(battle);
  });

  it('should find battle by id', async () => {
    const battle = new Battle();
    battle.id = '1';
    await repository.save(battle);
    const found = await repository.findById('1');
    expect(found).toBeDefined();
    expect(found?.status).toBe('ongoing');
  });

  it('should return null for non-existent battle', async () => {
    const found = await repository.findById('nonexistent');
    expect(found).toBeNull();
  });

  it('should update battle status', async () => {
    const battle = new Battle();
    battle.id = '1';
    battle.status = 'ongoing';
    await repository.save(battle);
    battle.status = 'finished';
    await repository.save(battle);
    const retrieved = await repository.findById('1');
    expect(retrieved?.status).toBe('finished');
  });

  it('should find battles by status', async () => {
    const battle1 = new Battle();
    battle1.id = '1';
    battle1.status = 'ongoing';
    const battle2 = new Battle();
    battle2.id = '2';
    battle2.status = 'finished';
    await repository.save(battle1);
    await repository.save(battle2);
    const ongoing = await repository.findByStatus('ongoing');
    expect(ongoing.length).toBe(1);
    expect(ongoing[0].id).toBe('1');
  });
});