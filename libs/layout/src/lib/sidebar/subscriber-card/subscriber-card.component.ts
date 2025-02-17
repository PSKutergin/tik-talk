import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AvatarCircleComponent } from '@tt/common';
import { Profile } from '@tt/data-access';

@Component({
  selector: 'app-subscriber-card',
  standalone: true,
  imports: [AvatarCircleComponent],
  templateUrl: './subscriber-card.component.html',
  styleUrl: './subscriber-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriberCardComponent {
  @Input() profile!: Profile;
}
