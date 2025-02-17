import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../environments';
import { GlobalStoreService, Pageble } from '../../shared';
import { Profile } from '../../profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http = inject(HttpClient);
  private globalStoreService = inject(GlobalStoreService);

  me = signal<Profile | null>(null);

  getMe(): Observable<Profile> {
    return this.http.get<Profile>(environment.api + 'account/me').pipe(
      tap((data: Profile) => {
        this.me.set(data);
        this.globalStoreService.me.set(data);
      })
    );
  }

  getTestProfiles(): Observable<Profile[]> {
    return this.http.get<Profile[]>(environment.api + 'account/test_accounts');
  }

  getAccount(id: string): Observable<Profile> {
    return this.http.get<Profile>(environment.api + 'account/' + id);
  }

  getSubscribersShortList(subscribersAmount = 3): Observable<Profile[]> {
    return this.http
      .get<Pageble<Profile>>(environment.api + 'account/subscribers/')
      .pipe(map((res) => res.items.slice(0, subscribersAmount)));
  }

  updateProfile(data: Partial<Profile>): Observable<Profile> {
    return this.http.patch<Profile>(environment.api + 'account/me', data);
  }

  uploadAvatar(file: File): Observable<Profile> {
    const fd = new FormData();

    fd.append('image', file);

    return this.http.post<Profile>(
      environment.api + 'account/upload_image',
      fd
    );
  }

  filterProfiles(params: Record<string, any>): Observable<Pageble<Profile>> {
    return this.http.get<Pageble<Profile>>(
      environment.api + 'account/accounts',
      { params }
    );
  }
}
