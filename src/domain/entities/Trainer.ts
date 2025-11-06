import { Pokemon } from './Pokemon';
import { Item } from './Item';

export class Trainer {
  id!: string;
  name!: string;
  rank!: number;
  team!: Pokemon[];
  items!: Item[];
}