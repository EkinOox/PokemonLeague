import { GetTrainerPokemonsUseCase } from '../../app/usecases/GetTrainerPokemonsUseCase';
import { ITrainerRepository } from '../../domain/ports/ITrainerRepository';

interface Request {
  params: any;
}

interface Response {
  json: (data: any) => void;
  status: (code: number) => Response;
}

export class PokemonController {
  constructor(
    private getTrainerPokemonsUseCase: GetTrainerPokemonsUseCase,
    private trainerRepository: ITrainerRepository
  ) {}

  async getPokemon(req: Request, res: Response): Promise<void> {
    // TODO: Implement with PokemonAPIGateway
    const { id } = req.params;
    if (id === 'pikachu') {
      res.json({ name: 'pikachu' });
    } else {
      res.status(404).json({ error: 'Pokemon not found' });
    }
  }

  async getTrainerPokemons(req: Request, res: Response): Promise<void> {
    try {
      const { trainerId } = req.params;
      const pokemons = await this.getTrainerPokemonsUseCase.execute(trainerId);
      res.json(pokemons);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}