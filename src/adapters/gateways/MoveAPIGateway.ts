import { Move } from '@/domain/entities/Move';
import { getMoveEffect } from '@/domain/config/moveEffects';
import { IMoveGateway } from '@/domain/ports/IMoveGateway';
import { PokeAPIMoveData } from './types/PokeAPITypes';

export class PokeAPIMoveGateway implements IMoveGateway {
  private baseUrl = 'https://pokeapi.co/api/v2';
  private cache: Map<string, Move> = new Map();

  async getMoveByName(moveName: string): Promise<Move> {
    const normalizedName = moveName.toLowerCase().replace(/\s+/g, '-');
    
    // Vérifier le cache
    if (this.cache.has(normalizedName)) {
      return this.cache.get(normalizedName)!;
    }

    try {
      const response = await fetch(`${this.baseUrl}/move/${normalizedName}`);
      
      if (!response.ok) {
        // Si le move n'existe pas dans l'API, retourner un move par défaut
        return this.getDefaultMove(moveName);
      }

      const data: PokeAPIMoveData = await response.json();
      
      const move: Move = {
        id: data.name,
        name: data.name.charAt(0).toUpperCase() + data.name.slice(1).replace(/-/g, ' '),
        type: data.type.name,
        power: data.power || 0,
        accuracy: data.accuracy || 100,
        pp: data.pp || 10,
        maxPp: data.pp || 10,
        damageClass: data.damage_class.name as 'physical' | 'special' | 'status',
        priority: data.priority || 0,
        description: data.effect_entries.find((entry) => entry.language.name === 'en')?.short_effect || '',
        effect: getMoveEffect(data.name), // Charger l'effet depuis notre configuration
      };

      // Stocker dans le cache
      this.cache.set(normalizedName, move);
      
      return move;
    } catch (error) {
      console.error(`Erreur lors de la récupération du move ${moveName}:`, error);
      return this.getDefaultMove(moveName);
    }
  }

  async getMovesByNames(moveNames: string[]): Promise<Move[]> {
    const promises = moveNames.map(name => this.getMoveByName(name));
    return Promise.all(promises);
  }

  private getDefaultMove(moveName: string): Move {
    // Move par défaut basé sur le nom
    const isSpecialMove = moveName.toLowerCase().includes('beam') || 
                          moveName.toLowerCase().includes('blast') ||
                          moveName.toLowerCase().includes('wave');
    
    return {
      id: moveName.toLowerCase().replace(/\s+/g, '-'),
      name: moveName,
      type: 'normal',
      power: 50,
      accuracy: 100,
      pp: 20,
      maxPp: 20,
      damageClass: isSpecialMove ? 'special' : 'physical',
      priority: 0,
      description: 'A basic move.',
    };
  }
}
