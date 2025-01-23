import { Component, effect, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '@tt/auth';
import { ProfileService } from '@tt/profile';
import { SvgIconComponent } from '@tt/common';
import { AvatarUploadComponent } from './avatar-upload/avatar-upload.component';
import { ProfileHeaderComponent } from '../../shared/components/profile-header/profile-header.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    SvgIconComponent,
    AvatarUploadComponent,
    ProfileHeaderComponent,
    ReactiveFormsModule,
    RouterLink,
    AsyncPipe
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  @ViewChild(AvatarUploadComponent) avatarUploader!: AvatarUploadComponent;

  profile$ = toObservable(this.profileService.me);

  profileForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    username: [{ value: '', disabled: true }, [Validators.required]],
    description: [''],
    stack: ['']
  });

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private authService: AuthService
  ) {
    effect(() => {
      //@ts-ignore
      this.profileForm.patchValue({
        ...this.profileService.me(),
        stack: this.mergeStack(this.profileService.me()?.stack)
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
      //@ts-ignore
      this.profileService.updateProfile({
        ...this.profileForm.value,
        stack: this.splitStack(this.profileForm.value.stack)
      })
    );
  }

  splitStack(stack: string | string[] | null | undefined): string[] {
    if (!stack) return [];
    if (Array.isArray(stack)) return stack;

    return stack.split(', ');
  }

  mergeStack(stack: string | string[] | null | undefined): string {
    if (!stack) return '';
    if (Array.isArray(stack)) return stack.join(', ');

    return stack;
  }

  onLogout(): void {
    this.authService.logout();
  }
}
