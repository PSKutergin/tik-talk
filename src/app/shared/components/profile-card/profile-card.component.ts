import { Profile } from '@/app/interfaces/profile.interface';
import { Component, Input } from '@angular/core';
import { ImgUrlPipe } from "@/app/shared/pipes/img-url.pipe";

@Component({
  selector: 'profile-card',
  standalone: true,
  imports: [ImgUrlPipe],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss',
})
export class ProfileCardComponent {
  @Input() profile!: Profile;

}
