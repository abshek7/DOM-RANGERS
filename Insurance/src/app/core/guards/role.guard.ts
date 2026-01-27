import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../../../models/users';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const allowed = (route.data?.['roles'] as UserRole[] | undefined) ?? [];
  const role = auth.role;

  if (!role) {
    router.navigate(['/login']);
    return false;
  }

  if (allowed.length === 0 || allowed.includes(role)) return true;

  router.navigate(['/unauthorized']);
  return false;
};
