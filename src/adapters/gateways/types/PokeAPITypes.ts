/**
 * Types pour l'API PokeAPI
 * https://pokeapi.co/
 */

export interface PokeAPIMoveData {
  name: string;
  type: { name: string };
  power: number | null;
  accuracy: number | null;
  pp: number;
  damage_class: { name: string };
  priority: number;
  effect_entries: Array<{
    language: { name: string };
    short_effect: string;
  }>;
}
