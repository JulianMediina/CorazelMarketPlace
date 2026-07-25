import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BottomNavComponent } from '../bottom-nav/bottom-nav';
import { FooterComponent } from '../footer/footer';
import { HeaderComponent } from '../header/header';

/** Shell de la tienda pública: header + contenido + footer + bottom-nav (mobile). */
@Component({
  selector: 'app-public-shell',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, BottomNavComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex min-h-dvh flex-col">
      <app-header />
      <main class="flex-1 pb-20 sm:pb-0">
        <router-outlet />
      </main>
      <app-footer />
      <app-bottom-nav />
    </div>
  `,
})
export class PublicShellComponent {}
