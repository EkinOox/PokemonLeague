/**
 * Types pour l'API Tyradex
 * https://tyradex.vercel.app/
 */

export interface TyradexType {
  name: string;
  image?: string;
}

export interface TyradexPokemonData {
  pokedex_id?: number;
  name?: { fr?: string; en?: string };
  types?: TyradexType[];
  stats?: {
    hp?: number;
    atk?: number;
    def?: number;
    spe_atk?: number;
    spe_def?: number;
    vit?: number;
  };
  sprites?: {
    regular?: string;
    shiny?: string;
  };
}
