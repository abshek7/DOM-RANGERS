import { Routes } from '@angular/router';
import { AgentLayout } from '../components/agent/agent-dashboard/agent-layout/agent-layout';
import { AgentDashboard } from '../components/agent/agent-dashboard/agent-dashboard/agent-dashboard';
import { AgentClaims } from '../components/agent/agent-dashboard/agent-claims/agent-claims';
import { AgentClaimsDetails } from '../components/agent/agent-dashboard/agent-claims-details/agent-claims-details';
import { AgentCustomers } from '../components/agent/agent-dashboard/agent-customers/agent-customers';
import { AgentCustomerDetails } from '../components/agent/agent-dashboard/agent-customers-details/agent-customer-details';
import { AgentPolicies } from '../components/agent/agent-dashboard/agent-policies/agent-policies';

export const agentRoutes: Routes = [
  { path: '', redirectTo: 'agent', pathMatch: 'full' },

  {
    path: 'agent',
    component: AgentLayout,
    children: [
      {
        path: 'agent-dashboard',
        component: AgentDashboard,
      },
      {
        path: 'agent-claims',
        component: AgentClaims,
      },
      {
        path: 'agent-claims/:id',
        component: AgentClaimsDetails,
      },
      {
        path: 'agent-customers',
        component: AgentCustomers,
      },
      {
        path: 'agent-customers/:id',
        component: AgentCustomerDetails,
      },
      {
        path: 'agent-policies',
        component: AgentPolicies,
      },
      {
        path: '',
        redirectTo: 'agent-dashboard',
        pathMatch: 'full',
      },
    ],
  },

  { path: '**', redirectTo: 'agent/agent-dashboard' },
];

export const routes: Routes = [...agentRoutes];
