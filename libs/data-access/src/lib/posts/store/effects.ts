import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map, switchMap } from 'rxjs';
import { postActions } from './actions';
import { Post, PostService } from '..';

@Injectable({
  providedIn: 'root'
})
export class PostEffects {
  postService = inject(PostService);
  actions$ = inject(Actions);

  loadPosts = createEffect(() =>
    this.actions$.pipe(
      ofType(postActions.fetchPosts),
      switchMap(() => this.postService.getPosts()),
      map((posts: Post[]) => postActions.postsLoaded({ posts }))
    )
  );

  createdPost = createEffect(() =>
    this.actions$.pipe(
      ofType(postActions.postCreated),
      switchMap(({ post }) => this.postService.createPost(post)),
      map(() => postActions.fetchPosts({}))
    )
  );

  loadComments = createEffect(() =>
    this.actions$.pipe(
      ofType(postActions.fetchComments),
      concatMap(({ postId }) => this.postService.getCommentsByPostId(postId)),
      map((comments) => postActions.commentsLoaded({ comments }))
    )
  );

  createdComment = createEffect(() =>
    this.actions$.pipe(
      ofType(postActions.commentCreated),
      switchMap(({ comment }) => {
        const postId = comment.postId;
        return this.postService
          .createComment(comment)
          .pipe(map(() => postActions.fetchComments({ postId })));
      })
    )
  );
}
