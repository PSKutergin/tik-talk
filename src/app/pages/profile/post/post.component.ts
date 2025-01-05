import { Comment, Post } from '@/app/interfaces/post.interface';
import { Component, input, OnInit, Output, signal } from '@angular/core';
import { AvatarCircleComponent } from "@/app/shared/components/avatar-circle/avatar-circle.component";
import { SvgIconComponent } from '@/app/shared/components/svg-icon/svg-icon.component';
import { PostInputComponent } from "@/app/pages/profile/post-input/post-input.component";
import { CommentComponent } from "@/app/pages/profile/post/comment/comment.component";
import { DatePipe } from '@angular/common';
import { PostService } from '@/app/shared/services/post.service';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-post',
  standalone: true,
  imports: [SvgIconComponent, AvatarCircleComponent, DatePipe, PostInputComponent, CommentComponent],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {
  post = input<Post>()
  comments = signal<Comment[]>([])

  constructor(private postService: PostService) { }

  ngOnInit() {
    this.comments.set(this.post()!.comments)
  }

  async onCreated() {
    const comments = await firstValueFrom(this.postService.getCommentsByPostId(this.post()!.id))
    this.comments.set(comments)
  }
}
