import { Routes } from '@angular/router';
import { Layout } from '../components/admin/layout/layout';
import { AdminDashboard } from '../components/admin/admin-dashboard/admin-dashboard';
import { Agentmanagement } from '../components/admin/agentmanagement/agentmanagement';
import { ClaimsManagement } from '../components/admin/claims-management/claims-management';
import { PolicyManagement } from '../components/admin/policy-management/policy-management';
import { CustomerManagement } from '../components/admin/customer-management/customer-management';
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
    component: Layout,
    children: [
      { path: 'dashboard', component: AdminDashboard },
      { path: 'agents', component: Agentmanagement },
      { path: 'claims', component: ClaimsManagement },
      { path: 'policies', component: PolicyManagement },
      { path: 'customers', component: CustomerManagement },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
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
