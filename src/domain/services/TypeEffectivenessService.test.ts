import { TypeEffectivenessService } from './TypeEffectivenessService';

describe('TypeEffectivenessService', () => {
  let service: TypeEffectivenessService;

  beforeEach(() => {
    service = new TypeEffectivenessService();
  });

  it('should return 2 for super effective', () => {
    const multiplier = service.getMultiplier('fire', 'grass');
    expect(multiplier).toBe(2);
  });

  it('should return 0.5 for not very effective', () => {
    const multiplier = service.getMultiplier('fire', 'water');
    expect(multiplier).toBe(0.5);
  });

  it('should return 0 for immune', () => {
    const multiplier = service.getMultiplier('normal', 'ghost');
    expect(multiplier).toBe(0);
  });

  it('should return 1 for neutral', () => {
    const multiplier = service.getMultiplier('normal', 'normal');
    expect(multiplier).toBe(1);
  });
});