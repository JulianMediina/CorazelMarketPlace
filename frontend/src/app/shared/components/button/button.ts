import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

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
 * Con [routerLink] se renderiza como <a> (navegación); sin él, como <button> (acción/submit).
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (routerLink) {
      <a [routerLink]="routerLink" [class]="classes">
        <ng-content />
      </a>
    } @else {
      <button [type]="type" [disabled]="disabled" (click)="clicked.emit($event)" [class]="classes">
        <ng-content />
      </button>
    }
  `,
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  @Input() fullWidth = false;
  /** Si se provee, el botón se renderiza como enlace de navegación en vez de <button>. */
  @Input() routerLink?: string | unknown[];
  @Output() clicked = new EventEmitter<MouseEvent>();

  get classes(): string {
    const width = this.fullWidth ? 'w-full' : '';
    return `${BASE_CLASSES} ${VARIANT_CLASSES[this.variant]} ${width}`.trim();
  }
}
