import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import type { Policy } from '../../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllPolicies(): Observable<Policy[]> {
    return this.http.get<any[]>(`${this.apiUrl}/policies`).pipe(
      map(policies => policies.map(p => this.mapToPolicy(p)))
    );
  }

  getPolicyById(id: string): Observable<Policy> {
    return this.http.get<any>(`${this.apiUrl}/policies/${id}`).pipe(
      map(p => this.mapToPolicy(p))
    );
  }

  getPoliciesByType(type: string): Observable<Policy[]> {
    return this.http.get<any[]>(`${this.apiUrl}/policies?type=${type}`).pipe(
      map(policies => policies.map(p => this.mapToPolicy(p)))
    );
  }

  // Map db.json fields to Policy interface
  private mapToPolicy(data: any): Policy {
    return {
      id: data.id,
      policyName: data.name, // db.json uses 'name', interface uses 'policyName'
      type: data.type,
      premium: data.premium,
      coverage: data.coverage,
      duration: this.formatDuration(data.duration), // Convert number to string
      description: data.description,
      features: data.features || [],
      minAge: data.minAge,
      maxAge: data.maxAge,
      icon: data.icon,
      rating: data.rating,
      reviewCount: data.reviewCount,
      createdAt: data.createdAt
    };
  }

  // Convert duration number to readable string
  private formatDuration(duration: number): string {
    if (duration === 1) return '1 Year';
    return `${duration} Years`;
  }

  calculatePremium(basePrice: number, age: number, durationYears: number): number {
    let premium = basePrice;

    // Age factor (0-30: 1x, 31-45: 1.2x, 46-60: 1.5x, 60+: 2x)
    if (age > 60) premium *= 2;
    else if (age > 45) premium *= 1.5;
    else if (age > 30) premium *= 1.2;

    // Duration discount
    if (durationYears >= 3) premium *= 0.9;
    if (durationYears >= 5) premium *= 0.85;

    return Math.round(premium);
  }

  filterPolicies(policies: Policy[], filters: any): Policy[] {
    return policies.filter(policy => {
      if (filters.category && policy.type !== filters.category) return false;
      if (filters.minPremium && policy.premium < filters.minPremium) return false;
      if (filters.maxPremium && policy.premium > filters.maxPremium) return false;
      if (filters.search) {
        const search = filters.search.toLowerCase();
        return policy.policyName.toLowerCase().includes(search) ||
          policy.description.toLowerCase().includes(search);
      }
      return true;
    });
  }
}
