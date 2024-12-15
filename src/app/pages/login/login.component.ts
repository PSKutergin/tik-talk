import { AuthService } from '@/app/core/auth/auth.service';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit(): void {
    if (this.loginForm.valid && this.loginForm.value.username && this.loginForm.value.password) {
      this.authService.login({
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      })
        .subscribe((data: any) => {
          console.log(data);
        });
    }
  }

}
