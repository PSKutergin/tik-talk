import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs';
import { ProfileService } from '../services/profile.service';
import { profileActions } from './actions';

@Injectable({
  providedIn: 'root'
})
export class ProfileEffects {
  profileService = inject(ProfileService);
  actions$ = inject(Actions);

  filterProfiles = createEffect(() =>
    this.actions$.pipe(
      ofType(profileActions.filterEvents),
      switchMap(({ filters }) => this.profileService.filterProfiles(filters)),
      map((res) => profileActions.profilesLoaded({ profiles: res.items }))
    )
  );
}
