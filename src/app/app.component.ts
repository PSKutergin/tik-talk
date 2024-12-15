import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProfileCardComponent } from "./shared/components/profile-card/profile-card.component";
import { Profile } from './interfaces/profile.interface';
import { ProfileService } from './shared/services/profile.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProfileCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  profiles: Profile[] = [];

  constructor(private profileService: ProfileService) {
    this.profileService.getTestProfiles()
      .subscribe((data: Profile[]) => {
        this.profiles = data;
      });
  }
}
