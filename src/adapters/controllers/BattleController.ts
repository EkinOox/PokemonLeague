import { StartBattleUseCase } from '@/application/usecases/StartBattleUseCase';
import { AttackUseCase } from '@/application/usecases/AttackUseCase';
import { ITrainerRepository } from '../../domain/ports/ITrainerRepository';
import { IBattleRepository } from '../../domain/ports/IBattleRepository';
import { IPokemonRepository } from '../../domain/ports/IPokemonRepository';

interface Request {
  body: any;
}

interface Response {
  json: (data: any) => void;
  status: (code: number) => Response;
}

export class BattleController {
  constructor(
    private startBattleUseCase: StartBattleUseCase,
    private attackUseCase: AttackUseCase,
    private trainerRepository: ITrainerRepository,
    private battleRepository: IBattleRepository,
    private pokemonRepository: IPokemonRepository
  ) {}

  async startBattle(req: Request, res: Response): Promise<void> {
    try {
      const { trainer1Id, trainer2Id } = req.body;
      const trainer1 = await this.trainerRepository.findById(trainer1Id);
      const trainer2 = await this.trainerRepository.findById(trainer2Id);
      if (!trainer1 || !trainer2) {
        res.status(404).json({ error: 'Trainer not found' });
        return;
      }
      const battle = this.startBattleUseCase.execute(trainer1, trainer2);
      await this.battleRepository.save(battle);
      res.json(battle);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async attack(req: Request, res: Response): Promise<void> {
    try {
      const { battleId, attackerId, defenderId } = req.body;
      const battle = await this.battleRepository.findById(battleId);
      const attacker = await this.pokemonRepository.findById(attackerId);
      const defender = await this.pokemonRepository.findById(defenderId);
      if (!battle || !attacker || !defender) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      const result = this.attackUseCase.execute(battle, attacker, defender);
      await this.battleRepository.save(battle);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}