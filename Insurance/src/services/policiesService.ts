import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Policies } from '../models/policies';
import { AuthService } from '../app/core/services/auth.service';
import { AdminService } from './adminservice';
import { forkJoin } from 'rxjs';

const API_URL = 'https://localhost:3000';

@Injectable({ providedIn: 'root' })
export class PoliciesService {
  private policiesSignal = signal<Policies[]>([]);
  private loadingSignal = signal<boolean>(false);

  constructor(
    private http: HttpClient,
    private adminService: AdminService,
    private auth: AuthService
  ) {}

  loadPolicies(): void {
    this.loadingSignal.set(true);

    forkJoin({
      customers: this.adminService.getCustomers(),
      agents: this.adminService.getAgents(),
    }).subscribe({
      next: ({ customers, agents }) => {
        const agent = agents.find(
          a => a.userId === this.auth.user?.id
        );

        if (!agent) {
          this.policiesSignal.set([]);
          this.loadingSignal.set(false);
          return;
        }

        const policies = customers
          .filter(c => c.assignedAgent?.agentId === agent.id)
          .flatMap(c => c.policies ?? []);
        console.log('Loaded policies for agent:', agent.id, policies);
        this.policiesSignal.set(policies);
        this.loadingSignal.set(false);
      },
      error: () => {
        this.policiesSignal.set([]);
        this.loadingSignal.set(false);
      },
    });
  }

  policies() {
    return this.policiesSignal();
  }

  isLoading() {
    return this.loadingSignal();
  }
}
