import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  ViewChild
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '@tt/data-access';
import { SvgIconComponent, StackInputComponent } from '@tt/common';
import { ProfileService } from '@tt/data-access';
import { AvatarUploadComponent, ProfileHeaderComponent } from '../../ui';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    SvgIconComponent,
    AvatarUploadComponent,
    ProfileHeaderComponent,
    ReactiveFormsModule,
    RouterLink,
    AsyncPipe,
    StackInputComponent
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
  @ViewChild(AvatarUploadComponent) avatarUploader!: AvatarUploadComponent;

  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private authService = inject(AuthService);

  profile$ = toObservable(this.profileService.me);

  profileForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    username: [{ value: '', disabled: true }, [Validators.required]],
    description: [''],
    stack: [[]]
  });

  constructor() {
    effect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      return this.profileForm.patchValue({
        ...this.profileService.me()
      });
    });
  }

  onSave(): void {
    this.profileForm.markAllAsTouched();
    this.profileForm.updateValueAndValidity();

    if (this.profileForm.invalid) return;

    if (this.avatarUploader.avatar) {
      firstValueFrom(
        this.profileService.uploadAvatar(this.avatarUploader.avatar)
      );
    }

    firstValueFrom(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      this.profileService.updateProfile({
        ...this.profileForm.value
      })
    );
  }

  onLogout(): void {
    this.authService.logout();
  }
}
