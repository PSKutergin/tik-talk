import { Component, Input } from '@angular/core';
import { AvatarCircleComponent } from '@tt/common';
import { Profile } from '@tt/interfaces/profile';

@Component({
  selector: 'app-subscriber-card',
  standalone: true,
  imports: [AvatarCircleComponent],
  templateUrl: './subscriber-card.component.html',
  styleUrl: './subscriber-card.component.scss'
})
export class SubscriberCardComponent {
  @Input() profile!: Profile;
}
