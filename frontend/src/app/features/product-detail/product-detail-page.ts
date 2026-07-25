import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product, Talla } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart.service';
import { CatalogService } from '../../core/services/catalog.service';
import { WhatsappService } from '../../core/services/whatsapp.service';
import { ButtonComponent } from '../../shared/components/button/button';
import { CollectionBadgeComponent } from '../../shared/components/collection-badge/collection-badge';
import { SizeSelectorComponent } from '../../shared/components/size-selector/size-selector';
import { WhatsappCtaComponent } from '../../shared/components/whatsapp-cta/whatsapp-cta';
import { CopCurrencyPipe } from '../../shared/pipes/cop-currency.pipe';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [
    ButtonComponent,
    CollectionBadgeComponent,
    SizeSelectorComponent,
    WhatsappCtaComponent,
    CopCurrencyPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (product(); as producto) {
      <div class="mx-auto max-w-5xl px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-10">
        <div>
          <div class="aspect-square w-full overflow-hidden rounded-2xl bg-corazel-rosa-pastel">
            @if (imagenActiva(); as imagen) {
              <img [src]="imagen.url" [alt]="producto.nombre" class="h-full w-full object-cover" />
            }
          </div>
          @if (producto.imagenes.length > 1) {
            <div class="mt-3 flex gap-2 overflow-x-auto">
              @for (imagen of producto.imagenes; track imagen.id) {
                <button
                  type="button"
                  (click)="imagenActivaId.set(imagen.id)"
                  class="h-16 w-16 shrink-0 overflow-hidden rounded-lg ring-2"
                  [class.ring-corazel-borgona]="imagen.id === imagenActivaId()"
                  [class.ring-transparent]="imagen.id !== imagenActivaId()"
                >
                  <img [src]="imagen.url" [alt]="producto.nombre" class="h-full w-full object-cover" />
                </button>
              }
            </div>
          }
        </div>

        <div class="mt-6 sm:mt-0">
          <app-collection-badge [nombre]="producto.collection.nombre" />
          <h1 class="mt-2 font-brand text-3xl text-corazel-borgona">{{ producto.nombre }}</h1>
          <p class="mt-1 text-xl font-semibold text-corazel-borgona">{{ producto.precio | copCurrency }}</p>
          <p class="mt-4 text-sm leading-relaxed text-corazel-borgona/80">{{ producto.descripcion }}</p>

          <div class="mt-6">
            <p class="mb-2 text-xs font-semibold tracking-wide text-corazel-borgona/70 uppercase">Talla</p>
            <app-size-selector
              [tallas]="tallasDisponibles()"
              [selected]="tallaSeleccionada()"
              (selectedChange)="onTallaChange($event)"
            />
          </div>

          @if (coloresDisponibles().length) {
            <div class="mt-5">
              <p class="mb-2 text-xs font-semibold tracking-wide text-corazel-borgona/70 uppercase">Color</p>
              <div class="flex flex-wrap gap-2">
                @for (color of coloresDisponibles(); track color) {
                  <button
                    type="button"
                    (click)="colorSeleccionado.set(color)"
                    class="rounded-full border-2 px-3 py-1.5 text-sm"
                    [class.border-corazel-borgona]="colorSeleccionado() === color"
                    [class.text-corazel-borgona]="true"
                    [class.border-corazel-champagne]="colorSeleccionado() !== color"
                  >
                    {{ color }}
                  </button>
                }
              </div>
            </div>
          }

          <div class="mt-8 flex flex-col gap-3">
            <app-button variant="primary" [fullWidth]="true" [disabled]="!puedeAgregar()" (clicked)="agregarAlCarrito()">
              {{ sinStock() ? 'Sin stock en esta combinación' : 'Agregar al carrito' }}
            </app-button>
            <app-whatsapp-cta [link]="linkConsulta()" label="Preguntar por WhatsApp" [fullWidth]="true" />
          </div>

          @if (agregado()) {
            <p class="mt-3 text-center text-sm font-medium text-corazel-borgona">Producto agregado al carrito.</p>
          }
        </div>
      </div>
    }
  `,
})
export class ProductDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly catalogService = inject(CatalogService);
  private readonly cartService = inject(CartService);
  private readonly whatsappService = inject(WhatsappService);

  protected readonly product = signal<Product | null>(null);
  protected readonly imagenActivaId = signal<string | null>(null);
  protected readonly tallaSeleccionada = signal<Talla | null>(null);
  protected readonly colorSeleccionado = signal<string | null>(null);
  protected readonly agregado = signal(false);

  protected readonly imagenActiva = computed(
    () => this.product()?.imagenes.find((imagen) => imagen.id === this.imagenActivaId()) ?? this.product()?.imagenes[0],
  );

  protected readonly tallasDisponibles = computed<Talla[]>(() => {
    const variantes = this.product()?.variantes ?? [];
    return [...new Set(variantes.map((variante) => variante.talla))];
  });

  protected readonly coloresDisponibles = computed<string[]>(() => {
    const talla = this.tallaSeleccionada();
    const variantes = this.product()?.variantes ?? [];
    const disponibles = talla ? variantes.filter((variante) => variante.talla === talla) : variantes;
    return [...new Set(disponibles.map((variante) => variante.color))];
  });

  protected readonly varianteSeleccionada = computed(() => {
    const talla = this.tallaSeleccionada();
    const color = this.colorSeleccionado();
    if (!talla || !color) {
      return null;
    }
    return this.product()?.variantes.find((variante) => variante.talla === talla && variante.color === color) ?? null;
  });

  protected readonly sinStock = computed(() => {
    const variante = this.varianteSeleccionada();
    return variante !== null && variante.stock <= 0;
  });

  protected readonly puedeAgregar = computed(() => {
    const variante = this.varianteSeleccionada();
    return variante !== null && variante.stock > 0;
  });

  protected readonly linkConsulta = computed(() =>
    this.whatsappService.buildProductInquiryLink(this.product()?.nombre ?? ''),
  );

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      return;
    }
    this.catalogService.getProduct(slug).subscribe((producto) => {
      this.product.set(producto);
      this.imagenActivaId.set(producto.imagenes[0]?.id ?? null);
    });
  }

  onTallaChange(talla: Talla): void {
    this.tallaSeleccionada.set(talla);
    this.colorSeleccionado.set(null);
  }

  agregarAlCarrito(): void {
    const producto = this.product();
    const talla = this.tallaSeleccionada();
    const color = this.colorSeleccionado();
    if (!producto || !talla || !color) {
      return;
    }
    this.cartService.add(producto, talla, color);
    this.agregado.set(true);
  }
}
