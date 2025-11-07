import { motion } from 'framer-motion';
import { Move } from '@/domain/entities/Move';

interface MoveSelectorProps {
  moves: Move[];
  onMoveSelect: (move: Move) => void;
  disabled?: boolean;
}

export function MoveSelector({ moves, onMoveSelect, disabled = false }: MoveSelectorProps) {
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
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="pixel-text text-yellow-400 text-center mb-4 text-lg">CHOISIR UNE ATTAQUE</h3>

      <div className="grid grid-cols-2 gap-4">
        {moves.map((move, index) => (
          <motion.button
            key={move.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={!disabled ? { scale: 1.05 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            onClick={() => !disabled && onMoveSelect(move)}
            disabled={disabled || move.pp <= 0}
            className={`
              pixel-border border-2 rounded-lg p-4 text-left transition-all
              ${move.pp <= 0
                ? 'border-gray-600 bg-gray-800 opacity-50 cursor-not-allowed'
                : disabled
                  ? 'border-slate-600 bg-slate-800 cursor-not-allowed'
                  : 'border-yellow-400 bg-slate-800 hover:border-yellow-300 hover:shadow-[0_0_20px_rgba(250,204,21,0.3)] cursor-pointer'
              }
            `}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="pixel-text text-white text-sm font-bold">{move.name}</h4>
              <span className={`pixel-text text-xs px-2 py-1 rounded ${getTypeColor(move.type)} text-white`}>
                {move.type.toUpperCase()}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="pixel-text text-slate-400">Puissance:</span>
                <span className="pixel-text text-white">{move.power || '-'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="pixel-text text-slate-400">Précision:</span>
                <span className="pixel-text text-white">{move.accuracy || '-'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="pixel-text text-slate-400">PP:</span>
                <span className={`pixel-text ${move.pp <= move.maxPp * 0.25 ? 'text-red-400' : 'text-green-400'}`}>
                  {move.pp}/{move.maxPp}
                </span>
              </div>
            </div>

            {move.description && (
              <p className="pixel-text text-slate-400 text-xs mt-2 leading-tight">
                {move.description}
              </p>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
