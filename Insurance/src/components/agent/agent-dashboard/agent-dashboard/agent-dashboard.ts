import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../app/core/services/auth.service';
import { AgentService } from '../../../../services/agentsService';
import { ClaimsService } from '../../../../services/claimsService';

import { LucideAngularModule, LoaderCircle } from 'lucide-angular';

import { User } from '../../../../models/users';

const API_URL = 'https://insurance-1-ylo4.onrender.com';

@Component({
  standalone: true,
  selector: 'agent-dashboard',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './agent-dashboard.html',
})
export class AgentDashboard implements OnInit {
  readonly LoaderCircle = LoaderCircle;
  currentAgent :any;
  constructor(
    private http: HttpClient,
    public agentService: AgentService,
    public claimsService: ClaimsService,
    private authService: AuthService
  ) {
    effect(() => {
      const agent = this.agentService.agent();
      if (agent) {
        this.claimsService.loadClaims(agent.id);
      }
    });
  }
  
  ngOnInit(): void {
    this.loadCurrentAgent();
    this.currentAgent = this.authService.user|| "";
    console.log(this.currentAgent);
  }
  
  private loadCurrentAgent(): void {
    this.http.get<User[]>(`${API_URL}/users`).subscribe((users) => {
      const agentUser = users.find((u) => u.role === 'agent' && u.id === this.authService.user?.id);
      // if (agentUser) {
      //   this.agentService.loadAgent(agentUser.id);
      // }
    });
  }
}
