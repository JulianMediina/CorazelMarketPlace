import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="mt-16 border-t border-corazel-champagne/40 bg-corazel-rosa-pastel/40 pb-24 sm:pb-8">
      <div class="mx-auto max-w-6xl px-4 py-10 text-center">
        <p class="font-brand text-xl text-corazel-borgona">Corazel</p>
        <p class="mt-2 font-body text-sm tracking-wide text-corazel-borgona/70 uppercase">
          Realza tu cuerpo, celebra quién eres.
        </p>

        <nav class="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <a routerLink="/catalogo" class="text-xs font-medium text-corazel-borgona/70 uppercase hover:text-corazel-borgona">
            Catálogo
          </a>
          <a routerLink="/colecciones" class="text-xs font-medium text-corazel-borgona/70 uppercase hover:text-corazel-borgona">
            Colecciones
          </a>
          <a routerLink="/nosotros" class="text-xs font-medium text-corazel-borgona/70 uppercase hover:text-corazel-borgona">
            Nosotros
          </a>
        </nav>

        <p class="mt-6 font-body text-xs text-corazel-borgona/60">
          © {{ year }} Corazel Lencería. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  protected readonly year = new Date().getFullYear();
}
