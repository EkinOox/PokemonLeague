export class TypeEffectivenessService {
  private typeChart: { [key: string]: { [key: string]: number } } = {
    fire: { grass: 1.5, water: 0.5, fire: 0.5 },
    water: { fire: 1.5, grass: 0.5, water: 0.5 },
    grass: { water: 1.5, fire: 0.5, grass: 0.5 },
    normal: { ghost: 0 },
    ghost: { normal: 0 },
    // Add more types as needed
  };

  getMultiplier(attackerType: string, defenderType: string): number {
    const attackerChart = this.typeChart[attackerType];
    if (!attackerChart) return 1;
    return attackerChart[defenderType] || 1;
  }
}