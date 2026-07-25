import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { WhatsappService } from '../../core/services/whatsapp.service';

const ITEM_CLASSES =
  'flex flex-col items-center gap-0.5 rounded-2xl px-3 py-1.5 text-[11px] font-medium text-corazel-borgona/50 transition-colors';
const ITEM_ACTIVE_CLASSES = 'bg-corazel-rosa-pastel text-corazel-borgona shadow-sm shadow-corazel-borgona/10';

/**
 * Navegación fija inferior, solo mobile (< sm). Es la navegación primaria dado que el
 * tráfico mobile domina. `min-h-dvh` en el shell padre evita el bug clásico de iOS Safari
 * donde un elemento `fixed` dentro de un contenedor `100vh` "flota" a mitad de pantalla.
 */
@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav
      class="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-corazel-champagne/40 bg-corazel-marfil/95 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur sm:hidden"
    >
      <a
        routerLink="/"
        routerLinkActive="${ITEM_ACTIVE_CLASSES}"
        [routerLinkActiveOptions]="{ exact: true }"
        class="${ITEM_CLASSES}"
      >
        <span class="material-icons text-[22px]">home</span>
        Inicio
      </a>
      <a routerLink="/catalogo" routerLinkActive="${ITEM_ACTIVE_CLASSES}" class="${ITEM_CLASSES}">
        <span class="material-icons text-[22px]">grid_view</span>
        Catálogo
      </a>
      <a routerLink="/colecciones" routerLinkActive="${ITEM_ACTIVE_CLASSES}" class="${ITEM_CLASSES}">
        <span class="material-icons text-[22px]">favorite</span>
        Colecciones
      </a>
      <a [href]="whatsappLink" target="_blank" rel="noopener" class="${ITEM_CLASSES}">
        <svg viewBox="0 0 24 24" fill="currentColor" class="h-[22px] w-[22px]">
          <path
            d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.05-1.36A10 10 0 1 0 12 2Zm5.7 14.2c-.24.68-1.4 1.3-1.94 1.36-.5.06-1.1.08-1.78-.11a15.6 15.6 0 0 1-1.66-.6 12.4 12.4 0 0 1-4.9-4.3c-.72-1-1.2-2.16-1.34-2.53-.14-.37-1.1-2.63.26-3.85.34-.3.68-.36.9-.36h.32c.24 0 .5-.02.72.55.24.63.82 2.1.9 2.25.08.15.13.33.03.53-.1.2-.15.32-.3.5-.15.17-.31.38-.44.5-.15.15-.3.31-.13.6.17.3.76 1.24 1.63 2 1.12 1 2.06 1.32 2.36 1.47.3.15.48.13.66-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.66-.15.28.1 1.75.83 2.05 1 .3.15.5.22.57.35.08.13.08.73-.16 1.4Z"
          />
        </svg>
        WhatsApp
      </a>
      <a routerLink="/carrito" routerLinkActive="${ITEM_ACTIVE_CLASSES}" class="relative ${ITEM_CLASSES}">
        <span class="material-icons text-[22px]">shopping_bag</span>
        Carrito
        @if (cart.totalItems() > 0) {
          <span
            class="absolute top-0 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-corazel-borgona px-1 text-[10px] font-semibold text-corazel-marfil"
          >
            {{ cart.totalItems() }}
          </span>
        }
      </a>
    </nav>
  `,
})
export class BottomNavComponent {
  protected readonly cart = inject(CartService);
  private readonly whatsappService = inject(WhatsappService);

  protected readonly whatsappLink = this.whatsappService.buildGeneralInquiryLink();
}
