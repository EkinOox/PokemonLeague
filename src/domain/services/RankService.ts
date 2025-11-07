import { Trainer } from '../entities/Trainer';

export class RankService {
  private rankLevels = [
    { rank: 1, name: 'Rookie Trainer', minPoints: 0 },
    { rank: 2, name: 'Junior Trainer', minPoints: 100 },
    { rank: 3, name: 'Pro Trainer', minPoints: 250 },
    { rank: 4, name: 'Expert Trainer', minPoints: 500 },
    { rank: 5, name: 'Champion', minPoints: 800 },
    { rank: 6, name: 'Elite', minPoints: 1200 },
    { rank: 7, name: 'Master', minPoints: 1700 },
    { rank: 8, name: 'League Boss', minPoints: 2500 },
  ];

  getRankName(rank: number): string {
    const rankLevel = this.rankLevels.find(r => r.rank === rank);
    return rankLevel?.name || 'Unknown';
  }

  calculateRankUp(currentPoints: number, pointsGained: number): { newPoints: number; newRank: number; rankedUp: boolean } {
    const newPoints = currentPoints + pointsGained;
    let newRank = 1;

    for (let i = this.rankLevels.length - 1; i >= 0; i--) {
      if (newPoints >= this.rankLevels[i].minPoints) {
        newRank = this.rankLevels[i].rank;
        break;
      }
    }

    const currentRank = this.getCurrentRank(currentPoints);
    const rankedUp = newRank > currentRank;

    return { newPoints, newRank, rankedUp };
  }

  calculateRankDown(currentPoints: number, pointsLost: number): { newPoints: number; newRank: number; rankedDown: boolean } {
    const newPoints = Math.max(0, currentPoints - pointsLost);
    let newRank = 1;

    for (let i = this.rankLevels.length - 1; i >= 0; i--) {
      if (newPoints >= this.rankLevels[i].minPoints) {
        newRank = this.rankLevels[i].rank;
        break;
      }
    }

    const currentRank = this.getCurrentRank(currentPoints);
    const rankedDown = newRank < currentRank;

    return { newPoints, newRank, rankedDown };
  }

  getCurrentRank(points: number): number {
    let rank = 1;
    for (let i = this.rankLevels.length - 1; i >= 0; i--) {
      if (points >= this.rankLevels[i].minPoints) {
        rank = this.rankLevels[i].rank;
        break;
      }
    }
    return rank;
  }

  getPointsForNextRank(currentPoints: number): number {
    const currentRank = this.getCurrentRank(currentPoints);
    const nextRankLevel = this.rankLevels.find(r => r.rank === currentRank + 1);
    return nextRankLevel ? nextRankLevel.minPoints - currentPoints : 0;
  }

  isMaxRank(rank: number): boolean {
    return rank >= this.rankLevels[this.rankLevels.length - 1].rank;
  }
}
