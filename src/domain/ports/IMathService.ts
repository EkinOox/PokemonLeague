/**
 * Interface pour les opérations mathématiques
 * Permet de tester et mocker facilement les calculs
 */
export interface IMathService {
  /**
   * Arrondit un nombre à l'entier inférieur
   */
  floor(value: number): number;

  /**
   * Arrondit un nombre à l'entier supérieur
   */
  ceil(value: number): number;

  /**
   * Arrondit un nombre à l'entier le plus proche
   */
  round(value: number): number;

  /**
   * Retourne la valeur absolue d'un nombre
   */
  abs(value: number): number;

  /**
   * Retourne le minimum entre plusieurs nombres
   */
  min(...values: number[]): number;

  /**
   * Retourne le maximum entre plusieurs nombres
   */
  max(...values: number[]): number;
}
