import { IPokemonRepository } from '../../domain/ports/IPokemonRepository';
import { Pokemon } from '../../domain/entities/Pokemon';

export class PokemonRepository implements IPokemonRepository {
  private pokemons: Map<string, Pokemon> = new Map();

  async save(pokemon: Pokemon): Promise<void> {
    this.pokemons.set(pokemon.id, { ...pokemon });
  }

  async findById(id: string): Promise<Pokemon | null> {
    const pokemon = this.pokemons.get(id);
    return pokemon ? { ...pokemon } : null;
  }

  async findAll(): Promise<Pokemon[]> {
    return Array.from(this.pokemons.values()).map(p => ({ ...p }));
  }
}