'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/framework/ui/context/GameContext';
import { RewardOptions, ItemReward, PokemonReward } from '@/application/usecases/RewardsUseCase';
import { Pokemon } from '@/domain/entities/Pokemon';
import { UseCaseFactory } from '@/framework/factories';

type RewardPhase = 'loading' | 'items' | 'pokemon' | 'complete';

export function RewardsPage() {
  const router = useRouter();
  const { gameState, addPoints, addItemToInventory, addPokemonToTeam, setGamePhase, healAllPokemon, endBattle, updatePlayer } = useGame();
  const [rewardOptions, setRewardOptions] = useState<RewardOptions | null>(null);
  const [phase, setPhase] = useState<RewardPhase>('loading');
  const [victoryMessage, setVictoryMessage] = useState('');
  const [selectedItems, setSelectedItems] = useState<ItemReward[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonReward | null>(null);
  const [pokemonToReplace, setPokemonToReplace] = useState<Pokemon | null>(null);
  const [replacementConfirmed, setReplacementConfirmed] = useState(false);

  // Utiliser le factory pour créer le use case avec injection de dépendances
  const rewardsUseCase = UseCaseFactory.createRewardsUseCase();

  useEffect(() => {
    if (!gameState.currentBattle) {
      router.push('/league');
      return;
    }

    async function loadRewards() {
      const savedVictoryType = (window as any).victoryType || 'normal';
      const opponentLevel = gameState.currentBattle!.trainer2.team[0]?.level || 50;

      const options = await rewardsUseCase.generateRewardOptions(
        opponentLevel,
        savedVictoryType,
        gameState.player?.team.length || 0
      );

      setRewardOptions(options);
      setVictoryMessage(rewardsUseCase.getVictoryMessage(savedVictoryType, gameState.currentBattle!.trainer2.name));
      
      // Ajouter automatiquement les points
      addPoints(options.points);
      
      // Passer à la phase de sélection d'items
      setTimeout(() => setPhase('items'), 2000);
      
      // Nettoyer window
      delete (window as any).battleRewards;
      delete (window as any).victoryType;
    }

    loadRewards();
  }, []);

  const toggleItemSelection = (item: ItemReward) => {
    const isAlreadySelected = selectedItems.find(i => i.item.id === item.item.id);
    
    if (isAlreadySelected) {
      // Désélectionner
      setSelectedItems(selectedItems.filter(i => i.item.id !== item.item.id));
    } else if (selectedItems.length < (rewardOptions?.maxItemSelections || 2)) {
      // Sélectionner (si on n'a pas atteint la limite)
      setSelectedItems([...selectedItems, item]);
    }
  };

  const confirmItemSelection = () => {
    // Ajouter les items sélectionnés à l'inventaire
    selectedItems.forEach(itemReward => {
      addItemToInventory(itemReward.item);
    });
    
    // Passer à la phase de sélection de Pokémon
    setPhase('pokemon');
  };

  const selectPokemon = (pokemonReward: PokemonReward) => {
    setSelectedPokemon(pokemonReward);
  };

    const confirmPokemonReplacement = () => {
    if (selectedPokemon && pokemonToReplace && gameState.player) {
      // Remplacer le Pokémon dans l'équipe
      const updatedTeam = gameState.player.team.map(p => 
        p.id === pokemonToReplace.id ? selectedPokemon.pokemon : p
      );
      
      updatePlayer({
        ...gameState.player,
        team: updatedTeam
      });
      
      // Marquer qu'on a sélectionné un Pokémon pour l'afficher dans le résumé
      setSelectedPokemon(selectedPokemon);
      
      // Marquer que le remplacement est confirmé
      setReplacementConfirmed(true);
    }
  };

  const skipPokemon = () => {
    finishRewards();
  };

  const finishRewards = () => {
    setPhase('complete');
    healAllPokemon();
    endBattle();
    
    setTimeout(() => {
      setGamePhase('league');
      router.push('/league');
    }, 3000);
  };

  if (!gameState.currentBattle || !rewardOptions) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-950 via-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"
          />
          <div className="pixel-text text-yellow-400 text-xl">Chargement des récompenses...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-950 via-slate-950 to-slate-900 p-4">
      {/* Scanlines effect */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="h-full w-full bg-repeat" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)'
        }} />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="pixel-text text-yellow-400 text-3xl md:text-4xl mb-4">
            VICTOIRE !
          </h1>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            className="pixel-border border-4 border-yellow-400 bg-slate-900/90 rounded-lg p-6 inline-block"
          >
            <p className="pixel-text text-white text-lg md:text-xl mb-2">
              {victoryMessage}
            </p>
            <p className="pixel-text text-yellow-400 text-2xl">
              +{rewardOptions.points} POINTS
            </p>
          </motion.div>
        </motion.div>

        {/* Phase: Sélection d'items */}
        <AnimatePresence mode="wait">
          {phase === 'items' && (
            <motion.div
              key="items"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="pixel-border border-4 border-blue-400 bg-slate-900/90 rounded-lg p-6 mb-6">
                <h2 className="pixel-text text-blue-400 text-2xl mb-2 text-center">
                  CHOISISSEZ 2 OBJETS
                </h2>
                <p className="pixel-text text-slate-400 text-sm text-center mb-6">
                  {selectedItems.length}/{rewardOptions.maxItemSelections} sélectionnés
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                  {rewardOptions.itemOptions.map((itemReward, index) => {
                    const isSelected = selectedItems.find(i => i.item.id === itemReward.item.id);
                    
                    return (
                      <motion.div
                        key={itemReward.item.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => toggleItemSelection(itemReward)}
                        className={`
                          pixel-border border-4 rounded-lg p-4 cursor-pointer transition-all
                          ${isSelected 
                            ? 'border-green-400 bg-green-900/60 scale-105' 
                            : 'border-slate-600 bg-slate-800 hover:border-blue-400'
                          }
                        `}
                      >
                        <div className="text-center">
                          {itemReward.item.image ? (
                            <img
                              src={itemReward.item.image}
                              alt={itemReward.item.name}
                              className="w-16 h-16 mx-auto mb-2"
                              onError={(e) => {
                                // Fallback si l'image ne charge pas
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'block';
                              }}
                            />
                          ) : null}
                          {!itemReward.item.image && (
                            <div className="w-16 h-16 mx-auto mb-2 bg-slate-700 rounded-lg flex items-center justify-center text-4xl">
                              📦
                            </div>
                          )}
                          <h3 className="pixel-text text-white text-sm mb-1">{itemReward.item.name}</h3>
                          <p className="pixel-text text-slate-400 text-xs">{itemReward.item.description}</p>
                          {isSelected && (
                            <div className="mt-2 text-green-400 text-2xl">✓</div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="text-center">
                  <button
                    onClick={confirmItemSelection}
                    disabled={selectedItems.length !== rewardOptions.maxItemSelections}
                    className={`
                      pixel-border border-4 px-8 py-4 rounded-lg transition-all
                      ${selectedItems.length === rewardOptions.maxItemSelections
                        ? 'border-green-400 bg-green-900 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] cursor-pointer'
                        : 'border-slate-600 bg-slate-800 opacity-50 cursor-not-allowed'
                      }
                    `}
                  >
                    <span className="pixel-text text-white text-xl">CONTINUER</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Phase: Sélection de Pokémon */}
          {phase === 'pokemon' && (
            <motion.div
              key="pokemon"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {!pokemonToReplace ? (
                <div className="pixel-border border-4 border-green-400 bg-slate-900/90 rounded-lg p-6 mb-6">
                  <h2 className="pixel-text text-green-400 text-2xl mb-2 text-center">
                    CHOISISSEZ 1 POKÉMON
                  </h2>
                  <p className="pixel-text text-slate-400 text-sm text-center mb-6">
                    Ce Pokémon rejoindra votre équipe
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {rewardOptions.pokemonOptions.map((pokemonReward, index) => (
                      <motion.div
                        key={pokemonReward.pokemon.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.15 }}
                        onClick={() => selectPokemon(pokemonReward)}
                        className={`
                          pixel-border border-4 rounded-lg p-4 cursor-pointer transition-all
                          ${selectedPokemon?.pokemon.id === pokemonReward.pokemon.id
                            ? 'border-green-400 bg-green-900/60 scale-105'
                            : 'border-slate-600 bg-slate-800 hover:border-green-400'
                          }
                        `}
                      >
                        <div className="text-center">
                          {pokemonReward.pokemon.sprite ? (
                            <img
                              src={pokemonReward.pokemon.sprite}
                              alt={pokemonReward.pokemon.name}
                              className="w-24 h-24 mx-auto mb-2"
                              onError={(e) => {
                                // Fallback si l'image ne charge pas
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'block';
                              }}
                            />
                          ) : null}
                          {!pokemonReward.pokemon.sprite && (
                            <div className="w-24 h-24 mx-auto mb-2 bg-slate-700 rounded-lg flex items-center justify-center text-4xl">
                              {pokemonReward.pokemon.emoji || '⭐'}
                            </div>
                          )}
                          <h3 className="pixel-text text-white text-lg mb-1">
                            {pokemonReward.pokemon.name}
                          </h3>
                          <p className="pixel-text text-slate-400 text-sm mb-2">
                            Niveau {pokemonReward.pokemon.level}
                          </p>
                          <div className="flex justify-center gap-2 mb-2">
                            {pokemonReward.pokemon.types.map((type, i) => (
                              <span key={i} className="pixel-text text-xs bg-slate-700 px-2 py-1 rounded">
                                {type.toUpperCase()}
                              </span>
                            ))}
                          </div>
                          {selectedPokemon?.pokemon.id === pokemonReward.pokemon.id && (
                            <div className="mt-2 text-green-400 text-2xl">✓</div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="text-center flex justify-center gap-4">
                    <button
                      onClick={() => selectedPokemon && setPokemonToReplace(gameState.player!.team[0])}
                      disabled={!selectedPokemon}
                      className={`
                        pixel-border border-4 px-8 py-4 rounded-lg transition-all
                        ${selectedPokemon
                          ? 'border-green-400 bg-green-900 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] cursor-pointer'
                          : 'border-slate-600 bg-slate-800 opacity-50 cursor-not-allowed'
                        }
                      `}
                    >
                      <span className="pixel-text text-white text-xl">REMPLACER</span>
                    </button>
                    
                    <button
                      onClick={skipPokemon}
                      className="pixel-border border-4 border-slate-600 bg-slate-800 hover:border-slate-500 px-8 py-4 rounded-lg transition-all"
                    >
                      <span className="pixel-text text-white text-xl">PASSER</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pixel-border border-4 border-yellow-400 bg-slate-900/90 rounded-lg p-6 mb-6">
                  <h2 className="pixel-text text-yellow-400 text-2xl mb-6 text-center">
                    {replacementConfirmed ? 'POKÉMON REMPLACÉ !' : 'QUEL POKÉMON REMPLACER ?'}
                  </h2>

                  {replacementConfirmed && (
                    <div className="text-center mb-6">
                      <div className="pixel-border border-2 border-green-400 bg-green-900/50 rounded-lg p-4 inline-block">
                        <p className="pixel-text text-green-400 text-lg">
                          {selectedPokemon?.pokemon.name} a remplacé {pokemonToReplace?.name} !
                        </p>
                      </div>
                    </div>
                  )}

                  {!replacementConfirmed && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                      {gameState.player?.team.map((pokemon, index) => (
                        <motion.div
                          key={pokemon.id}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => setPokemonToReplace(pokemon)}
                          className={`
                            pixel-border border-4 rounded-lg p-4 cursor-pointer transition-all
                            ${pokemonToReplace?.id === pokemon.id
                              ? 'border-red-400 bg-red-900/60'
                              : 'border-slate-600 bg-slate-800 hover:border-yellow-400'
                            }
                          `}
                        >
                          <div className="text-center">
                            {pokemon.sprite && (
                              <img
                                src={pokemon.sprite}
                                alt={pokemon.name}
                                className="w-16 h-16 mx-auto mb-1"
                              />
                            )}
                            <h3 className="pixel-text text-white text-sm">{pokemon.name}</h3>
                            <p className="pixel-text text-slate-400 text-xs">Niv. {pokemon.level}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <div className="text-center flex justify-center gap-4">
                    {!replacementConfirmed ? (
                      <>
                        <button
                          onClick={confirmPokemonReplacement}
                          disabled={!pokemonToReplace}
                          className={`
                            pixel-border border-4 px-8 py-4 rounded-lg transition-all
                            ${pokemonToReplace
                              ? 'border-red-400 bg-red-900 hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] cursor-pointer'
                              : 'border-slate-600 bg-slate-800 opacity-50 cursor-not-allowed'
                            }
                          `}
                        >
                          <span className="pixel-text text-white text-xl">REMPLACER</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            setPokemonToReplace(null);
                            setSelectedPokemon(null);
                          }}
                          className="pixel-border border-4 border-slate-600 bg-slate-800 hover:border-slate-500 px-8 py-4 rounded-lg transition-all"
                        >
                          <span className="pixel-text text-white text-xl">RETOUR</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={finishRewards}
                        className="pixel-border border-4 border-yellow-400 bg-yellow-900 hover:border-yellow-300 hover:shadow-[0_0_30px_rgba(250,204,21,0.3)] px-8 py-4 rounded-lg transition-all"
                      >
                        <span className="pixel-text text-white text-xl">CONTINUER</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Phase: Terminé */}
          {phase === 'complete' && (
            <motion.div
              key="complete"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="text-8xl md:text-9xl mb-6"
              >
                🎉
              </motion.div>

              <div className="pixel-border border-4 border-yellow-400 bg-slate-900/90 rounded-lg p-8 max-w-lg mx-auto">
                <h2 className="pixel-text text-yellow-400 text-3xl mb-4">
                  FÉLICITATIONS !
                </h2>
                <p className="pixel-text text-white text-lg mb-2">
                  Récompenses obtenues !
                </p>
                <p className="pixel-text text-slate-400 text-sm mb-4">
                  +{rewardOptions.points} points de ligue
                </p>
                <p className="pixel-text text-slate-400 text-sm mb-4">
                  {selectedItems.length} objets ajoutés
                </p>
                {selectedPokemon && (
                  <p className="pixel-text text-green-400 text-sm mb-4">
                    {selectedPokemon.pokemon.name} a rejoint votre équipe !
                  </p>
                )}
                <p className="pixel-text text-slate-300 text-sm mb-6">
                  Retour à la Ligue Pokémon...
                </p>
                
                <button
                  onClick={() => {
                    setGamePhase('league');
                    router.push('/league');
                  }}
                  className="pixel-border border-4 border-yellow-400 bg-yellow-900 hover:border-yellow-300 hover:shadow-[0_0_30px_rgba(250,204,21,0.3)] px-8 py-4 rounded-lg transition-all"
                >
                  <span className="pixel-text text-white text-xl">CONTINUER</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
