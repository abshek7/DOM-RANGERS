import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
  <header class="sticky top-0 z-50">
    <!-- Top colorful bar -->
    <div class="h-1 w-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-emerald-500"></div>

    <!-- Main nav -->
    <div class="border-b bg-white/70 backdrop-blur-xl">
      <div class="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">

        <!-- Left: Logo -->
        <a routerLink="/" class="group flex items-center gap-2">
          <div
            class="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-emerald-500 text-white font-extrabold shadow-lg shadow-indigo-500/20 ring-1 ring-white/60">
            H
          </div>

          <div class="leading-tight">
            <div class="text-sm font-extrabold text-slate-900 tracking-wide group-hover:text-indigo-700 transition">
              Hartford
            </div>
            <div class="text-[11px] text-slate-500 -mt-0.5">
              Insurance Portal
            </div>
          </div>
        </a>

        <!-- Center nav -->
        <nav class="hidden md:flex flex-1 items-center justify-center gap-2 text-sm font-semibold">
          <a
            routerLink="/"
            routerLinkActive="text-indigo-700 bg-indigo-50 ring-1 ring-indigo-100"
            [routerLinkActiveOptions]="{ exact: true }"
            class="rounded-xl px-4 py-2 text-slate-700 hover:text-indigo-700 hover:bg-indigo-50 transition">
            Home
          </a>

          <a
            href="#"
            class="rounded-xl px-4 py-2 text-slate-400 bg-slate-50/60 ring-1 ring-slate-100 cursor-not-allowed"
            title="Handled by other modules">
            Policies
          </a>

          <a
            href="#"
            class="rounded-xl px-4 py-2 text-slate-400 bg-slate-50/60 ring-1 ring-slate-100 cursor-not-allowed"
            title="Handled by other modules">
            Claims
          </a>

          <a
            href="#"
            class="rounded-xl px-4 py-2 text-slate-500 hover:text-fuchsia-700 hover:bg-fuchsia-50 transition opacity-80 cursor-not-allowed">
            About
          </a>

          <a
            href="#"
            class="rounded-xl px-4 py-2 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition opacity-80 cursor-not-allowed">
            Support
          </a>
        </nav>

        <!-- Right: Search + Auth -->
        <div class="ml-auto flex items-center gap-3">

          <!-- Search -->
          <div class="hidden sm:flex items-center gap-2 rounded-2xl border border-white/40 bg-white/70 px-3 py-2 shadow-sm ring-1 ring-slate-200/40">
            <svg class="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none">
              <path d="M21 21l-4.3-4.3m1.8-5.2a7 7 0 11-14 0 7 7 0 0114 0z"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <input
              class="w-48 bg-transparent text-sm outline-none placeholder:text-slate-400"
              placeholder="Help me find..." />
            <span class="hidden md:inline rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
              ⌘K
            </span>
          </div>

          <!-- Auth block -->
          <ng-container *ngIf="user(); else loggedOut">
            <span
              class="hidden sm:inline-flex items-center gap-2 rounded-2xl px-3 py-1.5 text-xs font-semibold
                     bg-gradient-to-r from-indigo-50 via-fuchsia-50 to-emerald-50
                     text-slate-700 ring-1 ring-slate-200/60">
              <span class="h-2 w-2 rounded-full bg-emerald-500 shadow shadow-emerald-400/40"></span>
              {{ user()?.firstName }} ({{ user()?.role }})
            </span>

            <a
              [routerLink]="dashboardLink()"
              class="rounded-2xl bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-emerald-500 px-4 py-2 text-sm font-extrabold text-white
                     shadow-lg shadow-indigo-500/20 hover:brightness-110 active:brightness-95 transition">
              Dashboard
            </a>

            <button
              (click)="logout()"
              class="rounded-2xl border border-slate-200 bg-white/70 px-4 py-2 text-sm font-bold text-slate-700
                     hover:bg-white hover:ring-2 hover:ring-indigo-200 transition">
              Logout
            </button>
          </ng-container>

          <ng-template #loggedOut>
            <a
              routerLink="/login"
              class="rounded-2xl border border-slate-200 bg-white/70 px-4 py-2 text-sm font-bold text-slate-700
                     hover:bg-white hover:ring-2 hover:ring-fuchsia-200 transition">
              Login
            </a>
            <a
              routerLink="/register"
              class="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-extrabold text-white
                     shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition">
              Register
            </a>
          </ng-template>

          <!-- Mobile menu button -->
          <button
            class="md:hidden rounded-2xl border border-slate-200 bg-white/70 p-2 hover:ring-2 hover:ring-indigo-200 transition"
            (click)="open.set(!open())">
            <svg class="h-5 w-5 text-slate-700" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile dropdown -->
    <div *ngIf="open()" class="md:hidden border-b bg-white/90 backdrop-blur-xl">
      <div class="mx-auto max-w-7xl px-4 py-4 space-y-2 text-sm">
        <a
          routerLink="/"
          (click)="open.set(false)"
          class="block rounded-2xl px-4 py-3 font-bold text-slate-800 hover:bg-indigo-50 hover:text-indigo-700 transition">
          Home
        </a>

        <div class="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-2"></div>

        <ng-container *ngIf="user(); else mobileLoggedOut">
          <a
            [routerLink]="dashboardLink()"
            (click)="open.set(false)"
            class="block rounded-2xl px-4 py-3 font-extrabold text-white
                   bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-emerald-500 shadow-md hover:brightness-110 transition">
            Dashboard
          </a>

          <button
            (click)="logout()"
            class="w-full text-left block rounded-2xl px-4 py-3 font-bold text-slate-700 bg-slate-50 ring-1 ring-slate-200 hover:bg-white transition">
            Logout
          </button>
        </ng-container>

        <ng-template #mobileLoggedOut>
          <a
            routerLink="/login"
            (click)="open.set(false)"
            class="block rounded-2xl px-4 py-3 font-bold text-slate-800 hover:bg-fuchsia-50 hover:text-fuchsia-700 transition">
            Login
          </a>
          <a
            routerLink="/register"
            (click)="open.set(false)"
            class="block rounded-2xl px-4 py-3 font-extrabold text-white bg-slate-900 hover:bg-slate-800 transition">
            Register
          </a>
        </ng-template>
      </div>
    </div>
  </header>
  `,
})
export class NavbarComponent {
  private auth = inject(AuthService);
  open = signal(false);

  user = signal(this.auth.user);
  dashboardLink = computed(() => {
    const role = this.auth.role;
    if (role === 'admin') return '/admin';
    if (role === 'agent') return '/agent';
    if (role === 'customer') return '/customer';
    return '/';
  });

  constructor() {
    this.auth.user$.subscribe((u) => this.user.set(u));
  }

  logout() {
    this.auth.logout();
    this.open.set(false);
  }
}
