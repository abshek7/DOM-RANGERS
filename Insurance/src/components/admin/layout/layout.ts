import { Component, signal ,inject} from '@angular/core';
import {Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../app/core/services/auth.service';

import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-layout',
 imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  private auth = inject(AuthService);
  router = inject(Router)
  open = signal(false);
  logout() {
    this.router.navigateByUrl('');
    this.auth.logout();
    this.open.set(false);
  }
}

