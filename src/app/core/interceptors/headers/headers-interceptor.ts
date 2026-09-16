import { HttpInterceptorFn } from '@angular/common/http';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('socialToken');

  if (token) {
    req = req.clone({
      setHeaders: {
        AUTHORIZATION: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
