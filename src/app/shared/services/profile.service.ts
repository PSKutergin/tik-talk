import { Pageble } from '@/app/interfaces/pageble.interface';
import { Profile } from '@/app/interfaces/profile.interface';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  me = signal<Profile | null>(null);

  constructor(private http: HttpClient) { }

  getMe(): Observable<Profile> {
    return this.http.get<Profile>(environment.api + 'account/me')
      .pipe(
        tap((data: Profile) => this.me.set(data))
      )
  }

  getTestProfiles(): Observable<Profile[]> {
    return this.http.get<Profile[]>(environment.api + 'account/test_accounts');
  }

  getAccount(id: string): Observable<Profile> {
    return this.http.get<Profile>(environment.api + 'account/' + id);
  }

  getSubscribersShortList(subscribersAmount: number = 3): Observable<Profile[]> {
    return this.http.get<Pageble<Profile>>(environment.api + 'account/subscribers/')
      .pipe(
        map(res => res.items.slice(0, subscribersAmount))
      )
  }

  updateProfile(data: Partial<Profile>): Observable<Profile> {
    return this.http.patch<Profile>(environment.api + 'account/me', data);
  }
}
