import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';
import { ApiService } from './api.service';

export interface ProductVariantInput {
  talla: string;
  color: string;
  colorHex?: string;
  stock: number;
  sku?: string;
}

export interface ProductImageInput {
  url: string;
  publicId: string;
  orden?: number;
}

export interface ProductInput {
  nombre: string;
  descripcion: string;
  precio: number;
  categoryId: string;
  collectionId: string;
  destacado?: boolean;
  activo?: boolean;
  variantes: ProductVariantInput[];
  imagenes?: ProductImageInput[];
}

interface ApiEnvelope<T> {
  success: true;
  data: T;
}

/** Operaciones de escritura sobre productos: requieren sesión de admin (ver authInterceptor). */
@Injectable({ providedIn: 'root' })
export class AdminProductsService {
  private readonly api = inject(ApiService);
  private readonly http = inject(HttpClient);

  create(dto: ProductInput): Observable<Product> {
    return this.api.post<Product>('products', dto);
  }

  update(id: string, dto: Partial<ProductInput>): Observable<Product> {
    return this.api.patch<Product>(`products/${id}`, dto);
  }

  remove(id: string): Observable<Product> {
    return this.api.delete<Product>(`products/${id}`);
  }

  uploadImage(file: File): Observable<{ url: string; publicId: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http
      .post<ApiEnvelope<{ url: string; publicId: string }>>(
        `${environment.apiUrl}/uploads/product-image`,
        formData,
      )
      .pipe(map((response) => response.data));
  }
}
