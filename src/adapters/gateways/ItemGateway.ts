import { Item } from '../../domain/entities/Item';

export class ItemGateway {
  private items: { [key: string]: Item } = {
    potion: { id: 'potion', name: 'potion', type: 'healing', effect: 20 },
    'x-attack': { id: 'x-attack', name: 'x-attack', type: 'boost', effect: 1.5 },
  };

  async getRandomItems(count: number): Promise<Item[]> {
    const itemList = Object.values(this.items);
    const randomItems: Item[] = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * itemList.length);
      randomItems.push({ ...itemList[randomIndex], id: `${itemList[randomIndex].id}-${i}` });
    }
    return randomItems;
  }

  async getItem(id: string): Promise<Item | null> {
    return this.items[id] || null;
  }
}