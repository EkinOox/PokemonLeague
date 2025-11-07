import { Battle } from '../entities/Battle';
import { Trainer } from '../entities/Trainer';
import { DamageCalculator } from './DamageCalculator';
import { IRandomGenerator } from '@/domain/ports/IRandomGenerator';

export class BattleSimulator {
  private damageCalculator: DamageCalculator;

  constructor(private randomGenerator: IRandomGenerator) {
    this.damageCalculator = new DamageCalculator();
  }

  simulateTurn(battle: Battle, action: string): { damage: number; winner?: Trainer; isCritical: boolean; effectiveness?: number } {
    if (action !== 'attack') {
      throw new Error('Unsupported action');
    }

    const attacker = battle.currentTurn === 1 ? battle.trainer1.team[0] : battle.trainer2.team[0];
    const defender = battle.currentTurn === 1 ? battle.trainer2.team[0] : battle.trainer1.team[0];
    const winnerTrainer = battle.currentTurn === 1 ? battle.trainer1 : battle.trainer2;

    if (!attacker || !defender) {
      throw new Error('No pokemon available');
    }

    // Calculate damage
    const baseDamage = 50; // Assume base damage for simplicity
    const attackerType = attacker.types[0] || 'normal';
    const defenderType = defender.types[0] || 'normal';
    const effectiveness = this.damageCalculator.calculate(attackerType, defenderType, 1);
    let damage = this.damageCalculator.calculate(attackerType, defenderType, baseDamage);

    // Critical hit (10% chance)
    const isCritical = this.randomGenerator.chance(0.1);
    if (isCritical) {
      damage *= 2;
    }

    // Apply damage
    defender.currentHp = Math.max(0, defender.currentHp - damage);

    // Check for KO
    let winner: Trainer | undefined;
    if (defender.currentHp <= 0) {
      battle.status = 'finished';
      winner = winnerTrainer;
      battle.winner = winner;
    }

    // Switch turns
    battle.currentTurn = battle.currentTurn === 1 ? 2 : 1;

    return { damage, winner, isCritical, effectiveness };
  }
}