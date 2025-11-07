import { PokeAPIMoveGateway } from './MoveAPIGateway';

describe('PokeAPIMoveGateway', () => {
  let gateway: PokeAPIMoveGateway;

  beforeEach(() => {
    gateway = new PokeAPIMoveGateway();
  });

  describe('getMoveByName', () => {
    it('should fetch move data from PokeAPI', async () => {
      const move = await gateway.getMoveByName('tackle');
      
      expect(move).toBeDefined();
      expect(move.name).toBeTruthy();
      expect(move.type).toBeTruthy();
      expect(move.power).toBeGreaterThanOrEqual(0);
      expect(move.pp).toBeGreaterThan(0);
    });

    it('should return default move for unknown move', async () => {
      const move = await gateway.getMoveByName('unknown-move-xyz-123');
      
      expect(move).toBeDefined();
      expect(move.name).toBe('unknown-move-xyz-123');
      expect(move.type).toBe('normal');
      expect(move.power).toBe(50);
    });

    it('should cache moves', async () => {
      const move1 = await gateway.getMoveByName('ember');
      const move2 = await gateway.getMoveByName('ember');
      
      expect(move1).toEqual(move2);
    });
  });

  describe('getMovesByNames', () => {
    it('should fetch multiple moves', async () => {
      const moves = await gateway.getMovesByNames(['tackle', 'ember', 'water-gun']);
      
      expect(moves).toHaveLength(3);
      expect(moves[0].name).toBeTruthy();
      expect(moves[1].name).toBeTruthy();
      expect(moves[2].name).toBeTruthy();
    });

    it('should handle empty array', async () => {
      const moves = await gateway.getMovesByNames([]);
      
      expect(moves).toHaveLength(0);
    });
  });
});
