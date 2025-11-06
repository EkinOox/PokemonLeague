import { BattleController } from './BattleController';

describe('BattleController', () => {
  let controller: BattleController;

  beforeEach(() => {
    controller = new BattleController();
  });

  it('should handle start battle request', () => {
    const req = { body: { trainer1Id: '1', trainer2Id: '2' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    controller.startBattle(req as any, res as any);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: expect.any(String) }));
  });

  it('should handle attack request', () => {
    const req = { body: { battleId: '1', attackerId: '1', defenderId: '2' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    controller.attack(req as any, res as any);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ damage: expect.any(Number) }));
  });

  it('should return 400 for invalid battle id', () => {
    const req = { body: { battleId: 'invalid', attackerId: '1', defenderId: '2' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    controller.attack(req as any, res as any);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});