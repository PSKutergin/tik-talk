import { Component, Input } from '@angular/core';
import { AvatarCircleComponent } from '@tt/common';
import { Profile } from '../../data';

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
