import { IDateProvider } from '../../domain/ports/IDateProvider';

/**
 * Implémentation de IDateProvider utilisant Date natif
 */
export class DateProvider implements IDateProvider {
  now(): number {
    return Date.now();
  }

  getCurrentDate(): Date {
    return new Date();
  }

  generateTimestamp(): string {
    return Date.now().toString();
  }
}
