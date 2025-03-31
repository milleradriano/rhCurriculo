import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Garante que o código só será executado no navegador
  if (typeof window !== 'undefined') {
    const token = sessionStorage.getItem('token');

    if (token) {
      return true; // Usuário autenticado, pode acessar
    }
  }

  // Caso não tenha token, redireciona para login e bloqueia o acesso
  return router.createUrlTree(['/']);
};
