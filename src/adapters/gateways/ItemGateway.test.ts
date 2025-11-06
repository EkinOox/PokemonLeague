import { ItemGateway } from './ItemGateway';

describe('ItemGateway', () => {
  let gateway: ItemGateway;

  beforeEach(() => {
    gateway = new ItemGateway();
  });

  it('should get random items', async () => {
    const items = await gateway.getRandomItems(2);
    expect(items).toHaveLength(2);
    expect(items[0]).toBeDefined();
    expect(items[0].type).toBeDefined();
  });

  it('should get item by id', async () => {
    const item = await gateway.getItem('potion');
    expect(item).toBeDefined();
    expect(item.name).toBe('potion');
    expect(item.type).toBe('healing');
  });

  it('should return null for non-existent item', async () => {
    const item = await gateway.getItem('nonexistent');
    expect(item).toBeNull();
  });

  it('should handle different item types', async () => {
    const boostItem = await gateway.getItem('x-attack');
    expect(boostItem?.type).toBe('boost');
  });
});