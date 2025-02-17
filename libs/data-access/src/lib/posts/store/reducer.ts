import { createFeature, createReducer, on } from '@ngrx/store';
import { postActions } from './actions';
import { Post, Comment } from '..';

export interface PostsState {
  posts: Post[];
  comments: Comment[];
}

const initialState: PostsState = {
  posts: [],
  comments: []
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
    }),
    on(postActions.commentsLoaded, (state, payload) => {
      if (!payload.comments.length) {
        return state;
      }

      const stateComments = state.comments.filter(
        (comment) => comment.postId !== payload.comments[0].postId
      );

      return {
        ...state,
        comments: [...stateComments, ...payload.comments]
      };
    })
  )
});
