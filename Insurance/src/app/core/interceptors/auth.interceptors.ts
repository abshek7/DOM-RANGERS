import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const raw =
    localStorage.getItem('insurance_auth') ??
    sessionStorage.getItem('insurance_auth');

  if (raw) {
    try {
      const session = JSON.parse(raw);
      const token = session?.token;

      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch {}
  }

  return next(req);
};
