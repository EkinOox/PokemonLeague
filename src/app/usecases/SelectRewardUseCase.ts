import { Trainer } from '../../domain/entities/Trainer';
import { Pokemon } from '../../domain/entities/Pokemon';
import { Item } from '../../domain/entities/Item';

export class SelectRewardUseCase {
  execute(trainer: Trainer, rewards: { pokemons: Pokemon[], items: Item[] }, selection: { type: 'pokemon' | 'item', index: number }): void {
    if (selection.type === 'pokemon') {
      if (selection.index < 0 || selection.index >= rewards.pokemons.length) {
        throw new Error('Invalid selection');
      }
      const selectedPokemon = rewards.pokemons[selection.index];
      if (trainer.team.length < 6) {
        trainer.team.push(selectedPokemon);
      } else {
        trainer.team[trainer.team.length - 1] = selectedPokemon; // Replace last
      }
    } else if (selection.type === 'item') {
      if (selection.index < 0 || selection.index >= rewards.items.length) {
        throw new Error('Invalid selection');
      }
      const selectedItem = rewards.items[selection.index];
      trainer.items.push(selectedItem);
    }
  }
}