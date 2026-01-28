import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Claims } from '../models/claims';
import { AuthService } from '../app/core/services/auth.service';
import { API_BASE_URL } from '../app/core/tokens/api-base-url.token';
import { inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ClaimsService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private baseUrl = inject(API_BASE_URL);

  private claimsSignal = signal<Claims[]>([]);
  private loadingSignal = signal(false);
  private currentAgentId: string | null = null;

  claims = computed(() => this.claimsSignal());
  isLoading = computed(() => this.loadingSignal());

  init(): void {
    const userId = this.auth.user?.id;
    if (!userId) return;
    console.log("Loading agent ID for user:", userId);
    this.http.get<any[]>(`${this.baseUrl}/agents`).subscribe({
      next: (agents) => {
        const agent = agents.find(a => a.userId === userId);
        this.currentAgentId = agent?.id ?? null;
        this.loadClaims(this.currentAgentId);
      }
    });
  }

  loadClaims(id:any): void {
    this.loadingSignal.set(true);

    this.http.get<Claims[]>(`${this.baseUrl}/claims`).subscribe({
      next: (claims) => {
        const filtered = id
          ? claims.filter(c => c.assignedAgent?.agentId === id)
          : claims;

        this.claimsSignal.set(filtered);
        this.loadingSignal.set(false);
      },
      error: () => {
        this.claimsSignal.set([]);
        this.loadingSignal.set(false);
      }
    });
  }

  getById(id: string): Claims | undefined {
    return this.claimsSignal().find(c => c.id === id);
  }

  updateStatus(id: string, status: Claims['status']) {
    return this.http.patch(`${this.baseUrl}/claims/${id}`, { status });
  }
}
