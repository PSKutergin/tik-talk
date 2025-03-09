import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {
  selectFilteredProfiles,
  ResizeService,
  profileActions
} from '@tt/data-access';
import { ProfileCardComponent } from '../../ui';
import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component';
import {
  WaIntersectionObservee,
  WaIntersectionObserverDirective
} from '@ng-web-apis/intersection-observer';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    ProfileCardComponent,
    ProfileFiltersComponent,
    WaIntersectionObserverDirective,
    WaIntersectionObservee
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements AfterViewInit, OnDestroy {
  private resizeService = inject(ResizeService);
  private store = inject(Store);
  hostElement = inject(ElementRef);
  profiles = this.store.selectSignal(selectFilteredProfiles);
  private resizeSubscription: Subscription = Subscription.EMPTY;

  ngAfterViewInit(): void {
    this.resizeService.resizeElement(this.hostElement);
    this.resizeSubscription = this.resizeService.onResize(100).subscribe(() => {
      this.resizeService.resizeElement(this.hostElement);
    });
  }

  onIntersection(entries: IntersectionObserverEntry[]): void {
    if (!entries.length) return;

    if (entries[0].intersectionRatio > 0) {
      this.loadMore();
    }
  }

  loadMore(): void {
    this.store.dispatch(profileActions.setPage({}));
  }

  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }
}
