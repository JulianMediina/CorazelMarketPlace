import { ChangeDetectionStrategy, Component } from '@angular/core';

// Sin codificar: encodeURIComponent() más abajo se encarga de todo el string de una sola
// pasada. Codificarlo a mano acá y volver a pasarlo por encodeURIComponent lo doble-codifica
// (# -> %23 -> %2523), lo que invalida el color y deja el stroke invisible (solo quedan
// visibles los círculos, que caen a su fill por defecto) — el bug de "solo se ven puntos".
const DORADO = '#C9A66B';
const TILE_WIDTH = 18;
const TILE_HEIGHT = 72;

// Una enredadera vertical angosta (tallo en "S" + una hoja + una flor pequeña) que se repite
// en mosaico vía CSS background-repeat-y a lo largo del lateral. El ancho del tile coincide
// con el ancho real de la franja en pantalla — si no coincide, el mosaico se recorta y solo
// se alcanzan a ver fragmentos sueltos (justo lo que pasaba con el diseño anterior).
const VINE_TILE = `
<svg xmlns='http://www.w3.org/2000/svg' width='${TILE_WIDTH}' height='${TILE_HEIGHT}' viewBox='0 0 ${TILE_WIDTH} ${TILE_HEIGHT}'>
  <path d='M9 0 C 2 12, 16 24, 9 36 C 2 48, 16 60, 9 72' stroke='${DORADO}' stroke-width='1.2' fill='none' stroke-linecap='round'/>
  <circle cx='4' cy='11' r='1.5' fill='${DORADO}'/>
  <ellipse cx='9' cy='36' rx='1.9' ry='3.1' fill='${DORADO}' opacity='0.85' transform='rotate(25 9 36)'/>
  <circle cx='14' cy='59' r='1.5' fill='${DORADO}'/>
</svg>`.replace(/\n\s*/g, '');

const VINE_URL = `url("data:image/svg+xml,${encodeURIComponent(VINE_TILE)}")`;

/**
 * Enredadera decorativa dorada en los laterales de la pantalla (no un marco completo — solo
 * izquierda/derecha), inspirada en el detalle floral del manual de identidad. Va acotada al
 * área de contenido (entre el header y el bottom-nav en mobile) para no superponerse con la
 * navegación. Puramente decorativo: pointer-events-none, no bloquea ningún tap/click.
 */
@Component({
  selector: 'app-lace-frame',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pointer-events-none fixed top-16 bottom-20 left-0 z-10 w-[18px] opacity-25 sm:bottom-0">
      <div class="h-full w-full" [style.background-image]="vineUrl" style="background-repeat: repeat-y"></div>
    </div>
    <div class="pointer-events-none fixed top-16 right-0 bottom-20 z-10 w-[18px] -scale-x-100 opacity-25 sm:bottom-0">
      <div class="h-full w-full" [style.background-image]="vineUrl" style="background-repeat: repeat-y"></div>
    </div>
  `,
})
export class LaceFrameComponent {
  protected readonly vineUrl = VINE_URL;
}
