import { Trainer } from '@/domain/entities/Trainer';
import { Pokemon } from '@/domain/entities/Pokemon';
import { PokemonAPIGateway } from '@/adapters/gateways/PokemonAPIGateway';
import { IRandomGenerator } from '@/domain/ports/IRandomGenerator';
import { IMathService } from '@/domain/ports/IMathService';

export class LeagueUseCase {
  private gateway: PokemonAPIGateway;

  constructor(
    private randomGenerator: IRandomGenerator,
    private mathService: IMathService
  ) {
    this.gateway = new PokemonAPIGateway();
  }

  /**
   * Génère les dresseurs de la ligue avec des niveaux croissants
   */
  async generateLeagueTrainers(playerLevel: number = 1): Promise<Trainer[]> {
    const trainerNames = [
      'Pierre', 'Ondine', 'Major Bob', 'Erika', 
      'Koga', 'Morgane', 'Auguste', 'Giovanni',
      'Lorelei', 'Agatha', 'Aldo', 'Peter'
    ];

    const trainers: Trainer[] = [];

    for (let i = 0; i < trainerNames.length; i++) {
      const trainer = await this.generateTrainer(
        trainerNames[i],
        playerLevel + i,
        6 // Nombre de Pokémon
      );
      trainers.push(trainer);
    }

    return trainers;
  }

  /**
   * Génère un dresseur avec une équipe de Pokémon
   */
  async generateTrainer(
    name: string,
    level: number,
    teamSize: number = 6
  ): Promise<Trainer> {
    const team: Pokemon[] = [];
    
    // Génère des Pokémon aléatoires pour l'équipe
    const usedIds = new Set<number>();
    
    while (team.length < teamSize) {
      // ID aléatoire entre 1 et 150 (Gen 1)
      const randomId = this.randomGenerator.generateInRange(1, 150);
      
      if (!usedIds.has(randomId)) {
        usedIds.add(randomId);
        const pokemon = await this.gateway.getPokemon(randomId.toString());
        
        if (pokemon) {
          // Ajuste le niveau et les HP
          const adjustedPokemon = this.adjustPokemonLevel(pokemon, level);
          team.push(adjustedPokemon);
        }
      }
    }

    return {
      id: `trainer-${name.toLowerCase()}`,
      name,
      rank: level,
      team,
      items: [],
    };
  }

  /**
   * Ajuste le niveau d'un Pokémon et recalcule ses stats
   */
  adjustPokemonLevel(pokemon: Pokemon, level: number): Pokemon {
    const levelMultiplier = level / 50; // Base level 50
    
    return {
      ...pokemon,
      level,
      maxHp: this.mathService.floor(pokemon.stats.hp * (1 + levelMultiplier * 0.5)),
      currentHp: this.mathService.floor(pokemon.stats.hp * (1 + levelMultiplier * 0.5)),
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
   * Calcule les points gagnés après une victoire
   */
  calculatePoints(
    opponentLevel: number,
    playerLevel: number,
    victorySpe: 'quick' | 'normal' | 'hard'
  ): number {
    let basePoints = opponentLevel * 100;
    
    // Bonus selon le type de victoire
    const bonusMultiplier = {
      quick: 1.5,  // Victoire rapide (sans KO)
      normal: 1.0, // Victoire normale
      hard: 0.8    // Victoire difficile (plusieurs KO)
    };
    
    basePoints *= bonusMultiplier[victorySpe];
    
    // Bonus si l'adversaire est plus fort
    if (opponentLevel > playerLevel) {
      basePoints *= 1.2;
    }
    
    return this.mathService.floor(basePoints);
  }

  /**
   * Détermine la prochaine récompense selon les points
   */
  getNextRewardThreshold(currentPoints: number): { threshold: number; reward: string } {
    const rewards = [
      { threshold: 1000, reward: 'Potion' },
      { threshold: 3000, reward: 'Super Potion' },
      { threshold: 6000, reward: 'Pokéball x5' },
      { threshold: 10000, reward: 'Nouveau Pokémon' },
      { threshold: 15000, reward: 'Hyper Potion' },
      { threshold: 20000, reward: 'Pierre Évolution' },
      { threshold: 30000, reward: 'Master Ball' },
    ];

    for (const reward of rewards) {
      if (currentPoints < reward.threshold) {
        return reward;
      }
    }

    return { threshold: 50000, reward: 'Champion de la Ligue !' };
  }

  /**
   * Vérifie si le joueur a assez de points pour un badge
   */
  canClaimBadge(points: number, badgeLevel: number): boolean {
    const thresholds = [2000, 5000, 10000, 15000, 20000, 30000, 40000, 50000];
    return points >= thresholds[badgeLevel - 1];
  }

  /**
   * Soigne complètement l'équipe du joueur
   */
  healTeam(trainer: Trainer): Trainer {
    return {
      ...trainer,
      team: trainer.team.map(pokemon => ({
        ...pokemon,
        currentHp: pokemon.maxHp,
      })),
    };
  }
}
