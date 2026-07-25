import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { FIELD_INPUT_CLASSES, FIELD_LABEL_CLASSES } from '../../../shared/styles/form-field.styles';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex min-h-dvh items-center justify-center bg-corazel-rosa-pastel/40 px-4 py-8">
      <div class="w-full max-w-sm rounded-3xl bg-corazel-marfil p-6 shadow-lg ring-1 ring-corazel-champagne/40 sm:p-8">
        <div class="flex flex-col items-center text-center">
          <img src="/logo-corazel.jpeg" alt="Corazel" class="h-14 w-14 rounded-full object-cover shadow-sm" />
          <h1 class="mt-3 font-brand text-xl text-corazel-borgona sm:text-2xl">Panel de administración</h1>
          <p class="mt-1 text-sm text-corazel-borgona/60">Inicia sesión para gestionar el catálogo</p>
        </div>

        <form class="mt-6 flex flex-col gap-4 sm:mt-8" [formGroup]="form" (ngSubmit)="submit()">
          <label class="flex flex-col gap-1">
            <span class="${FIELD_LABEL_CLASSES}">Email</span>
            <input
              type="email"
              formControlName="email"
              autocomplete="username"
              placeholder="tu@email.com"
              class="${FIELD_INPUT_CLASSES}"
            />
          </label>

          <label class="flex flex-col gap-1">
            <span class="${FIELD_LABEL_CLASSES}">Contraseña</span>
            <div class="relative">
              <input
                [type]="mostrarPassword() ? 'text' : 'password'"
                formControlName="password"
                autocomplete="current-password"
                class="${FIELD_INPUT_CLASSES} pr-11"
              />
              <button
                type="button"
                (click)="mostrarPassword.set(!mostrarPassword())"
                [attr.aria-label]="mostrarPassword() ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                class="absolute inset-y-0 right-2 flex items-center text-corazel-borgona/40 hover:text-corazel-borgona"
              >
                <mat-icon class="!text-xl">{{ mostrarPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </div>
          </label>

          @if (error()) {
            <p class="-mt-2 text-sm text-red-600">{{ error() }}</p>
          }

          <button
            mat-flat-button
            color="primary"
            type="submit"
            class="!mt-2 !h-12 !rounded-full !text-base"
            [disabled]="form.invalid || loading()"
          >
            {{ loading() ? 'Ingresando…' : 'Ingresar' }}
          </button>
        </form>
      </div>
    </div>
  `,
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly mostrarPassword = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    const { email, password } = this.form.getRawValue();
    this.loading.set(true);
    this.error.set(null);

    this.auth.login(email, password).subscribe({
      next: () => void this.router.navigate(['/admin/productos']),
      error: () => {
        this.error.set('Credenciales inválidas.');
        this.loading.set(false);
      },
    });
  }
}
