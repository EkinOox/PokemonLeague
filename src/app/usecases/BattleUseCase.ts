import { Battle } from '@/domain/entities/Battle';
import { Pokemon, StatusCondition, StatModifiers } from '@/domain/entities/Pokemon';
import { Move, StatusEffect, MoveEffect } from '@/domain/entities/Move';

export class BattleUseCase {
  /**
   * Calcule les dégâts d'une attaque en tenant compte des types
   */
  calculateDamage(
    attacker: Pokemon,
    defender: Pokemon,
    move: Move
  ): { damage: number; isCritical: boolean; effectiveness: number } {
    if (!move.power) return { damage: 0, isCritical: false, effectiveness: 1 };

    // Vérifier si c'est un coup critique (6.25% de chance)
    const isCritical = Math.random() < 0.0625;

    // Formule équilibrée pour des combats dynamiques
    const level = attacker.level || 50;
    
    // Utiliser les stats modifiées par les statuts
    const attackStat = move.damageClass === 'physical' ? 'attack' : 'specialAttack';
    const defenseStat = move.damageClass === 'physical' ? 'defense' : 'specialDefense';
    const attack = this.getModifiedStat(attacker, attackStat);
    const defense = this.getModifiedStat(defender, defenseStat);
    
    // Calcul de base: (Power/2) * (Attack/Defense) * (Level/25)
    // Cela donne des dégâts proportionnels à la puissance de l'attaque
    let damage = (move.power / 2) * (attack / defense) * (level / 25);
    
    // Multiplicateur critique (x2 pour être impactant)
    if (isCritical) {
      damage *= 2;
    }
    
    // Multiplicateur STAB (Same Type Attack Bonus)
    const isStab = attacker.types.some(t => t === move.type);
    if (isStab) {
      damage *= 1.5;
    }
    
    // Efficacité des types
    const effectiveness = this.getTypeEffectiveness(move.type, defender.types);
    damage *= effectiveness;
    
    // Variation aléatoire (90-110%)
    const randomFactor = 0.9 + Math.random() * 0.2;
    damage *= randomFactor;
    
    return { damage: Math.floor(damage), isCritical, effectiveness };
  }

  /**
   * Détermine l'efficacité d'un type contre un ou plusieurs types défensifs
   */
  getTypeEffectiveness(attackType: string, defenseTypes: string[]): number {
    const typeChart: Record<string, Record<string, number>> = {
      normal: { rock: 0.5, ghost: 0, steel: 0.5 },
      fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
      water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
      electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
      grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
      ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
      fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
      poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
      ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
      flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
      psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
      bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
      rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
      ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
      dragon: { dragon: 2, steel: 0.5, fairy: 0 },
      dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
      steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
      fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
    };

    let effectiveness = 1;
    
    for (const defenseType of defenseTypes) {
      const matchup = typeChart[attackType.toLowerCase()]?.[defenseType.toLowerCase()];
      if (matchup !== undefined) {
        effectiveness *= matchup;
      }
    }
    
    return effectiveness;
  }

  /**
   * Retourne le message d'efficacité pour l'UI
   */
  getEffectivenessMessage(effectiveness: number): string {
    if (effectiveness === 0) return "Ça n'a aucun effet...";
    if (effectiveness < 0.5) return "Ce n'est pas très efficace...";
    if (effectiveness < 1) return "Ce n'est pas très efficace...";
    if (effectiveness === 1) return "";
    if (effectiveness >= 2) return "C'est super efficace !";
    return "";
  }

  /**
   * Détermine si un Pokémon est K.O.
   */
  isFainted(pokemon: Pokemon): boolean {
    return pokemon.currentHp <= 0;
  }

  /**
   * Vérifie si le combat est terminé
   */
  isBattleOver(battle: Battle): { isOver: boolean; winner?: 'player' | 'opponent' } {
    const playerHasAlivePokemon = battle.trainer1.team.some((p: Pokemon) => !this.isFainted(p));
    const opponentHasAlivePokemon = battle.trainer2.team.some((p: Pokemon) => !this.isFainted(p));

    if (!playerHasAlivePokemon) {
      return { isOver: true, winner: 'opponent' };
    }
    
    if (!opponentHasAlivePokemon) {
      return { isOver: true, winner: 'player' };
    }

    return { isOver: false };
  }

  /**
   * Sélectionne automatiquement la prochaine attaque de l'adversaire (IA basique)
   * Note: Pour l'instant retourne un move basique car moves est un tableau de strings
   */
  selectOpponentMove(pokemon: Pokemon, availableMoves: Move[]): Move {
    const usableMoves = availableMoves.filter(move => move.pp > 0);
    
    if (usableMoves.length === 0) {
      // Struggle (attaque par défaut)
      return {
        id: 'struggle',
        name: 'Lutte',
        type: 'normal',
        power: 50,
        accuracy: 100,
        pp: 1,
        maxPp: 1,
        damageClass: 'physical',
        priority: 0,
      };
    }

    // IA simple : choisir une attaque aléatoire avec une préférence pour les attaques puissantes
    const powerfulMoves = usableMoves.filter(m => m.power && m.power >= 80);
    
    if (powerfulMoves.length > 0 && Math.random() > 0.3) {
      return powerfulMoves[Math.floor(Math.random() * powerfulMoves.length)];
    }
    
    return usableMoves[Math.floor(Math.random() * usableMoves.length)];
  }

