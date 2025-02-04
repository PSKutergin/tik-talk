import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, startWith } from 'rxjs';
import { Store } from '@ngrx/store';
import { profileActions } from '../../data';

@Component({
  selector: 'app-profile-filters',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss'
})
export class ProfileFiltersComponent {
  store = inject(Store);
  searchForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    stack: ['']
  });

  constructor(private fb: FormBuilder) {
    this.searchForm.valueChanges
      .pipe(startWith({}), debounceTime(500), takeUntilDestroyed())
      .subscribe((value) =>
        this.store.dispatch(profileActions.filterEvents({ filters: value }))
      );
  }
}
