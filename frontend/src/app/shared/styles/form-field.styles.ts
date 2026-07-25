/**
 * Estilos compartidos para inputs/select/textarea nativos del panel admin.
 *
 * No usamos `mat-form-field` (appearance="outline") aquí: su "notched outline" choca con
 * el preflight de Tailwind (que resetea `border-width`/`border-style` globalmente) y el
 * campo termina viéndose partido en dos cajas — la etiqueta en una y el input vacío en
 * otra. Un input nativo estilado con Tailwind evita ese conflicto y da control total del
 * ancho (100% del contenedor, sin proporciones raras).
 */
export const FIELD_LABEL_CLASSES = 'block text-xs font-medium text-corazel-borgona/60';

export const FIELD_INPUT_CLASSES =
  'w-full rounded-xl border border-corazel-champagne bg-transparent px-4 py-3 text-sm text-corazel-borgona placeholder:text-corazel-borgona/40 focus:border-corazel-borgona focus:outline-none focus:ring-1 focus:ring-corazel-borgona/20';
