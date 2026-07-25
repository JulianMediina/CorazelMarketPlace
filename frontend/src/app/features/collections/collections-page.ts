import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Collection } from '../../core/models/collection.model';
import { CatalogService } from '../../core/services/catalog.service';

@Component({
  selector: 'app-collections-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-4xl px-4 py-10 text-center">
      <h1 class="font-brand text-3xl text-corazel-borgona">Colecciones</h1>
      <p class="mt-2 text-sm text-corazel-borgona/70">
        Cada colección de Corazél tiene su propia esencia. Descubre la tuya.
      </p>

      <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        @for (coleccion of colecciones(); track coleccion.id) {
          <a
            [routerLink]="['/catalogo']"
            [queryParams]="{ coleccion: coleccion.slug }"
            class="group block overflow-hidden rounded-3xl bg-corazel-rosa-pastel p-10 text-center transition-shadow hover:shadow-md"
          >
            <p class="font-brand text-3xl text-corazel-borgona">{{ coleccion.nombre }}</p>
            @if (coleccion.esencia) {
              <p class="mt-3 text-sm text-corazel-borgona/70">{{ coleccion.esencia }}</p>
            }
          </a>
        }
      </div>
    </div>
  `,
})
export class CollectionsPageComponent implements OnInit {
  private readonly catalogService = inject(CatalogService);
  protected readonly colecciones = signal<Collection[]>([]);

  ngOnInit(): void {
    this.catalogService.getCollections().subscribe((colecciones) => this.colecciones.set(colecciones));
  }
}
