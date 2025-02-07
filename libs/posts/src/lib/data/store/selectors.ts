import { createSelector } from '@ngrx/store';
import { postsFeature } from './reducer';

export const selectPosts = createSelector(
  postsFeature.selectPosts,
  (posts) => posts
);

export const selectCommentsByPost = (postId: number) =>
  createSelector(postsFeature.selectComments, (comments) =>
    comments.filter((comment) => comment.postId === postId)
  );
