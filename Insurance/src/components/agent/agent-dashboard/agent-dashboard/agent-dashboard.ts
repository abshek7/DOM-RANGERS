import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../app/core/services/auth.service';
import { AgentService } from '../../../../services/agentsService';
import { ClaimsService } from '../../../../services/claimsService';
import { AdminService } from '../../../../services/adminservice';
import { LucideAngularModule, LoaderCircle } from 'lucide-angular';

import { User } from '../../../../models/users';
import { Agent } from '../../../../models';

const API_URL = 'https://localhost:3000';

@Component({
  standalone: true,
  selector: 'agent-dashboard',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './agent-dashboard.html',
})
export class AgentDashboard implements OnInit {
  readonly LoaderCircle = LoaderCircle;
  currentAgent :any;
  usersdata:any;
  constructor(
    private http: HttpClient,
    public agentService: AgentService,
    public claimsService: ClaimsService,
    private authService: AuthService,
    private adminService: AdminService
  ) {
  }
  
  ngOnInit(): void {
    this.adminService.getAgents().subscribe((users:Agent[]) => {
      this.currentAgent = users.filter((u:any) => u.userId==this.authService.user?.id);
    });
    this.agentService.loadAgent(this.authService.user?.id || 0);

  }
  
}
