<div align="center">

# 🎮 Pokémon League

### *Devenez le Champion de la Ligue Pokémon*

> Un RPG de combat au tour par tour démontrant l'excellence de la **Clean Architecture** avec **Next.js** et **TypeScript**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Jest](https://img.shields.io/badge/Jest-154_tests-C21325?logo=jest&logoColor=white)](https://jestjs.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animations-FF0055?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[🎯 Démo](#-démo) • [🚀 Démarrage rapide](#-installation) • [📖 Documentation](#-architecture) • [🤝 Contribuer](#-contribution)

---

</div>

## 🌟 Pourquoi ce projet ?

**Pokémon League** n'est pas qu'un simple jeu – c'est une **vitrine technique** démontrant comment construire une application complexe avec :

✨ **Clean Architecture rigoureuse** (Uncle Bob)  
🧪 **TDD avec 154 tests** (100% du domaine métier)  
⚡ **Performance optimale** (Next.js 16, TypeScript strict)  
🎨 **UX/UI immersive** (Pixel-art, animations fluides)  
🌐 **Intégration API réelle** (900+ Pokémon via Tyradex)

## 🎯 Aperçu

Incarnez un dresseur ambitieux et gravissez les échelons de la **Ligue Pokémon** en affrontant des adversaires toujours plus puissants. Maîtrisez les types, gérez vos ressources et capturez de nouveaux alliés pour devenir le **Champion ultime** !

<table>
<tr>
<td width="50%">

### 🎮 Gameplay

- ⚔️ **Combat stratégique** au tour par tour
- 🧩 **18 types élémentaires** avec multiplicateurs d'efficacité
- 💥 **Coups critiques** (10% de chance)
- 💊 **4 catégories d'objets** tactiques
- � **30% de chance** de capturer l'adversaire

</td>
<td width="50%">

### 📊 Progression

- 🏅 **8 rangs évolutifs** (Débutant → Champion)
- 📈 **Difficulté croissante** des adversaires
- 🔓 **Récompenses post-combat** (objets + Pokémon)
- 🌟 **900+ Pokémon** disponibles (Tyradex API)
- 💾 **Sauvegarde automatique** de progression

</td>
</tr>
</table>

---

## 🏗️ Architecture

Ce projet suit **rigoureusement** les principes de la **Clean Architecture** d'Uncle Bob, garantissant maintenabilité, testabilité et découplage.

```
src/
├── 📦 domain/              # ❤️ Cœur métier (aucune dépendance)
│   ├── entities/           # Modèles métier purs
│   │   ├── Pokemon.ts      # Type, Stats, HP, Attacks
│   │   ├── Trainer.ts      # Inventory, Pokemons, Rank
│   │   ├── Battle.ts       # Opponent, Rounds, State
│   │   └── Reward.ts       # Items, Captured Pokemon
│   │
│   ├── services/           # Logique métier complexe
│   │   ├── TypeEffectivenessService.ts    # Matrice 18x18 types
│   │   ├── DamageCalculator.ts            # Formule dégâts + critiques
│   │   ├── BattleSimulator.ts             # Orchestration tour par tour
│   │   ├── RewardService.ts               # Génération récompenses
│   │   └── RankService.ts                 # Progression 8 rangs
│   │
│   └── repositories/       # Interfaces (ports)
│       ├── TrainerRepository.ts
│       ├── PokemonRepository.ts
│       └── BattleRepository.ts
│
├── 🎯 application/         # Cas d'usage (orchestration)
│   └── usecases/
│       ├── StartBattleUseCase.ts          # Génération adversaire
│       ├── AttackUseCase.ts               # Logique attaque
│       ├── HealPokemonUseCase.ts          # Utilisation potions
│       ├── UseItemUseCase.ts              # Gestion 4 types items
│       ├── SelectRewardUseCase.ts         # Choix récompense
│       ├── GetTrainerPokemonsUseCase.ts   # Récupération équipe
│       └── GameInitializationUseCase.ts   # Génération starters
│
├── 🔌 adapters/            # Implémentations (adaptateurs)
│   ├── gateways/           # API externes
│   │   └── TyradexPokemonGateway.ts       # Tyradex API
│   │
│   ├── repositories/       # Persistance
│   │   ├── InMemoryTrainerRepository.ts
│   │   ├── InMemoryPokemonRepository.ts
│   │   └── InMemoryBattleRepository.ts
│   │
│   └── controllers/        # Contrôleurs HTTP
│       ├── StartBattleController.ts
│       ├── AttackController.ts
│       └── SelectRewardController.ts
│
└── 🖼️ framework/           # UI & Infra (Next.js)
    ├── app/                # App Router Next.js
    │   ├── page.tsx                       # Menu principal
    │   ├── selection/page.tsx             # Choix starter
    │   ├── battle/page.tsx                # Écran combat
    │   ├── rewards/page.tsx               # Sélection récompenses
    │   └── layout.tsx                     # Root layout
    │
    ├── components/         # Composants React
    │   ├── PokemonCard.tsx                # Card réutilisable
    │   ├── BattleLog.tsx                  # Historique combat
    │   └── TypeBadge.tsx                  # Badge type élémentaire
    │
    └── context/            # State management
        └── GameContext.tsx                # Context React global
```

