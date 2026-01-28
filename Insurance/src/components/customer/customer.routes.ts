import { Routes } from '@angular/router';
import { CustomerLayoutComponent } from './customer-layout';

export const customerRoutes: Routes = [
    {
        path: '',
        component: CustomerLayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent)
            },
            {
                path: 'marketplace',
                loadComponent: () => import('./pages/policies/marketplace').then(m => m.MarketplaceComponent)
            },
            {
                path: 'policy-details/:id',
                loadComponent: () => import('./pages/policies/policy-details').then(m => m.PolicyDetailsComponent)
            },
            {
                path: 'purchase/:id',
                loadComponent: () => import('./pages/policies/purchase').then(m => m.PurchaseComponent)
            },
            {
                path: 'my-policies',
                loadComponent: () => import('./pages/policies/my-policies').then(m => m.MyPoliciesComponent)
            },
            {
                path: 'claims',
                loadComponent: () => import('./pages/claims/track-claims').then(m => m.TrackClaimsComponent)
            },
            {
                path: 'file-claim',
                loadComponent: () => import('./pages/claims/file-claim').then(m => m.FileClaimComponent)
            },
            {
                path: 'profile',
                loadComponent: () => import('./pages/profile/profile').then(m => m.ProfileComponent)
            }
        ]
    }
];
