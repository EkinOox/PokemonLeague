/**
 * Interface pour générer des nombres aléatoires
 * Permet de tester et mocker facilement la génération aléatoire
 */
export interface IRandomGenerator {
  /**
   * Génère un nombre aléatoire entre 0 (inclus) et 1 (exclus)
   */
  generate(): number;

  /**
   * Génère un entier aléatoire entre min (inclus) et max (inclus)
   */
  generateInRange(min: number, max: number): number;

  /**
   * Sélectionne un élément aléatoire dans un tableau
   */
  selectRandom<T>(array: T[]): T;

  /**
   * Mélange un tableau aléatoirement
   */
  shuffle<T>(array: T[]): T[];

  /**
   * Génère un booléen avec une probabilité donnée (0-1)
   */
  chance(probability: number): boolean;
}
