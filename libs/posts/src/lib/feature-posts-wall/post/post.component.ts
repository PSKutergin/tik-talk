import { firstValueFrom } from 'rxjs';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import {
  AvatarCircleComponent,
  SvgIconComponent,
  TimeFormatPipe
} from '@tt/common';
import { CommentComponent, PostInputComponent } from '../../ui';
import { Comment, Post, PostService } from '../../data';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    SvgIconComponent,
    AvatarCircleComponent,
    PostInputComponent,
    CommentComponent,
    TimeFormatPipe
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {
  private postService = inject(PostService);

  post = input<Post>();
  comments = signal<Comment[]>([]);

  ngOnInit() {
    this.comments.set(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.post()!.comments.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    );
  }

  onCreatedComment(data: Record<string, any>) {
    firstValueFrom(
      this.postService.createComment({
        text: data['text'],
        authorId: data['authorId'],
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        postId: this.post()!.id
      })
    ).then(async () => {
      const comments = await firstValueFrom(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.postService.getCommentsByPostId(this.post()!.id)
      );
      this.comments.set(comments);
    });
  }
}
