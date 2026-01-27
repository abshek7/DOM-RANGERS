import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="mt-16 border-t bg-slate-950 text-slate-200">
      <!-- Top area -->
      <div class="mx-auto max-w-7xl px-4 py-12">
        <div class="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          <!-- Brand -->
          <div class="lg:col-span-4">
            <div class="flex items-center gap-3">
              <div class="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-white font-bold">
                H
              </div>
              <div class="leading-tight">
                <div class="text-base font-semibold text-white">Hartford</div>
                <div class="text-xs text-slate-400 -mt-0.5">Insurance Portal</div>
              </div>
            </div>

            <p class="mt-4 max-w-sm text-sm text-slate-400">
              Manage policies, claims, and customer support with a secure, role-based dashboard experience.
            </p>

            <!-- Social -->
            <div class="mt-5 flex items-center gap-3">
              <a class="group grid h-10 w-10 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
                 href="#" aria-label="Twitter">
                <svg class="h-5 w-5 text-slate-300 group-hover:text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.507 11.24h-6.66l-5.214-6.817-5.964 6.817H1.686l7.73-8.84L1.25 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.16 17.52h1.833L7.08 4.125H5.113L17.084 19.77Z"/>
                </svg>
              </a>

              <a class="group grid h-10 w-10 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
                 href="#" aria-label="LinkedIn">
                <svg class="h-5 w-5 text-slate-300 group-hover:text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.476-.9 1.637-1.85 3.37-1.85 3.602 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433A2.062 2.062 0 0 1 3.27 5.37a2.067 2.067 0 1 1 4.134 0c0 1.14-.925 2.063-2.067 2.063zM6.114 20.452H4.56V9h3.554v11.452z"/>
                </svg>
              </a>

              <a class="group grid h-10 w-10 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
                 href="#" aria-label="GitHub">
                <svg class="h-5 w-5 text-slate-300 group-hover:text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .5C5.73.5.75 5.78.75 12.3c0 5.2 3.44 9.62 8.2 11.18.6.12.82-.27.82-.6 0-.3-.01-1.08-.02-2.12-3.34.75-4.04-1.68-4.04-1.68-.55-1.45-1.34-1.83-1.34-1.83-1.1-.78.08-.77.08-.77 1.22.09 1.86 1.3 1.86 1.3 1.08 1.92 2.83 1.37 3.52 1.05.11-.8.42-1.37.76-1.68-2.66-.31-5.46-1.38-5.46-6.14 0-1.36.46-2.47 1.22-3.34-.12-.31-.53-1.58.12-3.29 0 0 1-.33 3.3 1.28a10.9 10.9 0 0 1 3-.42c1.02 0 2.05.14 3 .42 2.3-1.61 3.3-1.28 3.3-1.28.65 1.71.24 2.98.12 3.29.76.87 1.22 1.98 1.22 3.34 0 4.77-2.8 5.82-5.47 6.13.43.39.82 1.15.82 2.32 0 1.68-.02 3.03-.02 3.44 0 .33.22.72.82.6 4.76-1.56 8.2-5.98 8.2-11.18C23.25 5.78 18.27.5 12 .5z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Links -->
          <div class="lg:col-span-5 grid gap-8 sm:grid-cols-3">
            <div>
              <h4 class="text-sm font-semibold text-white">Product</h4>
              <ul class="mt-4 space-y-3 text-sm text-slate-400">
                <li><a routerLink="/" class="hover:text-white">Home</a></li>
                <li><a routerLink="/policies" class="hover:text-white">Policies</a></li>
                <li><a routerLink="/claims" class="hover:text-white">Claims</a></li>
                <li><a routerLink="/help" class="hover:text-white">Help Center</a></li>
              </ul>
            </div>

            <div>
              <h4 class="text-sm font-semibold text-white">Company</h4>
              <ul class="mt-4 space-y-3 text-sm text-slate-400">
                <li><a href="#" class="hover:text-white">About</a></li>
                <li><a href="#" class="hover:text-white">Careers</a></li>
                <li><a href="#" class="hover:text-white">Security</a></li>
                <li><a href="#" class="hover:text-white">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 class="text-sm font-semibold text-white">Legal</h4>
              <ul class="mt-4 space-y-3 text-sm text-slate-400">
                <li><a href="#" class="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" class="hover:text-white">Terms of Service</a></li>
                <li><a href="#" class="hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <!-- Newsletter -->
          <div class="lg:col-span-3">
            <div class="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
              <h4 class="text-sm font-semibold text-white">Get updates</h4>
              <p class="mt-2 text-sm text-slate-400">
                Monthly product updates and feature announcements.
              </p>

              <form class="mt-4 flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  class="w-full rounded-2xl bg-slate-950/60 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500
                         ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-white/20"
                />
                <button
                  type="button"
                  class="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-200"
                >
                  Subscribe
                </button>
              </form>

              <p class="mt-3 text-xs text-slate-500">
                By subscribing, you agree to receive emails. You can unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="border-t border-white/10">
        <div class="mx-auto max-w-7xl px-4 py-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-xs text-slate-500">
            © {{ year }} Hartford Insurance Portal. All rights reserved.
          </p>
          <div class="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span class="inline-flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
              Secure & role-based access
            </span>
            <span class="hidden sm:inline text-slate-700">|</span>
            <span>Support: support@hartford-demo.com</span>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  year = new Date().getFullYear();
}
