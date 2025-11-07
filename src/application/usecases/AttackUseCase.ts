import { Battle } from '../../domain/entities/Battle';
import { Pokemon } from '../../domain/entities/Pokemon';
import { DamageCalculator } from '../../domain/services/DamageCalculator';
import { IRandomGenerator } from '@/domain/ports/IRandomGenerator';
import { IMathService } from '@/domain/ports/IMathService';

export class AttackUseCase {
  private damageCalculator: DamageCalculator;

  constructor(
    private randomGenerator: IRandomGenerator,
    private mathService: IMathService
  ) {
    this.damageCalculator = new DamageCalculator();
  }

  execute(battle: Battle, attacker: Pokemon, defender: Pokemon): { damage: number; isCritical: boolean; effectiveness: number } {
    const baseDamage = attacker.stats.attack; // Use attack stat as base
    const attackerType = attacker.types[0] || 'normal';
    const defenderType = defender.types[0] || 'normal';
    const effectiveness = this.damageCalculator.calculate(attackerType, defenderType, 1); // Get multiplier
    let damage = this.mathService.floor(baseDamage * effectiveness);

    // Critical hit (10% chance)
    const isCritical = this.randomGenerator.chance(0.1);
    if (isCritical) {
      damage = this.mathService.floor(damage * 1.5);
    }

    // Apply damage
    defender.currentHp = Math.max(0, defender.currentHp - damage);

    return { damage, isCritical, effectiveness };
  }
}