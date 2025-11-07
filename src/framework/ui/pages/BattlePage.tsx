'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useGame } from '@/framework/ui/context/GameContext';
import { BattleScene } from '@/framework/ui/components/BattleScene';
import { MoveSelector } from '@/framework/ui/components/MoveSelector';
import { AttackSelector } from '@/framework/ui/components/AttackSelector';
import { Inventory } from '@/framework/ui/components/Inventory';
import { PokemonSwitcher } from '@/framework/ui/components/PokemonSwitcher';
import { Move } from '@/domain/entities/Move';
import { Item } from '@/domain/entities/Item';
import { Pokemon } from '@/domain/entities/Pokemon';
import { UseCaseFactory, GatewayFactory } from '@/framework/factories';

type BattlePhase = 'selecting' | 'inventory' | 'switching' | 'animating' | 'finished';

export function BattlePage() {
  const router = useRouter();
  const { gameState, endBattle, updateCurrentBattle, removeItemFromInventory, updatePlayer, addDefeatedTrainer } = useGame();
  const [battlePhase, setBattlePhase] = useState<BattlePhase>('selecting');
  const [battleMessage, setBattleMessage] = useState('Le combat commence !');
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [showInventory, setShowInventory] = useState(false);
  const [showPokemonSwitcher, setShowPokemonSwitcher] = useState(false);
  const [showAttackSelector, setShowAttackSelector] = useState(false);
  const [hasUsedItemOrSwitched, setHasUsedItemOrSwitched] = useState(false);
  const [playerMoves, setPlayerMoves] = useState<Move[]>([]);
  const [opponentMoves, setOpponentMoves] = useState<Move[]>([]);
  const [loadingMoves, setLoadingMoves] = useState(true);

  // Utiliser les factories pour créer les use cases et gateways
  const battleUseCase = UseCaseFactory.createBattleUseCase();
  const rewardsUseCase = UseCaseFactory.createRewardsUseCase();
  const moveGateway = GatewayFactory.getMoveGateway();

  // Garder une référence des IDs des Pokémon actuels pour détecter les changements
  const [currentPlayerPokemonId, setCurrentPlayerPokemonId] = useState<string | null>(null);
  const [currentOpponentPokemonId, setCurrentOpponentPokemonId] = useState<string | null>(null);

  // Charger les moves depuis l'API
  useEffect(() => {
    async function loadMoves() {
      if (!gameState.currentBattle) return;
      
      try {
        const playerPokemon = gameState.currentBattle.trainer1.team[0];
        const opponentPokemon = gameState.currentBattle.trainer2.team[0];
        
        // Charger les moves du joueur SEULEMENT si le Pokémon a changé
        if (playerPokemon.id !== currentPlayerPokemonId) {
          const playerMovesData = await moveGateway.getMovesByNames(playerPokemon.moves);
          // Restaurer les PP à leur maximum au début du combat
          const restoredPlayerMoves = playerMovesData.map(move => ({
            ...move,
            pp: move.maxPp
          }));
          setPlayerMoves(restoredPlayerMoves);
          setCurrentPlayerPokemonId(playerPokemon.id);
        }
        
        // Charger les moves de l'adversaire SEULEMENT si le Pokémon a changé
        if (opponentPokemon.id !== currentOpponentPokemonId) {
          const opponentMovesData = await moveGateway.getMovesByNames(opponentPokemon.moves);
          const restoredOpponentMoves = opponentMovesData.map(move => ({
            ...move,
            pp: move.maxPp
          }));
          setOpponentMoves(restoredOpponentMoves);
          setCurrentOpponentPokemonId(opponentPokemon.id);
        }
        
        setLoadingMoves(false);
      } catch (error) {
        console.error('Erreur lors du chargement des moves:', error);
        setLoadingMoves(false);
      }
    }
    
    loadMoves();
  }, [gameState.currentBattle?.trainer1.team[0]?.id, gameState.currentBattle?.trainer2.team[0]?.id]);

  // Calcul des pourcentages HP
  const playerHpPercentage = gameState.currentBattle?.trainer1.team[0]
    ? (gameState.currentBattle.trainer1.team[0].currentHp / gameState.currentBattle.trainer1.team[0].maxHp) * 100
    : 100;

  const opponentHpPercentage = gameState.currentBattle?.trainer2.team[0]
    ? (gameState.currentBattle.trainer2.team[0].currentHp / gameState.currentBattle.trainer2.team[0].maxHp) * 100
    : 100;

  // Gestion de la sélection d'une attaque
  const handleMoveSelect = async (move: Move) => {
    if (!gameState.currentBattle || !isPlayerTurn) return;

    // Vérifier si le move a encore des PP
    if (move.pp <= 0) {
      setBattleMessage('Cette attaque n\'a plus de PP !');
      setTimeout(() => setBattleMessage('À votre tour !'), 2000);
      return;
    }

    setBattlePhase('animating');
    setIsPlayerTurn(false);
    setShowAttackSelector(false);

    try {
      let playerPokemon = gameState.currentBattle.trainer1.team[0];
      let opponentPokemon = gameState.currentBattle.trainer2.team[0];

      // Vérifier si le joueur peut attaquer avec son statut
      const attackCheck = battleUseCase.canAttackWithStatus(playerPokemon);
      if (!attackCheck.canAttack) {
        setBattleMessage(attackCheck.message || `${playerPokemon.name} ne peut pas attaquer !`);
        
        // Mettre à jour le Pokémon si son statut a changé
        if (attackCheck.pokemon) {
          playerPokemon = attackCheck.pokemon;
          const updatedPlayerTeam = gameState.currentBattle.trainer1.team.map((p: Pokemon, index: number) =>
            index === 0 ? playerPokemon : p
          );
          updateCurrentBattle({
            ...gameState.currentBattle,
            trainer1: { ...gameState.currentBattle.trainer1, team: updatedPlayerTeam }
          });
        }
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Passer au tour de l'adversaire
        await handleOpponentTurn(gameState.currentBattle);
        return;
      }
      
      // Mettre à jour le Pokémon si son statut a changé (ex: fin de confusion)
      if (attackCheck.pokemon) {
        playerPokemon = attackCheck.pokemon;
      }

      // Réduire les PP du move utilisé
      const updatedPlayerMoves = playerMoves.map(m => 
        m.id === move.id ? battleUseCase.reducePP(m) : m
      );
      setPlayerMoves(updatedPlayerMoves);

      // Calculer les dégâts avec critique et efficacité
      const { damage, isCritical, effectiveness } = battleUseCase.calculateDamage(
        playerPokemon,
        opponentPokemon,
        move
      );

      // Appliquer les dégâts
      let newOpponentHp = Math.max(0, opponentPokemon.currentHp - damage);

      // Message de combat avec critique
      let criticalText = isCritical ? ' Coup critique !' : '';
      let effectivenessText = '';
      if (effectiveness > 1) effectivenessText = ' C\'est super efficace !';
      else if (effectiveness < 1 && effectiveness > 0) effectivenessText = ' Ce n\'est pas très efficace...';
      else if (effectiveness === 0) effectivenessText = ' Ça n\'a aucun effet...';

      setBattleMessage(`${playerPokemon.name} utilise ${move.name} !${criticalText}${effectivenessText}`);

      await new Promise(resolve => setTimeout(resolve, 1500));

      // Appliquer l'effet de l'attaque (statut, etc.)
      const effectResult = battleUseCase.applyMoveEffect(playerPokemon, opponentPokemon, move);
      if (effectResult.message) {
        opponentPokemon = effectResult.defender;
        setBattleMessage(effectResult.message);
        await new Promise(resolve => setTimeout(resolve, 1500));
      } else {
        opponentPokemon = effectResult.defender;
      }

      // Mettre à jour l'équipe adverse avec les HP du Pokémon actuel
      const updatedOpponentTeam = gameState.currentBattle.trainer2.team.map((p: Pokemon, index: number) =>
        index === 0 ? { ...opponentPokemon, currentHp: newOpponentHp } : p
      );

      // Créer un nouveau battle avec les HP mis à jour
      let updatedBattle = {
        ...gameState.currentBattle,
        trainer2: {
          ...gameState.currentBattle.trainer2,
          team: updatedOpponentTeam
        }
      };

      // Mettre à jour le battle dans le contexte
      updateCurrentBattle(updatedBattle);

      // Vérifier si le Pokémon adverse est K.O.
      if (newOpponentHp <= 0) {
        setBattleMessage(`${opponentPokemon.name} est K.O. !`);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Chercher le prochain Pokémon vivant dans TOUTE l'équipe mise à jour
        const nextOpponentPokemon = battleUseCase.getFirstAlivePokemon(
          updatedBattle.trainer2.team
        );
        
        if (nextOpponentPokemon) {
          // L'adversaire envoie son prochain Pokémon
          setBattleMessage(`${gameState.currentBattle.trainer2.name} envoie ${nextOpponentPokemon.name} !`);
          
          // Réorganiser l'équipe adverse pour mettre le nouveau Pokémon en premier
          const newOpponentTeam = [
            nextOpponentPokemon,
            ...updatedBattle.trainer2.team.filter(p => p.id !== nextOpponentPokemon.id)
          ];
          
          const battleWithNewOpponent = {
            ...updatedBattle,
            trainer2: {
              ...updatedBattle.trainer2,
              team: newOpponentTeam
            }
          };
          
          updateCurrentBattle(battleWithNewOpponent);
          
          // Charger les moves du nouveau Pokémon adverse avec PP restaurés
          const newOpponentMoves = await moveGateway.getMovesByNames(nextOpponentPokemon.moves);
          const restoredMoves = newOpponentMoves.map(move => ({
            ...move,
            pp: move.maxPp
          }));
          setOpponentMoves(restoredMoves);
          
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          setIsPlayerTurn(true);
          setBattlePhase('selecting');
          setBattleMessage('À votre tour !');
        } else {
          // Victoire ! Tous les Pokémon adverses sont K.O.
          setBattleMessage('Vous avez gagné le combat !');
          setTimeout(() => {
            setBattlePhase('finished');
            handleVictory();
          }, 2000);
        }
        return;
      }

      // Appliquer les dégâts de statut à l'adversaire
      const opponentStatusDamage = battleUseCase.applyStatusDamage(opponentPokemon);
      if (opponentStatusDamage.message) {
        opponentPokemon = opponentStatusDamage.pokemon;
        
        // Mettre à jour les HP de l'adversaire
        const statusDamageTeam = gameState.currentBattle.trainer2.team.map((p: Pokemon, index: number) =>
          index === 0 ? opponentPokemon : p
        );
        updatedBattle = {
          ...updatedBattle,
          trainer2: { ...updatedBattle.trainer2, team: statusDamageTeam }
        };
        updateCurrentBattle(updatedBattle);
        
        setBattleMessage(opponentStatusDamage.message);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Vérifier si l'adversaire est KO à cause du statut
        if (opponentPokemon.currentHp <= 0) {
          setBattleMessage(`${opponentPokemon.name} est K.O. à cause de son statut !`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const nextOpponentPokemon = battleUseCase.getFirstAlivePokemon(updatedBattle.trainer2.team);
          if (nextOpponentPokemon) {
            setBattleMessage(`${gameState.currentBattle.trainer2.name} envoie ${nextOpponentPokemon.name} !`);
            const newOpponentTeam = [
              nextOpponentPokemon,
              ...updatedBattle.trainer2.team.filter(p => p.id !== nextOpponentPokemon.id)
            ];
            const battleWithNewOpponent = {
              ...updatedBattle,
              trainer2: { ...updatedBattle.trainer2, team: newOpponentTeam }
            };
            updateCurrentBattle(battleWithNewOpponent);
            
            const newOpponentMoves = await moveGateway.getMovesByNames(nextOpponentPokemon.moves);
            const restoredMoves = newOpponentMoves.map(m => ({ ...m, pp: m.maxPp }));
            setOpponentMoves(restoredMoves);
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            setIsPlayerTurn(true);
            setBattlePhase('selecting');
            setBattleMessage('À votre tour !');
          } else {
            setBattleMessage('Vous avez gagné le combat !');
            setTimeout(() => {
              setBattlePhase('finished');
              handleVictory();
            }, 2000);
          }
          return;
        }
      }

      // Tour de l'adversaire
      await handleOpponentTurn(updatedBattle);

    } catch (error) {
      console.error('Erreur lors de l\'attaque:', error);
      setBattleMessage('Une erreur est survenue...');
      setTimeout(() => setBattlePhase('selecting'), 2000);
    }
  };

  // Tour de l'adversaire
  const handleOpponentTurn = async (currentBattle: any) => {
    if (!currentBattle) return;

    let opponentPokemon = currentBattle.trainer2.team[0];
    let playerPokemon = currentBattle.trainer1.team[0];

    // Vérifier si l'adversaire peut attaquer avec son statut
    const attackCheck = battleUseCase.canAttackWithStatus(opponentPokemon);
    if (!attackCheck.canAttack) {
      setBattleMessage(attackCheck.message || `${opponentPokemon.name} ne peut pas attaquer !`);
      
      // Mettre à jour le Pokémon si son statut a changé
      if (attackCheck.pokemon) {
        opponentPokemon = attackCheck.pokemon;
        const updatedOpponentTeam = currentBattle.trainer2.team.map((p: Pokemon, index: number) =>
          index === 0 ? opponentPokemon : p
        );
        const updatedBattle = {
          ...currentBattle,
          trainer2: { ...currentBattle.trainer2, team: updatedOpponentTeam }
        };
        updateCurrentBattle(updatedBattle);
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Appliquer les dégâts de statut au joueur en fin de tour
      const playerStatusDamage = battleUseCase.applyStatusDamage(playerPokemon);
      if (playerStatusDamage.message) {
        playerPokemon = playerStatusDamage.pokemon;
        const statusPlayerTeam = currentBattle.trainer1.team.map((p: Pokemon, index: number) =>
          index === 0 ? playerPokemon : p
        );
        updateCurrentBattle({
          ...currentBattle,
          trainer1: { ...currentBattle.trainer1, team: statusPlayerTeam }
        });
        
        setBattleMessage(playerStatusDamage.message);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (playerPokemon.currentHp <= 0) {
          setBattleMessage(`${playerPokemon.name} est K.O. à cause de son statut !`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const nextPlayerPokemon = battleUseCase.getFirstAlivePokemon(currentBattle.trainer1.team);
          if (nextPlayerPokemon) {
            setBattleMessage('Choisissez votre prochain Pokémon !');
            setShowPokemonSwitcher(true);
            setBattlePhase('switching');
          } else {
            setBattleMessage('Tous vos Pokémon sont K.O. ! Vous avez perdu...');
            setTimeout(() => {
              endBattle();
              router.push('/league');
            }, 3000);
          }
          return;
        }
      }
      
      setIsPlayerTurn(true);
      setHasUsedItemOrSwitched(false);
      setBattlePhase('selecting');
      setBattleMessage('À votre tour !');
      return;
    }
    
    // Mettre à jour le Pokémon si son statut a changé
    if (attackCheck.pokemon) {
      opponentPokemon = attackCheck.pokemon;
    }

    setBattleMessage(`${opponentPokemon.name} attaque !`);

    await new Promise(resolve => setTimeout(resolve, 1500));

    // Vérifier que les moves de l'adversaire sont chargés
    if (opponentMoves.length === 0) {
      console.error('Moves de l\'adversaire non chargés');
      setBattleMessage('Erreur: attaques non chargées');
      setTimeout(() => {
        setIsPlayerTurn(true);
        setBattlePhase('selecting');
      }, 2000);
      return;
    }

    // Sélectionner un move aléatoire parmi les moves de l'adversaire avec PP > 0
    const usableMoves = opponentMoves.filter(m => m.pp > 0);
    
    if (usableMoves.length === 0) {
      // Tous les moves sont à 0 PP, utiliser Lutte
      const struggleMove: Move = {
        id: 'struggle',
        name: 'Lutte',
        type: 'normal',
        power: 50,
        accuracy: 100,
        pp: 1,
        maxPp: 1,
        damageClass: 'physical',
        priority: 0
      };
      
      const { damage, isCritical, effectiveness } = battleUseCase.calculateDamage(
        opponentPokemon,
        playerPokemon,
        struggleMove
      );
      
      const newPlayerHp = Math.max(0, playerPokemon.currentHp - damage);
      
      // Mettre à jour l'équipe du joueur avec les HP du Pokémon actuel
      const updatedPlayerTeam = currentBattle.trainer1.team.map((p: Pokemon, index: number) =>
        index === 0 ? { ...playerPokemon, currentHp: newPlayerHp } : p
      );
      
      const updatedBattle = {
        ...currentBattle,
        trainer1: {
          ...currentBattle.trainer1,
          team: updatedPlayerTeam
        }
      };
      
      updateCurrentBattle(updatedBattle);
      setBattleMessage(`${opponentPokemon.name} utilise Lutte ! (Aucune attaque disponible)`);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsPlayerTurn(true);
      setHasUsedItemOrSwitched(false);
      setBattlePhase('selecting');
      setBattleMessage('À votre tour !');
      return;
    }
    
    const randomMoveIndex = Math.floor(Math.random() * usableMoves.length);
    const opponentMove = usableMoves[randomMoveIndex];
    
    // Réduire les PP du move de l'adversaire
    const updatedOpponentMoves = opponentMoves.map(m => 
      m.id === opponentMove.id ? battleUseCase.reducePP(m) : m
    );
    setOpponentMoves(updatedOpponentMoves);

    // Calculer les dégâts avec critique et efficacité
    const { damage, isCritical, effectiveness } = battleUseCase.calculateDamage(
      opponentPokemon,
      playerPokemon,
      opponentMove
    );

    // Appliquer les dégâts
    let newPlayerHp = Math.max(0, playerPokemon.currentHp - damage);

    // Message de combat avec critique
    let criticalText = isCritical ? ' Coup critique !' : '';
    let effectivenessText = '';
    if (effectiveness > 1) effectivenessText = ' C\'est super efficace !';
    else if (effectiveness < 1 && effectiveness > 0) effectivenessText = ' Ce n\'est pas très efficace...';
    else if (effectiveness === 0) effectivenessText = ' Ça n\'a aucun effet...';

    setBattleMessage(`${opponentPokemon.name} utilise ${opponentMove.name} !${criticalText}${effectivenessText}`);

    await new Promise(resolve => setTimeout(resolve, 1500));

    // Appliquer l'effet de l'attaque (statut, etc.)
    const effectResult = battleUseCase.applyMoveEffect(opponentPokemon, playerPokemon, opponentMove);
    if (effectResult.message) {
      playerPokemon = effectResult.defender;
      setBattleMessage(effectResult.message);
      await new Promise(resolve => setTimeout(resolve, 1500));
    } else {
      playerPokemon = effectResult.defender;
    }

    // Mettre à jour l'équipe du joueur avec les HP du Pokémon actuel
    const updatedPlayerTeam = currentBattle.trainer1.team.map((p: Pokemon, index: number) =>
      index === 0 ? { ...playerPokemon, currentHp: newPlayerHp } : p
    );

    // Créer un nouveau battle avec les HP mis à jour
    let updatedBattle = {
      ...currentBattle,
      trainer1: {
        ...currentBattle.trainer1,
        team: updatedPlayerTeam
      }
    };

    // Mettre à jour le battle dans le contexte
    updateCurrentBattle(updatedBattle);

    // Vérifier si le Pokémon du joueur est K.O.
    if (newPlayerHp <= 0) {
      setBattleMessage(`${playerPokemon.name} est K.O. !`);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Chercher le prochain Pokémon vivant dans TOUTE l'équipe mise à jour
      const nextPlayerPokemon = battleUseCase.getFirstAlivePokemon(
        updatedBattle.trainer1.team
      );
      
      if (nextPlayerPokemon) {
        // Demander au joueur de changer de Pokémon
        setBattleMessage('Choisissez votre prochain Pokémon !');
        setShowPokemonSwitcher(true);
        setBattlePhase('switching');
      } else {
        // Défaite ! Tous les Pokémon du joueur sont K.O.
        setBattleMessage('Tous vos Pokémon sont K.O. ! Vous avez perdu...');
        setTimeout(() => {
          endBattle();
          router.push('/league');
        }, 3000);
      }
      return;
    }

    // Appliquer les dégâts de statut au joueur
    const playerStatusDamage = battleUseCase.applyStatusDamage(playerPokemon);
    if (playerStatusDamage.message) {
      playerPokemon = playerStatusDamage.pokemon;
      
      // Mettre à jour les HP du joueur
      const statusPlayerTeam = updatedBattle.trainer1.team.map((p: Pokemon, index: number) =>
        index === 0 ? playerPokemon : p
      );
      updatedBattle = {
        ...updatedBattle,
        trainer1: { ...updatedBattle.trainer1, team: statusPlayerTeam }
      };
      updateCurrentBattle(updatedBattle);
      
      setBattleMessage(playerStatusDamage.message);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Vérifier si le joueur est KO à cause du statut
      if (playerPokemon.currentHp <= 0) {
        setBattleMessage(`${playerPokemon.name} est K.O. à cause de son statut !`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const nextPlayerPokemon = battleUseCase.getFirstAlivePokemon(updatedBattle.trainer1.team);
        if (nextPlayerPokemon) {
          setBattleMessage('Choisissez votre prochain Pokémon !');
          setShowPokemonSwitcher(true);
          setBattlePhase('switching');
        } else {
          setBattleMessage('Tous vos Pokémon sont K.O. ! Vous avez perdu...');
          setTimeout(() => {
            endBattle();
            router.push('/league');
          }, 3000);
        }
        return;
      }
    }

    // Retour au tour du joueur
    setIsPlayerTurn(true);
    setHasUsedItemOrSwitched(false);
    setBattlePhase('selecting');
    setBattleMessage('À votre tour !');
  };

  // Gestion de l'utilisation d'un item
  const handleItemUse = (item: Item) => {
    if (!gameState.currentBattle || hasUsedItemOrSwitched) return;

    setShowInventory(false);
    setHasUsedItemOrSwitched(true);

    const playerPokemon = gameState.currentBattle.trainer1.team[0];

    // Appliquer l'effet de l'item (simplifié pour l'exemple)
    if (item.type === 'healing') {
      const healAmount = item.effect;
      const newHp = Math.min(
        playerPokemon.maxHp,
        playerPokemon.currentHp + healAmount
      );

      // Créer un nouveau battle avec les HP mis à jour
      const updatedBattle = {
        ...gameState.currentBattle,
        trainer1: {
          ...gameState.currentBattle.trainer1,
          team: [
            { ...playerPokemon, currentHp: newHp },
            ...gameState.currentBattle.trainer1.team.slice(1)
          ]
        }
      };

      // Mettre à jour le battle dans le contexte
      updateCurrentBattle(updatedBattle);

      setBattleMessage(`${playerPokemon.name} récupère ${healAmount} PV grâce à ${item.name} !`);

      // Retirer l'item de l'inventaire
      removeItemFromInventory(item.id);
    } else {
      setBattleMessage(`Vous ne pouvez pas utiliser ${item.name} en combat !`);
      setHasUsedItemOrSwitched(false);
    }
  };

  // Gestion du changement de Pokémon
  const handlePokemonSwitch = async (pokemon: Pokemon) => {
    if (!gameState.currentBattle || hasUsedItemOrSwitched) return;

    setShowPokemonSwitcher(false);
    setHasUsedItemOrSwitched(true);

    // Charger les moves du nouveau Pokémon avec PP restaurés
    const newPokemonMoves = await moveGateway.getMovesByNames(pokemon.moves);
    const restoredMoves = newPokemonMoves.map(move => ({
      ...move,
      pp: move.maxPp
    }));
    setPlayerMoves(restoredMoves);

    // Réorganiser l'équipe pour mettre le nouveau Pokémon en position 0 (actif)
    const newTeam = [
      pokemon,
      ...gameState.currentBattle.trainer1.team.filter(p => p.id !== pokemon.id)
    ];

    const updatedBattle = {
      ...gameState.currentBattle,
      trainer1: {
        ...gameState.currentBattle.trainer1,
        team: newTeam
      }
    };

    // Mettre à jour le battle dans le contexte
    updateCurrentBattle(updatedBattle);

    setBattleMessage(`${gameState.player?.name} envoie ${pokemon.name} !`);
    
    // Si on était en phase de switching (Pokémon KO), lancer le tour de l'adversaire
    if (battlePhase === 'switching') {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setBattlePhase('animating');
      setIsPlayerTurn(false);
      await handleOpponentTurn(updatedBattle);
    }
  };

  // Gestion de la victoire
  const handleVictory = async () => {
    if (!gameState.currentBattle || !gameState.player) return;

    // Ajouter le trainer battu à la liste
    addDefeatedTrainer(gameState.currentBattle.trainer2.id);

    const victoryType: 'quick' | 'normal' | 'hard' = 'normal';

    // Sauvegarder uniquement le type de victoire (les récompenses seront générées dans la page rewards)
    (window as any).victoryType = victoryType;

    // NE PAS appeler endBattle() ici - la page rewards le fera
    // endBattle();
    
    router.push('/rewards');
  };

  // Vérifier que le combat est initialisé
  useEffect(() => {
    if (!gameState.currentBattle) {
      router.push('/league');
    }
  }, [gameState.currentBattle, router]);

  if (!gameState.currentBattle || loadingMoves) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-950 via-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"
          />
          <div className="pixel-text text-yellow-400 text-xl">
            {loadingMoves ? 'Chargement des attaques...' : 'Chargement du combat...'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-950 via-slate-950 to-slate-900 p-4">
      {/* Scanlines effect */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="h-full w-full bg-repeat" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)'
        }} />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="pixel-text text-yellow-400 text-2xl md:text-3xl mb-2">
            COMBAT POKÉMON
          </h1>
          <div className="pixel-border border-2 border-yellow-400 bg-slate-900/50 rounded-lg p-4 inline-block">
            <p className="pixel-text text-white">
              {gameState.player?.name} vs {gameState.currentBattle.trainer2.name}
            </p>
          </div>
        </motion.div>

        {/* Scène de combat */}
        <div className="mb-8">
          <BattleScene
            playerPokemon={gameState.currentBattle.trainer1.team[0]}
            opponentPokemon={gameState.currentBattle.trainer2.team[0]}
            playerTeam={gameState.currentBattle.trainer1.team}
            opponentTeam={gameState.currentBattle.trainer2.team}
            playerHpPercentage={playerHpPercentage}
            opponentHpPercentage={opponentHpPercentage}
            isPlayerTurn={isPlayerTurn}
            battleMessage={battleMessage}
          />
        </div>

        {/* Actions du joueur */}
        {isPlayerTurn && battlePhase === 'selecting' && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="space-y-4"
          >
            {/* Actions buttons - Compact grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAttackSelector(true)}
                className="pixel-border border-2 border-red-400 bg-red-900 hover:border-red-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] text-white rounded-lg px-4 py-3 transition-all"
              >
                <span className="pixel-text text-sm">⚔️ ATTAQUER</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowInventory(true)}
                disabled={hasUsedItemOrSwitched}
                className={`pixel-border border-2 rounded-lg px-4 py-3 transition-all ${
                  hasUsedItemOrSwitched
                    ? 'border-gray-600 bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'border-blue-400 bg-blue-900 hover:border-blue-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] text-white'
                }`}
              >
                <span className="pixel-text text-sm">📦 OBJET</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPokemonSwitcher(true)}
                disabled={hasUsedItemOrSwitched}
                className={`pixel-border border-2 rounded-lg px-4 py-3 transition-all ${
                  hasUsedItemOrSwitched
                    ? 'border-gray-600 bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'border-green-400 bg-green-900 hover:border-green-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] text-white'
                }`}
              >
                <span className="pixel-text text-sm">🔄 CHANGE</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/league')}
                className="pixel-border border-2 border-yellow-400 bg-yellow-900 hover:border-yellow-300 hover:shadow-[0_0_20px_rgba(250,204,21,0.3)] text-white rounded-lg px-4 py-3 transition-all"
              >
                <span className="pixel-text text-sm">🏃 FUIR</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Animation en cours */}
        {battlePhase === 'animating' && (
          <div className="text-center py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="pixel-text text-yellow-400 text-base">Combat en cours...</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AttackSelector
        moves={playerMoves}
        onMoveSelect={handleMoveSelect}
        onClose={() => setShowAttackSelector(false)}
        isOpen={showAttackSelector}
      />

      <Inventory
        items={gameState.player?.items || []}
        onItemUse={handleItemUse}
        onClose={() => setShowInventory(false)}
        isOpen={showInventory}
      />

      <PokemonSwitcher
        pokemon={gameState.player?.team || []}
        currentPokemon={gameState.currentBattle.trainer1.team[0]}
        onPokemonSelect={handlePokemonSwitch}
        onClose={() => setShowPokemonSwitcher(false)}
        isOpen={showPokemonSwitcher}
      />
    </div>
  );
}
