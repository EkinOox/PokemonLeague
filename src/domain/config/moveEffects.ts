import { MoveEffect } from '@/domain/entities/Move';

/**
 * Configuration des effets des attaques populaires
 * Cette liste peut être étendue au fur et à mesure
 */
export const MOVE_EFFECTS: Record<string, MoveEffect> = {
  // Attaques infligeant la brûlure
  'flamethrower': { type: 'status', status: 'burn', chance: 10 },
  'fire-blast': { type: 'status', status: 'burn', chance: 10 },
  'ember': { type: 'status', status: 'burn', chance: 10 },
  'flame-wheel': { type: 'status', status: 'burn', chance: 10 },
  'fire-punch': { type: 'status', status: 'burn', chance: 10 },
  'will-o-wisp': { type: 'status', status: 'burn', chance: 85 },
  'sacred-fire': { type: 'status', status: 'burn', chance: 50 },
  'lava-plume': { type: 'status', status: 'burn', chance: 30 },
  
  // Attaques infligeant le gel
  'ice-beam': { type: 'status', status: 'freeze', chance: 10 },
  'blizzard': { type: 'status', status: 'freeze', chance: 10 },
  'powder-snow': { type: 'status', status: 'freeze', chance: 10 },
  'ice-punch': { type: 'status', status: 'freeze', chance: 10 },
  'freeze-dry': { type: 'status', status: 'freeze', chance: 10 },
  
  // Attaques infligeant la paralysie
  'thunderbolt': { type: 'status', status: 'paralysis', chance: 10 },
  'thunder': { type: 'status', status: 'paralysis', chance: 30 },
  'spark': { type: 'status', status: 'paralysis', chance: 30 },
  'thunder-punch': { type: 'status', status: 'paralysis', chance: 10 },
  'discharge': { type: 'status', status: 'paralysis', chance: 30 },
  'thunder-wave': { type: 'status', status: 'paralysis', chance: 90 },
  'nuzzle': { type: 'status', status: 'paralysis', chance: 100 },
  'body-slam': { type: 'status', status: 'paralysis', chance: 30 },
  'lick': { type: 'status', status: 'paralysis', chance: 30 },
  'force-palm': { type: 'status', status: 'paralysis', chance: 30 },
  
  // Attaques infligeant le poison
  'poison-sting': { type: 'status', status: 'poison', chance: 30 },
  'sludge': { type: 'status', status: 'poison', chance: 30 },
  'sludge-bomb': { type: 'status', status: 'poison', chance: 30 },
  'poison-jab': { type: 'status', status: 'poison', chance: 30 },
  'smog': { type: 'status', status: 'poison', chance: 40 },
  'poison-gas': { type: 'status', status: 'poison', chance: 90 },
  'toxic': { type: 'status', status: 'badly-poison', chance: 90 },
  'poison-fang': { type: 'status', status: 'badly-poison', chance: 50 },
  
  // Attaques infligeant le sommeil
  'sleep-powder': { type: 'status', status: 'sleep', chance: 75 },
  'spore': { type: 'status', status: 'sleep', chance: 100 },
  'hypnosis': { type: 'status', status: 'sleep', chance: 60 },
  'lovely-kiss': { type: 'status', status: 'sleep', chance: 75 },
  'sing': { type: 'status', status: 'sleep', chance: 55 },
  'dark-void': { type: 'status', status: 'sleep', chance: 50 },
  
  // Attaques infligeant la confusion
  'confusion': { type: 'status', status: 'confusion', chance: 10 },
  'psybeam': { type: 'status', status: 'confusion', chance: 10 },
  'dizzy-punch': { type: 'status', status: 'confusion', chance: 20 },
  'dynamic-punch': { type: 'status', status: 'confusion', chance: 100 },
  'confuse-ray': { type: 'status', status: 'confusion', chance: 100 },
  'supersonic': { type: 'status', status: 'confusion', chance: 55 },
  'swagger': { type: 'status', status: 'confusion', chance: 85 },
  'flatter': { type: 'status', status: 'confusion', chance: 100 },
  'sweet-kiss': { type: 'status', status: 'confusion', chance: 75 },
  
  // Attaques avec recul
  'double-edge': { type: 'recoil', recoilPercent: 33 },
  'brave-bird': { type: 'recoil', recoilPercent: 33 },
  'flare-blitz': { type: 'recoil', recoilPercent: 33 },
  'wild-charge': { type: 'recoil', recoilPercent: 25 },
  'volt-tackle': { type: 'recoil', recoilPercent: 33 },
  'wood-hammer': { type: 'recoil', recoilPercent: 33 },
  'head-smash': { type: 'recoil', recoilPercent: 50 },
  'take-down': { type: 'recoil', recoilPercent: 25 },
  'submission': { type: 'recoil', recoilPercent: 25 },
};

/**
 * Récupère l'effet d'une attaque si elle en a un
 */
export function getMoveEffect(moveId: string): MoveEffect | undefined {
  return MOVE_EFFECTS[moveId];
}
