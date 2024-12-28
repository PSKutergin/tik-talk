import { Profile } from '@/app/interfaces/profile.interface';
import { ProfileService } from '@/app/shared/services/profile.service';
import { Component } from '@angular/core';
import { ProfileCardComponent } from "../../shared/components/profile-card/profile-card.component";
import { ProfileFiltersComponent } from "./profile-filters/profile-filters.component";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ProfileCardComponent, ProfileFiltersComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  profiles = this.profileService.filteredProfiles;

  constructor(private profileService: ProfileService) { }
}
