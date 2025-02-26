import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom, Subscription } from 'rxjs';
import { AuthService, ProfileService, ResizeService } from '@tt/data-access';
import { AvatarUploadComponent } from '../../../ui';
import { StackInputComponent, SvgIconComponent } from '@tt/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-settings-form',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    SvgIconComponent,
    AvatarUploadComponent,
    StackInputComponent
  ],
  templateUrl: './settings-form.component.html',
  styleUrl: './settings-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsFormComponent implements AfterViewInit, OnDestroy {
  @ViewChild(AvatarUploadComponent) avatarUploader!: AvatarUploadComponent;

  hostElement = inject(ElementRef);
  private fb = inject(FormBuilder);
  private resizeService = inject(ResizeService);
  private profileService = inject(ProfileService);
  private authService = inject(AuthService);
  private resizeSubscription: Subscription = Subscription.EMPTY;

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

  ngAfterViewInit(): void {
    this.resizeService.resizeElement(this.hostElement);
    this.resizeSubscription = this.resizeService.onResize(100).subscribe(() => {
      this.resizeService.resizeElement(this.hostElement);
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

  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }
}
