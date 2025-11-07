'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Trainer } from '@/domain/entities/Trainer';
import { Pokemon } from '@/domain/entities/Pokemon';
import { Item } from '@/domain/entities/Item';
import { Battle } from '@/domain/entities/Battle';

interface GameState {
  player: Trainer | null;
  currentBattle: Battle | null;
  leaguePoints: number;
  gamePhase: 'menu' | 'selection' | 'league' | 'battle' | 'rewards' | 'victory';
  defeatedTrainers: string[]; // Liste des IDs des trainers battus
  leagueTrainers: Trainer[]; // Liste des trainers de la ligue (fixe une fois générée)
}

interface GameContextType {
  gameState: GameState;
  setPlayer: (player: Trainer) => void;
  startBattle: (battle: Battle) => void;
  endBattle: () => void;
  updateCurrentBattle: (battle: Battle) => void;
  addPoints: (points: number) => void;
  setGamePhase: (phase: GameState['gamePhase']) => void;
  addPokemonToTeam: (pokemon: Pokemon) => void;
  addItemToInventory: (item: Item) => void;
  removeItemFromInventory: (itemId: string) => void;
  updatePlayer: (player: Trainer) => void;
  addDefeatedTrainer: (trainerId: string) => void;
  healAllPokemon: () => void;
  setLeagueTrainers: (trainers: Trainer[]) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY = 'pokemon-league-game-state';

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(() => {
    // Charger depuis localStorage au démarrage
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          // Assurer que toutes les propriétés existent avec des valeurs par défaut
          return {
            player: parsed.player || null,
            currentBattle: parsed.currentBattle || null,
            leaguePoints: parsed.leaguePoints || 0,
            gamePhase: parsed.gamePhase || 'menu',
            defeatedTrainers: parsed.defeatedTrainers || [],
            leagueTrainers: parsed.leagueTrainers || [],
          };
        } catch (e) {
          console.error('Erreur lors du chargement du state:', e);
        }
      }
    }
    return {
      player: null,
      currentBattle: null,
      leaguePoints: 0,
      gamePhase: 'menu' as const,
      defeatedTrainers: [],
      leagueTrainers: [],
    };
  });

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }
  }, [gameState]);

  const setPlayer = (player: Trainer) => {
    setGameState((prev) => ({ ...prev, player }));
  };

  const startBattle = (battle: Battle) => {
    setGameState((prev) => ({ ...prev, currentBattle: battle, gamePhase: 'battle' }));
  };

  const endBattle = () => {
    setGameState((prev) => ({ ...prev, currentBattle: null, gamePhase: 'rewards' }));
  };

  const addPoints = (points: number) => {
    setGameState((prev) => ({ ...prev, leaguePoints: prev.leaguePoints + points }));
  };

  const setGamePhase = (phase: GameState['gamePhase']) => {
    setGameState((prev) => ({ ...prev, gamePhase: phase }));
  };

  const addPokemonToTeam = (pokemon: Pokemon) => {
    if (gameState.player) {
      const updatedPlayer = { ...gameState.player };
      if (updatedPlayer.team.length < 6) {
        updatedPlayer.team.push(pokemon);
      } else {
        // Replace last pokemon
        updatedPlayer.team[5] = pokemon;
      }
      setGameState((prev) => ({ ...prev, player: updatedPlayer }));
    }
  };

  const updateCurrentBattle = (battle: Battle) => {
    setGameState((prev) => ({ ...prev, currentBattle: battle }));
  };

  const removeItemFromInventory = (itemId: string) => {
    if (gameState.player) {
      const updatedPlayer = {
        ...gameState.player,
        items: gameState.player.items.filter(item => item.id !== itemId)
      };
      setGameState((prev) => ({ ...prev, player: updatedPlayer }));
    }
  };

  const addItemToInventory = (item: Item) => {
    if (gameState.player) {
      const updatedPlayer = { ...gameState.player };
      updatedPlayer.items.push(item);
      setGameState((prev) => ({ ...prev, player: updatedPlayer }));
    }
  };

  const updatePlayer = (player: Trainer) => {
    setGameState((prev) => ({ ...prev, player }));
  };

  const addDefeatedTrainer = (trainerId: string) => {
    setGameState((prev) => ({
      ...prev,
      defeatedTrainers: [...prev.defeatedTrainers, trainerId],
    }));
  };

  const healAllPokemon = () => {
    if (gameState.player) {
      const healedTeam = gameState.player.team.map(pokemon => ({
        ...pokemon,
        currentHp: pokemon.maxHp,
      }));
      
      const updatedPlayer = {
        ...gameState.player,
        team: healedTeam,
      };
      
      setGameState((prev) => ({ ...prev, player: updatedPlayer }));
    }
  };

  const setLeagueTrainers = (trainers: Trainer[]) => {
    setGameState((prev) => ({ ...prev, leagueTrainers: trainers }));
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        setPlayer,
        startBattle,
        endBattle,
        updateCurrentBattle,
        addPoints,
        setGamePhase,
        addPokemonToTeam,
        addItemToInventory,
        removeItemFromInventory,
        updatePlayer,
        addDefeatedTrainer,
        healAllPokemon,
        setLeagueTrainers,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
