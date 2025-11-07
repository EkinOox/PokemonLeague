/**
 * Gateway Factory - Centralise l'instanciation des gateways
 * 
 * Les gateways sont responsables de la communication avec les APIs externes.
 * Ce factory permet de centraliser leur création et facilite les tests.
 */

import { PokemonAPIGateway } from '@/adapters/gateways/PokemonAPIGateway';
import { PokeAPIMoveGateway } from '@/adapters/gateways/MoveAPIGateway';
import { ItemGateway } from '@/adapters/gateways/ItemGateway';
import { ServiceFactory } from './ServiceFactory';

/**
 * Factory pour créer les gateways
 */
export class GatewayFactory {
  private static pokemonGatewayInstance: PokemonAPIGateway | null = null;
  private static moveGatewayInstance: PokeAPIMoveGateway | null = null;
  private static itemGatewayInstance: ItemGateway | null = null;

  /**
   * Retourne une instance singleton du Pokemon Gateway
   */
  static getPokemonGateway(): PokemonAPIGateway {
    if (!this.pokemonGatewayInstance) {
      this.pokemonGatewayInstance = new PokemonAPIGateway();
    }
    return this.pokemonGatewayInstance;
  }

  /**
   * Retourne une instance singleton du Move Gateway
   */
  static getMoveGateway(): PokeAPIMoveGateway {
    if (!this.moveGatewayInstance) {
      this.moveGatewayInstance = new PokeAPIMoveGateway();
    }
    return this.moveGatewayInstance;
  }

  /**
   * Retourne une instance singleton de l'Item Gateway
   */
  static getItemGateway(): ItemGateway {
    if (!this.itemGatewayInstance) {
      // ItemGateway nécessite un RandomGenerator
      this.itemGatewayInstance = new ItemGateway(ServiceFactory.getRandomGenerator());
    }
    return this.itemGatewayInstance;
  }

  /**
   * Réinitialise toutes les instances (utile pour les tests)
   */
  static reset(): void {
    this.pokemonGatewayInstance = null;
    this.moveGatewayInstance = null;
    this.itemGatewayInstance = null;
  }

  /**
   * Permet d'injecter des mocks pour les tests
   */
  static setPokemonGateway(mock: PokemonAPIGateway): void {
    this.pokemonGatewayInstance = mock;
  }

  static setMoveGateway(mock: PokeAPIMoveGateway): void {
    this.moveGatewayInstance = mock;
  }

  static setItemGateway(mock: ItemGateway): void {
    this.itemGatewayInstance = mock;
  }
}
