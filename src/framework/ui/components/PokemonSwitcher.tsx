import { motion, AnimatePresence } from 'framer-motion';
import { Pokemon } from '@/domain/entities/Pokemon';

interface PokemonSwitcherProps {
  pokemon: Pokemon[];
  currentPokemon: Pokemon;
  onPokemonSelect: (pokemon: Pokemon) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function PokemonSwitcher({
  pokemon,
  currentPokemon,
  onPokemonSelect,
  onClose,
  isOpen
}: PokemonSwitcherProps) {
  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      fire: '??',
      water: '??',
      grass: '??',
      electric: '?',
      psychic: '??',
      dragon: '??',
      normal: '?',
      fighting: '??',
      poison: '??',
      ground: '??',
      flying: '??',
      bug: '??',
      rock: '??',
      ghost: '??',
      dark: '??',
      steel: '??',
      fairy: '??',
      ice: '??',
    };
    return icons[type] || '?';
  };

  const availablePokemon = pokemon.filter(p => p.id !== currentPokemon.id && p.currentHp > 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-slate-900 border-4 border-yellow-400 rounded-lg shadow-[0_0_40px_rgba(250,204,21,0.3)] z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-linear-to-r from-blue-600 to-blue-500 p-4 border-b-4 border-yellow-400 shrink-0">
              <div className="flex justify-between items-center">
                <h2 className="pixel-text text-slate-900 text-xl md:text-2xl">CHANGER DE POKÉMON</h2>
                <button
                  onClick={onClose}
                  className="pixel-border border-2 border-slate-900 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
                >
                  <span className="pixel-text text-sm">X</span>
                </button>
              </div>
            </div>

            {/* Content - avec scroll */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="mb-6">
                <h3 className="pixel-text text-yellow-400 text-lg mb-4">Pokémon actuel:</h3>
                <div className="pixel-border border-2 border-yellow-400 bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    {currentPokemon.sprite ? (
                      <img
                        src={currentPokemon.sprite}
                        alt={currentPokemon.name}
                        className="w-16 h-16 object-contain"
                      />
                    ) : (
                      <span className="text-4xl">{currentPokemon.emoji || getTypeIcon(currentPokemon.types[0])}</span>
                    )}
                    <div>
                      <h4 className="pixel-text text-white text-lg">{currentPokemon.name}</h4>
                      <p className="pixel-text text-slate-400 text-sm">
                        Niveau {currentPokemon.level}  HP: {currentPokemon.currentHp}/{currentPokemon.maxHp}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="pixel-text text-yellow-400 text-lg mb-4">Choisir un Pokémon:</h3>

              {availablePokemon.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">??</span>
                  <p className="pixel-text text-slate-400 text-lg">Aucun autre Pokémon disponible</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availablePokemon.map((poke, index) => (
                    <motion.div
                      key={poke.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="pixel-border border-2 border-slate-600 bg-slate-800 hover:border-blue-400 hover:bg-slate-700 rounded-lg p-4 cursor-pointer transition-all"
                      onClick={() => onPokemonSelect(poke)}
                    >
                      <div className="flex items-center space-x-4">
                        {poke.sprite ? (
                          <img
                            src={poke.sprite}
                            alt={poke.name}
                            className="w-12 h-12 object-contain"
                          />
                        ) : (
                          <span className="text-3xl">{poke.emoji || getTypeIcon(poke.types[0])}</span>
                        )}
                        <div className="flex-1">
                          <h4 className="pixel-text text-white text-base">{poke.name}</h4>
                          <p className="pixel-text text-slate-400 text-sm">
                            Niveau {poke.level}
                          </p>
                          <div className="mt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="pixel-text text-slate-400">HP:</span>
                              <span className="pixel-text text-white">{poke.currentHp}/{poke.maxHp}</span>
                            </div>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-colors ${
                                  (poke.currentHp / poke.maxHp) > 0.5 ? 'bg-green-500' :
                                  (poke.currentHp / poke.maxHp) > 0.25 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${(poke.currentHp / poke.maxHp) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 text-center">
                        <span className="pixel-text text-blue-400 text-xs bg-slate-900 px-3 py-1 rounded border border-blue-400">
                          SÉLECTIONNER
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-slate-800 p-4 border-t-4 border-yellow-400 shrink-0">
              <p className="pixel-text text-slate-400 text-sm text-center">
                Le changement de Pokémon termine votre tour
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
