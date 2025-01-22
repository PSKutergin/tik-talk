import { Profile } from '@/app/interfaces/profile.interface';
import { Component, Input } from '@angular/core';
import { AvatarCircleComponent } from '../../avatar-circle/avatar-circle.component';

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
