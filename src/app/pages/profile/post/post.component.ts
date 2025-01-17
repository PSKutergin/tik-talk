import { Comment, Post } from '@/app/interfaces/post.interface';
import { Component, input, OnInit, Output, signal } from '@angular/core';
import { AvatarCircleComponent } from '@/app/shared/components/avatar-circle/avatar-circle.component';
import { SvgIconComponent } from '@/app/shared/components/svg-icon/svg-icon.component';
import { PostInputComponent } from '@/app/pages/profile/post-input/post-input.component';
import { CommentComponent } from '@/app/pages/profile/post/comment/comment.component';
import { PostService } from '@/app/shared/services/post.service';
import { firstValueFrom } from 'rxjs';
import { TimeFormatPipe } from '@/app/shared/pipes/time-format.pipe';

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
  post = input<Post>();
  comments = signal<Comment[]>([]);

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.comments.set(
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
        postId: this.post()!.id
      })
    ).then(async () => {
      const comments = await firstValueFrom(
        this.postService.getCommentsByPostId(this.post()!.id)
      );
      this.comments.set(comments);
    });
  }
}
