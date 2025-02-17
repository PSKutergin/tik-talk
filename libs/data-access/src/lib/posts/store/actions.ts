import { createActionGroup, props } from '@ngrx/store';
import { Comment, CommentCreateDto, Post, PostCreateDto } from '..';

export const postActions = createActionGroup({
  source: 'posts',
  events: {
    'fetch posts': props<{ page?: number }>(),
    'posts loaded': props<{ posts: Post[] }>(),
    'post created': props<{ post: PostCreateDto }>(),
    'fetch comments': props<{ postId: number }>(),
    'comments loaded': props<{ comments: Comment[] }>(),
    'comment created': props<{ comment: CommentCreateDto }>()
  }
});
