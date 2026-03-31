import { Item } from '@/domain/entities/Item';
import { Pokemon } from '@/domain/entities/Pokemon';
import { PokemonAPIGateway } from '@/adapters/gateways/PokemonAPIGateway';

export interface Reward {
  type: 'item' | 'pokemon' | 'points';
  item?: Item;
  pokemon?: Pokemon;
  points?: number;
  message: string;
}

export class RewardsUseCase {
  private gateway: PokemonAPIGateway;

  constructor() {
    this.gateway = new PokemonAPIGateway();
  }

  /**
   * Génère des récompenses selon la difficulté de la victoire
   */
  async generateRewards(
    opponentLevel: number,
    victorySpe: 'quick' | 'normal' | 'hard',
    playerTeamSize: number
  ): Promise<Reward[]> {
    const rewards: Reward[] = [];

    // Points de base
    const basePoints = this.calculateBasePoints(opponentLevel, victorySpe);
    rewards.push({
      type: 'points',
      points: basePoints,
      message: `Vous avez gagné ${basePoints} points de ligue !`,
    });

    // Chance de recevoir un item
    const itemChance = victorySpe === 'quick' ? 0.7 : victorySpe === 'normal' ? 0.5 : 0.3;
    if (Math.random() < itemChance) {
      const item = this.generateRandomItem(opponentLevel);
      rewards.push({
        type: 'item',
        item,
        message: `Vous avez reçu ${item.name} !`,
      });
    }

    // Chance de recevoir un Pokémon bonus (rare)
    const pokemonChance = victorySpe === 'quick' ? 0.2 : 0.1;
    if (Math.random() < pokemonChance && playerTeamSize < 6) {
      const pokemon = await this.generateBonusPokemon(opponentLevel);
      if (pokemon) {
        rewards.push({
          type: 'pokemon',
          pokemon,
          message: `Un ${pokemon.name} sauvage vous a rejoint !`,
        });
      }
    }

    return rewards;
  }

  /**
   * Calcule les points de base selon le niveau de l'adversaire
   */
  private calculateBasePoints(opponentLevel: number, victorySpe: 'quick' | 'normal' | 'hard'): number {
    let points = opponentLevel * 100;

    const multipliers = {
      quick: 1.5,
      normal: 1.0,
      hard: 0.8,
    };

    points *= multipliers[victorySpe];
    return Math.floor(points);
  }

  /**
   * Génère un item aléatoire selon le niveau
   */
  private generateRandomItem(level: number): Item {
    const items: Item[] = [
      { id: 'potion', name: 'Potion', type: 'healing', effect: 20, description: 'Restaure 20 HP' },
      { id: 'super-potion', name: 'Super Potion', type: 'healing', effect: 50, description: 'Restaure 50 HP' },
      { id: 'hyper-potion', name: 'Hyper Potion', type: 'healing', effect: 100, description: 'Restaure 100 HP' },
      { id: 'revive', name: 'Rappel', type: 'other', effect: 50, description: 'Ranime un Pokémon K.O. à 50% HP' },
      { id: 'full-heal', name: 'Guérison', type: 'other', effect: 0, description: 'Soigne tous les statuts' },
    ];

    // Items de niveau supérieur si le niveau est élevé
    if (level >= 30) {
      items.push(
        { id: 'max-potion', name: 'Potion Max', type: 'healing', effect: 999, description: 'Restaure tous les HP' },
        { id: 'full-restore', name: 'Restauration Totale', type: 'healing', effect: 999, description: 'Restaure HP et soigne statuts' }
      );
    }

    return items[Math.floor(Math.random() * items.length)];
  }

  /**
   * Génère un Pokémon bonus selon le niveau
   */
  private async generateBonusPokemon(level: number): Promise<Pokemon | null> {
    try {
      // Pokémon rares (151-251 pour Gen 2)
      const rarePokemonIds = level >= 40 
        ? Array.from({ length: 100 }, (_, i) => i + 151) // Gen 2
        : Array.from({ length: 150 }, (_, i) => i + 1);   // Gen 1

      const randomId = rarePokemonIds[Math.floor(Math.random() * rarePokemonIds.length)];
      const pokemon = await this.gateway.getPokemon(randomId.toString());

      if (pokemon) {
        // Ajuste le niveau du Pokémon bonus
        const bonusLevel = Math.max(5, level - 10); // Un peu plus faible que le niveau actuel
        return this.adjustPokemonLevel(pokemon, bonusLevel);
      }

      return null;
    } catch (error) {
      console.error('Error generating bonus pokemon:', error);
      return null;
    }
  }

  /**
   * Ajuste le niveau d'un Pokémon
   */
  private adjustPokemonLevel(pokemon: Pokemon, level: number): Pokemon {
    const levelMultiplier = level / 50;
    
    return {
      ...pokemon,
      level,
      maxHp: Math.floor(pokemon.stats.hp * (1 + levelMultiplier * 0.5)),
      currentHp: Math.floor(pokemon.stats.hp * (1 + levelMultiplier * 0.5)),
      stats: {
        ...pokemon.stats,
        hp: Math.floor(pokemon.stats.hp * (1 + levelMultiplier * 0.5)),
        attack: Math.floor(pokemon.stats.attack * (1 + levelMultiplier * 0.3)),
        defense: Math.floor(pokemon.stats.defense * (1 + levelMultiplier * 0.3)),
        specialAttack: Math.floor(pokemon.stats.specialAttack * (1 + levelMultiplier * 0.3)),
        specialDefense: Math.floor(pokemon.stats.specialDefense * (1 + levelMultiplier * 0.3)),
        speed: Math.floor(pokemon.stats.speed * (1 + levelMultiplier * 0.3)),
      },
    };
  }

  /**
   * Détermine le message de félicitations selon les performances
   */
  getVictoryMessage(victorySpe: 'quick' | 'normal' | 'hard', opponentName: string): string {
    const messages = {
      quick: [
        `Victoire écrasante contre ${opponentName} !`,
        `Domination totale ! ${opponentName} n'a rien pu faire !`,
        `Performance parfaite contre ${opponentName} !`,
      ],
      normal: [
        `Victoire contre ${opponentName} !`,
        `Vous avez battu ${opponentName} !`,
        `${opponentName} est vaincu !`,
      ],
      hard: [
        `Victoire difficile contre ${opponentName}...`,
        `Vous avez réussi à battre ${opponentName} de justesse !`,
        `Combat serré, mais victoire contre ${opponentName} !`,
      ],
    };

    const messageList = messages[victorySpe];
    return messageList[Math.floor(Math.random() * messageList.length)];
  }
}
