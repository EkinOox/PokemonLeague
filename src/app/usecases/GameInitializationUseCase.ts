import { Pokemon } from '../../domain/entities/Pokemon';
import { Trainer } from '../../domain/entities/Trainer';

export interface PokemonSet {
  pokemons: Pokemon[];
  theme: string;
}

export class GameInitializationUseCase {
  generateStarterSets(availablePokemons: Pokemon[], count: number = 3): PokemonSet[] {
    if (availablePokemons.length < 6) {
      throw new Error('Not enough pokemons to create sets');
    }

    const sets: PokemonSet[] = [];
    const themes = ['Balanced', 'Offensive', 'Defensive'];

    for (let i = 0; i < count; i++) {
      const selectedPokemons: Pokemon[] = [];
      const usedIndices = new Set<number>();

      while (selectedPokemons.length < 6 && usedIndices.size < availablePokemons.length) {
        const randomIndex = Math.floor(Math.random() * availablePokemons.length);
        if (!usedIndices.has(randomIndex)) {
          usedIndices.add(randomIndex);
          selectedPokemons.push({ ...availablePokemons[randomIndex] });
        }
      }

      if (selectedPokemons.length === 6) {
        sets.push({
          pokemons: selectedPokemons,
          theme: themes[i % themes.length],
        });
      }
    }

    return sets;
  }

  createStarterTrainer(name: string, selectedSet: PokemonSet): Trainer {
    const trainer = new Trainer();
    trainer.id = `trainer-${Date.now()}`;
    trainer.name = name;
    trainer.rank = 1;
    trainer.team = selectedSet.pokemons;
    trainer.items = [];
    return trainer;
  }

  validateSetSelection(sets: PokemonSet[], selectedIndex: number): boolean {
    return selectedIndex >= 0 && selectedIndex < sets.length;
  }
}
