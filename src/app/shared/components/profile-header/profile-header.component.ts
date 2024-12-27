import { Profile } from '@/app/interfaces/profile.interface';
import { Component, input } from '@angular/core';
import { ImgUrlPipe } from "@/app/shared/pipes/img-url.pipe";

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [ImgUrlPipe],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss'
})
export class ProfileHeaderComponent {
  profile = input<Profile>()
}
