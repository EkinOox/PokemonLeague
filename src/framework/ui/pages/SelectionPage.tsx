'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGame } from '@/framework/ui/context/GameContext';
import { PokemonCard } from '@/framework/ui/components/PokemonCard';
import { PokemonSet } from '@/domain/ports/IGameInitializationUseCase';
import { Pokemon } from '@/domain/entities/Pokemon';
import { UseCaseFactory, GatewayFactory } from '@/framework/factories';

export function SelectionPage() {
  const router = useRouter();
  const { setPlayer, setGamePhase, setLeagueTrainers } = useGame();
  const [sets, setSets] = useState<PokemonSet[]>([]);
  const [selectedSetIndex, setSelectedSetIndex] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [isNameEntered, setIsNameEntered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function generateSets() {
      try {
        // Utiliser le factory pour obtenir le gateway
        const gateway = GatewayFactory.getPokemonGateway();
        const availablePokemons: Pokemon[] = [];
        const pokemonIds = Array.from({ length: 150 }, (_, i) => i + 1);
        
        for (const id of pokemonIds) {
          const pokemon = await gateway.getPokemon(id.toString());
          if (pokemon) {
            availablePokemons.push(pokemon);
          }
        }

        // Utiliser le factory pour créer le use case
        const useCase = UseCaseFactory.createGameInitializationUseCase();
        const generatedSets = useCase.generateStarterSets(availablePokemons, 3);
        setSets(generatedSets);
        setLoading(false);
      } catch (error) {
        console.error('Error generating starter sets:', error);
        setLoading(false);
      }
    }
    generateSets();
  }, []);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      setIsNameEntered(true);
    }
  };

  const handleSelectSet = async () => {
    if (sets[selectedSetIndex]) {
      // Utiliser le factory
      const useCase = UseCaseFactory.createGameInitializationUseCase();
      const trainer = useCase.createStarterTrainer(playerName, sets[selectedSetIndex]);
      setPlayer(trainer);
      
      // Générer les trainers de la ligue
      const leagueUseCase = UseCaseFactory.createLeagueUseCase();
      const trainers = await leagueUseCase.generateLeagueTrainers(trainer.rank);
      setLeagueTrainers(trainers);
      
      setGamePhase('league');
      router.push('/league');
    }
  };

  // Écran de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 flex items-center justify-center scanlines">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 border-4 border-yellow-400 border-t-transparent rounded-lg mx-auto mb-6"
          />
          <p className="pixel-text text-yellow-300 text-2xl drop-shadow-[0_0_10px_rgba(253,224,71,0.5)]">
            CHARGEMENT...
          </p>
          <p className="pixel-text text-slate-400 text-sm mt-4">
            Préparation des Pokémon
          </p>
        </div>
      </div>
    );
  }

  // Formulaire de nom
  if (!isNameEntered) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 flex items-center justify-center p-4 scanlines">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md"
        >
          {/* Carte principale */}
          <div className="pixel-border border-4 border-yellow-400 bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg p-8 shadow-[0_0_60px_rgba(250,204,21,0.4)]">
            {/* Titre */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold pixel-text text-yellow-300 mb-2 drop-shadow-[0_0_10px_rgba(253,224,71,0.5)]">
                BIENVENUE
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-4" />
              <p className="text-slate-300 pixel-text text-sm">
                Entrez votre nom de dresseur
              </p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleNameSubmit} className="space-y-6">
              <div>
                <label className="block text-slate-400 pixel-text text-xs mb-2 text-center">
                  NOM DU DRESSEUR
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="MAX 12 CARACTÈRES"
                  maxLength={12}
                  className="w-full p-4 text-center text-xl pixel-text border-4 border-slate-600 rounded-lg bg-slate-900 text-yellow-300 placeholder:text-slate-600 focus:border-yellow-400 focus:outline-none focus:shadow-[0_0_20px_rgba(250,204,21,0.3)] transition-all uppercase"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={!playerName.trim()}
                className={`
                  w-full p-5 pixel-text text-xl font-bold border-4 rounded-lg transition-all
                  ${playerName.trim()
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 border-yellow-300 text-gray-900 hover:from-yellow-300 hover:to-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.6)] hover:scale-105 active:scale-95'
                    : 'bg-slate-700 border-slate-600 text-slate-500 cursor-not-allowed opacity-50'
                  }
                `}
              >
                {playerName.trim() ? '▶ CONTINUER' : '🔒 ENTREZ VOTRE NOM'}
              </button>
            </form>

            {/* Coins décoratifs */}
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-400 border-2 border-yellow-300 rounded-sm" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 border-2 border-yellow-300 rounded-sm" />
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-yellow-400 border-2 border-yellow-300 rounded-sm" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-yellow-400 border-2 border-yellow-300 rounded-sm" />
          </div>

          {/* Info en bas */}
          <p className="text-center text-slate-500 pixel-text text-xs mt-6">
            Ce nom sera visible durant toute l'aventure
          </p>
        </motion.div>
      </div>
    );
  }

  // Sélection d'équipe
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 p-4 md:p-8 scanlines">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold pixel-text text-yellow-300 mb-3 drop-shadow-[0_0_15px_rgba(253,224,71,0.6)]">
            CHOISIS TON ÉQUIPE
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-4" />
          <p className="text-white/90 pixel-text text-lg">
            Bienvenue <span className="text-yellow-300">{playerName}</span> !
          </p>
          <p className="text-slate-400 pixel-text text-sm mt-2">
            Sélectionne un set de 6 Pokémon
          </p>
        </motion.div>

        {/* Boutons de thème */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          {sets.map((set, index) => (
            <motion.button
              key={index}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedSetIndex(index)}
              className={`
                relative px-8 py-4 pixel-text text-lg font-bold border-4 rounded-lg transition-all
                ${selectedSetIndex === index
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 border-yellow-300 text-gray-900 shadow-[0_0_30px_rgba(250,204,21,0.7)]'
                  : 'bg-gradient-to-r from-slate-800 to-slate-900 border-slate-600 text-white hover:border-slate-500'
                }
              `}
            >
              {selectedSetIndex === index && <span className="mr-2">✓</span>}
              {set.theme}
              {selectedSetIndex === index && (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="ml-2"
                >
                  ⚡
                </motion.span>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Grille de Pokémon */}
        {sets[selectedSetIndex] && (
          <motion.div
            key={selectedSetIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="pixel-border border-4 border-slate-700 bg-slate-900/60 rounded-lg p-4 md:p-6 backdrop-blur-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sets[selectedSetIndex].pokemons.map((pokemon, index) => (
                  <motion.div
                    key={pokemon.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PokemonCard pokemon={pokemon} showStats={true} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Boutons d'action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsNameEntered(false)}
            className="px-10 py-5 bg-gradient-to-r from-slate-700 to-slate-800 text-white font-bold text-xl pixel-text border-4 border-slate-600 rounded-lg hover:border-slate-500 shadow-[0_0_20px_rgba(100,116,139,0.4)] transition-all"
          >
            ← RETOUR
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSelectSet}
            className="px-10 py-5 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-xl pixel-text border-4 border-green-400 rounded-lg hover:from-green-400 hover:to-green-500 shadow-[0_0_35px_rgba(34,197,94,0.7)] hover:shadow-[0_0_45px_rgba(34,197,94,0.9)] transition-all"
          >
            ✓ CONFIRMER
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="ml-2"
            >
              ⚡
            </motion.span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
