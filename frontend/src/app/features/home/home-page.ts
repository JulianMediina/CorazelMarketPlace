import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../core/services/catalog.service';
import { Collection } from '../../core/models/collection.model';
import { Product } from '../../core/models/product.model';
import { ButtonComponent } from '../../shared/components/button/button';
import { ProductCardComponent } from '../../shared/components/product-card/product-card';

const VALORES = [
  { titulo: 'Feminidad', descripcion: 'Cada prenda celebra la silueta y la piel que la lleva.' },
  { titulo: 'Elegancia', descripcion: 'Diseños delicados, nunca estridentes.' },
  { titulo: 'Confianza', descripcion: 'Lencería que se siente tan bien como se ve.' },
  { titulo: 'Amor propio', descripcion: 'Vestirse para una misma, antes que para nadie más.' },
];

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
          Corazel Lencería
        </p>
        <h1 class="mx-auto mt-3 max-w-xl font-brand text-4xl text-corazel-borgona sm:text-5xl">
          Realza tu cuerpo, celebra quién eres.
        </h1>
        <div class="mt-8">
          <app-button variant="primary" routerLink="/catalogo">Descubrir colección</app-button>
        </div>
      </div>
    </section>

    <!-- Promoción: banner tipo pieza gráfica, no una franja de texto corrida -->
    <section class="mx-auto max-w-5xl px-4 pt-10 sm:pt-14">
      <div class="relative overflow-hidden rounded-3xl bg-corazel-borgona px-6 py-10 text-center shadow-md sm:py-14">
        <img
          src="/logo-corazel.jpeg"
          alt=""
          class="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-10 mix-blend-overlay"
        />
        <div class="relative">
          <p class="font-body text-xs font-semibold tracking-[0.3em] text-corazel-dorado uppercase">Promoción</p>
          <p class="mx-auto mt-3 max-w-md font-brand text-2xl text-corazel-marfil sm:text-3xl">
            Nueva colección Isis ya disponible
          </p>
          <p class="mt-2 text-sm text-corazel-marfil/80">Envíos a toda Colombia · Compra 100% por WhatsApp</p>
          <a
            routerLink="/catalogo"
            class="mt-6 inline-block rounded-full border-2 border-corazel-marfil px-6 py-2.5 text-sm font-semibold tracking-wide text-corazel-marfil uppercase hover:bg-corazel-marfil hover:text-corazel-borgona"
          >
            Ver colección
          </a>
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

    <!-- Sobre Corazel: contenido de marca, ahora como sección del inicio en vez de página aparte -->
    <section class="bg-corazel-marfil px-4 py-14 sm:py-16">
      <div class="mx-auto max-w-2xl text-center">
        <p class="font-body text-xs font-semibold tracking-[0.2em] text-corazel-borgona/70 uppercase">
          Nuestra historia
        </p>
        <h2 class="mt-2 font-brand text-2xl text-corazel-borgona sm:text-3xl">Sobre Corazel</h2>
        <p class="mt-6 text-sm leading-relaxed text-corazel-borgona/80 sm:text-base">
          Corazel nació de una idea simple: la lencería no debería ser solo una prenda debajo de la ropa, sino
          un pequeño ritual de amor propio. Diseñamos cada colección pensando en mujeres reales — con curvas,
          historias y personalidades distintas — que merecen sentirse seguras, delicadas y poderosas al mismo
          tiempo. Cada pedido se confirma directo por WhatsApp, contigo, sin complicaciones.
        </p>
      </div>

      <div class="mx-auto mt-10 max-w-4xl">
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
          @for (valor of valores; track valor.titulo) {
            <div class="rounded-2xl bg-corazel-rosa-pastel/40 p-4 text-center">
              <p class="font-brand text-lg text-corazel-borgona">{{ valor.titulo }}</p>
              <p class="mt-1 text-xs text-corazel-borgona/70">{{ valor.descripcion }}</p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class HomePageComponent implements OnInit {
  private readonly catalogService = inject(CatalogService);

  protected readonly collections = signal<Collection[]>([]);
  protected readonly destacados = signal<Product[]>([]);
  protected readonly valores = VALORES;

  ngOnInit(): void {
    this.catalogService.getCollections().subscribe((collections) => this.collections.set(collections));
    this.catalogService
      .getProducts({ destacado: true, limit: 8 })
      .subscribe((response) => this.destacados.set(response.items));
  }
}
