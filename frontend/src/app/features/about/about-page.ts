import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonComponent } from '../../shared/components/button/button';

const VALORES = [
  { titulo: 'Feminidad', descripcion: 'Cada prenda celebra la silueta y la piel que la lleva.' },
  { titulo: 'Elegancia', descripcion: 'Diseños delicados, nunca estridentes.' },
  { titulo: 'Confianza', descripcion: 'Lencería que se siente tan bien como se ve.' },
  { titulo: 'Amor propio', descripcion: 'Vestirse para una misma, antes que para nadie más.' },
];

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="bg-corazel-rosa-pastel/50 px-4 py-14 text-center sm:py-20">
      <p class="font-body text-xs font-semibold tracking-[0.2em] text-corazel-borgona/70 uppercase">
        Nuestra historia
      </p>
      <h1 class="mx-auto mt-3 max-w-xl font-brand text-3xl text-corazel-borgona sm:text-4xl">
        Sobre Corazel
      </h1>
    </section>

    <section class="mx-auto max-w-2xl px-4 py-12 text-center sm:py-16">
      <p class="font-brand text-xl text-corazel-borgona italic">
        "Realza tu cuerpo, celebra quién eres."
      </p>
      <p class="mt-6 text-sm leading-relaxed text-corazel-borgona/80 sm:text-base">
        Corazel nació de una idea simple: la lencería no debería ser solo una prenda debajo de la
        ropa, sino un pequeño ritual de amor propio. Diseñamos cada colección pensando en mujeres
        reales — con curvas, historias y personalidades distintas — que merecen sentirse
        seguras, delicadas y poderosas al mismo tiempo.
      </p>
      <p class="mt-4 text-sm leading-relaxed text-corazel-borgona/80 sm:text-base">
        Trabajamos con telas suaves, acabados cuidados y una atención cercana: cada pedido se
        confirma directo por WhatsApp, contigo, para que encuentres tu talla, tu color y tu
        colección ideal sin complicaciones.
      </p>
    </section>

    <section class="bg-corazel-marfil px-4 py-12 sm:py-16">
      <div class="mx-auto max-w-4xl">
        <h2 class="text-center font-brand text-2xl text-corazel-borgona">Lo que nos define</h2>
        <div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          @for (valor of valores; track valor.titulo) {
            <div class="rounded-2xl bg-corazel-rosa-pastel/40 p-4 text-center">
              <p class="font-brand text-lg text-corazel-borgona">{{ valor.titulo }}</p>
              <p class="mt-1 text-xs text-corazel-borgona/70">{{ valor.descripcion }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-2xl px-4 py-12 text-center sm:py-16">
      <h2 class="font-brand text-2xl text-corazel-borgona">Nuestro compromiso</h2>
      <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <p class="font-brand text-3xl text-corazel-dorado">✦</p>
          <p class="mt-2 text-sm text-corazel-borgona/80">Empaque discreto en cada envío</p>
        </div>
        <div>
          <p class="font-brand text-3xl text-corazel-dorado">✦</p>
          <p class="mt-2 text-sm text-corazel-borgona/80">Asesoría personalizada por WhatsApp</p>
        </div>
        <div>
          <p class="font-brand text-3xl text-corazel-dorado">✦</p>
          <p class="mt-2 text-sm text-corazel-borgona/80">Tallas y colores confirmados antes de enviar</p>
        </div>
      </div>

      <div class="mt-10">
        <app-button variant="primary" routerLink="/catalogo">Descubrir el catálogo</app-button>
      </div>
    </section>
  `,
})
export class AboutPageComponent {
  protected readonly valores = VALORES;
}
