import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = sessionStorage.getItem('token');

  if (token) {
    return true;
  } else {
    // caso nao tenha token redireciona para pagina de login
    router.navigate(['/']);
    return true;
  }
  
};
