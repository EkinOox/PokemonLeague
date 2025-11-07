import { Pokemon } from '../../domain/entities/Pokemon';
import { IPokemonGateway } from '@/domain/ports/IPokemonGateway';
import { TyradexType, TyradexPokemonData } from './types/TyradexTypes';

export class PokemonAPIGateway implements IPokemonGateway {
  private baseUrl = 'https://tyradex.vercel.app/api/v1/pokemon';

  async getPokemon(id: string): Promise<Pokemon | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        return null;
      }
      const data: TyradexPokemonData = await response.json();
      const pokemon = new Pokemon();
      pokemon.id = data.pokedex_id?.toString() || id;
      pokemon.name = data.name?.fr || data.name?.en || id;
      pokemon.types = data.types?.map((t: TyradexType) => t.name) || [];
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
      
      // Les talents sont des capacités passives, pas des mouvements
      // On utilise seulement des mouvements par défaut basés sur les types
      const types = data.types?.map((t: TyradexType) => t.name) || ['normal'];
      pokemon.moves = this.getDefaultMovesForTypes(types);
      
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
      // Support pour les types français (Tyradex)
      'feu': ['ember', 'flame-wheel', 'flamethrower', 'fire-blast'],
      'eau': ['water-gun', 'bubble-beam', 'surf', 'hydro-pump'],
      'plante': ['vine-whip', 'razor-leaf', 'energy-ball', 'solar-beam'],
      'électrik': ['thunder-shock', 'spark', 'thunderbolt', 'thunder'],
      'glace': ['powder-snow', 'ice-beam', 'blizzard', 'ice-punch'],
      'combat': ['low-kick', 'karate-chop', 'brick-break', 'close-combat'],
      'sol': ['mud-slap', 'bulldoze', 'earthquake', 'earth-power'],
      'vol': ['gust', 'wing-attack', 'air-slash', 'brave-bird'],
      'psy': ['confusion', 'psybeam', 'psychic', 'future-sight'],
      'insecte': ['bug-bite', 'fury-cutter', 'x-scissor', 'bug-buzz'],
      'roche': ['rock-throw', 'rock-tomb', 'rock-slide', 'stone-edge'],
      'spectre': ['lick', 'shadow-sneak', 'shadow-ball', 'shadow-claw'],
      'ténèbres': ['bite', 'feint-attack', 'crunch', 'dark-pulse'],
      'acier': ['metal-claw', 'iron-head', 'flash-cannon', 'meteor-mash'],
      'fée': ['fairy-wind', 'draining-kiss', 'dazzling-gleam', 'moonblast'],
    };

    const moves: string[] = [];
    const primaryType = types[0]?.toLowerCase() || 'normal';
    const primaryMoves = movesByType[primaryType] || movesByType['normal'];

    // S'assurer qu'il y a au moins 3 mouvements du type principal
    moves.push(primaryMoves[0]); // Move faible
    moves.push(primaryMoves[1]); // Move moyen
    moves.push(primaryMoves[2]); // Move fort

    // Ajouter un 4ème move : soit du type secondaire, soit un move puissant du type principal
    if (types.length > 1) {
      const secondaryType = types[1]?.toLowerCase();
      const secondaryMoves = movesByType[secondaryType] || movesByType['normal'];
      moves.push(secondaryMoves[1]); // Move moyen du type secondaire
    } else {
      moves.push(primaryMoves[3]); // Move très fort du type principal
    }

    return moves;
  }
}