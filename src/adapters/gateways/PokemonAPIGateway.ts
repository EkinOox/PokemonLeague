import { Pokemon } from '../../domain/entities/Pokemon';

export class PokemonAPIGateway {
  private baseUrl = 'https://tyradex.vercel.app/api/v1/pokemon';

  async getPokemon(id: string): Promise<Pokemon | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      const pokemon = new Pokemon();
      pokemon.id = data.pokedex_id?.toString() || id;
      pokemon.name = data.name?.fr || data.name?.en || id;
      pokemon.types = data.types?.map((t: any) => t.name) || [];
      pokemon.stats = {
        hp: data.stats?.hp || 0,
        attack: data.stats?.atk || 0,
        defense: data.stats?.def || 0,
        specialAttack: data.stats?.spe_atk || 0,
        specialDefense: data.stats?.spe_def || 0,
        speed: data.stats?.vit || 0,
      };
      pokemon.level = 5;
      pokemon.currentHp = pokemon.stats.hp;
      pokemon.maxHp = pokemon.stats.hp;
      
      // Les talents deviennent directement des attaques spéciales
      // Plus besoin de mapping complexe - on utilise les noms français comme moves uniques
      const talents = data.talents?.map((t: any) => t.name.toLowerCase().replace(/\s+/g, '-')) || [];
      pokemon.moves = this.getMixedMoves(talents, data.types?.map((t: any) => t.name) || ['normal']);
      
      // Essayer plusieurs sources de sprites
      const tyradexSprite = data.sprites?.regular;
      const pokeapiSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
      const pokeapiOfficialSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
      
      // Tester si le sprite Tyradex existe, sinon utiliser PokeAPI
      pokemon.sprite = tyradexSprite || pokeapiSprite;
      
      pokemon.emoji = this.getPokemonEmoji(data.types?.[0]?.name || 'normal');
      return pokemon;
    } catch (error) {
      return null;
    }
  }

  private getPokemonEmoji(type: string): string {
    const normalizedType = type.toLowerCase();
    
    const emojiMap: Record<string, string> = {
      // English types
      'normal': '⭐',
      'fire': '🔥',
      'water': '💧',
      'grass': '🍃',
      'electric': '⚡',
      'ice': '❄️',
      'fighting': '🥊',
      'poison': '☠️',
      'ground': '🌍',
      'flying': '🦅',
      'psychic': '🔮',
      'bug': '🐛',
      'rock': '🪨',
      'ghost': '👻',
      'dragon': '🐉',
      'dark': '🌙',
      'steel': '⚙️',
      'fairy': '🧚',
      // French types (Tyradex API)
      'feu': '🔥',
      'eau': '💧',
      'plante': '🍃',
      'électrik': '⚡',
      'glace': '❄️',
      'combat': '🥊',
      'sol': '🌍',
      'vol': '🦅',
      'psy': '🔮',
      'insecte': '🐛',
      'roche': '🪨',
      'spectre': '👻',
      'ténèbres': '🌙',
      'acier': '⚙️',
      'fée': '🧚',
    };
    
    return emojiMap[normalizedType] || '⭐';
  }



  private getMixedMoves(talents: string[], types: string[]): string[] {
    const moves: string[] = [];
    
    // Ajouter tous les talents (jusqu'à 4)
    const talentMoves = talents.slice(0, 4);
    moves.push(...talentMoves);

    // Si on n'a pas 4 moves, compléter avec des attaques aléatoires basées sur les types
    if (moves.length < 4) {
      const randomMoves = this.getDefaultMovesForTypes(types);
      const neededMoves = 4 - moves.length;
      
      // Ajouter des moves aléatoires qui ne sont pas déjà présents
      for (const move of randomMoves) {
        if (!moves.includes(move) && moves.length < 4) {
          moves.push(move);
        }
      }
      
      // Si on manque encore de moves, forcer l'ajout
      while (moves.length < 4 && randomMoves.length > 0) {
        const randomIndex = Math.floor(Math.random() * randomMoves.length);
        const randomMove = randomMoves[randomIndex];
        if (!moves.includes(randomMove)) {
          moves.push(randomMove);
        } else {
          randomMoves.splice(randomIndex, 1);
        }
      }
    }

    return moves.slice(0, 4); // S'assurer qu'on retourne exactement 4 moves
  }

  private getDefaultMovesForTypes(types: string[]): string[] {
    // Map de moves par type avec leur niveau de puissance (noms anglais pour PokeAPI)
    // Format: [move faible, move moyen, move fort, move très fort]
    const movesByType: Record<string, string[]> = {
      normal: ['tackle', 'scratch', 'body-slam', 'hyper-beam'],
      fire: ['ember', 'flame-wheel', 'flamethrower', 'fire-blast'],
      water: ['water-gun', 'bubble-beam', 'surf', 'hydro-pump'],
      grass: ['vine-whip', 'razor-leaf', 'energy-ball', 'solar-beam'],
      electric: ['thunder-shock', 'spark', 'thunderbolt', 'thunder'],
      ice: ['powder-snow', 'ice-beam', 'blizzard', 'ice-punch'],
      fighting: ['low-kick', 'karate-chop', 'brick-break', 'close-combat'],
      poison: ['poison-sting', 'sludge', 'poison-jab', 'sludge-bomb'],
      ground: ['mud-slap', 'bulldoze', 'earthquake', 'earth-power'],
      flying: ['gust', 'wing-attack', 'air-slash', 'brave-bird'],
      psychic: ['confusion', 'psybeam', 'psychic', 'future-sight'],
      bug: ['bug-bite', 'fury-cutter', 'x-scissor', 'bug-buzz'],
      rock: ['rock-throw', 'rock-tomb', 'rock-slide', 'stone-edge'],
      ghost: ['lick', 'shadow-sneak', 'shadow-ball', 'shadow-claw'],
      dragon: ['dragon-breath', 'dragon-claw', 'dragon-pulse', 'draco-meteor'],
      dark: ['bite', 'feint-attack', 'crunch', 'dark-pulse'],
      steel: ['metal-claw', 'iron-head', 'flash-cannon', 'meteor-mash'],
      fairy: ['fairy-wind', 'draining-kiss', 'dazzling-gleam', 'moonblast'],
    };

    const moves: string[] = [];
    const primaryType = types[0]?.toLowerCase() || 'normal';
    const primaryMoves = movesByType[primaryType] || movesByType['normal'];

    // Ajouter 1 move faible, 1 move moyen du type principal
    moves.push(primaryMoves[0]); // Faible (PP élevé)
    moves.push(primaryMoves[2]); // Fort (PP moyen)

    // Ajouter 1 move du type secondaire si existe, sinon du type principal
    if (types.length > 1) {
      const secondaryType = types[1]?.toLowerCase();
      const secondaryMoves = movesByType[secondaryType] || movesByType['normal'];
      moves.push(secondaryMoves[1]); // Moyen
    } else {
      moves.push(primaryMoves[1]); // Moyen
    }

    // Ajouter 1 move puissant pour la variété
    const powerfulMoves = ['hyper-beam', 'giga-impact', 'self-destruct', 'explosion'];
    const randomPowerful = powerfulMoves[Math.floor(Math.random() * powerfulMoves.length)];
    moves.push(randomPowerful);

    return moves;
  }
}