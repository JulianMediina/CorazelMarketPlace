import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { WhatsappService } from '../../core/services/whatsapp.service';
import { ButtonComponent } from '../../shared/components/button/button';
import { WhatsappCtaComponent } from '../../shared/components/whatsapp-cta/whatsapp-cta';
import { CopCurrencyPipe } from '../../shared/pipes/cop-currency.pipe';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [RouterLink, ButtonComponent, WhatsappCtaComponent, CopCurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-2xl px-4 py-8">
      <h1 class="font-brand text-3xl text-corazel-borgona">Tu carrito</h1>

      @if (cart.cartItems().length === 0) {
        <div class="mt-10 text-center">
          <p class="text-sm text-corazel-borgona/70">Todavía no has agregado productos.</p>
          <div class="mt-6 inline-block">
            <app-button variant="secondary" routerLink="/catalogo">Ir al catálogo</app-button>
          </div>
        </div>
      } @else {
        <div class="mt-6 divide-y divide-corazel-champagne/40">
          @for (item of cart.cartItems(); track item.product.id + item.talla + item.color) {
            <div class="flex gap-4 py-4">
              <div class="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-corazel-rosa-pastel">
                @if (item.product.imagenes[0]; as imagen) {
                  <img [src]="imagen.url" [alt]="item.product.nombre" class="h-full w-full object-cover" />
                }
              </div>

              <div class="flex-1">
                <p class="font-brand text-lg text-corazel-borgona">{{ item.product.nombre }}</p>
                <p class="text-xs text-corazel-borgona/60">Talla {{ item.talla }} · {{ item.color }}</p>
                <p class="mt-1 text-sm font-semibold text-corazel-borgona">
                  {{ item.product.precio | copCurrency }}
                </p>

                <div class="mt-2 flex items-center gap-3">
                  <div class="flex items-center rounded-full border border-corazel-champagne">
                    <button
                      type="button"
                      class="h-8 w-8 text-corazel-borgona"
                      (click)="cart.updateQuantity(item.product, item.talla, item.color, item.cantidad - 1)"
                    >
                      −
                    </button>
                    <span class="w-6 text-center text-sm">{{ item.cantidad }}</span>
                    <button
                      type="button"
                      class="h-8 w-8 text-corazel-borgona"
                      (click)="cart.updateQuantity(item.product, item.talla, item.color, item.cantidad + 1)"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    class="text-xs text-corazel-borgona/60 underline"
                    (click)="cart.remove(item.product, item.talla, item.color)"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            </div>
          }
        </div>

        <div class="mt-6 flex items-center justify-between border-t border-corazel-champagne/40 pt-4">
          <span class="text-sm font-medium text-corazel-borgona/70">Total</span>
          <span class="text-xl font-semibold text-corazel-borgona">{{ cart.totalPrice() | copCurrency }}</span>
        </div>

        <div class="mt-6">
          <app-whatsapp-cta [link]="linkPedido()" label="Finalizar pedido por WhatsApp" [fullWidth]="true" />
          <p class="mt-2 text-center text-xs text-corazel-borgona/50">
            Te atenderemos por WhatsApp para confirmar disponibilidad, talla y forma de pago.
          </p>
        </div>
      }
    </div>
  `,
})
export class CartPageComponent {
  protected readonly cart = inject(CartService);
  private readonly whatsappService = inject(WhatsappService);

  protected readonly linkPedido = computed(() => this.whatsappService.buildCartMessageLink(this.cart.cartItems()));
}
