import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { Admin, LoginResponse } from '../models/admin.model';
import { ApiService } from './api.service';

const TOKEN_KEY = 'corazel_admin_token';
const ADMIN_KEY = 'corazel_admin_profile';

/** Sesión del admin: login, logout y estado reactivo (signal) del admin autenticado. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  readonly currentAdmin = signal<Admin | null>(this.readStoredAdmin());

  get isAuthenticated(): boolean {
    return this.currentAdmin() !== null;
  }

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  login(email: string, password: string) {
    return this.api.post<LoginResponse>('auth/login', { email, password }).pipe(
      tap(({ accessToken, admin }) => {
        localStorage.setItem(TOKEN_KEY, accessToken);
        localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
        this.currentAdmin.set(admin);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
    this.currentAdmin.set(null);
    void this.router.navigate(['/admin/login']);
  }

  private readStoredAdmin(): Admin | null {
    const raw = localStorage.getItem(ADMIN_KEY);
    return raw ? (JSON.parse(raw) as Admin) : null;
  }
}
