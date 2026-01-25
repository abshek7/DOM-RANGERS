import { Routes } from '@angular/router';
import { Layout } from '../components/admin/layout/layout';
import { AdminDashboard } from '../components/admin/admin-dashboard/admin-dashboard';
import { Agentmanagement } from '../components/admin/agentmanagement/agentmanagement';
import { ClaimsManagement } from '../components/admin/claims-management/claims-management';
import { PolicyManagement } from '../components/admin/policy-management/policy-management';
import { CustomerManagement } from '../components/admin/customer-management/customer-management';

export const routes: Routes = [
  {
    path: 'admin',
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
  { path: '', redirectTo: 'admin/dashboard', pathMatch: 'full' }
];
