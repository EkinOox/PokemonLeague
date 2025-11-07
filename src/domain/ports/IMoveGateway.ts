import { Move } from '@/domain/entities/Move';

/**
 * Interface pour récupérer les informations sur les attaques Pokémon
 * Port de sortie pour accéder aux données des moves depuis une source externe
 */
export interface IMoveGateway {
  /**
   * Récupère une attaque par son nom
   * @param moveName Le nom de l'attaque
   * @returns L'attaque trouvée
   */
  getMoveByName(moveName: string): Promise<Move>;

  /**
   * Récupère plusieurs attaques par leurs noms
   * @param moveNames Les noms des attaques
   * @returns Les attaques trouvées
   */
  getMovesByNames(moveNames: string[]): Promise<Move[]>;
}
