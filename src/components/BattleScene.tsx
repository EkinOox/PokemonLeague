'use client';

import { motion } from 'framer-motion';
import { Pokemon } from '@/domain/entities/Pokemon';

interface BattleSceneProps {
  playerPokemon: Pokemon;
  opponentPokemon: Pokemon;
  playerHpPercentage: number;
  opponentHpPercentage: number;
  isPlayerTurn: boolean;
  battleMessage: string;
  playerTeam: Pokemon[];
  opponentTeam: Pokemon[];
}

export function BattleScene({
  playerPokemon,
  opponentPokemon,
  playerHpPercentage,
  opponentHpPercentage,
  isPlayerTurn,
  battleMessage,
  playerTeam,
  opponentTeam,
}: BattleSceneProps) {
  const getHpBarColor = (percentage: number) => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-2 gap-8 mb-6">
        {/* Player Side (Left) - Plus mis en avant */}
        <div className="flex flex-col items-start">
          {/* Player Pokemon Status Indicators */}
          <div className="flex gap-1 mb-2 justify-start">
            {playerTeam.map((pokemon, index) => (
              <img
                key={pokemon.id}
                src={pokemon.currentHp > 0 ? '/images/pokeball.png' : '/images/pokeball-vide.png'}
                alt={pokemon.currentHp > 0 ? 'Pokémon vivant' : 'Pokémon KO'}
                className="w-6 h-6 object-contain"
                title={`${pokemon.name} (${pokemon.currentHp > 0 ? 'Vivant' : 'KO'})`}
              />
            ))}
          </div>

          <div className="pixel-border border-3 border-green-400 bg-slate-800/90 rounded-lg p-4 mb-3 w-full shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            <div className="flex justify-between items-center mb-2">
              <h3 className="pixel-text text-white text-lg font-bold">{playerPokemon.name}</h3>
              <span className="pixel-text text-green-400 text-sm font-bold">Niv.{playerPokemon.level}</span>
            </div>
            
            {/* HP Bar */}
            <div className="mb-2">
              <div className="flex justify-between text-xs pixel-text text-slate-400 mb-1">
                <span>PV</span>
                <span className="font-bold">{playerPokemon.currentHp}/{playerPokemon.maxHp}</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden border-2 border-slate-600">
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: `${playerHpPercentage}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-full ${getHpBarColor(playerHpPercentage)}`}
                />
              </div>
            </div>
            
            {/* Types */}
            <div className="flex gap-1">
              {playerPokemon.types.map((type, index) => (
                <span 
                  key={index}
                  className="pixel-text text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded font-bold"
                >
                  {type.toUpperCase()}
                </span>
              ))}
            </div>

            {/* Status */}
            {playerPokemon.status && (
              <div className="mt-2 pixel-text text-xs font-bold px-2 py-1 rounded inline-block" style={{
                backgroundColor: 
                  playerPokemon.status === 'burn' ? '#ef4444' :
                  playerPokemon.status === 'freeze' ? '#60a5fa' :
                  playerPokemon.status === 'paralysis' ? '#facc15' :
                  playerPokemon.status === 'poison' || playerPokemon.status === 'badly-poison' ? '#a855f7' :
                  playerPokemon.status === 'sleep' ? '#6b7280' :
                  playerPokemon.status === 'confusion' ? '#f97316' :
                  '#64748b',
                color: '#fff'
              }}>
                {playerPokemon.status === 'burn' ? '🔥 BRÛ' :
                 playerPokemon.status === 'freeze' ? '❄️ GEL' :
                 playerPokemon.status === 'paralysis' ? '⚡ PAR' :
                 playerPokemon.status === 'poison' ? '☠️ PSN' :
                 playerPokemon.status === 'badly-poison' ? '☠️☠️ PSN' :
                 playerPokemon.status === 'sleep' ? '😴 DOR' :
                 playerPokemon.status === 'confusion' ? '😵 CNF' : ''}
              </div>
            )}
          </div>

          {/* Player Pokemon Sprite - Plus grand */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative mx-auto"
          >
            {playerPokemon.sprite ? (
              <img
                src={playerPokemon.sprite}
                alt={playerPokemon.name}
                className="w-40 h-40 object-contain drop-shadow-[0_0_20px_rgba(34,197,94,0.4)] transform scale-x-[-1]"
              />
            ) : (
              <div className="w-40 h-40 flex items-center justify-center bg-slate-800 rounded-lg border-4 border-green-400">
                <span className="text-7xl">{playerPokemon.emoji || '❓'}</span>
              </div>
            )}
            {isPlayerTurn && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="absolute -top-1 -left-1 w-8 h-8 bg-green-500 rounded-full border-2 border-white shadow-lg"
              />
            )}
          </motion.div>
        </div>

        {/* Opponent Side (Right) */}
        <div className="flex flex-col items-end">
          {/* Opponent Pokemon Status Indicators */}
          <div className="flex gap-1 mb-2 justify-end">
            {opponentTeam.map((pokemon, index) => (
              <img
                key={pokemon.id}
                src={pokemon.currentHp > 0 ? '/images/pokeball.png' : '/images/pokeball-vide.png'}
                alt={pokemon.currentHp > 0 ? 'Pokémon vivant' : 'Pokémon KO'}
                className="w-6 h-6 object-contain"
                title={`${pokemon.name} (${pokemon.currentHp > 0 ? 'Vivant' : 'KO'})`}
              />
            ))}
          </div>

          <div className="pixel-border border-2 border-slate-600 bg-slate-800/90 rounded-lg p-3 mb-3 w-full">
            <div className="flex justify-between items-center mb-1">
              <h3 className="pixel-text text-white text-base font-bold">{opponentPokemon.name}</h3>
              <span className="pixel-text text-slate-400 text-xs">Niv.{opponentPokemon.level}</span>
            </div>
            
            {/* HP Bar */}
            <div className="mb-1">
              <div className="flex justify-between text-xs pixel-text text-slate-400 mb-1">
                <span>PV</span>
                <span>{opponentPokemon.currentHp}/{opponentPokemon.maxHp}</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden border border-slate-600">
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: `${opponentHpPercentage}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-full ${getHpBarColor(opponentHpPercentage)}`}
                />
              </div>
            </div>
            
            {/* Types */}
            <div className="flex gap-1 justify-end">
              {opponentPokemon.types.map((type, index) => (
                <span 
                  key={index}
                  className="pixel-text text-xs px-2 py-0.5 bg-slate-700 text-slate-300 rounded"
                >
                  {type.toUpperCase()}
                </span>
              ))}
            </div>

            {/* Status */}
            {opponentPokemon.status && (
              <div className="mt-2 pixel-text text-xs font-bold px-2 py-1 rounded inline-block float-right" style={{
                backgroundColor: 
                  opponentPokemon.status === 'burn' ? '#ef4444' :
                  opponentPokemon.status === 'freeze' ? '#60a5fa' :
                  opponentPokemon.status === 'paralysis' ? '#facc15' :
                  opponentPokemon.status === 'poison' || opponentPokemon.status === 'badly-poison' ? '#a855f7' :
                  opponentPokemon.status === 'sleep' ? '#6b7280' :
                  opponentPokemon.status === 'confusion' ? '#f97316' :
                  '#64748b',
                color: '#fff'
              }}>
                {opponentPokemon.status === 'burn' ? '🔥 BRÛ' :
                 opponentPokemon.status === 'freeze' ? '❄️ GEL' :
                 opponentPokemon.status === 'paralysis' ? '⚡ PAR' :
                 opponentPokemon.status === 'poison' ? '☠️ PSN' :
                 opponentPokemon.status === 'badly-poison' ? '☠️☠️ PSN' :
                 opponentPokemon.status === 'sleep' ? '😴 DOR' :
                 opponentPokemon.status === 'confusion' ? '😵 CNF' : ''}
              </div>
            )}
          </div>

          {/* Opponent Pokemon Sprite */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative mx-auto"
          >
            {opponentPokemon.sprite ? (
              <img
                src={opponentPokemon.sprite}
                alt={opponentPokemon.name}
                className="w-32 h-32 object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]"
              />
            ) : (
              <div className="w-32 h-32 flex items-center justify-center bg-slate-800 rounded-lg border-4 border-slate-600">
                <span className="text-6xl">{opponentPokemon.emoji || '❓'}</span>
              </div>
            )}
            {!isPlayerTurn && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-white"
              />
            )}
          </motion.div>
        </div>
      </div>

      {/* Battle Message - Compact */}
      <motion.div
        key={battleMessage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pixel-border border-2 border-yellow-400 bg-slate-900/95 rounded-lg p-3 text-center"
      >
        <p className="pixel-text text-white text-sm leading-relaxed">
          {battleMessage}
        </p>
      </motion.div>
    </div>
  );
}
