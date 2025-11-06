import { Trainer } from './Trainer';

export class Battle {
  id!: string;
  trainer1!: Trainer;
  trainer2!: Trainer;
  currentTurn!: number;
  status!: 'ongoing' | 'finished';
  winner?: Trainer;
}