export type StatusEffect = 'burn' | 'freeze' | 'paralysis' | 'poison' | 'sleep' | 'badly-poison' | 'confusion';

export interface MoveEffect {
  type: 'status' | 'stat-change' | 'heal' | 'recoil' | 'flinch';
  status?: StatusEffect;
  chance?: number; // Chance d'appliquer l'effet (0-100)
  statChanges?: {
    stat: 'attack' | 'defense' | 'specialAttack' | 'specialDefense' | 'speed';
    change: number; // -2, -1, +1, +2, etc.
  }[];
  healPercent?: number; // Pourcentage de HP restaurés
  recoilPercent?: number; // Pourcentage de dégâts reçus en recul
}

export interface Move {
  id: string;
  name: string;
  type: string;
  power: number | null;
  accuracy: number;
  pp: number;
  maxPp: number;
  damageClass: 'physical' | 'special' | 'status';
  priority: number;
  description?: string;
  effect?: MoveEffect;
}
