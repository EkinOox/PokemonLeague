import { Trainer } from '../entities/Trainer';

export interface ITrainerRepository {
  findById(id: string): Promise<Trainer | null>;
}