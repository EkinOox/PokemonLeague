import { Item } from '@/domain/entities/Item';

/**
 * Interface pour récupérer les objets du jeu
 * Port de sortie pour accéder aux données des items
 */
export interface IItemGateway {
  /**
   * Récupère des objets aléatoires
   * @param count Le nombre d'objets à récupérer
   * @returns Les objets générés aléatoirement
   */
  getRandomItems(count: number): Promise<Item[]>;

  /**
   * Récupère un objet par son ID
   * @param id L'identifiant de l'objet
   * @returns L'objet trouvé ou null si non trouvé
   */
  getItem(id: string): Promise<Item | null>;
}
