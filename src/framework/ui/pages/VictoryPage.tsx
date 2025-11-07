'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/framework/ui/context/GameContext';
import { ServiceFactory } from '@/framework/factories';

export function VictoryPage() {
  const router = useRouter();
  const { gameState, setGamePhase } = useGame();
  const [showCredits, setShowCredits] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Services pour les calculs aléatoires
  const randomGenerator = ServiceFactory.getRandomGenerator();

  useEffect(() => {
    // Animation sequence
    const timer1 = setTimeout(() => setShowStats(true), 2000);
    const timer2 = setTimeout(() => setShowCredits(true), 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleContinue = () => {
    setGamePhase('menu');
    router.push('/');
  };

  // Statistiques fictives pour l'exemple
  const stats = {
    totalBattles: 12,
    victories: 12,
    totalPoints: gameState.leaguePoints,
    pokemonCaught: gameState.player?.team.length || 0,
    itemsCollected: gameState.player?.items.length || 0,
    playTime: '2h 34m', // Temps fictif
  };

  const credits = [
    { title: 'Game Design', name: 'Pokémon League Team' },
    { title: 'Programming', name: 'GitHub Copilot' },
    { title: 'Art & Graphics', name: 'Pixel Art Masters' },
    { title: 'Sound Design', name: 'Retro Audio Team' },
    { title: 'Testing', name: 'Beta Testers' },
    { title: 'Special Thanks', name: 'Pokémon Community' },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-950 via-slate-950 to-slate-900 p-4">
      {/* Scanlines effect */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="h-full w-full bg-repeat" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)'
        }} />
      </div>

      {/* Fireworks background effect */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full"
            initial={{
              x: typeof window !== 'undefined' ? randomGenerator.generate() * window.innerWidth : randomGenerator.generate() * 1000,
              y: typeof window !== 'undefined' ? window.innerHeight + 10 : 1000,
              opacity: 0,
            }}
            animate={{
              y: -10,
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              delay: randomGenerator.generate() * 5,
              repeat: Infinity,
              repeatDelay: randomGenerator.generate() * 3,
            }}
            style={{
              left: `${randomGenerator.generate() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-8xl md:text-9xl mb-6"
          >
            🏆
          </motion.div>

          <motion.h1
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            className="pixel-text text-yellow-400 text-4xl md:text-5xl mb-4"
          >
            CHAMPION DE LA LIGUE !
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="pixel-border border-4 border-yellow-400 bg-slate-900/90 rounded-lg p-6 inline-block"
          >
            <p className="pixel-text text-white text-xl md:text-2xl">
              Félicitations {gameState.player?.name} !
            </p>
            <p className="pixel-text text-yellow-400 text-lg mt-2">
              Vous êtes le nouveau Champion de la Ligue Pokémon !
            </p>
          </motion.div>
        </motion.div>

        {/* Statistics */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="mb-12"
            >
              <h2 className="pixel-text text-yellow-400 text-3xl text-center mb-8">
                STATISTIQUES FINALES
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(stats).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="pixel-border border-2 border-blue-400 bg-slate-800 rounded-lg p-6 text-center"
                  >
                    <div className="text-4xl mb-2">
                      {key === 'totalBattles' && '⚔️'}
                      {key === 'victories' && '🏆'}
                      {key === 'totalPoints' && '⭐'}
                      {key === 'pokemonCaught' && '🐾'}
                      {key === 'itemsCollected' && '📦'}
                      {key === 'playTime' && '⏱️'}
                    </div>
                    <h3 className="pixel-text text-blue-400 text-lg capitalize mb-2">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </h3>
                    <p className="pixel-text text-white text-2xl font-bold">
                      {value}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Credits */}
        <AnimatePresence>
          {showCredits && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="mb-12"
            >
              <h2 className="pixel-text text-yellow-400 text-3xl text-center mb-8">
                CRÉDITS
              </h2>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="pixel-border border-4 border-purple-400 bg-slate-900/90 rounded-lg p-8 max-w-2xl mx-auto"
              >
                <div className="space-y-4">
                  {credits.map((credit, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.2 }}
                      className="flex justify-between items-center"
                    >
                      <span className="pixel-text text-purple-400 text-lg">{credit.title}:</span>
                      <span className="pixel-text text-white text-lg">{credit.name}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: credits.length * 0.2 + 1 }}
                  className="text-center mt-8 pt-6 border-t border-purple-400/30"
                >
                  <p className="pixel-text text-yellow-400 text-xl mb-2">
                    Merci d'avoir joué !
                  </p>
                  <p className="pixel-text text-slate-300 text-sm">
                    Pokémon League - Une création GitHub Copilot
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 8 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContinue}
            className="pixel-border border-4 border-green-400 bg-green-900 hover:border-green-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] text-white px-12 py-6 rounded-lg transition-all"
          >
            <span className="pixel-text text-2xl">CONTINUER</span>
          </motion.button>
        </motion.div>

        {/* Hall of Fame Badge */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 10, type: 'spring', stiffness: 200 }}
          className="text-center mt-12"
        >
          <div className="pixel-border border-4 border-yellow-400 bg-linear-to-r from-yellow-600 to-yellow-500 rounded-full p-6 inline-block shadow-[0_0_40px_rgba(250,204,21,0.3)]">
            <div className="text-6xl mb-2">👑</div>
            <h3 className="pixel-text text-slate-900 text-xl font-bold">
              HALL OF FAME
            </h3>
            <p className="pixel-text text-slate-900 text-sm">
              {gameState.player?.name}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}