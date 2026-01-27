import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
  <div class="min-h-[calc(100vh-64px)] bg-slate-50">
    <div class="mx-auto max-w-7xl px-4 py-14">
      <div class="mx-auto max-w-xl rounded-3xl border bg-white p-8 text-center shadow-sm">
        <h2 class="text-2xl font-bold text-slate-900">Unauthorized</h2>
        <p class="mt-2 text-slate-600">You don’t have permission to access this page.</p>
        <div class="mt-6 flex justify-center gap-3">
          <a routerLink="/" class="rounded-xl border px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Go Home</a>
          <a routerLink="/login" class="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">Login</a>
        </div>
      </div>
    </div>
  </div>
  `,
})
export class UnauthorizedComponent {}
