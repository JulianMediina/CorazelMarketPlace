import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { AdminShellComponent } from './layout/admin-shell/admin-shell';
import { PublicShellComponent } from './layout/public-shell/public-shell';

export const routes: Routes = [
  {
    path: '',
    component: PublicShellComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home-page').then((m) => m.HomePageComponent),
      },
      {
        path: 'catalogo',
        loadComponent: () => import('./features/catalog/catalog-page').then((m) => m.CatalogPageComponent),
      },
      {
        path: 'colecciones',
        loadComponent: () =>
          import('./features/collections/collections-page').then((m) => m.CollectionsPageComponent),
      },
      {
        path: 'producto/:slug',
        loadComponent: () =>
          import('./features/product-detail/product-detail-page').then((m) => m.ProductDetailPageComponent),
      },
      {
        path: 'carrito',
        loadComponent: () => import('./features/cart/cart-page').then((m) => m.CartPageComponent),
      },
      {
        path: 'nosotros',
        loadComponent: () => import('./features/about/about-page').then((m) => m.AboutPageComponent),
      },
    ],
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./features/admin/auth/login-page').then((m) => m.LoginPageComponent),
  },
  {
    path: 'admin',
    component: AdminShellComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'productos', pathMatch: 'full' },
      {
        path: 'productos',
        loadComponent: () =>
          import('./features/admin/products/product-list-page').then((m) => m.ProductListPageComponent),
      },
      {
        path: 'productos/nuevo',
        loadComponent: () =>
          import('./features/admin/products/product-form-page').then((m) => m.ProductFormPageComponent),
      },
      {
        path: 'productos/:id',
        loadComponent: () =>
          import('./features/admin/products/product-form-page').then((m) => m.ProductFormPageComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
