import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import {
  BehaviorSubject,
  catchError,
  filter,
  finalize,
  Observable,
  switchMap,
  tap,
  throwError
} from 'rxjs';
import { TokenResponse } from '@/app/interfaces/auth.interface';

let isRefreshing$ = new BehaviorSubject<boolean>(false);

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<any> => {
  const authService: AuthService = inject(AuthService);
  const token: string | null = authService.token;

  if (!token) return next(req);

  if (isRefreshing$.value) return refreshAndProceed(authService, req, next);

  return next(addToken(req, token)).pipe(
    catchError((err) => {
      if (err.status === 403) {
        return refreshAndProceed(authService, req, next);
      }

      return throwError(() => err);
    })
  );
};

const refreshAndProceed = (
  authService: AuthService,
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  if (!isRefreshing$.value) {
    isRefreshing$.next(true);

    return authService
      .refresh()
      .pipe(
        switchMap((res: TokenResponse) =>
          next(addToken(req, res.access_token!)).pipe(
            tap(() => isRefreshing$.next(false))
          )
        )
      );
  }

  if (req.url.includes('refresh'))
    return next(addToken(req, authService.token!));

  return isRefreshing$.pipe(
    filter((isRefreshing) => !isRefreshing),
    switchMap(() => next(addToken(req, authService.token!)))
  );
};

const addToken = (req: HttpRequest<any>, token: string): HttpRequest<any> => {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
};
