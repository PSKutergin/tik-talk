import { Message } from '@/app/interfaces/chat.interface';
import {
  Component,
  HostBinding,
  input,
  Input,
  InputSignal
} from '@angular/core';
import { AvatarCircleComponent } from '@/app/shared/components/avatar-circle/avatar-circle.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat-workspace-message',
  standalone: true,
  imports: [AvatarCircleComponent, DatePipe],
  templateUrl: './chat-workspace-message.component.html',
  styleUrl: './chat-workspace-message.component.scss'
})
export class ChatWorkspaceMessageComponent {
  message: InputSignal<Message> = input.required<Message>();

  @HostBinding('class.mine')
  get isMine() {
    return this.message().isMine;
  }
}
