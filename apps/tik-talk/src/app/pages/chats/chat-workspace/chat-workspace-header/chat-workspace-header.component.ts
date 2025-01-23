import { Component, input, InputSignal } from '@angular/core';
import { Profile } from '../../../../interfaces/profile.interface';
import { AvatarCircleComponent } from '../../../../shared/components/avatar-circle/avatar-circle.component';

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
