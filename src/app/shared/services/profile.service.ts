import { Profile } from '@/app/interfaces/profile.interface';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getTestProfiles() {
    return this.http.get<Profile[]>(environment.api + 'account/test_accounts');
  }
}
