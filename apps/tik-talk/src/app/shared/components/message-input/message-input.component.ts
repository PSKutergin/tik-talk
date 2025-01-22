import { ProfileService } from '@/app/shared/services/profile.service';
import {
  Component,
  EventEmitter,
  HostBinding,
  inject,
  input,
  Output,
  Renderer2
} from '@angular/core';
import { AvatarCircleComponent } from '@/app/shared/components/avatar-circle/avatar-circle.component';
import { SvgIconComponent } from '@/app/shared/components/svg-icon/svg-icon.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [AvatarCircleComponent, SvgIconComponent, FormsModule],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss'
})
export class MessageInputComponent {
  r2: Renderer2 = inject(Renderer2);
  profile = inject(ProfileService).me;
  postText: string = '';

  @Output() created = new EventEmitter<string>();

  onTextareaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;

    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', `${textarea.scrollHeight}px`);
  }

  onCreate() {
    if (!this.postText) return;

    this.created.emit(this.postText);
    this.postText = '';
  }
}
