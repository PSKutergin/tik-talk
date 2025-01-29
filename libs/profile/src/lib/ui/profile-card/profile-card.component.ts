import { Component, Input } from '@angular/core';
import { AvatarCircleComponent } from '@tt/common';
import { Profile } from '@tt/interfaces/profile';

@Component({
  selector: 'profile-card',
  standalone: true,
  imports: [AvatarCircleComponent],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss'
})
export class ProfileCardComponent {
  @Input() profile!: Profile;
}
