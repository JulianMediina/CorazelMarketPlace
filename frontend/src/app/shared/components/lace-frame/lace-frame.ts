import { ChangeDetectionStrategy, Component } from '@angular/core';

const PETALOS = [0, 72, 144, 216, 288];
const FLORES = [
  { cx: 24, cy: 10 },
  { cx: 44, cy: 32 },
];

/** Un solo motivo floral de esquina; se reutiliza 4 veces (espejado/rotado por CSS) en LaceFrameComponent. */
@Component({
  selector: 'app-corner-motif',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 120 120" fill="none" class="h-full w-full">
      <path
        d="M4 4 C 30 6, 20 34, 44 32 C 66 30, 58 6, 84 8"
        stroke="currentColor"
        stroke-width="1.4"
        stroke-linecap="round"
      />
      <path
        d="M4 4 C 8 26, 34 20, 32 44 C 30 64, 6 58, 8 84"
        stroke="currentColor"
        stroke-width="1.4"
        stroke-linecap="round"
      />
      @for (flor of flores; track flor.cx) {
        <g [attr.transform]="'translate(' + flor.cx + ',' + flor.cy + ')'">
          @for (angulo of petalos; track angulo) {
            <ellipse
              cx="0"
              cy="-5"
              rx="2.6"
              ry="4.6"
              fill="currentColor"
              opacity="0.85"
              [attr.transform]="'rotate(' + angulo + ')'"
            />
          }
          <circle cx="0" cy="0" r="2" fill="currentColor" />
        </g>
      }
      <ellipse cx="14" cy="46" rx="3" ry="6" fill="currentColor" opacity="0.7" transform="rotate(24 14 46)" />
      <ellipse cx="46" cy="14" rx="3" ry="6" fill="currentColor" opacity="0.7" transform="rotate(-24 46 14)" />
    </svg>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class CornerMotifComponent {
  protected readonly flores = FLORES;
  protected readonly petalos = PETALOS;
}

/**
 * Marco decorativo floral en las cuatro esquinas de la pantalla, inspirado en el "detalle
 * dorado + flores delicadas" del manual de identidad. Es puramente decorativo: fixed,
 * pointer-events-none y muy baja opacidad para no competir con el contenido ni estorbar la
 * lectura/scroll en mobile. Oculto en mobile (prioridad de la app) para no restar espacio útil.
 */
@Component({
  selector: 'app-lace-frame',
  standalone: true,
  imports: [CornerMotifComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pointer-events-none fixed inset-0 z-20 hidden sm:block" aria-hidden="true">
      <app-corner-motif class="absolute top-0 left-0 h-24 w-24 text-corazel-dorado opacity-25 sm:h-32 sm:w-32" />
      <app-corner-motif
        class="absolute top-0 right-0 h-24 w-24 -scale-x-100 text-corazel-dorado opacity-25 sm:h-32 sm:w-32"
      />
      <app-corner-motif
        class="absolute bottom-0 left-0 h-24 w-24 -scale-y-100 text-corazel-dorado opacity-25 sm:h-32 sm:w-32"
      />
      <app-corner-motif
        class="absolute right-0 bottom-0 h-24 w-24 -scale-100 text-corazel-dorado opacity-25 sm:h-32 sm:w-32"
      />
    </div>
  `,
})
export class LaceFrameComponent {}
