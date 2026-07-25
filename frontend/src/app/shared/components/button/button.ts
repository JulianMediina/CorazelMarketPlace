import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router } from '@angular/router';

export type ButtonVariant = 'primary' | 'secondary';

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-50';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-corazel-borgona text-corazel-marfil hover:opacity-90',
  secondary:
    'border-2 border-corazel-borgona text-corazel-borgona hover:bg-corazel-rosa-pastel bg-transparent',
};

/**
 * Botón del design system de Corazel (ver manual de identidad de marca).
 * primary: fondo borgoña, texto marfil. secondary: borde/texto borgoña, fondo transparente.
 *
 * Siempre renderiza un único <button> (nunca alterna con <a>): tener dos <ng-content>
 * en ramas @if/@else distintas dejaba el contenido proyectado sin mostrarse en la rama
 * que sí se usaba. Con [routerLink] navega por código en el click en vez de cambiar de tag.
 */
@Component({
  selector: 'app-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button [type]="type" [disabled]="disabled" (click)="handleClick($event)" [class]="classes">
      <ng-content />
    </button>
  `,
})
export class ButtonComponent {
  private readonly router = inject(Router);

  @Input() variant: ButtonVariant = 'primary';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  @Input() fullWidth = false;
  /** Si se provee, el click navega ahí en vez de emitir `clicked`. */
  @Input() routerLink?: string | unknown[];
  @Output() clicked = new EventEmitter<MouseEvent>();

  get classes(): string {
    const width = this.fullWidth ? 'w-full' : '';
    return `${BASE_CLASSES} ${VARIANT_CLASSES[this.variant]} ${width}`.trim();
  }

  handleClick(event: MouseEvent): void {
    if (this.routerLink) {
      const path = Array.isArray(this.routerLink) ? this.routerLink : [this.routerLink];
      void this.router.navigate(path);
      return;
    }
    this.clicked.emit(event);
  }
}
