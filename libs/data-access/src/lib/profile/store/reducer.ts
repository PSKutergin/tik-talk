import { createFeature, createReducer, on } from '@ngrx/store';
import { Profile } from '../../profile';
import { profileActions } from './actions';

export interface ProfileState {
  profiles: Profile[];
  profileFilters: Record<string, any>;
  page: number;
  size: number;
}

const initialState: ProfileState = {
  profiles: [],
  profileFilters: {},
  page: 1,
  size: 10
};

export const profileFeature = createFeature({
  name: 'profileFeature',
  reducer: createReducer(
    initialState,
    on(profileActions.filterEvents, (state, payload) => {
      return {
        ...state,
        profiles: [],
        profileFilters: payload.filters,
        page: 1
      };
    }),
    on(profileActions.profilesLoaded, (state, payload) => {
      return {
        ...state,
        profiles: state.profiles.concat(payload.profiles)
      };
    }),
    on(profileActions.setPage, (state, payload) => {
      let page = payload.page;

      if (!page) page = state.page + 1;

      return {
        ...state,
        page
      };
    })
  )
});
