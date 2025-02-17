import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { Store } from '@ngrx/store';
import { profileActions, selectProfileFilters } from '../../data';

@Component({
  selector: 'app-profile-filters',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss'
})
export class ProfileFiltersComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  searchForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    stack: ['']
  });

  profileFilters = this.store.selectSignal(selectProfileFilters);

  constructor() {
    this.searchForm.valueChanges
      .pipe(debounceTime(500), takeUntilDestroyed())
      .subscribe((value) =>
        this.store.dispatch(profileActions.filterEvents({ filters: value }))
      );
  }

  ngOnInit(): void {
    const filters = this.profileFilters();
    this.searchForm.patchValue(filters);

    this.store.dispatch(profileActions.filterEvents({ filters }));
  }
}
