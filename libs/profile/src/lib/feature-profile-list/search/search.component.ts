import { AfterViewInit, Component, ElementRef, inject, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { selectFilteredProfiles } from '../../data';
import { ProfileCardComponent } from '../../ui';
import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component';
import { ResizeService } from '@tt/shared';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ProfileCardComponent, ProfileFiltersComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements AfterViewInit, OnDestroy {
  private resizeService = inject(ResizeService);
  private store = inject(Store);
  hostElement = inject(ElementRef);
  profiles = this.store.selectSignal(selectFilteredProfiles);
  private resizeSubscription: Subscription = Subscription.EMPTY;

  ngAfterViewInit(): void {
    this.resizeService.resizeElement(this.hostElement);
    this.resizeSubscription = this.resizeService
      .onResize(100)
      .subscribe(() => {
        this.resizeService.resizeElement(this.hostElement);
      });
  }

  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }
}
