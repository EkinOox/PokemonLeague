import { RankService } from './RankService';

describe('RankService', () => {
  let service: RankService;

  beforeEach(() => {
    service = new RankService();
  });

  describe('getRankName', () => {
    it('should return correct rank name for rank 1', () => {
      expect(service.getRankName(1)).toBe('Rookie Trainer');
    });

    it('should return correct rank name for rank 5', () => {
      expect(service.getRankName(5)).toBe('Champion');
    });

    it('should return correct rank name for rank 8', () => {
      expect(service.getRankName(8)).toBe('League Boss');
    });

    it('should return Unknown for invalid rank', () => {
      expect(service.getRankName(99)).toBe('Unknown');
    });
  });

  describe('getCurrentRank', () => {
    it('should return rank 1 for 0 points', () => {
      expect(service.getCurrentRank(0)).toBe(1);
    });

    it('should return rank 2 for 100 points', () => {
      expect(service.getCurrentRank(100)).toBe(2);
    });

    it('should return rank 3 for 300 points', () => {
      expect(service.getCurrentRank(300)).toBe(3);
    });

    it('should return rank 8 for 3000 points', () => {
      expect(service.getCurrentRank(3000)).toBe(8);
    });

    it('should return correct rank for edge case (just below threshold)', () => {
      expect(service.getCurrentRank(99)).toBe(1);
      expect(service.getCurrentRank(249)).toBe(2);
    });
  });

  describe('calculateRankUp', () => {
    it('should rank up from Rookie to Junior', () => {
      const result = service.calculateRankUp(50, 60);
      expect(result.newPoints).toBe(110);
      expect(result.newRank).toBe(2);
      expect(result.rankedUp).toBe(true);
    });

    it('should not rank up if not enough points', () => {
      const result = service.calculateRankUp(50, 30);
      expect(result.newPoints).toBe(80);
      expect(result.newRank).toBe(1);
      expect(result.rankedUp).toBe(false);
    });

    it('should rank up multiple levels at once', () => {
      const result = service.calculateRankUp(0, 600);
      expect(result.newPoints).toBe(600);
      expect(result.newRank).toBe(4); // Expert Trainer
      expect(result.rankedUp).toBe(true);
    });

    it('should handle ranking up to max rank', () => {
      const result = service.calculateRankUp(2400, 200);
      expect(result.newPoints).toBe(2600);
      expect(result.newRank).toBe(8);
      expect(result.rankedUp).toBe(true);
    });

    it('should stay at current rank if already at threshold', () => {
      const result = service.calculateRankUp(100, 50);
      expect(result.newPoints).toBe(150);
      expect(result.newRank).toBe(2);
      expect(result.rankedUp).toBe(false);
    });
  });

  describe('calculateRankDown', () => {
    it('should rank down from Junior to Rookie', () => {
      const result = service.calculateRankDown(150, 100);
      expect(result.newPoints).toBe(50);
      expect(result.newRank).toBe(1);
      expect(result.rankedDown).toBe(true);
    });

    it('should not rank down if still above threshold', () => {
      const result = service.calculateRankDown(150, 30);
      expect(result.newPoints).toBe(120);
      expect(result.newRank).toBe(2);
      expect(result.rankedDown).toBe(false);
    });

    it('should not go below 0 points', () => {
      const result = service.calculateRankDown(50, 100);
      expect(result.newPoints).toBe(0);
      expect(result.newRank).toBe(1);
    });

    it('should rank down multiple levels', () => {
      const result = service.calculateRankDown(600, 500);
      expect(result.newPoints).toBe(100);
      expect(result.newRank).toBe(2);
      expect(result.rankedDown).toBe(true);
    });

    it('should stay at minimum rank when losing points at rank 1', () => {
      const result = service.calculateRankDown(50, 30);
      expect(result.newPoints).toBe(20);
      expect(result.newRank).toBe(1);
      expect(result.rankedDown).toBe(false);
    });
  });

  describe('getPointsForNextRank', () => {
    it('should return points needed for next rank', () => {
      const pointsNeeded = service.getPointsForNextRank(50);
      expect(pointsNeeded).toBe(50); // 100 - 50
    });

    it('should return 0 if at max rank', () => {
      const pointsNeeded = service.getPointsForNextRank(3000);
      expect(pointsNeeded).toBe(0);
    });

    it('should calculate correctly when close to next rank', () => {
      const pointsNeeded = service.getPointsForNextRank(240);
      expect(pointsNeeded).toBe(10); // 250 - 240
    });
  });

  describe('isMaxRank', () => {
    it('should return true for max rank', () => {
      expect(service.isMaxRank(8)).toBe(true);
    });

    it('should return false for non-max rank', () => {
      expect(service.isMaxRank(1)).toBe(false);
      expect(service.isMaxRank(5)).toBe(false);
    });
  });

  describe('Rank progression flow', () => {
    it('should progress through all ranks correctly', () => {
      let points = 0;
      let rank = 1;

      // Win battles and gain points
      const result1 = service.calculateRankUp(points, 150);
      expect(result1.newRank).toBe(2); // Junior Trainer
      points = result1.newPoints;
      rank = result1.newRank;

      const result2 = service.calculateRankUp(points, 200);
      expect(result2.newRank).toBe(3); // Pro Trainer

      const result3 = service.calculateRankUp(result2.newPoints, 400);
      expect(result3.newRank).toBe(4); // Expert Trainer
    });

    it('should handle win-loss sequences correctly', () => {
      let points = 250; // Pro Trainer
      
      // Win
      const win = service.calculateRankUp(points, 300);
      expect(win.newRank).toBe(4); // Expert Trainer
      expect(win.rankedUp).toBe(true);

      // Lose
      const loss = service.calculateRankDown(win.newPoints, 200);
      expect(loss.newRank).toBe(3); // Back to Pro
      expect(loss.rankedDown).toBe(true);
    });
  });
});
