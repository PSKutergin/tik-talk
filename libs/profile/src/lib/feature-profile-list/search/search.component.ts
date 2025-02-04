import { Component, inject } from '@angular/core';
import { selectFilteredProfiles } from '../../data';
import { ProfileCardComponent } from '../../ui';
import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ProfileCardComponent, ProfileFiltersComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  store = inject(Store);
  profiles = this.store.selectSignal(selectFilteredProfiles);

  constructor() {}
}
