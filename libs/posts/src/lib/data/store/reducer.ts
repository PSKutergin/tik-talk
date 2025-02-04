import { createFeature, createReducer, on } from '@ngrx/store';
import { postActions } from './actions';
import { Post } from '..';

export interface PostsState {
  posts: Post[];
}

export const initialState: PostsState = {
  posts: [],
};

export const postsFeature = createFeature({
  name: 'postsFeature',
  reducer: createReducer(
    initialState,
    on(postActions.postsLoaded, (state, payload) => {
      return {
        ...state,
        posts: payload.posts
      };
    })
  )
});
