import { Pipe, PipeTransform } from '@angular/core';

const formatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

/** Formatea un precio (string/number, ej. Decimal de Prisma serializado) como pesos colombianos. */
@Pipe({ name: 'copCurrency', standalone: true })
export class CopCurrencyPipe implements PipeTransform {
  transform(value: string | number | null | undefined): string {
    if (value === null || value === undefined) {
      return '';
    }
    return formatter.format(Number(value));
  }
}
