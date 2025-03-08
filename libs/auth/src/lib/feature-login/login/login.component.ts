import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, TokenResponse } from '@tt/data-access';
import { TtInputComponent } from '@tt/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, TtInputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  get username() {
    return this.loginForm.get('username');
  }
  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (
      this.loginForm.valid &&
      this.loginForm.value.username &&
      this.loginForm.value.password
    ) {
      this.authService
        .login({
          username: this.loginForm.value.username,
          password: this.loginForm.value.password
        })
        .subscribe((data: TokenResponse) => {
          this.router.navigate(['']);
        });
    }
  }
}
