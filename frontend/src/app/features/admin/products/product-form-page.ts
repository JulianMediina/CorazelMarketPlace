import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Category } from '../../../core/models/category.model';
import { Collection } from '../../../core/models/collection.model';
import { Talla } from '../../../core/models/product.model';
import { AdminProductsService } from '../../../core/services/admin-products.service';
import { CatalogService } from '../../../core/services/catalog.service';
import { FIELD_INPUT_CLASSES, FIELD_LABEL_CLASSES } from '../../../shared/styles/form-field.styles';

const TALLAS: Talla[] = ['XS', 'S', 'M', 'L', 'XL'];

/** Colores frecuentes en lencería, sugeridos vía <datalist> para reducir tipeo y errores de captura. */
const COLORES_SUGERIDOS = [
  'Negro',
  'Blanco',
  'Rojo',
  'Rosa',
  'Rosa pastel',
  'Borgoña',
  'Beige',
  'Champagne',
  'Dorado',
  'Nude',
];

@Component({
  selector: 'app-product-form-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mb-6 flex items-center justify-between">
      <div>
        <a
          routerLink="/admin/productos"
          class="inline-flex items-center gap-1 text-xs font-medium text-corazel-borgona/60 hover:text-corazel-borgona"
        >
          <mat-icon class="!text-base">arrow_back</mat-icon>
          Productos
        </a>
        <h1 class="mt-1 font-brand text-2xl text-corazel-borgona">
          {{ editando() ? 'Editar producto' : 'Nuevo producto' }}
        </h1>
      </div>
    </div>

    <form
      class="flex max-w-3xl flex-col gap-6 rounded-3xl bg-corazel-marfil p-4 shadow-sm ring-1 ring-corazel-champagne/40 sm:gap-8 sm:p-8"
      [formGroup]="form"
      (ngSubmit)="submit()"
    >
      <!-- Información general -->
      <section class="flex flex-col gap-2">
        <h2 class="font-brand text-base text-corazel-borgona sm:text-lg">Información general</h2>

        <label class="flex flex-col gap-1">
          <span class="${FIELD_LABEL_CLASSES}">Nombre del producto</span>
          <input
            formControlName="nombre"
            (blur)="autoSlug()"
            placeholder="Ej. Body Aura encaje"
            class="${FIELD_INPUT_CLASSES}"
          />
        </label>

        @if (mostrarSlug()) {
          <label class="flex flex-col gap-1">
            <span class="${FIELD_LABEL_CLASSES}">URL (slug)</span>
            <input formControlName="slug" class="${FIELD_INPUT_CLASSES}" />
            <span class="text-xs text-corazel-borgona/40">Se genera sola desde el nombre; solo cámbiala si sabes lo que haces.</span>
          </label>
        } @else {
          <button
            type="button"
            class="-mt-1 mb-1 self-start truncate text-xs text-corazel-borgona/50 underline hover:text-corazel-borgona"
            (click)="mostrarSlug.set(true)"
          >
            URL: /producto/{{ form.controls.slug.value || '...' }} · editar
          </button>
        }

        <label class="flex flex-col gap-1">
          <span class="${FIELD_LABEL_CLASSES}">Descripción</span>
          <textarea
            formControlName="descripcion"
            rows="3"
            placeholder="Tela, ajuste, detalles..."
            class="${FIELD_INPUT_CLASSES} resize-none"
          ></textarea>
        </label>

        <label class="flex flex-col gap-1">
          <span class="${FIELD_LABEL_CLASSES}">Precio (COP)</span>
          <div class="relative">
            <span class="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm text-corazel-borgona/50">$</span>
            <input
              type="number"
              formControlName="precio"
              min="0"
              class="${FIELD_INPUT_CLASSES} pl-8"
            />
          </div>
        </label>

        <label class="flex flex-col gap-1">
          <span class="${FIELD_LABEL_CLASSES}">Categoría</span>
          <select formControlName="categoryId" class="${FIELD_INPUT_CLASSES}">
            <option value="" disabled>Selecciona una categoría</option>
            @for (categoria of categorias(); track categoria.id) {
              <option [value]="categoria.id">{{ categoria.nombre }}</option>
            }
          </select>
        </label>

        <label class="flex flex-col gap-1">
          <span class="${FIELD_LABEL_CLASSES}">Colección</span>
          <select formControlName="collectionId" class="${FIELD_INPUT_CLASSES}">
            <option value="" disabled>Selecciona una colección</option>
            @for (coleccion of colecciones(); track coleccion.id) {
              <option [value]="coleccion.id">{{ coleccion.nombre }}</option>
            }
          </select>
        </label>

        <div class="flex flex-col gap-2 pt-1">
          <label class="flex items-center gap-2 text-sm text-corazel-borgona">
            <input type="checkbox" formControlName="destacado" class="h-4 w-4 rounded accent-corazel-borgona" />
            Destacado en inicio
          </label>
          <label class="flex items-center gap-2 text-sm text-corazel-borgona">
            <input type="checkbox" formControlName="activo" class="h-4 w-4 rounded accent-corazel-borgona" />
            Visible en la tienda
          </label>
        </div>
      </section>

      <!-- Imágenes -->
      <section class="flex flex-col gap-2 border-t border-corazel-champagne/30 pt-5 sm:gap-3 sm:pt-6">
        <h2 class="font-brand text-base text-corazel-borgona sm:text-lg">Imágenes</h2>
        <div class="flex flex-wrap gap-3">
          @for (imagen of imagenes.controls; track $index) {
            <div class="relative h-24 w-24 overflow-hidden rounded-xl bg-corazel-rosa-pastel">
              <img [src]="imagen.value.url" class="h-full w-full object-cover" />
              <button
                type="button"
                class="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-corazel-borgona text-corazel-marfil"
                (click)="imagenes.removeAt($index)"
                aria-label="Quitar imagen"
              >
                <mat-icon class="!text-base">close</mat-icon>
              </button>
            </div>
          }
          <label
            class="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-corazel-champagne text-corazel-borgona/50 hover:border-corazel-borgona/50 hover:text-corazel-borgona"
          >
            @if (subiendoImagen()) {
              <span class="text-xs">Subiendo…</span>
            } @else {
              <mat-icon>add_photo_alternate</mat-icon>
              <span class="text-xs">Agregar</span>
            }
            <input type="file" accept="image/*" class="hidden" (change)="onImagenSeleccionada($event)" />
          </label>
        </div>
        <p class="text-xs text-corazel-borgona/50">La primera imagen es la que se muestra en el catálogo.</p>
      </section>

      <!-- Variantes -->
      <section class="flex flex-col gap-2 border-t border-corazel-champagne/30 pt-5 sm:gap-3 sm:pt-6">
        <div class="flex items-center justify-between">
          <h2 class="font-brand text-base text-corazel-borgona sm:text-lg">Tallas, colores y stock</h2>
          <button mat-stroked-button type="button" class="!rounded-full !px-3" (click)="agregarVariante()">
            <mat-icon>add</mat-icon>
            Agregar
          </button>
        </div>

        <div class="flex flex-col gap-3">
          @for (variante of variantes.controls; track $index) {
            <div
              class="relative flex flex-col gap-2 rounded-xl border border-corazel-champagne/50 p-3"
              [formGroup]="$any(variante)"
            >
              <button
                type="button"
                (click)="variantes.removeAt($index)"
                aria-label="Quitar variante"
                class="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full text-corazel-borgona/40 hover:bg-corazel-rosa-pastel hover:text-corazel-borgona"
              >
                <mat-icon class="!text-lg">close</mat-icon>
              </button>

              <label class="flex flex-col gap-1">
                <span class="${FIELD_LABEL_CLASSES}">Talla</span>
                <select formControlName="talla" class="${FIELD_INPUT_CLASSES}">
                  @for (talla of tallas; track talla) {
                    <option [value]="talla">{{ talla }}</option>
                  }
                </select>
              </label>

              <label class="flex flex-col gap-1">
                <span class="${FIELD_LABEL_CLASSES}">Color</span>
                <input
                  formControlName="color"
                  list="colores-sugeridos"
                  placeholder="Ej. Negro"
                  class="${FIELD_INPUT_CLASSES}"
                />
              </label>

              <label class="flex flex-col gap-1">
                <span class="${FIELD_LABEL_CLASSES}">Stock</span>
                <input formControlName="stock" type="number" min="0" placeholder="0" class="${FIELD_INPUT_CLASSES}" />
              </label>
            </div>
          }
          @if (variantes.length === 0) {
            <p class="text-xs text-corazel-borgona/50">Agrega al menos una combinación de talla, color y stock.</p>
          }
        </div>

        <datalist id="colores-sugeridos">
          @for (color of coloresSugeridos; track color) {
            <option [value]="color"></option>
          }
        </datalist>
      </section>

      @if (error()) {
        <p class="text-sm text-red-600">{{ error() }}</p>
      }

      <div class="flex items-center gap-3 border-t border-corazel-champagne/30 pt-5 sm:pt-6">
        <button
          mat-flat-button
          color="primary"
          type="submit"
          class="!h-12 !rounded-full !px-8"
          [disabled]="form.invalid || variantes.length === 0 || guardando()"
        >
          {{ guardando() ? 'Guardando…' : 'Guardar producto' }}
        </button>
        <a routerLink="/admin/productos" class="text-sm text-corazel-borgona/60 hover:text-corazel-borgona">Cancelar</a>
      </div>
    </form>
  `,
})
export class ProductFormPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalogService = inject(CatalogService);
  private readonly adminProducts = inject(AdminProductsService);

  protected readonly tallas = TALLAS;
  protected readonly coloresSugeridos = COLORES_SUGERIDOS;
  protected readonly categorias = signal<Category[]>([]);
  protected readonly colecciones = signal<Collection[]>([]);
  protected readonly guardando = signal(false);
  protected readonly subiendoImagen = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly mostrarSlug = signal(false);

  private productId: string | null = null;
  protected readonly editando = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    slug: ['', Validators.required],
    descripcion: ['', Validators.required],
    precio: [0, [Validators.required, Validators.min(0)]],
    categoryId: ['', Validators.required],
    collectionId: ['', Validators.required],
    destacado: [false],
    activo: [true],
    variantes: this.fb.array<ReturnType<typeof this.crearVarianteGroup>>([]),
    imagenes: this.fb.array<ReturnType<typeof this.crearImagenGroup>>([]),
  });

  get variantes(): FormArray {
    return this.form.controls.variantes;
  }

  get imagenes(): FormArray {
    return this.form.controls.imagenes;
  }

  ngOnInit(): void {
    this.catalogService.getCategories().subscribe((categorias) => this.categorias.set(categorias));
    this.catalogService.getCollections().subscribe((colecciones) => this.colecciones.set(colecciones));

    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.editando.set(true);
      this.catalogService.getProduct(this.productId).subscribe((producto) => {
        this.form.patchValue({
          nombre: producto.nombre,
          slug: producto.slug,
          descripcion: producto.descripcion,
          precio: Number(producto.precio),
          categoryId: producto.category.id,
          collectionId: producto.collection.id,
          destacado: producto.destacado,
          activo: producto.activo,
        });
        producto.variantes.forEach((variante) =>
          this.variantes.push(
            this.crearVarianteGroup({ talla: variante.talla, color: variante.color, stock: variante.stock }),
          ),
        );
        producto.imagenes.forEach((imagen) =>
          this.imagenes.push(this.crearImagenGroup({ url: imagen.url, publicId: imagen.publicId })),
        );
      });
    } else {
      this.agregarVariante();
    }
  }

  autoSlug(): void {
    const slugControl = this.form.controls.slug;
    if (slugControl.value) {
      return;
    }
    const nombre = this.form.controls.nombre.value;
    slugControl.setValue(
      nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
    );
  }

  agregarVariante(): void {
    this.variantes.push(this.crearVarianteGroup());
  }

  onImagenSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    this.subiendoImagen.set(true);
    this.adminProducts.uploadImage(file).subscribe({
      next: ({ url, publicId }) => {
        this.imagenes.push(this.crearImagenGroup({ url, publicId }));
        this.subiendoImagen.set(false);
      },
      error: () => {
        this.error.set('No se pudo subir la imagen.');
        this.subiendoImagen.set(false);
      },
    });
    input.value = '';
  }

  submit(): void {
    if (this.form.invalid || this.variantes.length === 0) {
      return;
    }
    this.guardando.set(true);
    this.error.set(null);

    const raw = this.form.getRawValue();
    const dto = {
      ...raw,
      variantes: raw.variantes.map((variante) => ({ ...variante, stock: Number(variante.stock) })),
    };

    const request = this.productId
      ? this.adminProducts.update(this.productId, dto)
      : this.adminProducts.create(dto);

    request.subscribe({
      next: () => void this.router.navigate(['/admin/productos']),
      error: () => {
        this.error.set('No se pudo guardar el producto. Revisa que el slug no esté repetido.');
        this.guardando.set(false);
      },
    });
  }

  private crearVarianteGroup(valor?: { talla: Talla; color: string; stock: number }) {
    return this.fb.nonNullable.group({
      talla: [valor?.talla ?? 'M', Validators.required],
      color: [valor?.color ?? '', Validators.required],
      stock: [valor?.stock ?? 0, [Validators.required, Validators.min(0)]],
    });
  }

  private crearImagenGroup(valor: { url: string; publicId: string }) {
    return this.fb.nonNullable.group({
      url: [valor.url, Validators.required],
      publicId: [valor.publicId, Validators.required],
    });
  }
}
