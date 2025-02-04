import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs';
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
}
