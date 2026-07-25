import { Injectable, computed, signal } from '@angular/core';
import { CartItem } from '../models/cart-item.model';
import { Product, Talla } from '../models/product.model';

const STORAGE_KEY = 'corazel_cart';

function sameLine(a: CartItem, product: Product, talla: Talla, color: string): boolean {
  return a.product.id === product.id && a.talla === talla && a.color === color;
}

/** Carrito en memoria (signals) persistido en localStorage. No toca el backend: el MVP cierra la venta por WhatsApp. */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly items = signal<CartItem[]>(this.readStored());

  readonly cartItems = this.items.asReadonly();

  readonly totalItems = computed(() =>
    this.items().reduce((total, item) => total + item.cantidad, 0),
  );

  readonly totalPrice = computed(() =>
    this.items().reduce((total, item) => total + Number(item.product.precio) * item.cantidad, 0),
  );

  add(product: Product, talla: Talla, color: string, cantidad = 1): void {
    const current = this.items();
    const existing = current.find((item) => sameLine(item, product, talla, color));

    const next = existing
      ? current.map((item) =>
          sameLine(item, product, talla, color)
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item,
        )
      : [...current, { product, talla, color, cantidad }];

    this.persist(next);
  }

  updateQuantity(product: Product, talla: Talla, color: string, cantidad: number): void {
    if (cantidad <= 0) {
      this.remove(product, talla, color);
      return;
    }
    this.persist(
      this.items().map((item) =>
        sameLine(item, product, talla, color) ? { ...item, cantidad } : item,
      ),
    );
  }

  remove(product: Product, talla: Talla, color: string): void {
    this.persist(this.items().filter((item) => !sameLine(item, product, talla, color)));
  }

  clear(): void {
    this.persist([]);
  }

  private persist(items: CartItem[]): void {
    this.items.set(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  private readStored(): CartItem[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  }
}