  /**
   * Trouve le premier Pokémon encore en vie dans l'équipe
   */
  getFirstAlivePokemon(team: Pokemon[]): Pokemon | null {
    return team.find(p => !this.isFainted(p)) || null;
  }

  /**
   * Applique les dégâts à un Pokémon
   */
  applyDamage(pokemon: Pokemon, damage: number): Pokemon {
    return {
      ...pokemon,
      currentHp: Math.max(0, pokemon.currentHp - damage),
    };
  }

  /**
   * Réduit les PP d'une attaque
   */
  reducePP(move: Move): Move {
    return {
      ...move,
      pp: Math.max(0, move.pp - 1),
    };
  }

  /**
   * Détermine qui attaque en premier (basé sur la vitesse et la priorité)
   */
  determineFirstAttacker(
    playerPokemon: Pokemon,
    playerMove: Move,
    opponentPokemon: Pokemon,
    opponentMove: Move
  ): 'player' | 'opponent' {
    // Priorité des attaques
    if (playerMove.priority > opponentMove.priority) return 'player';
    if (opponentMove.priority > playerMove.priority) return 'opponent';
    
    // Vitesse des Pokémon
    if (playerPokemon.stats.speed > opponentPokemon.stats.speed) return 'player';
    if (opponentPokemon.stats.speed > playerPokemon.stats.speed) return 'opponent';
    
    // En cas d'égalité, aléatoire
    return Math.random() > 0.5 ? 'player' : 'opponent';
  }

  /**
   * Applique un statut à un Pokémon
   */
  applyStatus(pokemon: Pokemon, status: StatusCondition): { pokemon: Pokemon; success: boolean; message: string } {
    // Vérifier si le Pokémon a déjà un statut
    if (pokemon.status && pokemon.status !== null) {
      return {
        pokemon,
        success: false,
        message: `${pokemon.name} a déjà un statut !`
      };
    }

    // Immunités de type
    if (status === 'burn' && pokemon.types.includes('fire')) {
      return { pokemon, success: false, message: `${pokemon.name} est immunisé contre la brûlure !` };
    }
    if (status === 'freeze' && pokemon.types.includes('ice')) {
      return { pokemon, success: false, message: `${pokemon.name} est immunisé contre le gel !` };
    }
    if ((status === 'poison' || status === 'badly-poison') && 
        (pokemon.types.includes('poison') || pokemon.types.includes('steel'))) {
      return { pokemon, success: false, message: `${pokemon.name} est immunisé contre le poison !` };
    }
    if (status === 'paralysis' && pokemon.types.includes('electric')) {
      return { pokemon, success: false, message: `${pokemon.name} est immunisé contre la paralysie !` };
    }

    // Appliquer le statut
    const updatedPokemon = {
      ...pokemon,
      status,
      statusTurns: status === 'sleep' ? Math.floor(Math.random() * 3) + 1 : // 1-3 tours
                   status === 'confusion' ? Math.floor(Math.random() * 4) + 1 : // 1-4 tours
                   undefined
    };

    const messages: Record<string, string> = {
      'burn': `${pokemon.name} est brûlé !`,
      'freeze': `${pokemon.name} est gelé !`,
      'paralysis': `${pokemon.name} est paralysé !`,
      'poison': `${pokemon.name} est empoisonné !`,
      'badly-poison': `${pokemon.name} est gravement empoisonné !`,
      'sleep': `${pokemon.name} s'est endormi !`,
      'confusion': `${pokemon.name} est confus !`
    };

    return {
      pokemon: updatedPokemon,
      success: true,
      message: status ? messages[status] : `${pokemon.name} est affecté !`
    };
  }

