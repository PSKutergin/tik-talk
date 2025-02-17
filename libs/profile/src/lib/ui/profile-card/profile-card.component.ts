import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AvatarCircleComponent } from '@tt/common';
import { Profile } from '@tt/interfaces/profile';

@Component({
  selector: 'profile-card',
  standalone: true,
  imports: [AvatarCircleComponent, RouterLink],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss'
})
export class ProfileCardComponent {
  private router = inject(Router);
  @Input() profile!: Profile;

  async onSendMessage(userId: number) {
    this.router.navigate(['/chats', 'new'], { queryParams: { userId } });
  }
}
