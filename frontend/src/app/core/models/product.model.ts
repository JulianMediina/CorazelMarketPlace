import { Category } from './category.model';
import { Collection } from './collection.model';

export type Talla = 'XS' | 'S' | 'M' | 'L' | 'XL';

export interface ProductVariant {
  id: string;
  talla: Talla;
  color: string;
  colorHex: string | null;
  stock: number;
  sku: string | null;
}

export interface ProductImage {
  id: string;
  url: string;
  publicId: string;
  orden: number;
}

export interface Product {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  precio: string; // Prisma Decimal serializa como string
  destacado: boolean;
  activo: boolean;
  category: Category;
  collection: Collection;
  imagenes: ProductImage[];
  variantes: ProductVariant[];
}

export interface PaginatedProducts {
  items: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductFilters {
  categoria?: string;
  coleccion?: string;
  talla?: Talla;
  color?: string;
  buscar?: string;
  destacado?: boolean;
  page?: number;
  limit?: number;
}
