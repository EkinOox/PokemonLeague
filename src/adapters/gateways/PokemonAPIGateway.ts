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
      
      // Mixer les talents de l'API avec des attaques aléatoires
      const talents = data.talents?.map((t: any) => this.convertTalentToMove(t.name)) || [];
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

  private convertTalentToMove(talentName: string): string {
    // Convertir le nom français du talent en nom d'attaque anglais pour PokeAPI
    // Les talents deviennent des attaques spéciales uniques
    const talentToMoveMap: Record<string, string> = {
      // Talents Plante
      'engrais': 'solar-beam',        // Très puissant, peu de PP
      'chlorophylle': 'synthesis',    // Soin
      'feuille-garde': 'leaf-blade',
      
      // Talents Feu
      'brasier': 'fire-blast',        // Très puissant
      'torche': 'flare-blitz',
      'sécheresse': 'sunny-day',
      
      // Talents Eau
      'torrent': 'hydro-pump',        // Très puissant
      'cuvette': 'aqua-ring',
      'absorb-eau': 'water-spout',
      'moiteur': 'rain-dance',
      
      // Talents Électrik
      'statik': 'discharge',
      'paratonnerre': 'thunder',
      'boost-électrique': 'thunderbolt',
      
      // Talents Combat
      'cran': 'close-combat',
      'sans-limite': 'superpower',
      'poing-de-fer': 'meteor-mash',
      
      // Talents Psy
      'synchro': 'psychic',
      'attention': 'future-sight',
      'télépathe': 'psyshock',
      
      // Talents Spectre
      'marque-ombre': 'shadow-sneak',
      'corps-maudit': 'hex',
      
      // Talents Dragon
      'écaille-spéciale': 'dragon-pulse',
      
      // Talents Ténèbres
      'impudence': 'dark-pulse',
      
      // Talents Fée
      'joli-sourire': 'moonblast',
      
      // Talents génériques
      'intimidation': 'scary-face',
      'peau-dure': 'iron-defense',
      'tempo-perso': 'agility',
      'régé-force': 'drain-punch',
      'adaptabilité': 'swift',
      'rivalité': 'revenge',
      'glissade': 'aqua-jet',
      'essaim': 'bug-buzz',
      'écran-fumée': 'smokescreen',
      'pick-up': 'recycle',
      'ventouse': 'bind',
      'pare-feu': 'fire-spin',
      'échauffement': 'flame-charge',
      'voile-eau': 'water-sport',
      'sable-volant': 'sandstorm',
      'armurbaston': 'protect',
      'télécharge': 'charge-beam',
      'ignifuge': 'will-o-wisp',
      
      // Talents défensifs - mapper vers des moves défensifs
      'ignifu-voile': 'flame-charge',    // Flame Body -> flame move
      'lavabo': 'water-pulse',           // Water Absorb -> water move
      'pied-véloce': 'quick-attack',     // Quick Feet -> speed move
      'corps-sain': 'cosmic-power',      // Clear Body -> defensive move
      'corps-gel': 'ice-beam',           // Ice Body -> ice move
      'point-poison': 'poison-jab',      // Poison Point -> poison move
      'agitation': 'growl',              // Intimidate -> status move
      'œil-composé': 'focus-energy',     // Compound Eyes -> accuracy move
      'téméraire': 'take-down',          // Reckless -> reckless move
      'délestage': 'agility',            // Unburden -> speed boost
      'analyste': 'focus-energy',        // Analytic -> accuracy move
      'calque': 'transform',             // Trace -> transform
      'pression': 'scary-face',          // Pressure -> intimidate
      'coque-armure': 'iron-defense',    // Shell Armor -> defense
      'envelocape': 'protect',           // Overcoat -> protection
      'multi-coups': 'bullet-seed',      // Skill Link -> multi-hit
      'gloutonnerie': 'stockpile',       // Gluttony -> consume
      'ramassage': 'recycle',            // Pickup -> recycle
      
      // Talents supplémentaires pour éviter les warnings
      'lunatique': 'moonlight',          // Moody -> healing move
      'technicien': 'focus-energy',      // Technician -> accuracy boost
      'tension': 'scary-face',           // Super Luck -> intimidate
      'inconscient': 'rest',             // Oblivious -> rest
      'absorbe-eau': 'water-absorb',     // Water Absorb -> absorb
      'crachin': 'rain-dance',           // Drizzle -> weather
      'isograisse': 'stockpile',         // Thick Fat -> consume
      'sniper': 'focus-energy',          // Sniper -> accuracy
      'lévitation': 'teleport',          // Levitate -> teleport
      'hyper-cutter': 'swords-dance',    // Hyper Cutter -> attack boost
      'vaccin': 'acid-armor',            // Immunity -> defense
      'impassible': 'amnesia',           // Inner Focus -> special defense
      'incisif': 'swords-dance',         // Sharpness -> attack boost
      'cœur-noble': 'noble-roar',        // Justified -> intimidate
      'force-soleil': 'sunny-day',       // Solar Power -> weather
      'récolte': 'recycle',              // Harvest -> recycle
      'absentéisme': 'teleport',         // Run Away -> escape
      'piège-sable': 'sand-attack',      // Arena Trap -> accuracy down
      'baigne-sable': 'sandstorm',       // Sand Veil -> weather
      'magnépiège': 'thunder-wave',      // Magnet Pull -> paralyze
      'lumiattirance': 'flash',          // Lightning Rod -> special attack down
      'absorbe-volt': 'thunder-wave',    // Volt Absorb -> paralyze
      'plus': 'charge',                  // Plus -> charge
      'benêt': 'swagger',                // Simple -> confuse
      'anticipation': 'detect',          // Anticipation -> protection
      'hydratation': 'rain-dance',       // Hydration -> weather
      'multi-écaille': 'cosmic-power',   // Multiscale -> defense
      'suintement': 'toxic',             // Liquid Ooze -> poison
      'contestation': 'swagger',         // Defiant -> confuse
      'voile-sable': 'sandstorm',        // Sand Rush -> weather
      'garde-mystik': 'barrier',         // Magic Guard -> protection
      'battant': 'revenge',              // Sturdy -> revenge
      'garde-ami': 'follow-me',          // Friend Guard -> redirect
      'force-sable': 'sandstorm',        // Sand Force -> weather
      'glu': 'string-shot',              // Sticky Hold -> speed down
      'pose-spore': 'spore',             // Effect Spore -> sleep
      'peau-sèche': 'recover',           // Dry Skin -> healing
      'moeurs': 'swagger',               // Moody -> confuse
      'homochromie': 'camouflage',       // Color Change -> type change
      'protéen': 'transform',            // Protean -> transform
      'light-metal': 'iron-defense',     // Light Metal -> defense
      'tête-de-roc': 'rock-slide',       // Rock Head -> rock move
      'fermété': 'bulk-up',              // Sturdy -> defense
      'armurouillée': 'withdraw',        // Weak Armor -> defense down
      'fouille': 'dig',                  // Arena Trap -> ground move
      'matinal': 'morning-sun',          // Early Bird -> healing
      'turbo': 'agility',                // Speed Boost -> speed
      'lentiteintée': 'acid-armor',      // Slow Start -> defense
      'farceur': 'trick',                // Prankster -> trick
      'frein': 'disable',                // Slow Start -> disable
      'regard-vif': 'leer',              // Keen Eye -> intimidate
      'puanteur': 'poison-gas',          // Stench -> poison
      'herbivore': 'razor-leaf',         // Sap Sipper -> grass move
      'air-lock': 'sky-attack',          // Air Lock -> flying move
      'corp-sain': 'recover',            // Clear Body -> healing
      'coloforce': 'tri-attack',         // Color Change -> multi-type
      'insomnia': 'rest',                // Insomnia -> rest prevention
      'medic': 'heal-bell',              // Natural Cure -> healing
      'serenité': 'heal-bell',           // Serene Grace -> healing
      'ciel-gris': 'haze',               // Cloud Nine -> weather clear
      'chanceux': 'metronome',           // Super Luck -> random move
      'médic': 'heal-bell',              // Natural Cure -> healing
      'pare-balles': 'protect',          // Bulletproof -> protection
      'phobique': 'teleport',            // Run Away -> escape
      'glue': 'spider-web',              // Sticky Hold -> trap
      'tranche': 'night-slash',          // Sharpness -> dark move
      'cruauté': 'crunch',               // Strong Jaw -> bite
      'tempête-sable': 'sandstorm',      // Sand Stream -> weather
      'pluie': 'rain-dance',             // Drizzle -> weather
      'neige': 'blizzard',               // Snow Warning -> ice
      'peau-duale': 'transform',         // Disguise -> transform
      'ballon': 'bounce',                // Ball Fetch -> bounce
      'coton-poudre': 'cotton-spore',    // Cotton Down -> speed down
      'nez-busqué': 'peck',              // Big Pecks -> flying move
      'gourmandise': 'wish',             // Gluttony -> healing
      'soin-poison': 'heal-bell',        // Poison Heal -> healing
      'magicien': 'trick',               // Magician -> trick
      'anti-bruit': 'heal-bell',         // Soundproof -> healing
      'prisme-armure': 'reflect',        // Prism Armor -> protection
      'mue': 'shed-skin',                 // Shed Skin -> shed
      'prédiction': 'forecast',           // Forecast -> weather change
      'médic-nature': 'heal-bell',        // Natural Cure -> healing
      'annule-garde': 'bulk-up',          // No Guard -> attack/defense boost
      'esprit-vital': 'rest',             // Vital Spirit -> rest prevention
      'colérique': 'revenge',             // Anger Point -> revenge
      'acharné': 'revenge',               // Defiant -> revenge
      'pieds-confus': 'agility',          // Tangled Feet -> speed
      'cœur-de-coq': 'revenge',           // Rivalry -> revenge
      'infiltration': 'faint-attack',     // Infiltration -> dark move
      'heavy-metal': 'iron-defense',      // Heavy Metal -> defense
      'toxitouche': 'poison-jab',         // Poison Touch -> poison
      'force-pure': 'close-combat',       // Pure Power -> fighting
      'boom-final': 'explosion',          // Aftermath -> explosion
      'rage-brûlure': 'flame-charge',     // Flame Body -> fire
      'fuite': 'teleport',                 // Run Away -> escape
      'corps-ardent': 'flame-charge',      // Flame Body -> fire
    };

    const normalizedTalent = talentName.toLowerCase().trim();
    const mappedMove = talentToMoveMap[normalizedTalent];
    
    // Si le talent est mappé, retourner le move correspondant
    if (mappedMove) {
      return mappedMove;
    }
    
    // Pour les talents non mappés, retourner une attaque basique plutôt que le nom français
    // Cela évite les erreurs 404 avec PokeAPI
    console.warn(`Talent non mappé: ${talentName}, utilisation d'une attaque par défaut`);
    return 'tackle'; // Attaque basique par défaut
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