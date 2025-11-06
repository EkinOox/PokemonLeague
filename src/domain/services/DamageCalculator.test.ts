import { DamageCalculator } from './DamageCalculator';

describe('DamageCalculator', () => {
  let calculator: DamageCalculator;

  beforeEach(() => {
    calculator = new DamageCalculator();
  });

  it('should calculate normal damage when types are neutral', () => {
    const damage = calculator.calculate('normal', 'normal', 50);
    expect(damage).toBe(50);
  });

  it('should calculate increased damage for super effective types', () => {
    const damage = calculator.calculate('fire', 'grass', 50);
    expect(damage).toBe(75); // 50 * 1.5
  });

  it('should calculate decreased damage for not very effective types', () => {
    const damage = calculator.calculate('fire', 'water', 50);
    expect(damage).toBe(25); // 50 * 0.5
  });

  it('should calculate no damage for immune types', () => {
    const damage = calculator.calculate('normal', 'ghost', 50);
    expect(damage).toBe(0);
  });
});