import { AfterViewInit, Component, DestroyRef, ElementRef, HostListener, inject, OnDestroy, Renderer2 } from '@angular/core';
import { PostInputComponent } from "../post-input/post-input.component";
import { PostComponent } from "../post/post.component";
import { PostService } from '@/app/shared/services/post.service';
import { debounceTime, firstValueFrom, fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss'
})
export class PostFeedComponent implements AfterViewInit, OnDestroy {
  r2 = inject(Renderer2)
  hostElement = inject(ElementRef)
  destroy$ = inject(DestroyRef);
  feed = this.postService.posts

  constructor(private postService: PostService) {
    firstValueFrom(this.postService.getPosts())
  }

  ngAfterViewInit(): void {
    this.resizeFeed()

    fromEvent(window, 'resize')
      .pipe(
        debounceTime(100),
        takeUntilDestroyed(this.destroy$)
      )
      .subscribe(() => {
        this.resizeFeed()
      })
  }

  ngOnDestroy(): void { }

  resizeFeed(): void {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect()

    const height = window.innerHeight - top - 24 - 24

    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`)
  }

  onCreatedPost(data: Record<string, any>) {
    firstValueFrom(
      this.postService.createPost({
        title: 'New post',
        content: data['text'],
        authorId: data['authorId']
      })
    )
  }
}
