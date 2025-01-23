import {
  Component,
  HostBinding,
  input,
  InputSignal
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { AvatarCircleComponent } from '@tt/common';
import { Message } from '../../../../../interfaces/chat.interface';

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
