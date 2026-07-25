import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Talla } from '../../../core/models/product.model';

/** Selector de talla (XS-XL) con tap targets grandes, pensado para mobile. */
@Component({
  selector: 'app-size-selector',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-wrap gap-2" role="radiogroup" aria-label="Talla">
      @for (talla of tallas; track talla) {
        <button
          type="button"
          role="radio"
          [attr.aria-checked]="talla === selected"
          (click)="select(talla)"
          class="h-11 min-w-11 rounded-full border-2 px-3 text-sm font-semibold transition-colors"
          [class.border-corazel-borgona]="talla === selected"
          [class.bg-corazel-borgona]="talla === selected"
          [class.text-corazel-marfil]="talla === selected"
          [class.border-corazel-champagne]="talla !== selected"
          [class.text-corazel-borgona]="talla !== selected"
        >
          {{ talla }}
        </button>
      }
    </div>
  `,
})
export class SizeSelectorComponent {
  @Input({ required: true }) tallas!: Talla[];
  @Input() selected: Talla | null = null;
  @Output() selectedChange = new EventEmitter<Talla>();

  select(talla: Talla): void {
    this.selected = talla;
    this.selectedChange.emit(talla);
  }
}
