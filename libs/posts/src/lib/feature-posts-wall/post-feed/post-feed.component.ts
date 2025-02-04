import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { firstValueFrom, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { PostInputComponent } from '../../ui';
import { postActions, PostService, selectPosts } from '../../data';
import { PostComponent } from '../post/post.component';
import { ResizeService } from '@tt/shared';


@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss'
})
export class PostFeedComponent implements OnInit, AfterViewInit, OnDestroy {
  private resizeService = inject(ResizeService);
  private postService = inject(PostService);

  store = inject(Store);
  hostElement = inject(ElementRef);
  feed = this.store.selectSignal(selectPosts);
  private resizeSubscription: Subscription = Subscription.EMPTY;

  ngOnInit(): void {
    this.store.dispatch(postActions.fetchPosts({}));
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
