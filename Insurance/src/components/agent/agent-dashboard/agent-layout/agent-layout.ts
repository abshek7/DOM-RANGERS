import { CommonModule } from '@angular/common';
import {ChangeDetectorRef, Component, signal ,inject} from '@angular/core';
import {Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../app/core/services/auth.service';
import { AdminService } from '../../../../services/adminservice';
import { Agent } from '../../../../models';
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
  currentAgent :any;
  username = signal('');
  private auth = inject(AuthService);
  private adminService = inject(AdminService);
  private ChangeDetectorRef = inject(ChangeDetectorRef);
  router = inject(Router)
  open = signal(false);
  ngOnInit(): void {
   this.adminService.getAgents().subscribe((users:Agent[]) => {
        this.currentAgent = users.find((u:any) => u.userId==this.auth.user?.id);
        this.username.set(this.auth.user?.firstName + ' ' + this.auth.user?.lastName);
        this.ChangeDetectorRef.detectChanges();
      });}
  logout() {
    this.router.navigateByUrl('');
    this.auth.logout();
    this.open.set(false);
  }
}
