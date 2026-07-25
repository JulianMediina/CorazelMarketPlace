import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Product } from '../../../core/models/product.model';
import { AdminProductsService } from '../../../core/services/admin-products.service';
import { CatalogService } from '../../../core/services/catalog.service';
import { CopCurrencyPipe } from '../../../shared/pipes/cop-currency.pipe';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [RouterLink, MatTableModule, MatButtonModule, MatIconModule, CopCurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center justify-between">
      <h1 class="font-brand text-2xl text-corazel-borgona">Productos</h1>
      <a mat-flat-button color="primary" routerLink="/admin/productos/nuevo">Nuevo producto</a>
    </div>

    <div class="mt-6 overflow-x-auto rounded-xl bg-corazel-marfil shadow-sm">
      <table mat-table [dataSource]="productos()" class="w-full">
        <ng-container matColumnDef="nombre">
          <th mat-header-cell *matHeaderCellDef>Producto</th>
          <td mat-cell *matCellDef="let producto">{{ producto.nombre }}</td>
        </ng-container>

        <ng-container matColumnDef="categoria">
          <th mat-header-cell *matHeaderCellDef>Categoría</th>
          <td mat-cell *matCellDef="let producto">{{ producto.category.nombre }}</td>
        </ng-container>

        <ng-container matColumnDef="coleccion">
          <th mat-header-cell *matHeaderCellDef>Colección</th>
          <td mat-cell *matCellDef="let producto">{{ producto.collection.nombre }}</td>
        </ng-container>

        <ng-container matColumnDef="precio">
          <th mat-header-cell *matHeaderCellDef>Precio</th>
          <td mat-cell *matCellDef="let producto">{{ producto.precio | copCurrency }}</td>
        </ng-container>

        <ng-container matColumnDef="acciones">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let producto">
            <a mat-icon-button [routerLink]="['/admin/productos', producto.id]" aria-label="Editar">
              <mat-icon>edit</mat-icon>
            </a>
            <button mat-icon-button (click)="eliminar(producto)" aria-label="Eliminar">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="columnas"></tr>
        <tr mat-row *matRowDef="let row; columns: columnas"></tr>
      </table>

      @if (!loading() && productos().length === 0) {
        <p class="p-6 text-center text-sm text-corazel-borgona/60">Todavía no hay productos.</p>
      }
    </div>
  `,
})
export class ProductListPageComponent implements OnInit {
  private readonly catalogService = inject(CatalogService);
  private readonly adminProducts = inject(AdminProductsService);

  protected readonly columnas = ['nombre', 'categoria', 'coleccion', 'precio', 'acciones'];
  protected readonly productos = signal<Product[]>([]);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    this.fetch();
  }

  eliminar(producto: Product): void {
    if (!confirm(`¿Eliminar "${producto.nombre}"? Dejará de verse en la tienda.`)) {
      return;
    }
    this.adminProducts.remove(producto.id).subscribe(() => this.fetch());
  }

  private fetch(): void {
    this.loading.set(true);
    this.catalogService.getProducts({ limit: 60 }).subscribe((response) => {
      this.productos.set(response.items);
      this.loading.set(false);
    });
  }
}
