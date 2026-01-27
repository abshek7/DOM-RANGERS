import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },

  { path: 'login', loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'unauthorized', loadComponent: () => import('./pages/auth/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent) },

  // Guarded role dashboards (placeholders)
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
    loadComponent: () => import('./pages/dashboards/admin-shell.component').then(m => m.AdminShellComponent),
  },
  {
    path: 'customer',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['customer'] },
    loadComponent: () => import('./pages/dashboards/customer-shell.component').then(m => m.CustomerShellComponent),
  },
  {
    path: 'agent',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['agent'] },
    loadComponent: () => import('./pages/dashboards/agent-shell.component').then(m => m.AgentShellComponent),
  },

  { path: '**', loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent) },
];
