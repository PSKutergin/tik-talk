import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { postActions, selectPosts, ResizeService } from '@tt/data-access';
import { PostInputComponent } from '../../ui';
import { PostComponent } from '../post/post.component';

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss'
})
export class PostFeedComponent implements OnInit, AfterViewInit, OnDestroy {
  private resizeService = inject(ResizeService);
  private store = inject(Store);
  private hostElement = inject(ElementRef);
  private resizeSubscription: Subscription = Subscription.EMPTY;
  feed = this.store.selectSignal(selectPosts);

  ngOnInit(): void {
    this.store.dispatch(postActions.fetchPosts({}));
  }

  ngAfterViewInit(): void {
    this.resizeService.resizeElement(this.hostElement);
    this.resizeSubscription = this.resizeService.onResize(100).subscribe(() => {
      this.resizeService.resizeElement(this.hostElement);
    });
  }

  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  onCreatedPost(data: Record<string, any>) {
    this.store.dispatch(
      postActions.postCreated({
        post: {
          title: 'New post',
          content: data['text'],
          authorId: data['authorId']
        }
      })
    );
  }
}
