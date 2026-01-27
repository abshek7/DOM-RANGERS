import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="mx-auto max-w-7xl px-4 py-10">
    <div class="rounded-3xl border bg-white p-8 shadow-sm">
      <h2 class="text-2xl font-bold text-slate-900">Customer Dashboard (Protected)</h2>
      <p class="mt-2 text-slate-600">Hello, {{ auth.user?.firstName }}. This route is guarded for <b>customer</b>.</p>
      <div class="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
        Rithwika will implement customer features here.
      </div>
    </div>
  </div>
  `,
})
export class CustomerShellComponent {
  auth = inject(AuthService);
}
