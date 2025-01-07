import { Component, effect, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileHeaderComponent } from "@/app/shared/components/profile-header/profile-header.component";
import { SvgIconComponent } from '@/app/shared/components/svg-icon/svg-icon.component';
import { RouterLink } from '@angular/router';
import { ProfileService } from '@/app/shared/services/profile.service';
import { firstValueFrom } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { AuthService } from '@/app/core/auth/auth.service';
import { AvatarUploadComponent } from "./avatar-upload/avatar-upload.component";
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [SvgIconComponent, ProfileHeaderComponent, ReactiveFormsModule, RouterLink, AvatarUploadComponent, AsyncPipe],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  @ViewChild(AvatarUploadComponent) avatarUploader!: AvatarUploadComponent

  profile$ = toObservable(this.profileService.me)

  profileForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    username: [{ value: '', disabled: true }, [Validators.required]],
    description: [''],
    stack: [''],
  })

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
      })
    })
  }

  onSave(): void {
    this.profileForm.markAllAsTouched();
    this.profileForm.updateValueAndValidity();

    if (this.profileForm.invalid) return

    if (this.avatarUploader.avatar) {
      firstValueFrom(this.profileService.uploadAvatar(this.avatarUploader.avatar))
    }

    //@ts-ignore
    firstValueFrom(this.profileService.updateProfile({
      ...this.profileForm.value,
      stack: this.splitStack(this.profileForm.value.stack)
    }))
  }

  splitStack(stack: string | string[] | null | undefined): string[] {
    if (!stack) return [];
    if (Array.isArray(stack)) return stack

    return stack.split(', ')
  }

  mergeStack(stack: string | string[] | null | undefined): string {
    if (!stack) return '';
    if (Array.isArray(stack)) return stack.join(', ')

    return stack
  }

  onLogout(): void {
    this.authService.logout();
  }
}
