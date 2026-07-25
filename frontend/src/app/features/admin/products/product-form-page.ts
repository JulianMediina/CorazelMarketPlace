import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Category } from '../../../core/models/category.model';
import { Collection } from '../../../core/models/collection.model';
import { Talla } from '../../../core/models/product.model';
import { AdminProductsService } from '../../../core/services/admin-products.service';
import { CatalogService } from '../../../core/services/catalog.service';

const TALLAS: Talla[] = ['XS', 'S', 'M', 'L', 'XL'];

@Component({
  selector: 'app-product-form-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 class="font-brand text-2xl text-corazel-borgona">{{ editando() ? 'Editar producto' : 'Nuevo producto' }}</h1>

    <form class="mt-6 flex max-w-3xl flex-col gap-2" [formGroup]="form" (ngSubmit)="submit()">
      <mat-form-field appearance="outline">
        <mat-label>Nombre</mat-label>
        <input matInput formControlName="nombre" (blur)="autoSlug()" />
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Slug (URL)</mat-label>
        <input matInput formControlName="slug" />
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Descripción</mat-label>
        <textarea matInput formControlName="descripcion" rows="3"></textarea>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Precio (COP)</mat-label>
        <input matInput type="number" formControlName="precio" />
      </mat-form-field>

      <div class="flex gap-4">
        <mat-form-field appearance="outline" class="flex-1">
          <mat-label>Categoría</mat-label>
          <mat-select formControlName="categoryId">
            @for (categoria of categorias(); track categoria.id) {
              <mat-option [value]="categoria.id">{{ categoria.nombre }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="flex-1">
          <mat-label>Colección</mat-label>
          <mat-select formControlName="collectionId">
            @for (coleccion of colecciones(); track coleccion.id) {
              <mat-option [value]="coleccion.id">{{ coleccion.nombre }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </div>

      <div class="flex gap-6">
        <mat-checkbox formControlName="destacado">Destacado</mat-checkbox>
        <mat-checkbox formControlName="activo">Activo</mat-checkbox>
      </div>

      <!-- Imágenes -->
      <div class="mt-4">
        <p class="mb-2 text-sm font-semibold text-corazel-borgona">Imágenes</p>
        <div class="flex flex-wrap gap-3">
          @for (imagen of imagenes.controls; track $index) {
            <div class="relative h-24 w-24 overflow-hidden rounded-lg bg-corazel-rosa-pastel">
              <img [src]="imagen.value.url" class="h-full w-full object-cover" />
              <button
                type="button"
                class="absolute top-0.5 right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-corazel-borgona text-corazel-marfil"
                (click)="imagenes.removeAt($index)"
              >
                <mat-icon class="!text-base">close</mat-icon>
              </button>
            </div>
          }
          <label
            class="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-corazel-champagne text-corazel-borgona/50"
          >
            {{ subiendoImagen() ? '...' : '+' }}
            <input type="file" accept="image/*" class="hidden" (change)="onImagenSeleccionada($event)" />
          </label>
        </div>
      </div>

      <!-- Variantes: talla x color x stock -->
      <div class="mt-4">
        <div class="flex items-center justify-between">
          <p class="text-sm font-semibold text-corazel-borgona">Variantes (talla · color · stock)</p>
          <button mat-button type="button" (click)="agregarVariante()">+ Agregar variante</button>
        </div>

        <div class="mt-2 flex flex-col gap-2">
          @for (variante of variantes.controls; track $index) {
            <div class="flex items-center gap-2" [formGroup]="$any(variante)">
              <mat-form-field appearance="outline" class="w-24">
                <mat-label>Talla</mat-label>
                <mat-select formControlName="talla">
                  @for (talla of tallas; track talla) {
                    <mat-option [value]="talla">{{ talla }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="flex-1">
                <mat-label>Color</mat-label>
                <input matInput formControlName="color" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-24">
                <mat-label>Stock</mat-label>
                <input matInput type="number" formControlName="stock" />
              </mat-form-field>

              <button mat-icon-button type="button" (click)="variantes.removeAt($index)" aria-label="Quitar variante">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          }
          @if (variantes.length === 0) {
            <p class="text-xs text-corazel-borgona/50">Agrega al menos una variante (talla/color/stock).</p>
          }
        </div>
      </div>

      @if (error()) {
        <p class="mt-2 text-sm text-red-600">{{ error() }}</p>
      }

      <div class="mt-6 flex gap-3">
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || variantes.length === 0 || guardando()">
          {{ guardando() ? 'Guardando…' : 'Guardar' }}
        </button>
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
  protected readonly categorias = signal<Category[]>([]);
  protected readonly colecciones = signal<Collection[]>([]);
  protected readonly guardando = signal(false);
  protected readonly subiendoImagen = signal(false);
  protected readonly error = signal<string | null>(null);

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
