import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { Collection } from '../models/collection.model';
import { PaginatedProducts, Product, ProductFilters } from '../models/product.model';
import { ApiService } from './api.service';

/** Lecturas públicas de catálogo: categorías, colecciones y productos. */
@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly api = inject(ApiService);

  getCategories(): Observable<Category[]> {
    return this.api.get<Category[]>('categories');
  }

  getCollections(): Observable<Collection[]> {
    return this.api.get<Collection[]>('collections');
  }

  getProducts(filters: ProductFilters = {}): Observable<PaginatedProducts> {
    return this.api.get<PaginatedProducts>('products', { ...filters });
  }

  getProduct(idOrSlug: string): Observable<Product> {
    return this.api.get<Product>(`products/${idOrSlug}`);
  }
}
