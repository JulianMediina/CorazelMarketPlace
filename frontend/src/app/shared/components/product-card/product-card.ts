import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { CopCurrencyPipe } from '../../pipes/cop-currency.pipe';
import { CollectionBadgeComponent } from '../collection-badge/collection-badge';

/** Tarjeta de producto reutilizada en catálogo, colección y búsqueda. Tap target grande para mobile. */
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CopCurrencyPipe, CollectionBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a
      [routerLink]="['/producto', product.slug]"
      class="group block overflow-hidden rounded-2xl bg-corazel-marfil shadow-sm ring-1 ring-corazel-champagne/40 transition-shadow hover:shadow-md"
    >
      <div class="aspect-[3/4] w-full overflow-hidden bg-corazel-rosa-pastel">
        @if (product.imagenes[0]; as imagen) {
          <img
            [src]="imagen.url"
            [alt]="product.nombre"
            loading="lazy"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        }
      </div>

      <div class="space-y-1.5 p-3">
        <app-collection-badge [nombre]="product.collection.nombre" />
        <h3 class="truncate font-brand text-lg text-corazel-borgona">{{ product.nombre }}</h3>
        <p class="text-sm font-semibold text-corazel-borgona">
          {{ product.precio | copCurrency }}
        </p>
      </div>
    </a>
  `,
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
}
