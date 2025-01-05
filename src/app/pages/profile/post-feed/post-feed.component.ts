import { Component, ElementRef, HostListener, inject, Renderer2 } from '@angular/core';
import { PostInputComponent } from "../post-input/post-input.component";
import { PostComponent } from "../post/post.component";
import { PostService } from '@/app/shared/services/post.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [PostInputComponent, PostComponent],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss'
})
export class PostFeedComponent {
  r2 = inject(Renderer2)
  hostElement = inject(ElementRef)
  feed = this.postService.posts

  @HostListener('window:resize')
  onWindowResize() {
    this.resizeFeed()
  }

  constructor(private postService: PostService) {
    firstValueFrom(this.postService.getPosts())
  }

  ngAfterViewInit(): void {
    this.resizeFeed()
  }

  resizeFeed(): void {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect()

    const height = window.innerHeight - top - 24 - 24

    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`)
  }
}
