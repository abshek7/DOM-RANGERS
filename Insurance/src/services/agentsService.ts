import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Agent } from '../models/agents';

const API_URL = 'https://insurance-1-ylo4.onrender.com';

@Injectable({ providedIn: 'root' })
export class AgentService {
  private agentSignal = signal<Agent | null>(null);
  private loadingSignal = signal<boolean>(false);

  constructor(private http: HttpClient) {}
 
  loadAgent(agentUserId: number): void {
    this.loadingSignal.set(true);

    this.http.get<Agent[]>(`${API_URL}/agents`).subscribe({
      next: agents => {
        const agent = agents.find(a => a.userId === agentUserId) ?? null;
        this.agentSignal.set(agent);
        this.loadingSignal.set(false);
      },
      error: err => {
        console.error('Failed to load agent', err);
        this.agentSignal.set(null);
        this.loadingSignal.set(false);
      }
    });
  }
 
  agent = computed(() => this.agentSignal());
  isLoading = computed(() => this.loadingSignal());

 
  totalSalesAmount = computed(() =>
    this.agent()?.sales.reduce((sum, s) => sum + s.premium, 0) ?? 0
  );

  totalPoliciesSold = computed(() =>
    this.agent()?.totalPoliciesSold ?? 0
  );

  recentSales = computed(() =>
    this.agent()?.sales.slice(-5) ?? []
  );

  /* ---------------- COMMISSIONS ---------------- */
  pendingCommission = computed(() =>
    this.agent()?.commissions
      .filter(c => c.status === 'pending')
      .reduce((sum, c) => sum + c.amount, 0) ?? 0
  );

  earnedCommission = computed(() =>
    this.agent()?.commissions
      .filter(c => c.status === 'earned')
      .reduce((sum, c) => sum + c.amount, 0) ?? 0
  );

  /* ---------------- CUSTOMERS ---------------- */
  assignedCustomersCount = computed(() =>
    this.agent()?.assignedCustomers.length ?? 0
  );

  /* ---------------- COMMUNICATION ---------------- */
  recentCommunications = computed(() =>
    this.agent()?.communicationLogs.slice(-5) ?? []
  );

  /* ---------------- PROFILE ---------------- */
  licenseNumber = computed(() =>
    this.agent()?.licenseNumber ?? 'N/A'
  );

  commissionRate = computed(() =>
    this.agent()?.commissionRate ?? 0
  );
}
