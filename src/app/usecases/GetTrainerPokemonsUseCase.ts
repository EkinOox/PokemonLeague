import { ITrainerRepository } from '../../domain/ports/ITrainerRepository';
import { Pokemon } from '../../domain/entities/Pokemon';

export class GetTrainerPokemonsUseCase {
  constructor(private trainerRepository: ITrainerRepository) {}

  async execute(trainerId: string): Promise<Pokemon[]> {
    const trainer = await this.trainerRepository.findById(trainerId);
    if (!trainer) {
      return [];
    }
    return trainer.team.sort((a, b) => (b.level || 0) - (a.level || 0));
  }
}