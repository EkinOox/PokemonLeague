'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState(0);

  const menuOptions = [
    { label: 'NOUVELLE PARTIE', action: () => router.push('/selection'), icon: '▶' },
    { label: 'CONTINUER', action: () => alert('Fonctionnalité prochainement disponible'), icon: '●' },
    { label: 'OPTIONS', action: () => alert('Fonctionnalité prochainement disponible'), icon: '◆' },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        setSelectedOption((prev) => (prev > 0 ? prev - 1 : menuOptions.length - 1));
      } else if (e.key === 'ArrowDown') {
        setSelectedOption((prev) => (prev < menuOptions.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Enter') {
        menuOptions[selectedOption].action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOption, menuOptions]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 flex flex-col items-center justify-center p-8 scanlines relative overflow-hidden">
      {/* Grille de fond style pixel art */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px),
                         repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)`
      }} />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo / Titre */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="text-center mb-16"
        >
          {/* Badge titre principal */}
          <div className="inline-block mb-8">
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 40px rgba(250, 204, 21, 0.5)',
                  '0 0 60px rgba(250, 204, 21, 0.8)',
                  '0 0 40px rgba(250, 204, 21, 0.5)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative"
            >
              <div className="pixel-border border-4 border-yellow-400 bg-gradient-to-b from-yellow-500 via-yellow-600 to-orange-600 px-12 py-6 rounded-lg shadow-2xl">
                <h1 className="text-5xl md:text-6xl font-bold pixel-text text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]">
                  POKÉMON
                </h1>
                <h2 className="text-4xl md:text-5xl font-bold pixel-text text-yellow-200 drop-shadow-[3px_3px_0px_rgba(0,0,0,0.8)] mt-1">
                  LEAGUE
                </h2>
              </div>
              {/* Coins décoratifs */}
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-300 border-2 border-yellow-400 rounded-sm" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-300 border-2 border-yellow-400 rounded-sm" />
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-yellow-300 border-2 border-yellow-400 rounded-sm" />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-yellow-300 border-2 border-yellow-400 rounded-sm" />
            </motion.div>
          </div>

          {/* Slogan */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-yellow-300 pixel-text text-lg mb-4 tracking-wider">
              DEVENEZ LE CHAMPION
            </p>
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-white/70 pixel-text text-sm"
            >
              ▼ APPUYEZ SUR START ▼
            </motion.p>
          </motion.div>

          {/* Image Pokémon décorative */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.5,
              type: 'spring',
              stiffness: 200
            }}
            className="mt-8 relative"
          >
            <div className="inline-block relative">
              <motion.img
                src="/images/pokemon.png"
                alt="Pokémon"
                className="w-32 h-32 md:w-40 md:h-40 pixel-art drop-shadow-[0_0_20px_rgba(250,204,21,0.4)]"
                style={{ imageRendering: 'pixelated' }}
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
              {/* Ombre au sol */}
              <motion.div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-black/30 rounded-full blur-md"
                animate={{
                  scale: [1, 0.8, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Menu */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-4 mb-12"
        >
          {menuOptions.map((option, index) => (
            <motion.button
              key={option.label}
              onClick={option.action}
              onMouseEnter={() => setSelectedOption(index)}
              whileHover={{ x: 10 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full p-6 text-left pixel-text text-xl font-bold
                border-4 rounded-lg transition-all duration-200
                relative overflow-hidden
                ${selectedOption === index
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 border-yellow-300 text-gray-900 shadow-[0_0_30px_rgba(250,204,21,0.6)]'
                  : 'bg-gradient-to-r from-slate-800 to-slate-900 border-slate-600 text-white hover:border-slate-500'
                }
              `}
            >
              {/* Indicateur de sélection */}
              {selectedOption === index && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                >
                  <span className="text-3xl animate-pulse">►</span>
                </motion.div>
              )}

              {/* Contenu du bouton */}
              <div className="flex items-center justify-between ml-12">
                <span className="flex items-center gap-4">
                  <span className="text-2xl">{option.icon}</span>
                  {option.label}
                </span>
                {selectedOption === index && (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="text-2xl"
                  >
                    ⚡
                  </motion.span>
                )}
              </div>

              {/* Effet de bord pixel art */}
              <div className={`absolute inset-0 pointer-events-none ${selectedOption === index ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
                <div className="absolute top-0 left-0 w-3 h-3 bg-white/30" />
                <div className="absolute top-0 right-0 w-3 h-3 bg-white/30" />
                <div className="absolute bottom-0 left-0 w-3 h-3 bg-white/30" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-white/30" />
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Footer / Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-6"
        >
          {/* Contrôles */}
          <div className="pixel-border border-2 border-slate-700 bg-slate-900/80 rounded-lg p-4">
            <div className="text-center space-y-2">
              <p className="text-slate-400 pixel-text text-xs">CONTRÔLES</p>
              <div className="flex justify-center gap-6 text-slate-300 pixel-text text-xs">
                <span>↑↓ NAVIGUER</span>
                <span className="text-slate-600">|</span>
                <span>ENTER SÉLECTIONNER</span>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center space-y-1">
            <p className="text-slate-500 pixel-text text-xs">
              © 2025 POKÉMON LEAGUE
            </p>
            <p className="text-slate-600 pixel-text text-[10px]">
              VERSION 1.0.0
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
