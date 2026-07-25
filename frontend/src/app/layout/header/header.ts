import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { WhatsappService } from '../../core/services/whatsapp.service';

/** Header público (no admin). En mobile es compacto: logo + carrito; la navegación completa vive en el bottom-nav. */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header
      class="sticky top-0 z-30 border-b border-corazel-champagne/40 bg-corazel-marfil/95 backdrop-blur"
    >
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a routerLink="/" class="flex items-center gap-2 font-brand text-2xl tracking-wide text-corazel-borgona">
          <img src="/logo-corazel.jpeg" alt="" class="h-9 w-9 rounded-full object-cover" />
          Corazél
        </a>

        <nav class="hidden items-center gap-8 sm:flex">
          <a
            routerLink="/catalogo"
            routerLinkActive="text-corazel-borgona"
            class="font-body text-sm font-medium tracking-wide text-corazel-borgona/70 uppercase hover:text-corazel-borgona"
          >
            Catálogo
          </a>
          <a
            routerLink="/colecciones"
            routerLinkActive="text-corazel-borgona"
            class="font-body text-sm font-medium tracking-wide text-corazel-borgona/70 uppercase hover:text-corazel-borgona"
          >
            Colecciones
          </a>
        </nav>

        <div class="flex items-center gap-1">
          <a
            [href]="whatsappLink"
            target="_blank"
            rel="noopener"
            class="flex h-10 w-10 items-center justify-center rounded-full text-corazel-borgona hover:bg-corazel-rosa-pastel"
            aria-label="Escribir por WhatsApp"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5">
              <path
                d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.05-1.36A10 10 0 1 0 12 2Zm5.7 14.2c-.24.68-1.4 1.3-1.94 1.36-.5.06-1.1.08-1.78-.11a15.6 15.6 0 0 1-1.66-.6 12.4 12.4 0 0 1-4.9-4.3c-.72-1-1.2-2.16-1.34-2.53-.14-.37-1.1-2.63.26-3.85.34-.3.68-.36.9-.36h.32c.24 0 .5-.02.72.55.24.63.82 2.1.9 2.25.08.15.13.33.03.53-.1.2-.15.32-.3.5-.15.17-.31.38-.44.5-.15.15-.3.31-.13.6.17.3.76 1.24 1.63 2 1.12 1 2.06 1.32 2.36 1.47.3.15.48.13.66-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.66-.15.28.1 1.75.83 2.05 1 .3.15.5.22.57.35.08.13.08.73-.16 1.4Z"
              />
            </svg>
          </a>

          <a
            routerLink="/carrito"
            class="relative flex h-10 w-10 items-center justify-center rounded-full text-corazel-borgona hover:bg-corazel-rosa-pastel"
            aria-label="Carrito"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="h-6 w-6">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-2.293 2.293A1 1 0 0 0 5.414 17H17M17 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM9 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
              />
            </svg>
            @if (cart.totalItems() > 0) {
              <span
                class="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-corazel-borgona px-1 text-[11px] font-semibold text-corazel-marfil"
              >
                {{ cart.totalItems() }}
              </span>
            }
          </a>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  protected readonly cart = inject(CartService);
  private readonly whatsappService = inject(WhatsappService);

  protected readonly whatsappLink = this.whatsappService.buildGeneralInquiryLink();
}
