import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  inject,
  input,
  Output,
  Renderer2
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarCircleComponent, SvgIconComponent } from '@tt/common';
import { GlobalStoreService } from '@tt/data-access';

@Component({
  selector: 'app-post-input',
  standalone: true,
  imports: [AvatarCircleComponent, SvgIconComponent, FormsModule],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostInputComponent {
  r2: Renderer2 = inject(Renderer2);
  profile = inject(GlobalStoreService).me;
  isCommentInput = input<boolean>(false);
  postText = '';

  @Output() created = new EventEmitter<Record<string, any>>();

  @HostBinding('class.comment')
  get isComment() {
    return this.isCommentInput();
  }

  onTextareaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;

    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', `${textarea.scrollHeight}px`);
  }

  onCreate() {
    if (!this.postText) return;

    this.created.emit({ text: this.postText, authorId: this.profile()?.id });
    this.postText = '';
  }
}
