import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** Insignia pequeña con el nombre de la colección (Aura, Afrodita, Atenea, Isis). */
@Component({
  selector: 'app-collection-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="inline-block rounded-full bg-corazel-rosa-pastel px-3 py-1 text-xs font-medium tracking-wide text-corazel-borgona uppercase"
    >
      {{ nombre }}
    </span>
  `,
})
export class CollectionBadgeComponent {
  @Input({ required: true }) nombre!: string;
}
