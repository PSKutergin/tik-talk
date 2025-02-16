import { Component, input, InputSignal } from '@angular/core';
import { AvatarCircleComponent } from '@tt/common';
import { Profile } from '@tt/interfaces/profile';

@Component({
  selector: 'app-chat-workspace-header',
  standalone: true,
  imports: [AvatarCircleComponent],
  templateUrl: './chat-workspace-header.component.html',
  styleUrl: './chat-workspace-header.component.scss'
})
export class ChatWorkspaceHeaderComponent {
  profile: InputSignal<Profile | undefined> = input<Profile>();
}
