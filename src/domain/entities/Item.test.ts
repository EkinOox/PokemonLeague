import { Item } from './Item';

describe('Item', () => {
  it('should create an item with properties', () => {
    const item = new Item();
    item.id = '1';
    item.name = 'Potion';
    item.type = 'healing';
    item.effect = 20;

    expect(item.name).toBe('Potion');
    expect(item.type).toBe('healing');
    expect(item.effect).toBe(20);
  });

  it('should handle different item types', () => {
    const item = new Item();
    item.type = 'boost';
    expect(item.type).toBe('boost');
  });
});