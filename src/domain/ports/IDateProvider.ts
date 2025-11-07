/**
 * Interface pour la gestion des dates et du temps
 * Permet de tester et mocker facilement les dates
 */
export interface IDateProvider {
  /**
   * Retourne la date/heure actuelle en millisecondes
   */
  now(): number;

  /**
   * Retourne la date/heure actuelle comme objet Date
   */
  getCurrentDate(): Date;

  /**
   * Génère un timestamp unique pour les IDs
   */
  generateTimestamp(): string;
}
