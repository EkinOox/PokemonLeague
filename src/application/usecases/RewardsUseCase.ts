import { Item } from '@/domain/entities/Item';
import { Pokemon } from '@/domain/entities/Pokemon';
import { Trainer } from '@/domain/entities/Trainer';
import { PokemonAPIGateway } from '@/adapters/gateways/PokemonAPIGateway';
import { IRandomGenerator } from '@/domain/ports/IRandomGenerator';
import { IMathService } from '@/domain/ports/IMathService';

export interface ItemReward {
  item: Item;
  selected: boolean;
}

export interface PokemonReward {
  pokemon: Pokemon;
  selected: boolean;
}

export interface RewardOptions {
  points: number;
  itemOptions: ItemReward[]; // 5 items proposés
  pokemonOptions: PokemonReward[]; // 3 Pokémon proposés
  maxItemSelections: number; // 2
  maxPokemonSelections: number; // 1
}

export class RewardsUseCase {
  private gateway: PokemonAPIGateway;

  constructor(
    private randomGenerator: IRandomGenerator,
    private mathService: IMathService
  ) {
    this.gateway = new PokemonAPIGateway();
  }

  /**
   * Génère les options de récompenses
   */
  async generateRewardOptions(
    opponentLevel: number,
    victorySpe: 'quick' | 'normal' | 'hard',
    playerTeamSize: number
  ): Promise<RewardOptions> {
    // Points automatiques
    const points = this.calculateBasePoints(opponentLevel, victorySpe);

    // Générer 5 items aléatoires
    const itemOptions: ItemReward[] = this.generateRandomItems(opponentLevel, 5).map(item => ({
      item,
      selected: false
    }));

    // Générer 3 Pokémon aléatoires (toujours disponibles)
    const pokemonOptions: PokemonReward[] = [];
    for (let i = 0; i < 3; i++) {
      let pokemon = await this.generateBonusPokemon(opponentLevel);
      let attempts = 0;
      
      // Essaie jusqu'à 3 fois de générer un Pokémon valide
      while (!pokemon && attempts < 3) {
        pokemon = await this.generateBonusPokemon(opponentLevel);
        attempts++;
      }
      
      if (pokemon) {
        pokemonOptions.push({
          pokemon,
          selected: false
        });
      } else {
        // Si on ne peut pas générer de Pokémon, créer un Pokémon par défaut
        console.warn(`Failed to generate pokemon ${i + 1}, creating fallback`);
        const fallbackPokemon = this.createFallbackPokemon(opponentLevel);
        pokemonOptions.push({
          pokemon: fallbackPokemon,
          selected: false
        });
      }
    }

    return {
      points,
      itemOptions,
      pokemonOptions,
      maxItemSelections: 2,
      maxPokemonSelections: 1
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
    return this.randomGenerator.selectRandom(messageList);
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
    return this.mathService.floor(points);
  }

  /**
   * Génère plusieurs items aléatoires selon le niveau
   */
  private generateRandomItems(level: number, count: number): Item[] {
    const allItems: Item[] = [
      { id: 'potion', name: 'Potion', type: 'healing', effect: 20, description: 'Restaure 20 HP', image: '/images/objets/potion.png' },
      { id: 'super-potion', name: 'Super Potion', type: 'healing', effect: 50, description: 'Restaure 50 HP', image: '/images/objets/super-potion.png' },
      { id: 'hyper-potion', name: 'Hyper Potion', type: 'healing', effect: 100, description: 'Restaure 100 HP', image: '/images/objets/hyper-potion.png' },
      { id: 'revive', name: 'Rappel', type: 'other', effect: 50, description: 'Ranime un Pokémon K.O. à 50% HP', image: '/images/objets/rappel.png' },
      { id: 'full-heal', name: 'Guérison', type: 'status-heal', effect: 0, description: 'Soigne tous les statuts', image: '/images/objets/guerison.png' },
      { id: 'antidote', name: 'Antidote', type: 'status-heal', effect: 0, description: 'Soigne l\'empoisonnement', image: '/images/objets/antidote.png' },
      { id: 'awakening', name: 'Réveil', type: 'status-heal', effect: 0, description: 'Réveille un Pokémon endormi', image: '/images/objets/reveil.png' },
      { id: 'paralyze-heal', name: 'Anti-Para', type: 'status-heal', effect: 0, description: 'Soigne la paralysie', image: '/images/objets/antipara.png' },
      { id: 'burn-heal', name: 'Anti-Brûle', type: 'status-heal', effect: 0, description: 'Soigne les brûlures', image: '/images/objets/antibrule.png' },
      { id: 'ice-heal', name: 'Antigel', type: 'status-heal', effect: 0, description: 'Soigne le gel', image: '/images/objets/antigel.png' },
    ];

    // Items de niveau supérieur si le niveau est élevé
    if (level >= 30) {
      allItems.push(
        { id: 'max-potion', name: 'Potion Max', type: 'healing', effect: 999, description: 'Restaure tous les HP', image: '/images/objets/potion-max.png' },
        { id: 'full-restore', name: 'Restauration Totale', type: 'healing', effect: 999, description: 'Restaure HP et soigne statuts' },
        { id: 'max-revive', name: 'Rappel Max', type: 'other', effect: 100, description: 'Ranime un Pokémon K.O. à 100% HP', image: '/images/objets/rappel-max.png' }
      );
    }

    // Mélanger et prendre 'count' items uniques
    const shuffled = this.randomGenerator.shuffle([...allItems]);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  /**
   * Génère un Pokémon bonus selon le niveau
   */
  private async generateBonusPokemon(level: number): Promise<Pokemon | null> {
    try {
      // Utilise la même plage que la sélection de départ (500 premiers Pokémon)
      const pokemonIds = Array.from({ length: 500 }, (_, i) => i + 1);

      // Essaie jusqu'à 5 fois de trouver un Pokémon valide
      for (let attempt = 0; attempt < 5; attempt++) {
        const randomId = this.randomGenerator.selectRandom(pokemonIds);
        
        const pokemon = await this.gateway.getPokemon(randomId.toString());
        
        if (pokemon) {
          
          if (pokemon.name) {
            // Ajuste le niveau du Pokémon bonus
            const bonusLevel = Math.max(5, level - 5); // Niveau proche de l'adversaire
            const adjustedPokemon = this.adjustPokemonLevel(pokemon, bonusLevel);
            return adjustedPokemon;
          } else {
            console.warn(`Pokemon ${randomId} missing name`);
          }
        } else {
          console.warn(`Failed to get pokemon with ID ${randomId}`);
        }
      }

      console.warn('Could not generate a valid bonus pokemon after 5 attempts');
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
    
    // Initialiser currentMoves avec PP max si pas déjà défini
    let currentMoves = pokemon.currentMoves;
    if (!currentMoves) {
      // Créer des moves basiques avec PP max
      currentMoves = pokemon.moves.map(moveName => ({
        id: moveName,
        name: moveName.charAt(0).toUpperCase() + moveName.slice(1).replace('-', ' '),
        type: 'normal', // Type par défaut, devrait être chargé depuis l'API
        power: 50,
        accuracy: 100,
        pp: 20, // PP max par défaut
        maxPp: 20,
        damageClass: 'physical' as const,
        priority: 0
      }));
    }
    
    return {
      ...pokemon,
      level,
      maxHp: this.mathService.floor(pokemon.stats.hp * (1 + levelMultiplier * 0.5)),
      currentHp: this.mathService.floor(pokemon.stats.hp * (1 + levelMultiplier * 0.5)),
      currentMoves,
      stats: {
        ...pokemon.stats,
        hp: this.mathService.floor(pokemon.stats.hp * (1 + levelMultiplier * 0.5)),
        attack: this.mathService.floor(pokemon.stats.attack * (1 + levelMultiplier * 0.3)),
        defense: this.mathService.floor(pokemon.stats.defense * (1 + levelMultiplier * 0.3)),
        specialAttack: this.mathService.floor(pokemon.stats.specialAttack * (1 + levelMultiplier * 0.3)),
        specialDefense: this.mathService.floor(pokemon.stats.specialDefense * (1 + levelMultiplier * 0.3)),
        speed: this.mathService.floor(pokemon.stats.speed * (1 + levelMultiplier * 0.3)),
      },
    };
  }

  /**
   * Crée un Pokémon de secours si la génération échoue
   */
  private createFallbackPokemon(level: number): Pokemon {
    const fallbackPokemon = new Pokemon();
    fallbackPokemon.id = 'fallback-' + this.randomGenerator.generate().toString(36).substr(2, 9);
    fallbackPokemon.name = 'Pokémon Mystère';
    fallbackPokemon.types = ['normal'];
    fallbackPokemon.stats = {
      hp: 50,
      attack: 50,
      defense: 50,
      specialAttack: 50,
      specialDefense: 50,
      speed: 50,
    };
    fallbackPokemon.level = Math.max(5, level - 5);
    fallbackPokemon.currentHp = fallbackPokemon.stats.hp;
    fallbackPokemon.maxHp = fallbackPokemon.stats.hp;
    fallbackPokemon.moves = ['tackle', 'growl', 'scratch', 'tail-whip'];
    fallbackPokemon.sprite = undefined; // Pas de sprite, utilisera l'emoji
    fallbackPokemon.emoji = '❓';
    
    return this.adjustPokemonLevel(fallbackPokemon, fallbackPokemon.level);
  }

  /**
   * Remplace un Pokémon dans l'équipe du joueur
   */
  replacePokemonInTeam(player: Trainer, pokemonToReplaceId: string, newPokemon: Pokemon): Trainer {
    const updatedTeam = player.team.map((p: Pokemon) => 
      p.id === pokemonToReplaceId ? newPokemon : p
    );
    
    return {
      ...player,
      team: updatedTeam
    };
  }
}
