import { Pokemon } from '../entities/Pokemon';

export interface IPokemonRepository {
  findById(id: string): Promise<Pokemon | null>;
  save(pokemon: Pokemon): Promise<void>;
}