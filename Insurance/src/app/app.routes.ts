import { Routes } from '@angular/router';
import { AgentLayout } from '../components/agent/agent-dashboard/agent-layout/agent-layout';
import { AgentDashboard } from '../components/agent/agent-dashboard/agent-dashboard/agent-dashboard';
import { AgentClaims } from '../components/agent/agent-dashboard/agent-claims/agent-claims';
import { AgentClaimsDetails } from '../components/agent/agent-dashboard/agent-claims-details/agent-claims-details';
import { AgentCustomers } from '../components/agent/agent-dashboard/agent-customers/agent-customers';
import { AgentCustomerDetails } from '../components/agent/agent-dashboard/agent-customers-details/agent-customer-details';
import { AgentPolicies } from '../components/agent/agent-dashboard/agent-policies/agent-policies';
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
    component: AgentLayout,
    children: [
      { path: 'agent-dashboard', component: AgentDashboard },
      { path: 'agent-claims', component: AgentClaims },
      { path: 'agent-claims/:id', component: AgentClaimsDetails },
      { path: 'agent-customers', component: AgentCustomers },
      { path: 'agent-customers/:id', component: AgentCustomerDetails },
      { path: 'agent-policies', component: AgentPolicies },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent) },
];
