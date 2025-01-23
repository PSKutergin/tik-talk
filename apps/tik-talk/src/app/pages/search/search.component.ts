import { Component } from '@angular/core';
import { ProfileCardComponent } from '../../shared/components/profile-card/profile-card.component';
import { ProfileFiltersComponent } from './profile-filters/profile-filters.component';
import { ProfileService } from '../../shared/services/profile.service';

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
