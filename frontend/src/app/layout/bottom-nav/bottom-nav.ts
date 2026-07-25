import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

/** Navegación fija inferior, solo mobile (< sm). Es la navegación primaria dado que el tráfico mobile domina. */
@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav
      class="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-corazel-champagne/40 bg-corazel-marfil/95 py-2 backdrop-blur sm:hidden"
    >
      <a
        routerLink="/"
        routerLinkActive="text-corazel-borgona"
        [routerLinkActiveOptions]="{ exact: true }"
        class="flex flex-col items-center gap-0.5 px-4 py-1 text-[11px] font-medium text-corazel-borgona/50"
      >
        <span class="material-icons text-[22px]">home</span>
        Inicio
      </a>
      <a
        routerLink="/catalogo"
        routerLinkActive="text-corazel-borgona"
        class="flex flex-col items-center gap-0.5 px-4 py-1 text-[11px] font-medium text-corazel-borgona/50"
      >
        <span class="material-icons text-[22px]">grid_view</span>
        Catálogo
      </a>
      <a
        routerLink="/colecciones"
        routerLinkActive="text-corazel-borgona"
        class="flex flex-col items-center gap-0.5 px-4 py-1 text-[11px] font-medium text-corazel-borgona/50"
      >
        <span class="material-icons text-[22px]">favorite</span>
        Colecciones
      </a>
      <a
        routerLink="/carrito"
        routerLinkActive="text-corazel-borgona"
        class="relative flex flex-col items-center gap-0.5 px-4 py-1 text-[11px] font-medium text-corazel-borgona/50"
      >
        <span class="material-icons text-[22px]">shopping_bag</span>
        Carrito
        @if (cart.totalItems() > 0) {
          <span
            class="absolute top-0 right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-corazel-borgona px-1 text-[10px] font-semibold text-corazel-marfil"
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
}
