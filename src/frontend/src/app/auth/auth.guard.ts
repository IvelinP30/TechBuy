import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from "./auth.service";
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated()) {
    console.log('user authenticated');
    return true;
  } else {
    router.navigate(['/']);  // Redirect to login if not authenticated
    return false;
  }
};
