import { Trainer } from './Trainer';
import { Battle } from './Battle';

export class League {
  id!: string;
  trainers!: Trainer[];
  battles!: Battle[];
}