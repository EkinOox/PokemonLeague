import { IBattleRepository } from '../../domain/ports/IBattleRepository';
import { Battle } from '../../domain/entities/Battle';

export class BattleRepository implements IBattleRepository {
  private battles: Map<string, Battle> = new Map();

  async save(battle: Battle): Promise<void> {
    this.battles.set(battle.id, { ...battle });
  }

  async findById(id: string): Promise<Battle | null> {
    const battle = this.battles.get(id);
    return battle ? { ...battle } : null;
  }

  async findByStatus(status: string): Promise<Battle[]> {
    return Array.from(this.battles.values())
      .filter(b => b.status === status)
      .map(b => ({ ...b }));
  }
}