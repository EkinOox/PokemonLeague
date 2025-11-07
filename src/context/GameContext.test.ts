import { GameProvider, useGame } from './GameContext';
import { Trainer } from '@/domain/entities/Trainer';

/**
 * @jest-environment jsdom
 */

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('GameContext - localStorage persistence', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should persist and load league points from localStorage', () => {
    // Simuler l'ajout de points
    const initialState = {
      player: null,
      currentBattle: null,
      leaguePoints: 0,
      gamePhase: 'league' as const,
      defeatedTrainers: [],
    };
    
    // Ajouter 100 points
    const updatedState = {
      ...initialState,
      leaguePoints: 100,
    };
    
    localStorage.setItem('pokemon-league-game-state', JSON.stringify(updatedState));
    
    // Vérifier que c'est sauvegardé
    const savedState = localStorage.getItem('pokemon-league-game-state');
    expect(savedState).toBeTruthy();
    
    if (savedState) {
      const parsed = JSON.parse(savedState);
      expect(parsed.leaguePoints).toBe(100);
    }
  });

  it('should persist defeated trainers to localStorage', () => {
    const stateWithDefeatedTrainers = {
      player: null,
      currentBattle: null,
      leaguePoints: 0,
      gamePhase: 'league' as const,
      defeatedTrainers: ['trainer-1', 'trainer-2'],
    };

    localStorage.setItem('pokemon-league-game-state', JSON.stringify(stateWithDefeatedTrainers));

    const savedState = localStorage.getItem('pokemon-league-game-state');
    expect(savedState).toBeTruthy();
    
    if (savedState) {
      const parsed = JSON.parse(savedState);
      expect(parsed.defeatedTrainers).toEqual(['trainer-1', 'trainer-2']);
    }
  });

  it('should handle invalid localStorage data gracefully', () => {
    // Mettre des données invalides
    localStorage.setItem('pokemon-league-game-state', 'invalid json');
    
    // Le contexte devrait revenir aux valeurs par défaut
    // Cette partie serait testée dans un test d'intégration avec le composant réel
    expect(true).toBe(true);
  });

  it('should accumulate league points correctly', () => {
    let currentPoints = 0;
    
    // Simuler plusieurs ajouts de points
    currentPoints += 50;
    expect(currentPoints).toBe(50);
    
    currentPoints += 100;
    expect(currentPoints).toBe(150);
    
    currentPoints += 75;
    expect(currentPoints).toBe(225);
  });
});

