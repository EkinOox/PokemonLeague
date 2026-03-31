import { LeagueController } from './LeagueController';

describe('LeagueController', () => {
  let controller: LeagueController;

  beforeEach(() => {
    controller = new LeagueController();
  });

  it('should handle get league standings request', () => {
    const req = {};
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    controller.getStandings(req as any, res as any);
    expect(res.json).toHaveBeenCalledWith(expect.any(Array));
  });

  it('should handle get trainer rank request', () => {
    const req = { params: { trainerId: '1' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    controller.getTrainerRank(req as any, res as any);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ rank: expect.any(Number) }));
  });

  it('should return 404 for non-existent trainer', () => {
    const req = { params: { trainerId: 'nonexistent' } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    controller.getTrainerRank(req as any, res as any);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});