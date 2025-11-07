/**
 * Interface pour la journalisation et le débogage
 * Permet de logger des informations, erreurs, et warnings
 */
export interface ILogger {
  /**
   * Log une information
   */
  info(message: string, ...args: any[]): void;

  /**
   * Log une erreur
   */
  error(message: string, error?: Error, ...args: any[]): void;

  /**
   * Log un avertissement
   */
  warn(message: string, ...args: any[]): void;

  /**
   * Log une information de débogage
   */
  debug(message: string, ...args: any[]): void;
}
