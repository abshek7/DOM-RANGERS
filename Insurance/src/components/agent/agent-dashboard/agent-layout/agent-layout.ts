import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

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
}
