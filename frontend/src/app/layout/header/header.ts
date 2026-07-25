import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

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
    </header>
  `,
})
export class HeaderComponent {
  protected readonly cart = inject(CartService);
}
