import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Claims } from '../models/claims';

const API_URL = 'https://insurance-1-ylo4.onrender.com';

@Injectable({ providedIn: 'root' })
export class ClaimsService {
  private claimsSignal = signal<Claims[]>([]);
  private loadingSignal = signal<boolean>(false);

  constructor(private http: HttpClient) {}
 
  loadClaims(agentId?: string): void {
    this.loadingSignal.set(true);

    this.http.get<Claims[]>(`${API_URL}/claims`).subscribe({
      next: claims => {
        const filteredClaims = agentId
          ? claims.filter(
              c => c.assignedAgent?.agentId === agentId
            )
          : claims;

        this.claimsSignal.set(filteredClaims);
        this.loadingSignal.set(false);
      },
      error: err => {
        console.error('Failed to load claims', err);
        this.claimsSignal.set([]);
        this.loadingSignal.set(false);
      }
    });
  }
 
  claims = computed(() => this.claimsSignal());
  isLoading = computed(() => this.loadingSignal());

 
  getById(id: string): Claims | undefined {
    return this.claimsSignal().find(c => c.id === id);
  }

  updateStatus(
    id: string,
    status: 'pending' | 'approved' | 'rejected'
  ) {
    return this.http.patch(`${API_URL}/claims/${id}`, { status });
  }
}
