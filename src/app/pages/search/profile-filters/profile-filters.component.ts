import { ProfileService } from '@/app/shared/services/profile.service';
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounce, debounceTime, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-profile-filters',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss'
})
export class ProfileFiltersComponent {
  searchForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    stack: ['']
  });

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService
  ) {
    this.searchForm.valueChanges
      .pipe(
        startWith({}),
        debounceTime(500),
        switchMap((value) => this.profileService.filterProfiles(value)),
        takeUntilDestroyed()
      )
      .subscribe();
  }
}
