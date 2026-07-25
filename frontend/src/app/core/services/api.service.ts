import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

interface ApiEnvelope<T> {
  success: true;
  data: T;
}

type QueryValue = string | number | boolean | undefined;

/**
 * Wrapper delgado sobre HttpClient: centraliza la base URL y desenvuelve el
 * shape { success, data } que devuelve el TransformInterceptor del backend.
 * El resto de servicios (CatalogService, AuthService, etc.) consumen esto
 * en vez de HttpClient directamente.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  get<T>(path: string, query?: Record<string, QueryValue>): Observable<T> {
    return this.http
      .get<ApiEnvelope<T>>(`${this.baseUrl}/${path}`, { params: this.toHttpParams(query) })
      .pipe(map((response) => response.data));
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .post<ApiEnvelope<T>>(`${this.baseUrl}/${path}`, body)
      .pipe(map((response) => response.data));
  }

  patch<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .patch<ApiEnvelope<T>>(`${this.baseUrl}/${path}`, body)
      .pipe(map((response) => response.data));
  }

  delete<T>(path: string): Observable<T> {
    return this.http
      .delete<ApiEnvelope<T>>(`${this.baseUrl}/${path}`)
      .pipe(map((response) => response.data));
  }

  private toHttpParams(query?: Record<string, QueryValue>): HttpParams {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(query ?? {})) {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    }
    return params;
  }
}
