import { Profile } from '@/app/interfaces/profile.interface';
import { ProfileService } from '@/app/shared/services/profile.service';
import { Component } from '@angular/core';
import { ProfileCardComponent } from "../../shared/components/profile-card/profile-card.component";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ProfileCardComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  profiles: Profile[] = [];

  constructor(private profileService: ProfileService) {
    this.profileService.getTestProfiles()
      .subscribe((data: Profile[]) => {
        this.profiles = data;
      });
  }
}
