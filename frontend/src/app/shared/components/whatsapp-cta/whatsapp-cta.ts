import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * CTA de WhatsApp: reemplaza el checkout con pago en el MVP (ver .claude/CLAUDE.md).
 * Se usa en línea dentro del contenido (buy-box del producto, resumen del carrito),
 * nunca como barra fija: eso chocaría con el bottom-nav mobile global.
 */
@Component({
  selector: 'app-whatsapp-cta',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a [href]="link" target="_blank" rel="noopener" class="block" [class.w-full]="fullWidth">
      <span
        class="flex items-center justify-center gap-2 rounded-full bg-corazel-borgona px-6 py-3 text-sm font-semibold tracking-wide text-corazel-marfil uppercase hover:opacity-90"
        [class.w-full]="fullWidth"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5">
          <path
            d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.05-1.36A10 10 0 1 0 12 2Zm5.7 14.2c-.24.68-1.4 1.3-1.94 1.36-.5.06-1.1.08-1.78-.11a15.6 15.6 0 0 1-1.66-.6 12.4 12.4 0 0 1-4.9-4.3c-.72-1-1.2-2.16-1.34-2.53-.14-.37-1.1-2.63.26-3.85.34-.3.68-.36.9-.36h.32c.24 0 .5-.02.72.55.24.63.82 2.1.9 2.25.08.15.13.33.03.53-.1.2-.15.32-.3.5-.15.17-.31.38-.44.5-.15.15-.3.31-.13.6.17.3.76 1.24 1.63 2 1.12 1 2.06 1.32 2.36 1.47.3.15.48.13.66-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.66-.15.28.1 1.75.83 2.05 1 .3.15.5.22.57.35.08.13.08.73-.16 1.4Z"
          />
        </svg>
        {{ label }}
      </span>
    </a>
  `,
})
export class WhatsappCtaComponent {
  @Input({ required: true }) link!: string;
  @Input() label = 'Comprar por WhatsApp';
  @Input() fullWidth = false;
}
