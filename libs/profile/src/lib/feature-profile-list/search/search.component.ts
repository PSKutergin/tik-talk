import { Component } from '@angular/core';
import { ProfileService } from '../../data';
import { ProfileCardComponent } from '../../ui';
import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component';


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
