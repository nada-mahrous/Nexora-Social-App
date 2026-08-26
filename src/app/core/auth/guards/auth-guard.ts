import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  // check on token in local storage
  // if we have token --> return true
  // if we haven't token --> return true
  // if token is not found, redirect to login page

  const router = inject(Router);

  const token = localStorage.getItem('socialToken');

  if (token) {
    return true;
  } else {
    /* 
  // redirect to login page
  // window.location.href = '/login';
  router.navigate(['/login']);
  return false;
  */

    // navigate to login page --> return url Tree
    return router.parseUrl('/login');
  }
};
