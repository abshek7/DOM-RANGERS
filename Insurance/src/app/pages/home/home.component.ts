import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
  <section class="bg-gradient-to-b from-slate-50 to-white">
    <div class="mx-auto max-w-7xl px-4 py-14">
      <div class="grid items-center gap-10 md:grid-cols-2">
        <div>
          <p class="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-xs font-semibold text-slate-700">
            <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
            Secure • Role-based • JWT Auth
          </p>

          <h1 class="mt-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Insurance Policy Management
            <span class="text-slate-600">Web Application</span>
          </h1>

          <p class="mt-4 text-slate-600 leading-relaxed">
            A clean, responsive portal for Admin, Customer, and Agent workflows — onboarding,
            policy purchase, claim tracking, and reporting (team modules).
          </p>

          <div class="mt-6 flex flex-wrap gap-3">
            <ng-container *ngIf="!auth.isAuthenticated(); else loggedIn">
              <a routerLink="/login" class="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
                Login
              </a>
              <a routerLink="/register" class="rounded-xl border px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Register
              </a>
            </ng-container>

            <ng-template #loggedIn>
              <a [routerLink]="dashLink()" class="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
                Continue to Dashboard
              </a>
            </ng-template>
          </div>

          <div class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div class="rounded-2xl border bg-white p-4">
              <div class="text-xs text-slate-500">Backend</div>
              <div class="mt-1 font-semibold text-slate-900">JSON Server</div>
            </div>
            <div class="rounded-2xl border bg-white p-4">
              <div class="text-xs text-slate-500">Auth</div>
              <div class="mt-1 font-semibold text-slate-900">JWT (client)</div>
            </div>
            <div class="rounded-2xl border bg-white p-4">
              <div class="text-xs text-slate-500">UI</div>
              <div class="mt-1 font-semibold text-slate-900">Tailwind</div>
            </div>
            <div class="rounded-2xl border bg-white p-4">
              <div class="text-xs text-slate-500">Routing</div>
              <div class="mt-1 font-semibold text-slate-900">Guards</div>
            </div>
          </div>
        </div>

        <div class="relative">
          <div class="rounded-3xl border bg-white p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-slate-900">Quick Role Entry</h3>
            <p class="mt-1 text-sm text-slate-600">Login and you will be redirected automatically.</p>

            <div class="mt-6 grid gap-4">
              <div class="rounded-2xl border p-4 hover:bg-slate-50">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-semibold text-slate-900">Admin</div>
                    <div class="text-sm text-slate-600">Catalog, agents, claims monitoring</div>
                  </div>
                  <span class="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">Guarded</span>
                </div>
              </div>

              <div class="rounded-2xl border p-4 hover:bg-slate-50">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-semibold text-slate-900">Customer</div>
                    <div class="text-sm text-slate-600">Browse policies, purchase, file claims</div>
                  </div>
                  <span class="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">Guarded</span>
                </div>
              </div>

              <div class="rounded-2xl border p-4 hover:bg-slate-50">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-semibold text-slate-900">Agent</div>
                    <div class="text-sm text-slate-600">Assigned claims, customers, commissions</div>
                  </div>
                  <span class="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">Guarded</span>
                </div>
              </div>
            </div>

            <div class="mt-6 rounded-2xl bg-slate-900 p-4 text-white">
              <div class="text-sm font-semibold">Backend URL</div>
              <div class="mt-1 break-all text-xs opacity-90">
                https://insurance-1-ylo4.onrender.com
              </div>
            </div>
          </div>

          <div class="pointer-events-none absolute -inset-2 -z-10 rounded-[2rem] bg-gradient-to-r from-slate-200 to-slate-100 blur-2xl"></div>
        </div>
      </div>
    </div>
  </section>
  `,
})
export class HomeComponent {
  auth = inject(AuthService);

  dashLink(): string {
    const role = this.auth.role;
    if (role === 'admin') return '/admin';
    if (role === 'agent') return '/agent';
    return '/customer';
  }
}
