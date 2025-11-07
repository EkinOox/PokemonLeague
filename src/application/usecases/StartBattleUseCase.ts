import { Battle } from '../../domain/entities/Battle';
import { Trainer } from '../../domain/entities/Trainer';
import { IDateProvider } from '../../domain/ports/IDateProvider';

export class StartBattleUseCase {
  constructor(private dateProvider: IDateProvider) {}

  execute(trainer1: Trainer, trainer2: Trainer): Battle {
    if (!trainer1.team || trainer1.team.length === 0) {
      throw new Error('Trainer must have at least one pokemon');
    }
    if (!trainer2.team || trainer2.team.length === 0) {
      throw new Error('Trainer must have at least one pokemon');
    }

    const battle = new Battle();
    battle.id = `battle-${this.dateProvider.generateTimestamp()}`;
    battle.trainer1 = trainer1;
    battle.trainer2 = trainer2;
    battle.currentTurn = 1;
    battle.status = 'ongoing';

    return battle;
  }
}