import { Product, Talla } from './product.model';

export interface CartItem {
  product: Product;
  talla: Talla;
  color: string;
  cantidad: number;
}
