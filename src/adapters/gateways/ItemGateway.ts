import { Item } from '../../domain/entities/Item';
import { IRandomGenerator } from '../../domain/ports/IRandomGenerator';

export class ItemGateway {
  private items: { [key: string]: Item } = {
    potion: { id: 'potion', name: 'potion', type: 'healing', effect: 20 },
    'x-attack': { id: 'x-attack', name: 'x-attack', type: 'boost', effect: 1.5 },
  };

  constructor(private randomGenerator: IRandomGenerator) {}

  async getRandomItems(count: number): Promise<Item[]> {
    const itemList = Object.values(this.items);
    const randomItems: Item[] = [];
    for (let i = 0; i < count; i++) {
      const randomItem = this.randomGenerator.selectRandom(itemList);
      randomItems.push({ ...randomItem, id: `${randomItem.id}-${i}` });
    }
    return randomItems;
  }

  async getItem(id: string): Promise<Item | null> {
    return this.items[id] || null;
  }
}