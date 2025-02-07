import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  Signal,
  signal
} from '@angular/core';
import {
  AvatarCircleComponent,
  SvgIconComponent,
  TimeFormatPipe
} from '@tt/common';
import { CommentComponent, PostInputComponent } from '../../ui';
import { Comment, Post, postActions, selectCommentsByPost } from '../../data';
import { Store } from '@ngrx/store';

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
  private store = inject(Store);
  post = input<Post>();
  postId = 0;
  comments!: Signal<Comment[]>;

  renderComments = computed(() => {
    if (this.comments().length) {
      return this.sortComments([...this.comments()]);
    }

    const postComments = this.post()?.comments;
    return postComments && this.sortComments([...postComments]);
  });

  ngOnInit() {
    const post = this.post();

    if (post) {
      this.postId = post?.id;

      this.comments = this.store.selectSignal(
        selectCommentsByPost(this.postId)
      );
      this.store.dispatch(postActions.fetchComments({ postId: this.postId }));
    }
  }

  onCreatedComment(data: Record<string, any>) {
    this.store.dispatch(
      postActions.commentCreated({
        comment: {
          text: data['text'],
          authorId: data['authorId'],
          postId: this.postId
        }
      })
    );
  }

  sortComments(comments: Comment[]) {
    return comments.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}
