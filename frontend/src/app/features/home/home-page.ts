import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../core/services/catalog.service';
import { Collection } from '../../core/models/collection.model';
import { Product } from '../../core/models/product.model';
import { ButtonComponent } from '../../shared/components/button/button';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, ButtonComponent, ProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="relative overflow-hidden bg-corazel-rosa-pastel/50 px-4 py-16 text-center sm:py-24">
      <img
        src="/logo-corazel.jpeg"
        alt=""
        class="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10 mix-blend-multiply"
      />
      <div class="relative">
        <p class="font-body text-xs font-semibold tracking-[0.2em] text-corazel-borgona/70 uppercase">
          Corazél Lencería
        </p>
        <h1 class="mx-auto mt-3 max-w-xl font-brand text-4xl text-corazel-borgona sm:text-5xl">
          Realza tu cuerpo, celebra quién eres.
        </h1>
        <div class="mt-8">
          <app-button variant="primary" routerLink="/catalogo">Descubrir colección</app-button>
        </div>
      </div>
    </section>

    @if (collections().length) {
      <section class="mx-auto max-w-6xl px-4 py-14">
        <h2 class="text-center font-brand text-2xl text-corazel-borgona">Nuestras colecciones</h2>
        <div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          @for (coleccion of collections(); track coleccion.id) {
            <a
              [routerLink]="['/catalogo']"
              [queryParams]="{ coleccion: coleccion.slug }"
              class="group block overflow-hidden rounded-2xl bg-corazel-rosa-pastel p-6 text-center transition-shadow hover:shadow-md"
            >
              <p class="font-brand text-xl text-corazel-borgona">{{ coleccion.nombre }}</p>
              @if (coleccion.esencia) {
                <p class="mt-1 text-xs text-corazel-borgona/70">{{ coleccion.esencia }}</p>
              }
            </a>
          }
        </div>
      </section>
    }

    @if (destacados().length) {
      <section class="mx-auto max-w-6xl px-4 py-14">
        <h2 class="text-center font-brand text-2xl text-corazel-borgona">Destacados</h2>
        <div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          @for (producto of destacados(); track producto.id) {
            <app-product-card [product]="producto" />
          }
        </div>
      </section>
    }
  `,
})
export class HomePageComponent implements OnInit {
  private readonly catalogService = inject(CatalogService);

  protected readonly collections = signal<Collection[]>([]);
  protected readonly destacados = signal<Product[]>([]);

  ngOnInit(): void {
    this.catalogService.getCollections().subscribe((collections) => this.collections.set(collections));
    this.catalogService
      .getProducts({ destacado: true, limit: 8 })
      .subscribe((response) => this.destacados.set(response.items));
  }
}
