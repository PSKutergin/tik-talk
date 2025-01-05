import { Profile } from '@/app/interfaces/profile.interface';
import { Component, input } from '@angular/core';
import { ImgUrlPipe } from "@/app/shared/pipes/img-url.pipe";
import { AvatarCircleComponent } from "../avatar-circle/avatar-circle.component";

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [AvatarCircleComponent],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss'
})
export class ProfileHeaderComponent {
  profile = input<Profile>()
}
