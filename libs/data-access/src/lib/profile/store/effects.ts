import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, withLatestFrom } from 'rxjs';
import { ProfileService } from '../services/profile.service';
import { profileActions } from './actions';
import { selectProfileFilters, selectProfilePageble } from './selectors';

@Injectable({
  providedIn: 'root'
})
export class ProfileEffects {
  profileService = inject(ProfileService);
  actions$ = inject(Actions);
  store = inject(Store);

  filterProfiles = createEffect(() =>
    this.actions$.pipe(
      ofType(profileActions.filterEvents, profileActions.setPage),
      withLatestFrom(
        this.store.select(selectProfileFilters),
        this.store.select(selectProfilePageble)
      ),
      switchMap(([_, filters, pageble]) =>
        this.profileService.filterProfiles({ ...pageble, ...filters })
      ),
      map((res) => profileActions.profilesLoaded({ profiles: res.items }))
    )
  );
}
