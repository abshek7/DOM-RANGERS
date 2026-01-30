import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';
import { Policies} from '../models/policies';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getAllPolicies(): Observable<Policies[]> {
    return this.http.get<Policies[]>(`${this.apiUrl}/policies`);
  }

  getPolicyById(id: string): Observable<Policies> {
    return this.http.get<Policies>(`${this.apiUrl}/policies/${id}`);
  }

  getPoliciesByType(type: string): Observable<Policies[]> {
    return this.http.get<Policies[]>(`${this.apiUrl}/policies?type=${type}`);
  }

  filterPolicies(policies: Policies[], filters: any): Policies[] {
    return policies.filter(policy => {
      if (filters.type && policy.type !== filters.type) return false;
      if (filters.minPremium && policy.premium < filters.minPremium) return false;
      if (filters.maxPremium && policy.premium > filters.maxPremium) return false;
      if (filters.search) {
        const search = filters.search.toLowerCase();
        return policy.name.toLowerCase().includes(search) ||
          policy.description.toLowerCase().includes(search);
      }
      return true;
    });
  }

 submitCancellationRequest(policyId: string, request: any) {
  const cancellationRequest = {
    requestId: `CAN-${Date.now()}`,
    customerId: request.customerId,
    reason: request.reason,
    status: 'pending',
    requestedAt: new Date().toISOString()
  };

  return this.http.get<any>(`${this.apiUrl}/policies/${policyId}`).pipe(
    switchMap(policy => {
      const updated = [...(policy.cancellationRequests || []), cancellationRequest];

      return this.http.patch(`${this.apiUrl}/policies/${policyId}`, {
        cancellationRequests: updated
      });
    })
  );
}

 submitEndorsementRequest(policyId: string, request: any): Observable<Policies> {
  const endorsementRequest = {
    requestId: `END-${Date.now()}`,
    customerId: request.customerId,
    details: request.details,
    status: 'pending',
    requestedAt: new Date().toISOString()
  };

  return this.http.get<Policies>(`${this.apiUrl}/policies/${policyId}`).pipe(
    switchMap(policy => {
      const updatedRequests = [
        ...(policy.endorsementRequests || []),
        endorsementRequest
      ];

      return this.http.patch<Policies>(`${this.apiUrl}/policies/${policyId}`, {
        endorsementRequests: updatedRequests
      });
    })
  );
}
}
