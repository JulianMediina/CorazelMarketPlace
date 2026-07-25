import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CartItem } from '../models/cart-item.model';

/**
 * Genera el link de WhatsApp que reemplaza el checkout en el MVP (ver .claude/CLAUDE.md).
 * No hay pasarela de pago: el pedido se cierra por chat con un mensaje prellenado.
 */
@Injectable({ providedIn: 'root' })
export class WhatsappService {
  buildCartMessageLink(items: CartItem[]): string {
    const lineas = items.map(
      (item) =>
        `• ${item.product.nombre} — Talla ${item.talla}, Color ${item.color} x${item.cantidad}`,
    );
    const mensaje = [
      'Hola Corazél, quiero hacer este pedido:',
      ...lineas,
      '',
      '¿Me ayudan a confirmar disponibilidad y el total?',
    ].join('\n');

    return this.buildLink(mensaje);
  }

  buildProductInquiryLink(nombreProducto: string): string {
    const mensaje = `Hola Corazél, quiero más información sobre "${nombreProducto}".`;
    return this.buildLink(mensaje);
  }

  /** Link genérico para el punto de entrada persistente (header/bottom-nav), sin producto en contexto. */
  buildGeneralInquiryLink(): string {
    return this.buildLink('Hola Corazél, quiero más información sobre sus productos.');
  }

  private buildLink(mensaje: string): string {
    const numero = environment.whatsappSalesNumber;
    return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  }
}
