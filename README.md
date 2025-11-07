# 🎮 Pokémon League

> Jeu RPG de combat Pokémon au tour par tour avec Clean Architecture

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 🚀 Installation

```bash
# Cloner le projet
git clone https://github.com/EkinOox/PokemonLeague.git
cd PokemonLeague

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le jeu sera accessible sur `http://localhost:3000`

---

## � Comment jouer

1. **Choisis ton équipe de départ** (6 Pokémon parmi 3 sets)
2. **Affronte des adversaires** dans des combats au tour par tour
3. **Utilise des objets** et gère tes ressources stratégiquement
4. **Progresse dans les rangs** pour devenir Champion
5. **Récupère des récompenses** après chaque victoire

### ⚔️ Combat
- Choisis une attaque parmi 4 moves disponibles
- Utilise des objets (potions, boosts, shields)
- Change de Pokémon si nécessaire
- Les types et multiplicateurs affectent les dégâts

### 🎁 Récompenses
- 2 objets à choisir parmi 5
- 30% de chance d'obtenir un nouveau Pokémon
- Remplace un membre de ton équipe si capture

---

## �️ Architecture

Clean Architecture avec séparation en 4 couches :

```
domain/         → Entités et logique métier (Pokemon, Trainer, Battle)
application/    → Cas d'usage (AttackUseCase, StartBattleUseCase...)
adapters/       → Repositories et API (TyradexAPI)
framework/      → UI Next.js et composants React
```

---

## 🛠️ Stack Technique

- **Next.js 16** - Framework React avec App Router
- **TypeScript 5** - Typage strict
- **TailwindCSS 3** - Styles utility-first
- **Framer Motion** - Animations
- **Tyradex API** - Données Pokémon (900+)

---

## 📄 Licence

MIT License - Copyright (c) 2024 EkinOox

> ⚠️ Ce projet est à but éducatif. Pokémon est une marque de Nintendo/Game Freak/Creatures Inc.
