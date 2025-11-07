'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGame } from '@/context/GameContext';
import { Trainer } from '@/domain/entities/Trainer';

export default function LeaguePage() {
  const router = useRouter();
  const { gameState, startBattle } = useGame();
  const [loading, setLoading] = useState(false);
  const [selectedTrainerIndex, setSelectedTrainerIndex] = useState(0);

  useEffect(() => {
    if (!gameState.player) {
      router.push('/selection');
      return;
    }

    // Si les trainers n'ont pas encore été générés, rediriger vers la sélection
    if (!gameState.leagueTrainers || gameState.leagueTrainers.length === 0) {
      router.push('/selection');
      return;
    }

    setLoading(false);
  }, [gameState.player, gameState.leagueTrainers, router]);

  const handleChallenge = (trainer: Trainer, trainerIndex: number) => {
    if (!gameState.player) return;

    // Vérifier si le joueur a débloqué ce trainer
    // Il faut avoir battu tous les trainers précédents
    const defeatedTrainers = gameState.defeatedTrainers || [];
    
    // Si ce n'est pas le premier trainer (index 0), vérifier qu'on a battu le précédent
    if (trainerIndex > 0) {
      const previousTrainerId = gameState.leagueTrainers[trainerIndex - 1]?.id;
      if (!defeatedTrainers.includes(previousTrainerId)) {
        setBattleMessage(`Vous devez d'abord battre le dresseur précédent !`);
        setTimeout(() => setBattleMessage(''), 3000);
        return;
      }
    }

    // Créer une copie profonde du trainer adverse pour ne pas modifier l'original
    const trainer2Copy: Trainer = {
      ...trainer,
      team: trainer.team.map(pokemon => ({
        ...pokemon,
        currentHp: pokemon.maxHp, // Restaurer les HP au maximum
        status: undefined, // Retirer les statuts
        statusTurns: undefined,
      })),
    };

    // Créer un battle entre le joueur et le trainer sélectionné
    const battle = {
      id: `battle-${Date.now()}`,
      trainer1: gameState.player,
      trainer2: trainer2Copy,
      status: 'ongoing' as const,
      currentTurn: 1,
      maxTurns: 50,
    };

    // Démarrer le battle et naviguer
    startBattle(battle);
    router.push('/battle');
  };

  const [battleMessage, setBattleMessage] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-indigo-950 via-purple-950 to-slate-950 flex items-center justify-center scanlines">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 border-4 border-yellow-400 border-t-transparent rounded-lg mx-auto mb-6"
          />
          <p className="pixel-text text-yellow-300 text-2xl drop-shadow-[0_0_10px_rgba(253,224,71,0.5)]">
            CHARGEMENT...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-indigo-950 via-purple-950 to-slate-950 p-4 md:p-8 scanlines">
      <div className="max-w-7xl mx-auto">
        {/* Header avec info du joueur */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="pixel-border border-4 border-yellow-400 bg-linear-to-r from-slate-800 to-slate-900 rounded-lg p-6 shadow-[0_0_40px_rgba(250,204,21,0.4)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold pixel-text text-yellow-300 mb-2">
                  LIGUE POKÉMON
                </h1>
                <p className="text-white pixel-text text-sm">
                  Dresseur: <span className="text-yellow-300">{gameState.player?.name}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="pixel-text text-slate-400 text-xs mb-1">POINTS DE LIGUE</p>
                <p className="text-3xl font-bold pixel-text text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.5)]">
                  {gameState.leaguePoints}
                </p>
              </div>
            </div>
            
            {/* Barre de progression */}
            <div className="mt-4">
              <div className="flex justify-between text-xs pixel-text text-slate-400 mb-2">
                <span>Progression</span>
                <span>Prochain badge: 5000 pts</span>
              </div>
              <div className="h-4 bg-slate-700 rounded-full overflow-hidden border-2 border-slate-600">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(gameState.leaguePoints / 5000) * 100}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-linear-to-r from-yellow-400 to-yellow-500"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Liste des dresseurs */}
        {battleMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pixel-border border-4 border-red-400 bg-red-900/90 rounded-lg p-4 mb-6 text-center"
          >
            <p className="pixel-text text-white text-lg">{battleMessage}</p>
          </motion.div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {gameState.leagueTrainers && gameState.leagueTrainers.map((trainer, index) => {
            const defeatedTrainers = gameState.defeatedTrainers || [];
            const isDefeated = defeatedTrainers.includes(trainer.id);
            const isLocked = index > 0 && !defeatedTrainers.includes(gameState.leagueTrainers[index - 1]?.id);
            
            return (
              <motion.div
                key={trainer.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setSelectedTrainerIndex(index)}
              >
                <div 
                  className={`
                    pixel-border border-4 rounded-lg p-5 transition-all relative
                    ${isLocked
                      ? 'border-gray-600 bg-gray-900/60 opacity-50 cursor-not-allowed'
                      : isDefeated
                        ? 'border-green-400 bg-green-900/40'
                        : selectedTrainerIndex === index
                          ? 'border-yellow-400 bg-linear-to-br from-yellow-900/40 to-slate-900/40 shadow-[0_0_30px_rgba(250,204,21,0.6)] scale-105 cursor-pointer'
                          : 'border-slate-600 bg-linear-to-br from-slate-800/60 to-slate-900/60 hover:border-slate-500 cursor-pointer'
                    }
                  `}
                  onClick={() => !isLocked && handleChallenge(trainer, index)}
                >
                  {isLocked && (
                    <div className="absolute top-2 right-2 text-3xl">🔒</div>
                  )}
                  {isDefeated && (
                    <div className="absolute top-2 right-2 text-2xl">✅</div>
                  )}
                {/* Nom du dresseur */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold pixel-text text-white">
                    {trainer.name}
                  </h3>
                  <span className="pixel-text text-sm text-yellow-400">
                    Niv. {trainer.rank}
                  </span>
                </div>

                {/* Équipe (miniatures) */}
                <div className="grid grid-cols-6 gap-1 mb-3">
                  {trainer.team.map((pokemon, pIndex) => (
                    <div
                      key={`${trainer.id}-${pIndex}`}
                      className="aspect-square bg-slate-700 rounded border-2 border-slate-600 flex items-center justify-center overflow-hidden"
                      title={pokemon.name}
                    >
                      {pokemon.sprite ? (
                        <img
                          src={pokemon.sprite}
                          alt={pokemon.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-xl">{pokemon.emoji || '⭐'}</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Bouton challenge */}
                <button
                  disabled={isLocked}
                  className={`
                    w-full py-3 pixel-text text-sm font-bold border-4 rounded-lg transition-all
                    ${isLocked
                      ? 'bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed'
                      : isDefeated
                        ? 'bg-linear-to-r from-blue-500 to-blue-600 border-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.7)]'
                        : selectedTrainerIndex === index
                          ? 'bg-linear-to-r from-green-500 to-green-600 border-green-400 text-white shadow-[0_0_20px_rgba(34,197,94,0.7)]'
                          : 'bg-linear-to-r from-slate-700 to-slate-800 border-slate-600 text-slate-400'
                    }
                  `}
                >
                  {isLocked ? '🔒 VERROUILLÉ' : isDefeated ? '🔄 RECOMBATTRE' : '⚔️ DÉFIER'}
                </button>
              </div>
            </motion.div>
          );
        })}
        </div>

        {/* Boutons d'action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            className="px-10 py-5 bg-linear-to-r from-slate-700 to-slate-800 text-white font-bold text-xl pixel-text border-4 border-slate-600 rounded-lg hover:border-slate-500 shadow-[0_0_20px_rgba(100,116,139,0.4)] transition-all"
          >
            ← MENU
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
