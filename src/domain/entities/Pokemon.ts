export type StatusCondition = 'burn' | 'freeze' | 'paralysis' | 'poison' | 'sleep' | 'badly-poison' | 'confusion' | null;

export interface StatModifiers {
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export class Pokemon {
  id!: string;
  name!: string;
  types!: string[];
  stats!: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  level!: number;
  currentHp!: number;
  maxHp!: number;
  moves!: string[];
  sprite?: string; // URL du sprite du Pokemon
  emoji?: string; // Emoji de secours si pas de sprite
  status?: StatusCondition; // Statut actuel du Pokémon
  statusTurns?: number; // Nombre de tours du statut (pour sommeil, confusion)
  statModifiers?: StatModifiers; // Modificateurs de stats (-6 à +6)
}
