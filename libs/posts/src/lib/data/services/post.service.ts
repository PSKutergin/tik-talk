import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { environment } from '@tt/shared';
import {
  Comment,
  CommentCreateDto,
  Post,
  PostCreateDto
} from '../interfaces/post.interface';
import { map, Observable, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  posts: WritableSignal<Post[]> = signal<Post[]>([]);

  constructor(private http: HttpClient) { }

  getPosts(): Observable<Post[]> {
    return this.http
      .get<Post[]>(environment.api + 'post/')
      .pipe(tap((data: Post[]) => this.posts.set(data)));
  }

  createPost(data: PostCreateDto): Observable<Post[]> {
    return this.http
      .post<Post[]>(environment.api + 'post/', data)
      .pipe(switchMap(() => this.getPosts()));
  }

  getCommentsByPostId(postId: number): Observable<Comment[]> {
    return this.http
      .get<Post>(environment.api + `post/${postId}`)
      .pipe(
        map((res) =>
          res.comments.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        )
      );
  }

  createComment(data: CommentCreateDto) {
    return this.http.post<Comment>(environment.api + 'comment/', data);
  }
}
