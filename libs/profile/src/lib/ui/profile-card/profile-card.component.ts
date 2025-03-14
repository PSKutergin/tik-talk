import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AvatarCircleComponent } from '@tt/common';
import { Profile } from '@tt/data-access';

@Component({
  selector: 'profile-card',
  standalone: true,
  imports: [AvatarCircleComponent, RouterLink],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileCardComponent {
  private router = inject(Router);
  @Input() profile!: Profile;

  async onSendMessage(userId: number) {
    this.router.navigate(['/chats', 'new'], { queryParams: { userId } });
  }
}
