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

      {/* SVG décoratifs flottants */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Pokéballs pixel art */}
        <motion.div
          className="absolute top-16 left-16"
          animate={{
            y: [0, -8, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" className="text-red-500 drop-shadow-lg">
            <rect x="0" y="14" width="32" height="4" fill="currentColor"/>
            <rect x="14" y="0" width="4" height="32" fill="currentColor"/>
            <rect x="12" y="12" width="8" height="8" fill="currentColor"/>
            <rect x="14" y="14" width="4" height="4" fill="white"/>
            <rect x="15" y="15" width="2" height="2" fill="currentColor"/>
          </svg>
        </motion.div>

        <motion.div
          className="absolute top-24 right-24"
          animate={{
            y: [0, -6, 0],
            rotate: [0, -3, 3, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" className="text-red-500 drop-shadow-lg">
            <rect x="0" y="10" width="24" height="4" fill="currentColor"/>
            <rect x="10" y="0" width="4" height="24" fill="currentColor"/>
            <rect x="9" y="9" width="6" height="6" fill="currentColor"/>
            <rect x="10" y="10" width="4" height="4" fill="white"/>
            <rect x="11" y="11" width="2" height="2" fill="currentColor"/>
          </svg>
        </motion.div>

        {/* Éclairs pixel art */}
        <motion.div
          className="absolute top-1/3 right-12"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <svg width="28" height="32" viewBox="0 0 28 32" className="text-yellow-400 drop-shadow-lg">
            <rect x="12" y="0" width="4" height="8" fill="currentColor"/>
            <rect x="8" y="8" width="4" height="4" fill="currentColor"/>
            <rect x="16" y="8" width="4" height="4" fill="currentColor"/>
            <rect x="4" y="12" width="4" height="4" fill="currentColor"/>
            <rect x="20" y="12" width="4" height="4" fill="currentColor"/>
            <rect x="8" y="16" width="4" height="4" fill="currentColor"/>
            <rect x="16" y="16" width="4" height="4" fill="currentColor"/>
            <rect x="12" y="20" width="4" height="8" fill="currentColor"/>
            <rect x="10" y="28" width="8" height="4" fill="currentColor"/>
          </svg>
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 left-16"
          animate={{
            scale: [1, 0.9, 1],
            rotate: [0, -3, 3, 0],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
        >
          <svg width="20" height="24" viewBox="0 0 20 24" className="text-yellow-400 drop-shadow-lg">
            <rect x="8" y="0" width="4" height="6" fill="currentColor"/>
            <rect x="6" y="6" width="4" height="4" fill="currentColor"/>
            <rect x="10" y="6" width="4" height="4" fill="currentColor"/>
            <rect x="4" y="10" width="4" height="4" fill="currentColor"/>
            <rect x="12" y="10" width="4" height="4" fill="currentColor"/>
            <rect x="6" y="14" width="4" height="4" fill="currentColor"/>
            <rect x="10" y="14" width="4" height="4" fill="currentColor"/>
            <rect x="8" y="18" width="4" height="6" fill="currentColor"/>
          </svg>
        </motion.div>

        {/* Potions pixel art */}
        <motion.div
          className="absolute bottom-24 right-1/3"
          animate={{
            y: [0, -4, 0],
            rotate: [0, 1, -1, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.8
          }}
        >
          <svg width="20" height="28" viewBox="0 0 20 28" className="text-pink-500 drop-shadow-lg">
            <rect x="6" y="0" width="8" height="20" fill="currentColor"/>
            <rect x="4" y="2" width="12" height="16" fill="currentColor"/>
            <rect x="8" y="20" width="4" height="8" fill="currentColor"/>
            <rect x="6" y="24" width="8" height="4" fill="currentColor"/>
            <rect x="7" y="4" width="6" height="12" fill="white"/>
            <rect x="8" y="6" width="4" height="8" fill="currentColor"/>
          </svg>
        </motion.div>

        {/* Super Ball pixel art */}
        <motion.div
          className="absolute top-1/2 left-1/4"
          animate={{
            y: [0, -5, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
            delay: 1.2
          }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" className="text-blue-500 drop-shadow-lg">
            <rect x="0" y="12" width="28" height="4" fill="currentColor"/>
            <rect x="12" y="0" width="4" height="28" fill="currentColor"/>
            <rect x="10" y="10" width="8" height="8" fill="currentColor"/>
            <rect x="12" y="12" width="4" height="4" fill="white"/>
            <rect x="13" y="13" width="2" height="2" fill="currentColor"/>
          </svg>
        </motion.div>

        {/* Étoiles pixel art */}
        <motion.div
          className="absolute top-20 left-20"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" className="text-yellow-400 opacity-60">
            <rect x="10" y="0" width="4" height="4" fill="currentColor"/>
            <rect x="6" y="6" width="4" height="4" fill="currentColor"/>
            <rect x="14" y="6" width="4" height="4" fill="currentColor"/>
            <rect x="2" y="10" width="4" height="4" fill="currentColor"/>
            <rect x="18" y="10" width="4" height="4" fill="currentColor"/>
            <rect x="10" y="10" width="4" height="4" fill="currentColor"/>
            <rect x="6" y="14" width="4" height="4" fill="currentColor"/>
            <rect x="14" y="14" width="4" height="4" fill="currentColor"/>
            <rect x="10" y="18" width="4" height="4" fill="currentColor"/>
          </svg>
        </motion.div>

        <motion.div
          className="absolute top-32 right-32"
          animate={{
            y: [0, -15, 0],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" className="text-blue-400 opacity-40">
            <rect x="6" y="0" width="4" height="4" fill="currentColor"/>
            <rect x="4" y="4" width="4" height="4" fill="currentColor"/>
            <rect x="8" y="4" width="4" height="4" fill="currentColor"/>
            <rect x="2" y="6" width="4" height="4" fill="currentColor"/>
            <rect x="10" y="6" width="4" height="4" fill="currentColor"/>
            <rect x="6" y="6" width="4" height="4" fill="currentColor"/>
            <rect x="4" y="8" width="4" height="4" fill="currentColor"/>
            <rect x="8" y="8" width="4" height="4" fill="currentColor"/>
            <rect x="6" y="12" width="4" height="4" fill="currentColor"/>
          </svg>
        </motion.div>

        {/* Cercles décoratifs */}
        <motion.svg
          className="absolute top-1/4 right-20 w-8 h-8 text-cyan-400 opacity-30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <circle cx="12" cy="12" r="10" />
        </motion.svg>

        <motion.svg
          className="absolute bottom-1/3 left-1/4 w-6 h-6 text-pink-400 opacity-40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          animate={{
            scale: [1, 0.8, 1],
            rotate: [0, -360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1.5
          }}
        >
          <circle cx="12" cy="12" r="10" />
        </motion.svg>

        {/* Formes géométriques */}
        <motion.svg
          className="absolute top-1/2 left-10 w-4 h-4 text-green-400 opacity-50"
          viewBox="0 0 24 24"
          fill="currentColor"
          animate={{
            x: [0, 20, 0],
            y: [0, -10, 0],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <polygon points="12,2 22,12 12,22 2,12" />
        </motion.svg>

        <motion.svg
          className="absolute bottom-20 right-1/4 w-5 h-5 text-orange-400 opacity-45"
          viewBox="0 0 24 24"
          fill="currentColor"
          animate={{
            x: [0, -15, 0],
            y: [0, 15, 0],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5
          }}
        >
          <rect x="4" y="4" width="16" height="16" rx="2" />
        </motion.svg>

        {/* Particules lumineuses */}
        <motion.svg
          className="absolute top-3/4 right-10 w-3 h-3 text-white opacity-60"
          viewBox="0 0 24 24"
          fill="currentColor"
          animate={{
            scale: [0.5, 1.5, 0.5],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <circle cx="12" cy="12" r="8" />
        </motion.svg>

        <motion.svg
          className="absolute top-1/6 left-1/3 w-2 h-2 text-yellow-300 opacity-70"
          viewBox="0 0 24 24"
          fill="currentColor"
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
        >
          <circle cx="12" cy="12" r="6" />
        </motion.svg>
      </div>

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
