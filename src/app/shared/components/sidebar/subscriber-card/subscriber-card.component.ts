import { Profile } from '@/app/interfaces/profile.interface';
import { Component, Input } from '@angular/core';
import { ImgUrlPipe } from "@/app/shared/pipes/img-url.pipe";

@Component({
  selector: 'app-subscriber-card',
  standalone: true,
  imports: [ImgUrlPipe],
  templateUrl: './subscriber-card.component.html',
  styleUrl: './subscriber-card.component.scss'
})
export class SubscriberCardComponent {
  @Input() profile!: Profile
}
