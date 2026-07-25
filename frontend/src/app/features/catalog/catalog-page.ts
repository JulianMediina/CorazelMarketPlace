import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../core/models/category.model';
import { Collection } from '../../core/models/collection.model';
import { Product, Talla } from '../../core/models/product.model';
import { CatalogService } from '../../core/services/catalog.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';

const TALLAS: Talla[] = ['XS', 'S', 'M', 'L', 'XL'];

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [ProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-6xl px-4 py-6">
      <h1 class="font-brand text-3xl text-corazel-borgona">Catálogo</h1>

      <div class="mt-4 flex flex-col gap-3">
        <!-- Categoría: chips deslizables horizontalmente, cómodo para pulgar en mobile -->
        <div class="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          <button
            type="button"
            (click)="setCategoria(undefined)"
            class="shrink-0 rounded-full border px-4 py-1.5 text-sm whitespace-nowrap"
            [class.bg-corazel-borgona]="!categoriaSeleccionada()"
            [class.text-corazel-marfil]="!categoriaSeleccionada()"
            [class.border-corazel-borgona]="!categoriaSeleccionada()"
            [class.border-corazel-champagne]="!!categoriaSeleccionada()"
            [class.text-corazel-borgona]="!!categoriaSeleccionada()"
          >
            Todas
          </button>
          @for (categoria of categorias(); track categoria.id) {
            <button
              type="button"
              (click)="setCategoria(categoria.slug)"
              class="shrink-0 rounded-full border px-4 py-1.5 text-sm whitespace-nowrap"
              [class.bg-corazel-borgona]="categoriaSeleccionada() === categoria.slug"
              [class.text-corazel-marfil]="categoriaSeleccionada() === categoria.slug"
              [class.border-corazel-borgona]="categoriaSeleccionada() === categoria.slug"
              [class.border-corazel-champagne]="categoriaSeleccionada() !== categoria.slug"
              [class.text-corazel-borgona]="categoriaSeleccionada() !== categoria.slug"
            >
              {{ categoria.nombre }}
            </button>
          }
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <!-- Colección -->
          <select
            class="rounded-full border border-corazel-champagne px-3 py-1.5 text-sm text-corazel-borgona"
            [value]="coleccionSeleccionada() ?? ''"
            (change)="setColeccion($any($event.target).value || undefined)"
          >
            <option value="">Todas las colecciones</option>
            @for (coleccion of colecciones(); track coleccion.id) {
              <option [value]="coleccion.slug">{{ coleccion.nombre }}</option>
            }
          </select>

          <!-- Talla -->
          <div class="flex gap-1.5">
            @for (talla of tallas; track talla) {
              <button
                type="button"
                (click)="setTalla(talla)"
                class="h-8 min-w-8 rounded-full border text-xs font-semibold"
                [class.bg-corazel-borgona]="tallaSeleccionada() === talla"
                [class.text-corazel-marfil]="tallaSeleccionada() === talla"
                [class.border-corazel-borgona]="tallaSeleccionada() === talla"
                [class.border-corazel-champagne]="tallaSeleccionada() !== talla"
                [class.text-corazel-borgona]="tallaSeleccionada() !== talla"
              >
                {{ talla }}
              </button>
            }
          </div>
        </div>
      </div>

      @if (loading()) {
        <p class="mt-10 text-center text-sm text-corazel-borgona/60">Cargando productos…</p>
      } @else if (productos().length === 0) {
        <p class="mt-10 text-center text-sm text-corazel-borgona/60">
          No encontramos productos con esos filtros.
        </p>
      } @else {
        <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          @for (producto of productos(); track producto.id) {
            <app-product-card [product]="producto" />
          }
        </div>
      }
    </div>
  `,
})
export class CatalogPageComponent implements OnInit {
  private readonly catalogService = inject(CatalogService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly tallas = TALLAS;
  protected readonly categorias = signal<Category[]>([]);
  protected readonly colecciones = signal<Collection[]>([]);
  protected readonly productos = signal<Product[]>([]);
  protected readonly loading = signal(true);

  protected readonly categoriaSeleccionada = signal<string | undefined>(undefined);
  protected readonly coleccionSeleccionada = signal<string | undefined>(undefined);
  protected readonly tallaSeleccionada = signal<Talla | undefined>(undefined);

  ngOnInit(): void {
    this.catalogService.getCategories().subscribe((categorias) => this.categorias.set(categorias));
    this.catalogService.getCollections().subscribe((colecciones) => this.colecciones.set(colecciones));

    this.route.queryParamMap.subscribe((params) => {
      this.categoriaSeleccionada.set(params.get('categoria') ?? undefined);
      this.coleccionSeleccionada.set(params.get('coleccion') ?? undefined);
      this.tallaSeleccionada.set((params.get('talla') as Talla) ?? undefined);
      this.fetchProductos();
    });
  }

  setCategoria(slug: string | undefined): void {
    this.updateQueryParams({ categoria: slug ?? null });
  }

  setColeccion(slug: string | undefined): void {
    this.updateQueryParams({ coleccion: slug ?? null });
  }

  setTalla(talla: Talla): void {
    const next = this.tallaSeleccionada() === talla ? null : talla;
    this.updateQueryParams({ talla: next });
  }

  private updateQueryParams(params: Record<string, string | null>): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }

  private fetchProductos(): void {
    this.loading.set(true);
    this.catalogService
      .getProducts({
        categoria: this.categoriaSeleccionada(),
        coleccion: this.coleccionSeleccionada(),
        talla: this.tallaSeleccionada(),
      })
      .subscribe((response) => {
        this.productos.set(response.items);
        this.loading.set(false);
      });
  }
}
