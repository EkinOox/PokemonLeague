// Export all port interfaces
export type { IPokemonRepository } from './IPokemonRepository';
export type { ITrainerRepository } from './ITrainerRepository';
export type { IBattleRepository } from './IBattleRepository';
export type { IBattleGateway } from './IBattleGateway';
export type { ILogger } from './ILogger';
export type { IRandomGenerator } from './IRandomGenerator';
export type { IMathService } from './IMathService';
export type { IDateProvider } from './IDateProvider';

// Export Gateway interfaces
export type { IPokemonGateway } from './IPokemonGateway';
export type { IMoveGateway } from './IMoveGateway';
export type { IItemGateway } from './IItemGateway';

// Export UseCase interfaces
export type { IBattleUseCase } from './IBattleUseCase';
export type { IUseItemUseCase } from './IUseItemUseCase';
export type { IRewardsUseCase, ItemReward, PokemonReward, RewardOptions } from './IRewardsUseCase';
export type { ILeagueUseCase } from './ILeagueUseCase';
export type { IGameInitializationUseCase, PokemonSet } from './IGameInitializationUseCase';
