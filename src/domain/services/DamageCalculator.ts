import { TypeEffectivenessService } from './TypeEffectivenessService';

export class DamageCalculator {
  private typeService: TypeEffectivenessService;

  constructor() {
    this.typeService = new TypeEffectivenessService();
  }

  calculate(attackerType: string, defenderType: string, baseDamage: number): number {
    const multiplier = this.typeService.getMultiplier(attackerType, defenderType);
    return Math.floor(baseDamage * multiplier);
  }
}