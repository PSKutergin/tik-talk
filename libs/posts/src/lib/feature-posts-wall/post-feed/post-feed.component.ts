import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
} from '@angular/core';
import { firstValueFrom, Subscription } from 'rxjs';
import { PostInputComponent } from '../../ui';
import { PostService } from '../../data';
import { PostComponent } from '../post/post.component';
import { ResizeService } from '@tt/shared';

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss'
})
export class PostFeedComponent implements AfterViewInit, OnDestroy {
  hostElement = inject(ElementRef);
  feed = this.postService.posts;
  private resizeSubscription: Subscription = Subscription.EMPTY;

  constructor(
    private resizeService: ResizeService,
    private postService: PostService
  ) {
    firstValueFrom(this.postService.getPosts());
  }

  ngAfterViewInit(): void {
    this.resizeService.resizeElement(this.hostElement);
    this.resizeSubscription = this.resizeService
      .onResize(100)
      .subscribe(() => {
        this.resizeService.resizeElement(this.hostElement);
      });
  }

  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  onCreatedPost(data: Record<string, any>) {
    firstValueFrom(
      this.postService.createPost({
        title: 'New post',
        content: data['text'],
        authorId: data['authorId']
      })
    );
  }
}
