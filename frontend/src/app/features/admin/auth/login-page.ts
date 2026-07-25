import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto mt-16 max-w-sm px-4">
      <h1 class="text-center font-brand text-3xl text-corazel-borgona">Corazél · Admin</h1>
      <p class="mt-1 text-center text-sm text-corazel-borgona/60">Inicia sesión para gestionar el catálogo</p>

      <form class="mt-8 flex flex-col gap-2" [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" autocomplete="username" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Contraseña</mat-label>
          <input matInput type="password" formControlName="password" autocomplete="current-password" />
        </mat-form-field>

        @if (error()) {
          <p class="text-sm text-red-600">{{ error() }}</p>
        }

        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || loading()">
          {{ loading() ? 'Ingresando…' : 'Ingresar' }}
        </button>
      </form>
    </div>
  `,
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

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
