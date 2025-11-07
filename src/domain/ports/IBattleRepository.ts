import { Battle } from '../entities/Battle';

export interface IBattleRepository {
  findById(id: string): Promise<Battle | null>;
  save(battle: Battle): Promise<void>;
}