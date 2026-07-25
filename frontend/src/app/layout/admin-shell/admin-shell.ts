import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

/** Shell del panel admin: barra superior con navegación y logout + contenido. Sin header/footer públicos. */
@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-corazel-rosa-pastel/30">
      <header class="border-b border-corazel-champagne/50 bg-corazel-marfil">
        <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <span class="font-brand text-xl text-corazel-borgona">Corazel · Admin</span>

          <nav class="flex items-center gap-6">
            <a
              routerLink="/admin/productos"
              routerLinkActive="text-corazel-borgona"
              class="text-sm font-medium tracking-wide text-corazel-borgona/60 uppercase hover:text-corazel-borgona"
            >
              Productos
            </a>
            <button
              type="button"
              (click)="auth.logout()"
              class="text-sm font-medium tracking-wide text-corazel-borgona/60 uppercase hover:text-corazel-borgona"
            >
              Salir
            </button>
          </nav>
        </div>
      </header>

      <main class="mx-auto max-w-6xl px-4 py-8">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AdminShellComponent {
  protected readonly auth = inject(AuthService);
}
