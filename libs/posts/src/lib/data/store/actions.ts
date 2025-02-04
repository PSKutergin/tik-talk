import { createActionGroup, props } from '@ngrx/store';
import { Post } from '..';

export const postActions = createActionGroup({
  source: 'posts',
  events: {
    'fetch posts': props<{ page?: number }>(),
    'posts loaded': props<{ posts: Post[] }>()
  }
});
