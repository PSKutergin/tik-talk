import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { ProfileService } from '@tt/data-access';
import { ProfileHeaderComponent } from '../../ui';
import { SettingsFormComponent } from './settings-form/settings-form.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ProfileHeaderComponent, AsyncPipe, SettingsFormComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
  private profileService = inject(ProfileService);

  profile$ = toObservable(this.profileService.me);
}
