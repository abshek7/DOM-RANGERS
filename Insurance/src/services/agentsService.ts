import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Agent } from '../models/agents';
import { AuthService } from '../app/core/services/auth.service';

const API_URL = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class AgentService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  private agentSignal = signal<Agent | null>(null);
  private loadingSignal = signal<boolean>(false);

  constructor() {
    const user = this.auth.user;
    if (user?.role === 'agent') {
      this.loadAgent(user.id!);
    }
  }

  public loadAgent(agentUserId: number): void {
    this.loadingSignal.set(true);

    this.http.get<Agent[]>(`${API_URL}/agents`).subscribe({
      next: (agents) => {
        const agent = agents.find(a => a.userId === agentUserId) ?? null;
        this.agentSignal.set(agent);
        this.loadingSignal.set(false);
      },
      error: () => {
        this.agentSignal.set(null);
        this.loadingSignal.set(false);
      },
    });
  }

  /* ---------------- BASE ---------------- */
  agent = computed(() => this.agentSignal());
  isLoading = computed(() => this.loadingSignal());

  /* ---------------- SALES ---------------- */
  totalSalesAmount = computed(
    () => this.agent()?.sales.reduce((sum, s) => sum + s.premium, 0) ?? 0
  );

  totalPoliciesSold = computed(
    () => this.agent()?.totalPoliciesSold ?? 0
  );

  recentSales = computed(
    () => this.agent()?.sales.slice(-5) ?? []
  );

  /* ---------------- COMMISSIONS ---------------- */
  pendingCommission = computed(
    () =>
      this.agent()
        ?.commissions.filter(c => c.status === 'pending')
        .reduce((sum, c) => sum + c.amount, 0) ?? 0
  );

  earnedCommission = computed(
    () =>
      this.agent()
        ?.commissions.filter(c => c.status === 'earned')
        .reduce((sum, c) => sum + c.amount, 0) ?? 0
  );

  /* ---------------- CUSTOMERS ---------------- */
  assignedCustomersCount = computed(
    () => this.agent()?.assignedCustomers.length ?? 0
  );

  /* ---------------- COMMUNICATION ---------------- */
  recentCommunications = computed(
    () => this.agent()?.communicationLogs.slice(-5) ?? []
  );

  /* ---------------- PROFILE ---------------- */
  licenseNumber = computed(
    () => this.agent()?.licenseNumber ?? 'N/A'
  );

  commissionRate = computed(
    () => this.agent()?.commissionRate ?? 0
  );
}
