import { Component, input, InputSignal } from '@angular/core';
import { Profile } from '@tt/profile';
import { AvatarCircleComponent } from '@tt/common';

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
