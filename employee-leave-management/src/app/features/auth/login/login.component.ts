import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',

  standalone: true,

  imports: [CommonModule, ReactiveFormsModule],

  templateUrl: './login.component.html',

  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;

  loading = false;

  error = '';

  returnUrl = '';

  constructor(
    private fb: FormBuilder,

    private authService: AuthService,

    private router: Router,

    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],

      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.error = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        const role = this.authService.getUserRole();

        if (role === 'Manager') {
          this.router.navigate(['/manager/dashboard']);
        } else {
          this.router.navigate(['/employee/dashboard']);
        }
      },

      error: (error) => {
        this.error = 'Invalid email or password';

        this.loading = false;
      },
    });
  }

  useDemoCredentials(type: 'manager' | 'employee'): void {
    if (type === 'manager') {
      this.loginForm.patchValue({
        email: 'manager@company.com',

        password: 'password123',
      });
    } else {
      this.loginForm.patchValue({
        email: 'employee@company.com',

        password: 'password123',
      });
    }
  }
}
