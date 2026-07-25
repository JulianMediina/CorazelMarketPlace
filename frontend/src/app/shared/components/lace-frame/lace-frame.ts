import { ChangeDetectionStrategy, Component } from '@angular/core';

const DORADO = '%23C9A66B'; // #C9A66B URL-encoded para usar dentro del data URI del SVG

// Un solo "eslabón" de enredadera (tallo ondulado + una hoja + una flor pequeña) que se repite
// en mosaico vía CSS background-repeat, formando una guía floral continua a lo largo de cada
// borde de la pantalla — en vez de 4 acentos sueltos en las esquinas.
const VINE_TILE = `
<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44'>
  <path d='M0 22 C 8 10, 14 34, 22 22 C 30 10, 36 34, 44 22' stroke='${DORADO}' stroke-width='1.3' fill='none' stroke-linecap='round'/>
  <circle cx='11' cy='15' r='1.8' fill='${DORADO}'/>
  <ellipse cx='22' cy='22' rx='2.2' ry='3.6' fill='${DORADO}' opacity='0.85' transform='rotate(45 22 22)'/>
  <circle cx='33' cy='29' r='1.8' fill='${DORADO}'/>
</svg>`.replace(/\n\s*/g, '');

const VINE_URL = `url("data:image/svg+xml,${encodeURIComponent(VINE_TILE)}")`;

/**
 * Marco decorativo floral que recorre los cuatro bordes de la pantalla como una enredadera
 * continua (mosaico repetido de un solo motivo), inspirado en el "detalle dorado + flores
 * delicadas" del manual de identidad. Puramente decorativo: fixed y pointer-events-none, no
 * bloquea ningún tap/click. Visible en todos los tamaños de pantalla, incluido mobile.
 */
@Component({
  selector: 'app-lace-frame',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pointer-events-none fixed inset-0 z-40 opacity-25" aria-hidden="true">
      <div class="absolute inset-x-0 top-0 h-4" [style.background-image]="vineUrl" style="background-repeat: repeat-x"></div>
      <div class="absolute inset-x-0 bottom-0 h-4" [style.background-image]="vineUrl" style="background-repeat: repeat-x"></div>
      <div class="absolute inset-y-0 left-0 w-4" [style.background-image]="vineUrl" style="background-repeat: repeat-y"></div>
      <div class="absolute inset-y-0 right-0 w-4" [style.background-image]="vineUrl" style="background-repeat: repeat-y"></div>
    </div>
  `,
})
export class LaceFrameComponent {
  protected readonly vineUrl = VINE_URL;
}
