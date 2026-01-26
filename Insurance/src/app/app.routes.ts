import { Routes } from '@angular/router';
import { customerRoutes } from './customer/customer.routes';

export const routes: Routes = [
  {
    path: 'customer',
    children: customerRoutes
  },
  { path: '', redirectTo: '/customer/dashboard', pathMatch: 'full' }
];

