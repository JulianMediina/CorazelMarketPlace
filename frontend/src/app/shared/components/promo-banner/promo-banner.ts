import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Franja de anuncios/promociones. Contenido estático por ahora (no hay CMS de promociones
 * en el MVP) — si más adelante se necesita editar desde el admin, esto se conecta a un
 * endpoint nuevo sin tocar el resto de la home.
 */
@Component({
  selector: 'app-promo-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overflow-hidden bg-corazel-borgona py-2.5 text-corazel-marfil">
      <div class="flex animate-[scroll_22s_linear_infinite] gap-12 whitespace-nowrap text-xs font-medium tracking-wide uppercase">
        @for (item of [1, 2]; track item) {
          <span class="flex shrink-0 gap-12">
            <span>✦ Envíos a toda Colombia</span>
            <span>✦ Nueva colección Isis ya disponible</span>
            <span>✦ Compra 100% por WhatsApp, sin complicaciones</span>
            <span>✦ Empaque discreto en cada pedido</span>
          </span>
        }
      </div>
    </div>
  `,
  styles: `
    @keyframes scroll {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }
  `,
})
export class PromoBannerComponent {}