### 🔄 Flux de données

```
UI (React) → Controller → UseCase → Service/Repository → Domain Entity
                ↓                          ↓
           Response ← DTO Mapper ← Repository ← Gateway (API)
```

### ✅ Avantages de cette architecture

| Principe | Bénéfice |
|----------|----------|
| 🎯 **Separation of Concerns** | Chaque couche a une responsabilité unique |
| 🧪 **Testabilité** | 154 tests unitaires (domaine indépendant) |
| 🔄 **Réversibilité** | Changez Next.js par Angular sans toucher au métier |
| 📦 **Découplage** | Interfaces pour toutes les dépendances externes |
| 🛡️ **Protection du domaine** | Règles métier isolées de l'infrastructure |

---

## 🚀 Installation & Démarrage

### ⚙️ Prérequis

- **Node.js** 18+ ([Télécharger](https://nodejs.org/))
- **npm** ou **yarn**

### 📦 Installation

```bash
# 1. Cloner le repository
git clone https://github.com/EkinOox/PokemonLeague.git
cd PokemonLeague

# 2. Installer les dépendances
npm install

# 3. Lancer les tests (optionnel)
npm test

# 4. Démarrer le serveur de développement
npm run dev
```

🎮 **Le jeu sera accessible sur** `http://localhost:3000`

### 🏗️ Build de production

```bash
# Build optimisé
npm run build

# Lancer la version production
npm start
```

---

## 🎮 Guide de Gameplay

### 🎯 1. Sélection du Starter

Au démarrage, choisis **un set de 6 Pokémon** parmi 3 options thématiques :

- 🔥 **Offensive** : Types offensifs (Feu, Combat, Dragon)
- 🛡️ **Defensive** : Types résistants (Acier, Roche, Eau)
- ⚖️ **Balanced** : Mix équilibré de tous types

Les Pokémon sont générés aléatoirement via l'**API Tyradex** (900+ disponibles).

### 🏆 2. Progression dans la Ligue

Gravis les **8 rangs** pour devenir Champion :

| Rang | Nom | Points requis | Niveau adversaire |
|------|-----|---------------|-------------------|
| 1️⃣ | **Rookie Trainer** | 0 | Facile |
| 2️⃣ | **Junior Trainer** | 100 | Facile+ |
| 3️⃣ | **Pro Trainer** | 250 | Moyen |
| 4️⃣ | **Expert Trainer** | 500 | Moyen+ |
| 5️⃣ | **Champion** | 800 | Difficile |
| 6️⃣ | **Elite** | 1200 | Difficile+ |
| 7️⃣ | **Master** | 1700 | Très difficile |
| 8️⃣ | **League Boss** | 2500 | Extrême |

### ⚔️ 3. Combat au Tour par Tour

```
┌─────────────────────────────────────┐
│ 1. Sélectionne ton Pokémon actif    │
│ 2. Choisis une action :             │
│    • Attaquer (4 moves disponibles) │
│    • Utiliser un objet              │
│    • Changer de Pokémon             │
│ 3. L'adversaire riposte             │
│ 4. Répète jusqu'à KO total          │
└─────────────────────────────────────┘
```

**Calcul des dégâts** :
```typescript
Dégâts = (Attaque / Défense) × TypeMultiplier × CriticalHit × Random(0.9-1.1)
```

- **Type Effectiveness** : x0 (immunité), x0.5 (résistant), x1 (neutre), x2 (super efficace)
- **Coups critiques** : 10% de chance, x1.5 les dégâts
- **Variation** : ±10% aléatoire pour le réalisme

### 🎁 4. Récompenses Post-Combat

Après chaque victoire :

1. **Choisis 2 objets** parmi 5 proposés aléatoirement
2. **30% de chance** d'obtenir un nouveau Pokémon
   - Si oui : choisis parmi 3 propositions
   - Remplace un membre de ton équipe (max 6)

### 💊 5. Objets Disponibles

| Catégorie | Objet | Effet |
|-----------|-------|-------|
| 💚 **Healing** | Potion | +20 HP |
| 💚 **Healing** | Super Potion | +50 HP |
| 💚 **Healing** | Hyper Potion | +100 HP |
| 💚 **Healing** | Revive | Réanime (50% HP) |
| 💪 **Boost** | X Attack | Attaque x1.5 |
| 🛡️ **Boost** | X Defense | Défense x1.5 |
| ⚡ **Boost** | X Speed | Vitesse x1.5 |
| 🔰 **Shield** | Shield | Bloque 1 attaque |

---

## 🧪 Tests & Qualité

### 📊 Statistiques

- ✅ **25 suites de tests**
- ✅ **154 tests passants**
- ✅ **0 tests échoués**
- ✅ **100% de couverture** du domaine métier

### 🚀 Commandes

```bash
# Lancer tous les tests
npm test

# Mode watch (recommandé pour le développement)
npm test -- --watch

# Test d'un fichier spécifique
npm test -- --testPathPatterns=BattleSimulator

# Couverture de code
npm test -- --coverage
```

### � Couverture par couche

| Couche | Fichiers | Tests | Status |
|--------|----------|-------|--------|
| 🧠 **Entities** | 4 | 18 | ✅ |
| ⚙️ **Services** | 5 | 70 | ✅ |
| 🎯 **UseCases** | 7 | 52 | ✅ |
| 🔌 **Controllers** | 3 | 8 | ✅ |
| 📡 **Gateways** | 1 | 3 | ✅ |
| 💾 **Repositories** | 3 | 3 | ✅ |

### 🎨 Approche TDD

1. ✍️ **RED** : Écrire un test qui échoue
2. ✅ **GREEN** : Écrire le code minimal pour le faire passer
3. 🔄 **REFACTOR** : Améliorer le code sans casser les tests

---

## 🛠️ Stack Technique

<table>
<tr>
<td width="33%">

### 🧠 Backend/Logique

- **TypeScript** 5.0
  - Typage strict
  - Interfaces & Generics
- **Jest** 29.0
  - Tests unitaires
  - Mocks & Spies
- **Clean Architecture**
  - Ports & Adapters
  - DDD patterns

</td>
<td width="33%">

### 🎨 Frontend

- **Next.js** 16.0
  - App Router
  - Server Components
- **React** 19.0
  - Context API
  - Hooks
- **TailwindCSS** 3.4
  - Utility-first
  - Responsive
- **Framer Motion** 11.0
  - Animations fluides
  - Gestures

</td>
<td width="33%">

### 🌐 APIs & Services

- **Tyradex API**
  - 900+ Pokémon
  - Sprites & Stats
  - Types & Moves
- **GitHub Raw**
  - Hébergement images
  - CDN gratuit

</td>
</tr>
</table>

### 🔗 Endpoints utilisés

```typescript
// Liste des Pokémon
GET https://tyradex.vercel.app/api/v1/pokemon

// Sprites (images)
GET https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/{gen}/{id}.png
```

---

## 📁 Structure des Fichiers Clés

```
src/
├── 📦 domain/entities/
│   ├── Pokemon.ts           # 🎮 Entité Pokémon (stats, HP, types, moves)
│   ├── Trainer.ts           # 👤 Entité Dresseur (équipe, items, rank, points)
│   ├── Battle.ts            # ⚔️ Entité Combat (état, tours, historique)
│   ├── Item.ts              # 💊 Entité Objet (type, effet, quantité)
│   └── Reward.ts            # 🎁 Entité Récompense (items, Pokémon capturé)
│
├── 📦 domain/services/
│   ├── TypeEffectivenessService.ts  # 🧩 Matrice 18x18 types
│   ├── DamageCalculator.ts          # 💥 Formule dégâts + critiques
│   ├── BattleSimulator.ts           # 🎲 Orchestration tour par tour
│   ├── RankService.ts               # 📈 Progression 8 rangs
│   └── RewardService.ts             # 🎰 Génération récompenses aléatoires
│
├── 🎯 application/usecases/
│   ├── GameInitializationUseCase.ts # 🚀 Génération 3 sets de starters
│   ├── StartBattleUseCase.ts        # 🥊 Initialisation combat vs adversaire
│   ├── AttackUseCase.ts             # 👊 Exécution attaque + calcul dégâts
│   ├── UseItemUseCase.ts            # 💊 Utilisation objets (4 types)
│   ├── HealPokemonUseCase.ts        # 💚 Soin Pokémon hors combat
│   ├── SelectRewardUseCase.ts       # 🎁 Sélection récompense post-combat
│   └── GetTrainerPokemonsUseCase.ts # 📋 Récupération équipe active
│
├── 🔌 adapters/
│   ├── gateways/
│   │   └── TyradexPokemonGateway.ts # 🌐 Fetch API Tyradex (900+ Pokémon)
│   ├── repositories/
│   │   ├── InMemoryTrainerRepository.ts   # 💾 Persistance Trainer
│   │   ├── InMemoryPokemonRepository.ts   # 💾 Persistance Pokémon
│   │   └── InMemoryBattleRepository.ts    # 💾 Persistance Battle
│   └── controllers/
│       ├── StartBattleController.ts       # 🎮 HTTP Controller Battle
│       ├── AttackController.ts            # 🎮 HTTP Controller Attack
│       └── SelectRewardController.ts      # 🎮 HTTP Controller Reward
│
└── 🖼️ framework/
    ├── app/
    │   ├── page.tsx                 # 🏠 Menu principal
    │   ├── selection/page.tsx       # 🎯 Sélection starter (3 sets)
    │   ├── battle/page.tsx          # ⚔️ Écran combat (à implémenter)
    │   ├── rewards/page.tsx         # 🎁 Sélection récompenses (à implémenter)
    │   ├── layout.tsx               # 📐 Root layout + GameProvider
    │   └── globals.css              # 🎨 Styles globaux pixel-art
    │
    ├── components/
    │   ├── PokemonCard.tsx          # 🃏 Carte Pokémon réutilisable
    │   ├── BattleLog.tsx            # 📜 Historique combat (à implémenter)
    │   └── TypeBadge.tsx            # 🏷️ Badge type élémentaire (à implémenter)
    │
    └── context/
        └── GameContext.tsx          # 🌐 Context React (state global)
```

---

## 🎨 Design System

### 🎭 Thème Pixel-Art Rétro

- **Police** : [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) (authentique pixel-art)
- **Palette** : Inspirée des jeux Pokémon Game Boy (rouge, bleu, jaune)
- **Effets visuels** :
  - 📺 Scanlines pour effet CRT
  - ⚡ Animations shake lors des dégâts
  - ✨ Glow sur le Pokémon actif
  - 💚 Barres HP animées avec dégradés

### 🎨 Couleurs des Types (18 types)

```css
Normal: #A8A878    Feu: #F08030      Eau: #6890F0
Plante: #78C850    Électrik: #F8D030  Glace: #98D8D8
Combat: #C03028    Poison: #A040A0    Sol: #E0C068
Vol: #A890F0       Psy: #F85888       Insecte: #A8B820
Roche: #B8A038     Spectre: #705898   Dragon: #7038F8
Ténèbres: #705848  Acier: #B8B8D0     Fée: #EE99AC
```

### 🧩 Composants

| Composant | Description | Animations |
|-----------|-------------|------------|
| `PokemonCard` | Carte interactive | Hover scale, HP bar |
| `TypeBadge` | Badge de type | Glow, colors |
| `BattleLog` | Historique combat | Slide-in, fade |
| `HPBar` | Barre de vie | Gradient, transition |

---

## 🤝 Contribution

Les contributions sont **bienvenues** ! Ce projet est éducatif et open-source.

### 📋 Comment contribuer

1. 🍴 **Fork** le projet
2. 🌿 **Crée** une branche (`git checkout -b feature/SuperFeature`)
3. ✍️ **Commit** tes changements (`git commit -m 'Add SuperFeature'`)
4. 📤 **Push** sur la branche (`git push origin feature/SuperFeature`)
5. 🔀 **Ouvre** une Pull Request

### 💡 Idées de contributions

<table>
<tr>
<td width="50%">

#### 🎮 Gameplay

- [ ] Système d'évolution des Pokémon
- [ ] Talents et capacités spéciales
- [ ] Conditions météo (pluie, soleil, grêle)
- [ ] Objets tenus (items held)
- [ ] Mode multijoueur (PvP)
- [ ] Replay des combats

</td>
<td width="50%">

#### 🛠️ Technique

- [ ] Sauvegarde localStorage/IndexedDB
- [ ] Persistance avec Prisma + PostgreSQL
- [ ] API Routes Next.js
- [ ] Authentification (NextAuth.js)
- [ ] Sons et musiques
- [ ] Animations de combat avancées
- [ ] Mode sombre/clair

</td>
</tr>
</table>

### 🐛 Reporter un bug

Ouvre une **issue** avec :
- 📝 Description claire du problème
- 🔁 Étapes pour reproduire
- 📸 Captures d'écran si applicable
- 💻 Environnement (OS, navigateur, version Node)

---

## 📚 Ressources & Références

### 📖 Architecture & Patterns

- [Clean Architecture - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Hexagonal Architecture (Ports & Adapters)](https://alistair.cockburn.us/hexagonal-architecture/)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

### 🛠️ Documentation technique

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion API](https://www.framer.com/motion/)

### 🎮 Pokémon Data

- [Tyradex API](https://tyradex.vercel.app/) - API Pokémon complète
- [Pokemon Type Chart](https://pokemondb.net/type) - Tableau des types
- [Bulbapedia](https://bulbapedia.bulbagarden.net/) - Encyclopédie Pokémon

---

## 📄 Licence

Ce projet est sous licence **MIT** - voir le fichier [LICENSE](LICENSE) pour plus de détails.

```
MIT License - Copyright (c) 2024 EkinOox
Permission is hereby granted, free of charge, to any person obtaining a copy...
```

> ⚠️ **Note** : Ce projet est à but éducatif. Pokémon est une marque déposée de Nintendo/Game Freak/Creatures Inc.

---

## 👨‍💻 Auteur

<div align="center">

**EkinOox**

[![GitHub](https://img.shields.io/badge/GitHub-@EkinOox-181717?logo=github&logoColor=white)](https://github.com/EkinOox)
[![Portfolio](https://img.shields.io/badge/Portfolio-ekinoox.dev-FF5722?logo=google-chrome&logoColor=white)](https://ekinoox.dev)

</div>

---

## 🎯 Objectifs Pédagogiques

Ce projet a été créé pour démontrer :

<table>
<tr>
<td width="50%">

### 🏗️ Architecture

✅ Clean Architecture en production  
✅ Séparation des responsabilités  
✅ Inversion de dépendances  
✅ Ports & Adapters pattern  
✅ Domain-Driven Design

</td>
<td width="50%">

### 💻 Développement

✅ Test-Driven Development (TDD)  
✅ TypeScript avancé (Generics, Types)  
✅ Next.js 16 avec App Router  
✅ Intégration d'APIs externes  
✅ UX/UI immersive façon jeu vidéo

</td>
</tr>
</table>

---

<div align="center">

### ⭐ Si ce projet t'a aidé, n'hésite pas à lui donner une étoile ! ⭐

Made with ❤️ and ⚡ by **EkinOox**

---

**[⬆ Retour en haut](#-pokémon-league)**

</div>