  /**
   * Vérifie si un Pokémon peut attaquer avec son statut
   */
  canAttackWithStatus(pokemon: Pokemon): { canAttack: boolean; message?: string; pokemon?: Pokemon } {
    if (!pokemon.status) return { canAttack: true };

    switch (pokemon.status) {
      case 'freeze':
        // 20% de chance de dégeler
        if (Math.random() < 0.2) {
          return {
            canAttack: true,
            message: `${pokemon.name} a dégelé !`,
            pokemon: { ...pokemon, status: null }
          };
        }
        return {
          canAttack: false,
          message: `${pokemon.name} est gelé et ne peut pas attaquer !`
        };

      case 'sleep':
        const turnsLeft = (pokemon.statusTurns || 0) - 1;
        if (turnsLeft <= 0) {
          return {
            canAttack: true,
            message: `${pokemon.name} s'est réveillé !`,
            pokemon: { ...pokemon, status: null, statusTurns: undefined }
          };
        }
        return {
          canAttack: false,
          message: `${pokemon.name} dort...`,
          pokemon: { ...pokemon, statusTurns: turnsLeft }
        };

      case 'paralysis':
        // 25% de chance d'être paralysé
        if (Math.random() < 0.25) {
          return {
            canAttack: false,
            message: `${pokemon.name} est paralysé et ne peut pas attaquer !`
          };
        }
        return { canAttack: true };

      case 'confusion':
        const confusionTurnsLeft = (pokemon.statusTurns || 0) - 1;
        if (confusionTurnsLeft <= 0) {
          return {
            canAttack: true,
            message: `${pokemon.name} n'est plus confus !`,
            pokemon: { ...pokemon, status: null, statusTurns: undefined }
          };
        }
        
        // 33% de chance de se blesser
        if (Math.random() < 0.33) {
          const selfDamage = Math.floor(pokemon.maxHp * 0.125); // 12.5% des HP max
          return {
            canAttack: false,
            message: `${pokemon.name} est confus et se blesse lui-même !`,
            pokemon: {
              ...pokemon,
              currentHp: Math.max(0, pokemon.currentHp - selfDamage),
              statusTurns: confusionTurnsLeft
            }
          };
        }
        
        return {
          canAttack: true,
          pokemon: { ...pokemon, statusTurns: confusionTurnsLeft }
        };

      default:
        return { canAttack: true };
    }
  }

  /**
   * Applique les dégâts de statut en fin de tour
   */
  applyStatusDamage(pokemon: Pokemon): { pokemon: Pokemon; message?: string } {
    if (!pokemon.status) return { pokemon };

    switch (pokemon.status) {
      case 'burn':
        const burnDamage = Math.floor(pokemon.maxHp * 0.0625); // 6.25% des HP max
        return {
          pokemon: {
            ...pokemon,
            currentHp: Math.max(0, pokemon.currentHp - burnDamage)
          },
          message: `${pokemon.name} souffre de sa brûlure !`
        };

      case 'poison':
        const poisonDamage = Math.floor(pokemon.maxHp * 0.125); // 12.5% des HP max
        return {
          pokemon: {
            ...pokemon,
            currentHp: Math.max(0, pokemon.currentHp - poisonDamage)
          },
          message: `${pokemon.name} souffre du poison !`
        };

      case 'badly-poison':
        // Le poison aggravé augmente à chaque tour
        const badlyPoisonTurns = (pokemon.statusTurns || 0) + 1;
        const badlyPoisonDamage = Math.floor(pokemon.maxHp * 0.0625 * badlyPoisonTurns);
        return {
          pokemon: {
            ...pokemon,
            currentHp: Math.max(0, pokemon.currentHp - badlyPoisonDamage),
            statusTurns: badlyPoisonTurns
          },
          message: `${pokemon.name} souffre du poison aggravé !`
        };

      default:
        return { pokemon };
    }
  }

  /**
   * Applique un effet d'attaque (chance d'appliquer un statut, etc.)
   */
  applyMoveEffect(
    attacker: Pokemon,
    defender: Pokemon,
    move: Move
  ): { defender: Pokemon; message?: string } {
    if (!move.effect) return { defender };

    // Vérifier la chance d'application
    const chance = move.effect.chance || 100;
    if (Math.random() * 100 > chance) {
      return { defender };
    }

    switch (move.effect.type) {
      case 'status':
        if (move.effect.status) {
          const result = this.applyStatus(defender, move.effect.status);
          return {
            defender: result.pokemon,
            message: result.success ? result.message : undefined
          };
        }
        return { defender };

      case 'stat-change':
        // TODO: Implémenter les changements de stats
        return { defender };

      case 'heal':
        // TODO: Implémenter la guérison
        return { defender };

      case 'recoil':
        // Les dégâts de recul sont appliqués après l'attaque
        return { defender };

      default:
        return { defender };
    }
  }

  /**
   * Modifie l'attaque/défense selon le statut
   */
  getModifiedStat(pokemon: Pokemon, stat: 'attack' | 'defense' | 'specialAttack' | 'specialDefense' | 'speed'): number {
    let value = pokemon.stats[stat];

    // La brûlure réduit l'attaque physique de 50%
    if (pokemon.status === 'burn' && stat === 'attack') {
      value = Math.floor(value * 0.5);
    }

    // La paralysie réduit la vitesse de 50%
    if (pokemon.status === 'paralysis' && stat === 'speed') {
      value = Math.floor(value * 0.5);
    }

    // Appliquer les modificateurs de stats si présents
    if (pokemon.statModifiers && pokemon.statModifiers[stat] !== 0) {
      const modifier = pokemon.statModifiers[stat];
      const multiplier = modifier > 0 
        ? (2 + modifier) / 2 
        : 2 / (2 - modifier);
      value = Math.floor(value * multiplier);
    }

    return value;
  }
}
