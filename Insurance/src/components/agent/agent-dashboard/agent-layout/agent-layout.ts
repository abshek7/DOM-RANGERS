import { CommonModule } from '@angular/common';
import { Component, signal ,inject} from '@angular/core';
import {Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../app/core/services/auth.service';
import {
  LucideAngularModule,
  Shield,
  LayoutDashboard,
  Users,
  FileText,
  Receipt,
  Settings,
  LogOut,
} from 'lucide-angular';

@Component({
  standalone: true,
  selector: 'agent-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './agent-layout.html',
})
export class AgentLayout {
  // Icons
  readonly Shield = Shield;
  readonly LayoutDashboard = LayoutDashboard;
  readonly Users = Users;
  readonly FileText = FileText;
  readonly Receipt = Receipt;
  // readonly Settings = Settings;
  readonly LogOut = LogOut;
  private auth = inject(AuthService);
  router = inject(Router)
  open = signal(false);
  logout() {
    this.router.navigateByUrl('');
    this.auth.logout();
    this.open.set(false);
  }
}
