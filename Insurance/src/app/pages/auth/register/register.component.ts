import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../../models/users';
import { AdminService } from '../../../../services/adminservice';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
  <div class="min-h-[calc(100vh-64px)] bg-slate-50">
    <div class="mx-auto max-w-7xl px-4 py-12">
      <div class="mx-auto max-w-2xl rounded-3xl border bg-white p-8 shadow-sm">
        <h2 class="text-2xl font-bold text-slate-900">Create your account</h2>
        <p class="mt-1 text-sm text-slate-600">Register as Customer or Agent</p>

        <div *ngIf="error" class="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {{ error }}
        </div>

        <form class="mt-6 grid gap-4 sm:grid-cols-2" [formGroup]="form" (ngSubmit)="submit()">
          <div>
            <label class="text-sm font-semibold text-slate-700">First Name</label>
            <input formControlName="firstName" class="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-slate-200" />
          </div>

          <div>
            <label class="text-sm font-semibold text-slate-700">Last Name</label>
            <input formControlName="lastName" class="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-slate-200" />
          </div>

          <div>
            <label class="text-sm font-semibold text-slate-700">Username</label>
            <input formControlName="username" class="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-slate-200" />
          </div>

          <div>
            <label class="text-sm font-semibold text-slate-700">Email</label>
            <input formControlName="email" type="email" class="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-slate-200" />
          </div>

          <div>
            <label class="text-sm font-semibold text-slate-700">Phone</label>
            <input formControlName="phone" class="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-slate-200" />
          </div>

          <div>
            <label class="text-sm font-semibold text-slate-700">Role</label>
            <select formControlName="role" class="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-slate-200">
              <option value="customer">Customer</option>
              <option value="agent">Agent</option>
            </select>
          </div>

          <div class="sm:col-span-2">
            <label class="text-sm font-semibold text-slate-700">Password</label>
            <input formControlName="password" type="password" class="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-slate-200" />
            <p class="mt-1 text-xs text-slate-500">Minimum 6 characters</p>
          </div>

          <div class="sm:col-span-2 flex flex-wrap items-center justify-between gap-3 pt-2">
            <a routerLink="/login" class="text-sm font-semibold text-slate-900 hover:underline">Already have an account?</a>

            <button [disabled]="loading" class="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
              {{ loading ? 'Creating...' : 'Create Account' }}
            </button>
          </div>
        </form>

        <div class="mt-6 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
          After registration, you will be auto-logged in and redirected to your dashboard.
        </div>
      </div>
    </div>
  </div>
  `,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private AdminService = inject(AdminService);
  loading = false;
  error = '';
  users:any;
  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    role: ['customer' as UserRole, Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit() {
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const v = this.form.getRawValue();
    this.users=this.AdminService.getUsers();
    this.auth.register({
      id: this.users.length + 1,
      firstName: v.firstName!,
      lastName: v.lastName!,
      username: v.username!,
      email: v.email!,
      phone: v.phone!,
      role: v.role!,
      password: v.password!,
    }).subscribe({
      next: (user) => {
        if (user.role === 'agent') this.router.navigate(['/agent']);
        else this.router.navigate(['/customer']);
      },
      error: (e) => (this.error = e.message || 'Registration failed'),
      complete: () => (this.loading = false),
    });
  }
}
