'use client';

import Image from 'next/image';
import { Pokemon } from '@/domain/entities/Pokemon';
import { motion } from 'framer-motion';

interface PokemonCardProps {
  pokemon: Pokemon;
  isActive?: boolean;
  showStats?: boolean;
  onClick?: () => void;
  className?: string;
}

export function PokemonCard({ pokemon, isActive, showStats = true, onClick, className = '' }: PokemonCardProps) {
  const hpPercentage = (pokemon.currentHp / pokemon.maxHp) * 100;
  
  const getHpColor = (percentage: number) => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTypeColor = (type: string) => {
    const typeMap: { [key: string]: string } = {
      normal: 'bg-gray-400',
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500',
      ice: 'bg-cyan-300',
      fighting: 'bg-orange-700',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-700',
      flying: 'bg-indigo-300',
      psychic: 'bg-pink-500',
      bug: 'bg-lime-500',
      rock: 'bg-yellow-800',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-600',
      dark: 'bg-gray-800',
      steel: 'bg-gray-500',
      fairy: 'bg-pink-300',
    };
    return typeMap[type.toLowerCase()] || 'bg-gray-400';
  };

  const spriteUrl = `https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/${pokemon.id}/regular.png`;

  return (
    <motion.div
      whileHover={{ scale: onClick ? 1.05 : 1 }}
      whileTap={{ scale: onClick ? 0.95 : 1 }}
      onClick={onClick}
      className={`
        relative pixel-border bg-gradient-to-br from-gray-800 to-gray-900
        border-gray-600 rounded-xl p-4 
        ${isActive ? 'border-yellow-300 shadow-[0_0_30px_rgba(250,204,21,0.6)]' : ''}
        ${onClick ? 'cursor-pointer hover:border-yellow-300/50 hover:shadow-[0_0_20px_rgba(250,204,21,0.3)] transition-all' : ''}
        ${className}
      `}
    >
      {/* Pokemon Sprite */}
      <div className="relative w-full h-32 mb-3 flex items-center justify-center bg-gray-900/50 rounded-lg pixel-border border-gray-700">
        <Image
          src={spriteUrl}
          alt={pokemon.name}
          width={96}
          height={96}
          className="pixelated"
          style={{ imageRendering: 'pixelated' }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-pokemon.png';
          }}
        />
      </div>

      {/* Pokemon Name */}
      <h3 className="text-center text-sm font-bold mb-3 truncate uppercase pixel-text text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
        {pokemon.name}
      </h3>

      {/* Level Badge */}
      <div className="absolute top-2 right-2 bg-gradient-to-br from-yellow-400 to-yellow-500 pixel-border border-yellow-300 rounded-lg w-10 h-10 flex items-center justify-center text-sm font-bold pixel-text text-gray-900 shadow-[0_0_10px_rgba(250,204,21,0.4)]">
        {pokemon.level}
      </div>

      {/* Types */}
      <div className="flex gap-2 justify-center mb-3 flex-wrap">
        {pokemon.types?.map((type, index) => (
          <span
            key={index}
            className={`${getTypeColor(type)} text-white text-[10px] px-3 py-1 rounded-md pixel-border border-black/30 uppercase pixel-text shadow-[0_2px_4px_rgba(0,0,0,0.3)]`}
          >
            {type}
          </span>
        ))}
      </div>

      {/* HP Bar */}
      {showStats && (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs pixel-text text-white/90">
            <span className="font-bold">HP</span>
            <span>{pokemon.currentHp}/{pokemon.maxHp}</span>
          </div>
          <div className="w-full h-4 bg-gray-950/80 pixel-border border-gray-700 rounded overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${hpPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`h-full ${getHpColor(hpPercentage)} transition-all duration-300`}
            />
          </div>

          {/* Stats Preview */}
          <div className="grid grid-cols-3 gap-2 text-[10px] mt-3 pixel-text">
            <div className="text-center bg-red-900/30 pixel-border border-red-700/50 rounded-md py-1">
              <div className="text-red-400 font-bold">ATK</div>
              <div className="text-white">{pokemon.stats.attack}</div>
            </div>
            <div className="text-center bg-blue-900/30 pixel-border border-blue-700/50 rounded-md py-1">
              <div className="text-blue-400 font-bold">DEF</div>
              <div className="text-white">{pokemon.stats.defense}</div>
            </div>
            <div className="text-center bg-yellow-900/30 pixel-border border-yellow-700/50 rounded-md py-1">
              <div className="text-yellow-400 font-bold">SPD</div>
              <div className="text-white">{pokemon.stats.speed}</div>
            </div>
          </div>
        </div>
      )}

      {/* KO Overlay */}
      {pokemon.currentHp === 0 && (
        <div className="absolute inset-0 bg-black bg-opacity-80 rounded-xl flex items-center justify-center">
          <span className="text-red-500 text-3xl font-bold text-shadow-pixel pixel-text">KO</span>
        </div>
      )}
    </motion.div>
  );
}
