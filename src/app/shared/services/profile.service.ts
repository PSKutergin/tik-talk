import { Profile } from '@/app/interfaces/profile.interface';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getTestProfiles(): Observable<Profile[]> {
    return this.http.get<Profile[]>(environment.api + 'account/test_accounts');
  }
}
