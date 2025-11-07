'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Move } from '@/domain/entities/Move';

interface AttackSelectorProps {
  moves: Move[];
  onMoveSelect: (move: Move) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function AttackSelector({ moves, onMoveSelect, onClose, isOpen }: AttackSelectorProps) {
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      normal: 'bg-gray-500',
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      grass: 'bg-green-500',
      electric: 'bg-yellow-500',
      ice: 'bg-cyan-400',
      fighting: 'bg-red-700',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-700',
      flying: 'bg-indigo-400',
      psychic: 'bg-pink-500',
      bug: 'bg-green-600',
      rock: 'bg-yellow-800',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-700',
      dark: 'bg-gray-800',
      steel: 'bg-gray-400',
      fairy: 'bg-pink-300',
    };
    return colors[type] || 'bg-gray-500';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="pixel-border border-4 border-yellow-400 bg-slate-900 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="pixel-text text-yellow-400 text-2xl">CHOISIR UNE ATTAQUE</h2>
                <button
                  onClick={onClose}
                  className="pixel-border border-2 border-red-400 bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded transition-colors"
                >
                  <span className="pixel-text text-sm">✕ FERMER</span>
                </button>
              </div>

              {/* Moves Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {moves.map((move, index) => (
                  <motion.button
                    key={move.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onMoveSelect(move);
                      onClose();
                    }}
                    disabled={move.pp <= 0}
                    className={`
                      pixel-border border-2 rounded-lg p-4 text-left transition-all
                      ${move.pp <= 0
                        ? 'border-gray-600 bg-gray-800 opacity-50 cursor-not-allowed'
                        : 'border-yellow-400 bg-slate-800 hover:border-yellow-300 hover:shadow-[0_0_20px_rgba(250,204,21,0.3)] cursor-pointer'
                      }
                    `}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="pixel-text text-white text-lg font-bold">{move.name}</h3>
                      <span className={`pixel-text text-xs px-2 py-1 rounded ${getTypeColor(move.type)} text-white`}>
                        {move.type.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="text-center">
                        <p className="pixel-text text-xs text-slate-400 mb-1">Puissance</p>
                        <p className="pixel-text text-white font-bold">{move.power || '-'}</p>
                      </div>
                      <div className="text-center">
                        <p className="pixel-text text-xs text-slate-400 mb-1">Précision</p>
                        <p className="pixel-text text-white font-bold">{move.accuracy || '-'}</p>
                      </div>
                      <div className="text-center">
                        <p className="pixel-text text-xs text-slate-400 mb-1">PP</p>
                        <p className={`pixel-text font-bold ${move.pp <= move.maxPp * 0.25 ? 'text-red-400' : 'text-green-400'}`}>
                          {move.pp}/{move.maxPp}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      <span className={`pixel-text text-xs px-3 py-1 rounded ${
                        move.damageClass === 'physical' ? 'bg-orange-700' :
                        move.damageClass === 'special' ? 'bg-blue-700' :
                        'bg-gray-700'
                      } text-white`}>
                        {move.damageClass === 'physical' ? '💪 PHYSIQUE' :
                         move.damageClass === 'special' ? '✨ SPÉCIALE' :
                         '➕ STATUT'}
                      </span>
                    </div>

                    {move.description && (
                      <p className="pixel-text text-slate-400 text-xs mt-3 leading-tight">
                        {move.description}
                      </p>
                    )}
                  </motion.button>
                ))}
              </div>

              {moves.length === 0 && (
                <div className="text-center py-12">
                  <p className="pixel-text text-slate-400 text-lg">Aucune attaque disponible</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
