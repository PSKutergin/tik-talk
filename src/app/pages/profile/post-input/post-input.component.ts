import { ProfileService } from '@/app/shared/services/profile.service';
import { Component, EventEmitter, HostBinding, inject, input, Output, Renderer2 } from '@angular/core';
import { AvatarCircleComponent } from "@/app/shared/components/avatar-circle/avatar-circle.component";
import { SvgIconComponent } from '@/app/shared/components/svg-icon/svg-icon.component';
import { PostService } from '@/app/shared/services/post.service';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-post-input',
  standalone: true,
  imports: [AvatarCircleComponent, SvgIconComponent, FormsModule],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss'
})
export class PostInputComponent {
  r2: Renderer2 = inject(Renderer2)
  profile = inject(ProfileService).me
  isCommentInput = input<boolean>(false)
  postId = input<number>(0)
  postText: string = '';

  @Output() created = new EventEmitter()

  constructor(private postService: PostService) { }

  @HostBinding('class.comment')
  get isComment() {
    return this.isCommentInput()
  }

  onTextareaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement

    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', `${textarea.scrollHeight}px`);
  }

  onCreatePost() {
    if (!this.postText) return;

    if (this.isCommentInput()) {
      firstValueFrom(
        this.postService.createComment({
          text: this.postText,
          authorId: this.profile()!.id,
          postId: this.postId()
        })
      ).then(() => {
        this.postText = ''
        this.created.emit()
      })

      return
    }

    firstValueFrom(
      this.postService.createPost({
        title: 'New post',
        content: this.postText,
        authorId: this.profile()!.id
      })
    ).then(() => this.postText = '')
  }
}
