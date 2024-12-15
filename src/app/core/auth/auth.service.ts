import { TokenResponse } from '@/app/interfaces/auth.interface';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: string | null = null;
  refreshToken: string | null = null;

  constructor(private http: HttpClient, private cookiesService: CookieService, private router: Router) { }

  get isAuth(): boolean {
    if (!this.token) {
      this.token = this.cookiesService.get('token');
      this.refreshToken = this.cookiesService.get('refreshToken');
    }

    return !!this.token;
  }

  login(data: { username: string, password: string }): Observable<TokenResponse> {
    const fd: FormData = new FormData();

    fd.append('username', data.username);
    fd.append('password', data.password);

    return this.http.post<TokenResponse>(environment.api + 'auth/token', fd)
      .pipe(
        tap((data: TokenResponse) => this.saveTokens(data))
      );
  }

  refresh(): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(environment.api + 'auth/refresh', { refresh_token: this.refreshToken })
      .pipe(
        tap((data: TokenResponse) => this.saveTokens(data)),
        catchError(err => {
          this.logout();
          return throwError(() => err);
        })
      );
  }

  logout(): void {
    this.cookiesService.deleteAll();
    this.token = null;
    this.refreshToken = null;

    this.router.navigate(['/login']);
  }

  saveTokens(data: TokenResponse): void {
    this.token = data.access_token;
    this.refreshToken = data.refresh_token;

    this.cookiesService.set('token', this.token);
    this.cookiesService.set('refreshToken', this.refreshToken);
  }
}
