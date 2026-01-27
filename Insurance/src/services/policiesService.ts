import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Policies } from '../models/policies';

const API_URL = 'https://insurance-1-ylo4.onrender.com';

@Injectable({ providedIn: 'root' })
export class PoliciesService {
  private policiesSignal = signal<Policies[]>([]);
  private loadingSignal = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  loadPolicies(): void {
    this.loadingSignal.set(true);

    this.http.get<Policies[]>(`${API_URL}/policies`).subscribe({
      next: res => {
        this.policiesSignal.set(res);
        this.loadingSignal.set(false);
      },
      error: err => {
        console.error('Failed to load policies', err);
        this.policiesSignal.set([]);
        this.loadingSignal.set(false);
      }
    });
  }

  policies() {
    return this.policiesSignal();
  }

  isLoading() {
    return this.loadingSignal();
  }
}
