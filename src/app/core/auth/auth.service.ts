import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(data: { username: string, password: string }): Observable<any> {
    const fd: FormData = new FormData();

    fd.append('username', data.username);
    fd.append('password', data.password);

    return this.http.post(environment.api + 'auth/token', fd);
  }
}
