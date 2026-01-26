import { Routes } from '@angular/router';
import { CustomerLayoutComponent } from './customer-layout.component';

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
                loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'marketplace',
                loadComponent: () => import('./pages/policies/marketplace.component').then(m => m.MarketplaceComponent)
            },
            {
                path: 'policy-details/:id',
                loadComponent: () => import('./pages/policies/policy-details.component').then(m => m.PolicyDetailsComponent)
            },
            {
                path: 'purchase/:id',
                loadComponent: () => import('./pages/policies/purchase.component').then(m => m.PurchaseComponent)
            },
            {
                path: 'my-policies',
                loadComponent: () => import('./pages/policies/my-policies.component').then(m => m.MyPoliciesComponent)
            },
            {
                path: 'claims',
                loadComponent: () => import('./pages/claims/track-claims.component').then(m => m.TrackClaimsComponent)
            },
            {
                path: 'file-claim',
                loadComponent: () => import('./pages/claims/file-claim.component').then(m => m.FileClaimComponent)
            },
            {
                path: 'documents',
                loadComponent: () => import('./pages/documents/document-vault.component').then(m => m.DocumentVaultComponent)
            },
            {
                path: 'profile',
                loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
            },
            {
                path: 'payments',
                loadComponent: () => import('./pages/payments/payments.component').then(m => m.PaymentsComponent)
            }
        ]
    }
];
