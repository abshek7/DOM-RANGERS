import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
  <div class="min-h-[calc(100vh-64px)] bg-slate-50 grid place-items-center px-4">
    <div class="max-w-xl rounded-3xl border bg-white p-8 text-center shadow-sm">
      <h2 class="text-3xl font-bold text-slate-900">404</h2>
      <p class="mt-2 text-slate-600">Page not found.</p>
      <a routerLink="/" class="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
        Back to Home
      </a>
    </div>
  </div>
  `,
})
export class NotFoundComponent {}
