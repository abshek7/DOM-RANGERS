import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
  <div class="min-h-[calc(100vh-64px)] bg-slate-50">
    <div class="mx-auto max-w-7xl px-4 py-12">
      <div class="mx-auto max-w-lg rounded-3xl border bg-white p-8 shadow-sm">
        <h2 class="text-2xl font-bold text-slate-900">Welcome back</h2>
        <p class="mt-1 text-sm text-slate-600">Login using email or username</p>

        <div *ngIf="error" class="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {{ error }}
        </div>

        <form class="mt-6 space-y-4" [formGroup]="form" (ngSubmit)="submit()">
          <div>
            <label class="text-sm font-semibold text-slate-700">Email / Username</label>
            <input formControlName="identifier"
                   class="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-slate-200"
                   placeholder="customer@insurance.com or cust01" />
            <p class="mt-1 text-xs text-red-600" *ngIf="form.controls.identifier.touched && form.controls.identifier.invalid">
              Identifier is required
            </p>
          </div>

          <div>
            <label class="text-sm font-semibold text-slate-700">Password</label>
            <div class="mt-2 flex items-center rounded-xl border px-4 py-3 focus-within:ring-2 focus-within:ring-slate-200">
              <input [type]="show ? 'text' : 'password'" formControlName="password"
                     class="w-full outline-none"
                     placeholder="••••••••" />
              <button type="button" class="text-xs font-semibold text-slate-600" (click)="show=!show">
                {{ show ? 'HIDE' : 'SHOW' }}
              </button>
            </div>
            <p class="mt-1 text-xs text-red-600" *ngIf="form.controls.password.touched && form.controls.password.invalid">
              Password is required
            </p>
          </div>

          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" formControlName="rememberMe" class="h-4 w-4 rounded border-slate-300" />
              Remember me
            </label>

            <a routerLink="/register" class="text-sm font-semibold text-slate-900 hover:underline">
              Create account
            </a>
          </div>

          <button [disabled]="loading"
                  class="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>

          
        </form>
      </div>
    </div>
  </div>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = false;
  error = '';
  show = false;

  form = this.fb.group({
    identifier: ['', Validators.required],
    password: ['', Validators.required],
    rememberMe: [true],
  });

  submit() {
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { identifier, password, rememberMe } = this.form.getRawValue();
    this.loading = true;

    this.auth.login(identifier!, password!, !!rememberMe).subscribe({
      next: (user) => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        const role = user.role;

        if (returnUrl) {
          this.router.navigateByUrl(returnUrl);
        } else if (role === 'admin') {
          this.router.navigate(['/admin']);
        } else if (role === 'agent') {
          this.router.navigate(['/agent']);
        } else {
          this.router.navigate(['/customer']);
        }
      },
      error: (e) => (this.error = e.message || 'Login failed'),
      complete: () => (this.loading = false),
    });
  }
}
